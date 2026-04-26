import { useState } from "react";
import { MapPin } from "lucide-react";

const dummyAddresses = [
  {
    label: "Timergara, Lower Dir, Khyber Pakhtunkhwa, Pakistan",
    address_line_1: "Timergara Main Bazaar",
    address_line_2: "",
    city: "Lower Dir",
    province: "Khyber Pakhtunkhwa",
    country: "Pakistan",
    postal_code: "18300",
  },
  {
    label: "Dir Upper, Khyber Pakhtunkhwa, Pakistan",
    address_line_1: "Dir Upper City",
    address_line_2: "",
    city: "Upper Dir",
    province: "Khyber Pakhtunkhwa",
    country: "Pakistan",
    postal_code: "18000",
  },
  {
    label: "Peshawar Saddar, Khyber Pakhtunkhwa, Pakistan",
    address_line_1: "Saddar Road, Peshawar",
    address_line_2: "",
    city: "Peshawar",
    province: "Khyber Pakhtunkhwa",
    country: "Pakistan",
    postal_code: "25000",
  },
  {
    label: "Mingora, Swat, Khyber Pakhtunkhwa, Pakistan",
    address_line_1: "Mingora Main Road",
    address_line_2: "",
    city: "Swat",
    province: "Khyber Pakhtunkhwa",
    country: "Pakistan",
    postal_code: "19130",
  },
  {
    label: "Abbottabad City, Khyber Pakhtunkhwa, Pakistan",
    address_line_1: "Main Abbottabad City",
    address_line_2: "",
    city: "Abbottabad",
    province: "Khyber Pakhtunkhwa",
    country: "Pakistan",
    postal_code: "22010",
  },
  {
    label: "Gulberg III, Lahore, Punjab, Pakistan",
    address_line_1: "Main Boulevard Gulberg III",
    address_line_2: "",
    city: "Lahore",
    province: "Punjab",
    country: "Pakistan",
    postal_code: "54660",
  },
  {
    label: "DHA Phase 5, Lahore, Punjab, Pakistan",
    address_line_1: "DHA Phase 5",
    address_line_2: "",
    city: "Lahore",
    province: "Punjab",
    country: "Pakistan",
    postal_code: "54792",
  },
  {
    label: "Rawalpindi Saddar, Punjab, Pakistan",
    address_line_1: "Saddar Rawalpindi",
    address_line_2: "",
    city: "Rawalpindi",
    province: "Punjab",
    country: "Pakistan",
    postal_code: "46000",
  },
  {
    label: "Clifton Block 5, Karachi, Sindh, Pakistan",
    address_line_1: "Clifton Block 5",
    address_line_2: "",
    city: "Karachi",
    province: "Sindh",
    country: "Pakistan",
    postal_code: "75600",
  },
  {
    label: "Gulshan-e-Iqbal, Karachi, Sindh, Pakistan",
    address_line_1: "Gulshan-e-Iqbal",
    address_line_2: "",
    city: "Karachi",
    province: "Sindh",
    country: "Pakistan",
    postal_code: "75300",
  },
  {
    label: "Blue Area, Islamabad, Pakistan",
    address_line_1: "Blue Area",
    address_line_2: "",
    city: "Islamabad",
    province: "Islamabad Capital Territory",
    country: "Pakistan",
    postal_code: "44000",
  },
  {
    label: "Quetta Cantt, Balochistan, Pakistan",
    address_line_1: "Quetta Cantt",
    address_line_2: "",
    city: "Quetta",
    province: "Balochistan",
    country: "Pakistan",
    postal_code: "87300",
  },
];

function DummyAddressAutocomplete({ onAddressSelect }) {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredAddresses = dummyAddresses.filter((address) =>
    address.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (address) => {
    setSearch(address.label);
    setShowSuggestions(false);
    onAddressSelect(address);
  };

  return (
    <div className="relative">
      <label className="block">
        <span className="block text-sm text-gray-300 mb-2 font-medium">
          Search Delivery Address
        </span>

        <div className="relative">
          <span
            className="
              absolute left-3 top-1/2 -translate-y-1/2
              w-9 h-9 rounded-lg
              bg-[#D4AF37]/12 border border-[#D4AF37]/30
              flex items-center justify-center
              text-[#D4AF37]
              pointer-events-none z-10
            "
          >
            <MapPin size={17} />
          </span>

          <input
            className="input-dark w-full"
            style={{ paddingLeft: "4rem" }}
            placeholder="Search city, district, or area..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
        </div>
      </label>

      {showSuggestions && search && (
        <div className="absolute z-50 mt-2 w-full bg-[#111] border border-[#D4AF37]/30 rounded-xl overflow-hidden shadow-xl">
          {filteredAddresses.length === 0 ? (
            <div className="p-4 text-sm text-gray-400">
              No matching address found. You can still fill the address manually.
            </div>
          ) : (
            filteredAddresses.map((address) => (
              <button
                type="button"
                key={address.label}
                onClick={() => handleSelect(address)}
                className="w-full text-left px-4 py-3 hover:bg-[#D4AF37]/10 border-b border-[#D4AF37]/10 last:border-b-0"
              >
                <p className="text-white text-sm">{address.label}</p>
                <p className="text-gray-500 text-xs">
                  Postal code: {address.postal_code}
                </p>
              </button>
            ))
          )}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Select a suggested address to auto-fill correct province, city, and postal code.
      </p>
    </div>
  );
}

export default DummyAddressAutocomplete;