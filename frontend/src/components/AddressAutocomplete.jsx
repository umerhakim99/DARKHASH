import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-places-script";

function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve(window.google);
      return;
    }

    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google));
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");

    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve(window.google);
    script.onerror = reject;

    document.head.appendChild(script);
  });
}

function getComponent(place, type) {
  const component = place.address_components?.find((item) =>
    item.types.includes(type)
  );

  return component?.long_name || "";
}

function getShortComponent(place, type) {
  const component = place.address_components?.find((item) =>
    item.types.includes(type)
  );

  return component?.short_name || "";
}

function extractAddressData(place) {
  const streetNumber = getComponent(place, "street_number");
  const route = getComponent(place, "route");
  const sublocality =
    getComponent(place, "sublocality_level_1") ||
    getComponent(place, "sublocality") ||
    getComponent(place, "neighborhood");

  const city =
    getComponent(place, "locality") ||
    getComponent(place, "postal_town") ||
    getComponent(place, "administrative_area_level_2") ||
    sublocality;

  const province = getComponent(place, "administrative_area_level_1");
  const country = getComponent(place, "country");
  const countryCode = getShortComponent(place, "country");
  const postalCode = getComponent(place, "postal_code");

  const addressParts = [];

  if (streetNumber || route) {
    addressParts.push(`${streetNumber} ${route}`.trim());
  }

  if (sublocality) {
    addressParts.push(sublocality);
  }

  const latitude = place.geometry?.location?.lat();
  const longitude = place.geometry?.location?.lng();

  return {
    google_place_id: place.place_id || "",
    formatted_address: place.formatted_address || "",
    address_line_1: addressParts.join(", ") || place.name || "",
    address_line_2: "",
    city,
    province,
    country: countryCode === "PK" ? "Pakistan" : country,
    postal_code: postalCode,
    latitude: latitude ? String(latitude) : "",
    longitude: longitude ? String(longitude) : "",
  };
}

function AddressAutocomplete({ value, onAddressSelect, error }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [scriptError, setScriptError] = useState("");

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setScriptError(
        "Google Maps API key is missing. Add VITE_GOOGLE_MAPS_API_KEY to frontend/.env.local."
      );
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then((google) => {
        if (!inputRef.current || autocompleteRef.current) {
          return;
        }

        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            componentRestrictions: { country: "pk" },
            fields: [
              "place_id",
              "formatted_address",
              "address_components",
              "geometry",
              "name",
            ],
            types: ["geocode"],
          }
        );

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();

          if (!place.place_id || !place.geometry) {
            return;
          }

          const data = extractAddressData(place);

          onAddressSelect(data);
        });
      })
      .catch(() => {
        setScriptError("Could not load Google Places autocomplete.");
      });
  }, [onAddressSelect]);

  return (
    <div>
      <label className="block">
        <span className="block text-sm text-gray-300 mb-2 font-medium">
          Search Verified Delivery Address
        </span>

        <div className="relative">
          <span className="field-icon-box">
            <MapPin size={17} />
          </span>

          <input
            ref={inputRef}
            className="input-dark w-full"
            style={{ paddingLeft: "4rem" }}
            placeholder="Start typing your full address..."
            defaultValue={value}
            autoComplete="off"
            required
          />
        </div>
      </label>

      {scriptError && (
        <p className="text-red-400 text-sm mt-2">{scriptError}</p>
      )}

      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Please select your address from Google suggestions. Manual unverified
        addresses are not accepted.
      </p>
    </div>
  );
}

export default AddressAutocomplete;