import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Gem } from "lucide-react";

import { getCategories } from "../services/stoneService";
import { getProfile } from "../services/authService";
import { createStone, uploadStoneImage } from "../services/adminService";

function AdminStoneCreate() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [certificate, setCertificate] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    weight: "",
    color: "",
    clarity: "",
    origin: "",
    stock: "1",
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async () => {
    try {
      const user = await getProfile();

      if (!user.is_staff) {
        alert("Only admin users can access this page.");
        navigate("/");
        return;
      }

      const data = await getCategories();
      setCategories(data.results || data);
    } catch (error) {
      alert("Please login as admin first.");
      navigate("/login");
    }
  };

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const stoneFormData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        stoneFormData.append(key, value);
      });

      if (certificate) {
        stoneFormData.append("certification_file", certificate);
      }

      const createdStone = await createStone(stoneFormData);

      for (let index = 0; index < images.length; index++) {
        const imageData = new FormData();

        imageData.append("stone", createdStone.id);
        imageData.append("image", images[index]);
        imageData.append("alt_text", createdStone.name);
        imageData.append("is_primary", index === 0 ? "true" : "false");

        await uploadStoneImage(imageData);
      }

      alert("Stone created successfully.");
      navigate("/admin-dashboard");
    } catch (error) {
      console.error(error);
      alert("Could not create stone. Check all fields and try again.");
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-10">
        <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-sm">
          Admin Inventory
        </p>

        <h1 className="font-luxury text-5xl mt-2">Add New Stone</h1>

        <p className="text-gray-400 mt-2">
          Upload product details, multiple images, and certificate files.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-luxury rounded-xl p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormGroup label="Stone Name">
            <input
              className="input-dark w-full"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup label="Category">
            <select
              className="input-dark w-full"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              required
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup label="Price">
            <input
              className="input-dark w-full"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup label="Weight / Carats">
            <input
              className="input-dark w-full"
              type="number"
              step="0.01"
              value={form.weight}
              onChange={(e) => updateField("weight", e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup label="Color">
            <input
              className="input-dark w-full"
              value={form.color}
              onChange={(e) => updateField("color", e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup label="Clarity">
            <input
              className="input-dark w-full"
              value={form.clarity}
              onChange={(e) => updateField("clarity", e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup label="Origin">
            <input
              className="input-dark w-full"
              value={form.origin}
              onChange={(e) => updateField("origin", e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup label="Stock">
            <input
              className="input-dark w-full"
              type="number"
              value={form.stock}
              onChange={(e) => updateField("stock", e.target.value)}
              required
            />
          </FormGroup>
        </div>

        <FormGroup label="Description">
          <textarea
            className="input-dark w-full min-h-36"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            required
          />
        </FormGroup>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="card-luxury rounded-xl p-6 border-dashed border-[#D4AF37]/40 cursor-pointer">
            <Upload className="text-[#D4AF37] mb-3" />
            <p className="font-semibold">Upload Stone Images</p>
            <p className="text-gray-400 text-sm mt-1">
              You can select multiple images.
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {images.length > 0 && (
              <p className="text-[#D4AF37] text-sm mt-3">
                {images.length} image(s) selected
              </p>
            )}
          </label>

          <label className="card-luxury rounded-xl p-6 border-dashed border-[#D4AF37]/40 cursor-pointer">
            <Gem className="text-[#D4AF37] mb-3" />
            <p className="font-semibold">Upload Certificate</p>
            <p className="text-gray-400 text-sm mt-1">
              PDF or image certificate file.
            </p>

            <input
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={(e) => setCertificate(e.target.files[0])}
            />

            {certificate && (
              <p className="text-[#D4AF37] text-sm mt-3">
                {certificate.name}
              </p>
            )}
          </label>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => updateField("is_featured", e.target.checked)}
            />
            Featured Stone
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => updateField("is_active", e.target.checked)}
            />
            Active Product
          </label>
        </div>

        <div className="flex gap-4">
          <button className="btn-gold px-10 py-3 rounded">
            Create Stone
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin-dashboard")}
            className="border border-[#D4AF37] px-10 py-3 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}

function FormGroup({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-400 mb-2">{label}</span>
      {children}
    </label>
  );
}

export default AdminStoneCreate;