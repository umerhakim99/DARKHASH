import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gem, Plus, Package, Tags, ShoppingBag, Users } from "lucide-react";

import { getProfile } from "../services/authService";
import { getCategories, getStones } from "../services/stoneService";
import { createCategory, deleteCategory, deleteStone } from "../services/adminService";
import { getOrders } from "../services/orderService";

function AdminDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stones, setStones] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadAdmin();
  }, []);

  const loadAdmin = async () => {
    try {
      const user = await getProfile();

      if (!user.is_staff) {
        alert("Only admin users can access this page.");
        navigate("/");
        return;
      }

      setProfile(user);

      const stonesData = await getStones();
      const categoryData = await getCategories();
      const orderData = await getOrders();

      setStones(stonesData.results || stonesData);
      setCategories(categoryData.results || categoryData);
      setOrders(orderData.results || orderData);
    } catch (error) {
      alert("Please login as admin first.");
      navigate("/login");
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    try {
      await createCategory(categoryForm);
      setCategoryForm({ name: "", description: "" });
      loadAdmin();
    } catch (error) {
      alert("Could not create category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      loadAdmin();
    } catch (error) {
      alert("Could not delete category. It may have stones assigned.");
    }
  };

  const handleDeleteStone = async (id) => {
    if (!confirm("Delete this stone?")) return;

    try {
      await deleteStone(id);
      loadAdmin();
    } catch (error) {
      alert("Could not delete stone.");
    }
  };

  if (!profile) {
    return <div className="p-10">Loading admin dashboard...</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-sm">
            Admin Control Center
          </p>

          <h1 className="font-luxury text-5xl mt-2">
            Marketplace Dashboard
          </h1>

          <p className="text-gray-400 mt-2">
            Manage stones, categories, images, certificates, and orders.
          </p>
        </div>

        <Link
          to="/admin-dashboard/stones/create"
          className="btn-gold px-6 py-3 rounded flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Stone
        </Link>
      </div>

      <section className="grid md:grid-cols-4 gap-4 mb-10">
        <StatCard icon={<Gem />} title="Total Stones" value={stones.length} />
        <StatCard icon={<Tags />} title="Categories" value={categories.length} />
        <StatCard icon={<ShoppingBag />} title="Orders" value={orders.length} />
        <StatCard icon={<Users />} title="Role" value="Admin" />
      </section>

      <section className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="card-luxury rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-luxury text-3xl">Stone Inventory</h2>

            <Link
              to="/admin-dashboard/stones/create"
              className="text-[#D4AF37] text-sm"
            >
              Add Stone
            </Link>
          </div>

          {stones.length === 0 ? (
            <p className="text-gray-400">No stones found.</p>
          ) : (
            <div className="space-y-4">
              {stones.map((stone) => (
                <div
                  key={stone.id}
                  className="border border-[#D4AF37]/20 rounded-xl p-4 flex items-center gap-4"
                >
                  {stone.images?.[0]?.image ? (
                    <img
                      src={stone.images[0].image}
                      alt={stone.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-black rounded flex items-center justify-center text-[#D4AF37]">
                      GEM
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold">{stone.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {stone.category_detail?.name} • {stone.origin} • Stock {stone.stock}
                    </p>
                    <p className="text-[#D4AF37] font-bold">
                      ${Number(stone.price).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteStone(stone.id)}
                    className="text-red-400 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-8">
          <div className="card-luxury rounded-xl p-6">
            <h2 className="font-luxury text-3xl mb-6">Create Category</h2>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <input
                className="input-dark w-full"
                placeholder="Category name"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    name: e.target.value,
                  })
                }
                required
              />

              <textarea
                className="input-dark w-full min-h-28"
                placeholder="Description"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    description: e.target.value,
                  })
                }
              />

              <button className="btn-gold w-full py-3 rounded">
                Save Category
              </button>
            </form>
          </div>

          <div className="card-luxury rounded-xl p-6">
            <h2 className="font-luxury text-3xl mb-6">Categories</h2>

            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex justify-between border border-[#D4AF37]/20 rounded p-3"
                >
                  <span>{category.name}</span>

                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-400 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="card-luxury rounded-xl p-6">
      <div className="text-[#D4AF37] mb-4">{icon}</div>
      <p className="text-gray-400">{title}</p>
      <h2 className="text-3xl font-bold mt-1">{value}</h2>
    </div>
  );
}

export default AdminDashboard;