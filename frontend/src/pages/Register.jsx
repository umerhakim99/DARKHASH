import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  LockKeyhole,
  Phone,
  MapPin,
  Home,
  Map,
} from "lucide-react";
import { register } from "../services/authService";
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

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    province: "",
    city: "",
    country: "Pakistan",
    postal_code: "",
  });

  const [error, setError] = useState("");

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
      return "Could not create account.";
    }

    if (typeof data === "string") {
      return data;
    }

    const firstKey = Object.keys(data)[0];

    if (Array.isArray(data[firstKey])) {
      return data[firstKey][0];
    }

    return data[firstKey] || "Could not create account.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(form);
      alert(`Welcome to GEMLUXE, ${form.first_name}! Your account has been created.`);
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err.response?.data));
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 animate-fade-up">
      <div className="mb-8 text-center md:text-left">
        <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-xs">
          Join GEMLUXE
        </p>

        <h1 className="font-luxury text-4xl md:text-6xl mt-3">
          Create Account
        </h1>

        <p className="text-gray-400 mt-3 max-w-2xl">
          Create your account and save your delivery details for faster checkout.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-panel p-5 md:p-8 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <section>
          <h2 className="font-luxury text-2xl mb-4">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="First Name" icon={<User size={17} />}>
              <input
                className="input-dark w-full"
                style={{ paddingLeft: "4rem" }}
                placeholder="First name"
                value={form.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
                required
              />
            </Field>

            <Field label="Last Name" icon={<User size={17} />}>
              <input
                className="input-dark w-full"
                style={{ paddingLeft: "4rem" }}
                placeholder="Last name"
                value={form.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
                required
              />
            </Field>

            <Field label="Email Address" icon={<Mail size={17} />}>
              <input
                className="input-dark w-full"
                style={{ paddingLeft: "4rem" }}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </Field>

            <Field label="Password" icon={<LockKeyhole size={17} />}>
              <input
                className="input-dark w-full"
                style={{ paddingLeft: "4rem" }}
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
              />
            </Field>

            <Field label="Phone Number" icon={<Phone size={17} />}>
              <input
                className="input-dark w-full"
                style={{ paddingLeft: "4rem" }}
                type="tel"
                placeholder="03XXXXXXXXX"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                required
              />
            </Field>

            <Field label="Postal Code" icon={<MapPin size={17} />}>
              <input
                className="input-dark w-full"
                style={{ paddingLeft: "4rem" }}
                inputMode="numeric"
                maxLength="5"
                placeholder="5 digit postal code"
                value={form.postal_code}
                onChange={(e) =>
                  updateField("postal_code", e.target.value.replace(/\D/g, ""))
                }
                required
              />
            </Field>
          </div>
        </section>

        <section className="border-t soft-divider pt-6">
          <h2 className="font-luxury text-2xl mb-4">Delivery Address</h2>

          <div className="grid gap-4">
            <DummyAddressAutocomplete
              onAddressSelect={handleDummyAddressSelect}
            />

            <Field label="Address Line 1" icon={<Home size={17} />}>
              <input
                className="input-dark w-full"
                style={{ paddingLeft: "4rem" }}
                placeholder="House, street, area"
                value={form.address_line_1}
                onChange={(e) => updateField("address_line_1", e.target.value)}
                required
              />
            </Field>

            <Field label="Address Line 2" icon={<Map size={17} />}>
              <input
                className="input-dark w-full"
                style={{ paddingLeft: "4rem" }}
                placeholder="Landmark, apartment, optional"
                value={form.address_line_2}
                onChange={(e) => updateField("address_line_2", e.target.value)}
              />
            </Field>

            <div className="grid md:grid-cols-3 gap-4">
              <label className="block">
                <span className="block text-sm text-gray-300 mb-2 font-medium">
                  Province / State
                </span>

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
              </label>

              <label className="block">
                <span className="block text-sm text-gray-300 mb-2 font-medium">
                  City / Town / District
                </span>

                <input
                  className="input-dark w-full"
                  placeholder="Example: Dir, Lower Dir, Lahore"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <span className="block text-sm text-gray-300 mb-2 font-medium">
                  Country
                </span>

                <input className="input-dark w-full" value={form.country} readOnly />
              </label>
            </div>
          </div>
        </section>

        <button className="btn-gold w-full py-3.5 rounded-xl">
          Create Account
        </button>

        <p className="text-sm text-gray-400 text-center">
          Already registered?{" "}
          <Link to="/login" className="text-[#D4AF37] hover:text-[#f5d879]">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}

function Field({ label, icon, children }) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-300 mb-2 font-medium">
        {label}
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
          {icon}
        </span>

        {children}
      </div>
    </label>
  );
}

export default Register;