import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Upload, Trash2, ImagePlus } from "lucide-react";

import { isAdmin } from "../services/authService";
import { getCategories, getStone } from "../services/stoneService";
import {
  updateStone,
  uploadStoneImage,
  deleteStoneImage,
} from "../services/adminService";

function AdminStoneEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [imageFiles, setImageFiles] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    weight: "",
    color: "",
    clarity: "",
    origin: "",
    stock: "",
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
      return;
    }

    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const stone = await getStone(id);
      const categoryData = await getCategories();

      setCategories(categoryData.results || categoryData);
      setImages(stone.images || []);

      setForm({
        name: stone.name || "",
        category: stone.category || stone.category_detail?.id || "",
        description: stone.description || "",
        price: stone.price || "",
        weight: stone.weight || "",
        color: stone.color || "",
        clarity: stone.clarity || "",
        origin: stone.origin || "",
        stock: stone.stock ?? "",
        is_featured: Boolean(stone.is_featured),
        is_active: stone.is_active !== false,
      });
    } catch (error) {
      console.error(error);
      alert("Could not load stone details.");
      navigate("/admin-dashboard");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    return `${url}?v=${Date.now()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...form,
        category: Number(form.category),
        price: Number(form.price),
        weight: Number(form.weight),
        stock: Number(form.stock),
      };

      await updateStone(id, payload);

      alert("Stone updated successfully.");
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Could not update stone. Please check all fields.");
    } finally {
      setSaving(false);
    }
  };

  const handleReplaceImages = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    try {
      setImageUploading(true);

      for (const img of images) {
        await deleteStoneImage(img.id);
      }

      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append("stone", id);
        formData.append("image", file);
        formData.append("alt_text", form.name || "Stone image");

        await uploadStoneImage(formData);
      }

      setImageFiles([]);
      await loadData();

      alert("Product image replaced successfully.");
    } catch (error) {
      console.error(error);
      alert("Could not replace image. Check backend image upload/delete API.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddMoreImages = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    try {
      setImageUploading(true);

      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append("stone", id);
        formData.append("image", file);
        formData.append("alt_text", form.name || "Stone image");

        await uploadStoneImage(formData);
      }

      setImageFiles([]);
      await loadData();

      alert("Image uploaded successfully.");
    } catch (error) {
      console.error(error);
      alert("Could not upload image. Check backend image upload API.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm("Delete this image?")) {
      return;
    }

    try {
      await deleteStoneImage(imageId);
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Could not delete image.");
    }
  };

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="card-luxury rounded-xl p-8 text-gray-400">
          Loading stone edit form...
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-sm">
            Admin Product Control
          </p>

          <h1 className="font-luxury text-5xl mt-2">Edit Stone</h1>

          <p className="text-gray-400 mt-2">
            Update product details, pricing, stock, images, and visibility.
          </p>
        </div>

        <Link
          to="/admin-dashboard"
          className="btn-outline-gold px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      <section className="card-luxury rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <ImagePlus className="text-[#D4AF37]" size={26} />

          <div>
            <h2 className="font-luxury text-3xl">Product Images</h2>
            <p className="text-sm text-gray-400">
              Replace the main image or add more gallery images.
            </p>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="border border-[#D4AF37]/20 rounded-xl p-6 text-gray-400 mb-6">
            No images uploaded for this stone yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="border border-[#D4AF37]/20 rounded-xl overflow-hidden bg-[#111]"
              >
                <div className="relative">
                  <img
                    src={getImageUrl(img.image)}
                    alt={img.alt_text || form.name}
                    className="w-full h-48 object-cover"
                  />

                  {index === 0 && (
                    <span className="absolute top-3 left-3 badge-gold">
                      Main Image
                    </span>
                  )}
                </div>

                <div className="p-3 flex justify-between items-center">
                  <p className="text-sm text-gray-400 truncate">
                    {img.alt_text || "Stone image"}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <label className="block">
            <span className="block text-sm text-gray-300 mb-2">
              Select New Image
            </span>

            <input
              className="input-dark w-full"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
            />
          </label>

          {imageFiles.length > 0 && (
            <div className="text-sm text-gray-400">
              Selected files:{" "}
              <span className="text-[#D4AF37]">{imageFiles.length}</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              disabled={imageUploading}
              onClick={handleReplaceImages}
              className="btn-gold px-6 py-3 rounded-xl flex justify-center items-center gap-2"
            >
              <Upload size={18} />
              {imageUploading ? "Replacing..." : "Replace Product Images"}
            </button>

            <button
              type="button"
              disabled={imageUploading}
              onClick={handleAddMoreImages}
              className="btn-outline-gold px-6 py-3 rounded-xl flex justify-center items-center gap-2"
            >
              <Upload size={18} />
              {imageUploading ? "Uploading..." : "Add More Images"}
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Use “Replace Product Images” when you want the new image to become
            the main product image.
          </p>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="card-luxury rounded-xl p-6 space-y-6"
      >
        <section>
          <h2 className="font-luxury text-3xl mb-5">Basic Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm text-gray-300 mb-2">
                Stone Name
              </span>

              <input
                className="input-dark w-full"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="block text-sm text-gray-300 mb-2">
                Category
              </span>

              <select
                className="input-dark w-full"
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                required
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block mt-4">
            <span className="block text-sm text-gray-300 mb-2">
              Description
            </span>

            <textarea
              className="input-dark w-full min-h-32"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              required
            />
          </label>
        </section>

        <section className="border-t border-[#D4AF37]/20 pt-6">
          <h2 className="font-luxury text-3xl mb-5">Pricing & Details</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <label className="block">
              <span className="block text-sm text-gray-300 mb-2">Price</span>

              <input
                className="input-dark w-full"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="block text-sm text-gray-300 mb-2">Weight</span>

              <input
                className="input-dark w-full"
                type="number"
                step="0.01"
                min="0"
                value={form.weight}
                onChange={(e) => updateField("weight", e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="block text-sm text-gray-300 mb-2">Stock</span>

              <input
                className="input-dark w-full"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="block text-sm text-gray-300 mb-2">Color</span>

              <input
                className="input-dark w-full"
                value={form.color}
                onChange={(e) => updateField("color", e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="block text-sm text-gray-300 mb-2">Clarity</span>

              <input
                className="input-dark w-full"
                value={form.clarity}
                onChange={(e) => updateField("clarity", e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="block text-sm text-gray-300 mb-2">Origin</span>

              <input
                className="input-dark w-full"
                value={form.origin}
                onChange={(e) => updateField("origin", e.target.value)}
                required
              />
            </label>
          </div>
        </section>

        <section className="border-t border-[#D4AF37]/20 pt-6">
          <h2 className="font-luxury text-3xl mb-5">Visibility</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 border border-[#D4AF37]/20 rounded-xl p-4">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => updateField("is_featured", e.target.checked)}
              />
              <span>Featured Stone</span>
            </label>

            <label className="flex items-center gap-3 border border-[#D4AF37]/20 rounded-xl p-4">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateField("is_active", e.target.checked)}
              />
              <span>Active Product</span>
            </label>
          </div>
        </section>

        <button
          disabled={saving}
          className="btn-gold w-full py-3.5 rounded-xl flex justify-center items-center gap-2"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}

export default AdminStoneEdit;