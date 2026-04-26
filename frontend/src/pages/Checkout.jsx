import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import { getProfile, isAuthenticated } from "../services/authService";
import DummyAddressAutocomplete from "../components/DummyAddressAutocomplete";

const provinces = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Kashmir",
];

function Checkout() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    province: "",
    city: "",
    country: "Pakistan",
    postal_code: "",
    payment_method: "cash_on_delivery",
    customer_note: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    try {
      const profile = await getProfile();

      setForm((prev) => ({
        ...prev,
        full_name:
          profile.full_name ||
          `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
        email: profile.email || "",
        phone: profile.phone || "",
        address_line_1: profile.address_line_1 || "",
        address_line_2: profile.address_line_2 || "",
        province: profile.province || "",
        city: profile.city || "",
        country: profile.country || "Pakistan",
        postal_code: profile.postal_code || "",
      }));
    } catch {
      navigate("/login");
    }
  };

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDummyAddressSelect = (address) => {
    setForm((prev) => ({
      ...prev,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code,
    }));
  };

  const getErrorMessage = (data) => {
    if (!data) {
      return "Could not create order. Please check your details.";
    }

    if (typeof data === "string") {
      return data;
    }

    const firstKey = Object.keys(data)[0];

    if (Array.isArray(data[firstKey])) {
      return data[firstKey][0];
    }

    return data[firstKey] || "Could not create order.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const order = await createOrder(form);
      navigate(`/order-success/${order.id}`);
    } catch (error) {
      setError(getErrorMessage(error.response?.data));
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-luxury text-5xl mb-3">Checkout</h1>

      <p className="text-gray-400 mb-8">
        Confirm your delivery details before placing the order.
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-[1fr_360px] gap-8"
      >
        <section className="card-luxury rounded-xl p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded">
              {error}
            </div>
          )}

          <h2 className="font-luxury text-3xl">Delivery Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="input-dark w-full"
              placeholder="Full name"
              value={form.full_name}
              onChange={(e) => updateField("full_name", e.target.value)}
              required
            />

            <input
              className="input-dark w-full"
              placeholder="Email address"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />

            <input
              className="input-dark w-full"
              placeholder="Phone number e.g. 03XXXXXXXXX"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              required
            />

            <input
              className="input-dark w-full"
              placeholder="Postal code"
              inputMode="numeric"
              maxLength="5"
              value={form.postal_code}
              onChange={(e) =>
                updateField("postal_code", e.target.value.replace(/\D/g, ""))
              }
              required
            />
          </div>

          <DummyAddressAutocomplete
            onAddressSelect={handleDummyAddressSelect}
          />

          <input
            className="input-dark w-full"
            placeholder="Address line 1: house, street, area"
            value={form.address_line_1}
            onChange={(e) => updateField("address_line_1", e.target.value)}
            required
          />

          <input
            className="input-dark w-full"
            placeholder="Address line 2, optional"
            value={form.address_line_2}
            onChange={(e) => updateField("address_line_2", e.target.value)}
          />

          <div className="grid md:grid-cols-3 gap-4">
            <select
              className="input-dark w-full"
              value={form.province}
              onChange={(e) => updateField("province", e.target.value)}
              required
            >
              <option value="">Select province/state</option>

              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>

            <input
              className="input-dark w-full"
              placeholder="City / Town / District"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              required
            />

            <input
              className="input-dark w-full"
              value={form.country}
              readOnly
            />
          </div>

          <textarea
            className="input-dark w-full min-h-28"
            placeholder="Order note, optional"
            value={form.customer_note}
            onChange={(e) => updateField("customer_note", e.target.value)}
          />
        </section>

        <aside className="card-luxury rounded-xl p-6 h-fit">
          <h2 className="font-luxury text-3xl mb-6">Payment Method</h2>

          <label className="flex items-start gap-3 border border-[#D4AF37]/30 rounded p-4 cursor-pointer">
            <input
              type="radio"
              name="payment"
              checked={form.payment_method === "cash_on_delivery"}
              onChange={() => updateField("payment_method", "cash_on_delivery")}
            />

            <div>
              <p className="font-semibold">Cash on Delivery</p>
              <p className="text-sm text-gray-400">
                Pay when your order is delivered.
              </p>
            </div>
          </label>

          <button className="btn-gold w-full py-3 rounded mt-8">
            Place Order
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Your phone number and postal code will be validated.
          </p>
        </aside>
      </form>
    </main>
  );
}

export default Checkout;