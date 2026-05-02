import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Gem,
  Plus,
  Tags,
  ShoppingBag,
  Users,
  Pencil,
  Trash2,
  PackageCheck,
  Clock,
} from "lucide-react";

import { getProfile, isAdmin } from "../services/authService";
import { getCategories, getStones } from "../services/stoneService";
import {
  createCategory,
  deleteCategory,
  deleteStone,
} from "../services/adminService";
import { getOrders } from "../services/orderService";

function AdminDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stones, setStones] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
      return;
    }

    loadAdmin();
  }, []);

  const loadAdmin = async () => {
    try {
      setLoading(true);

      const user = await getProfile();

      if (!user.is_staff) {
        navigate("/dashboard");
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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    try {
      await createCategory(categoryForm);

      setCategoryForm({
        name: "",
        description: "",
      });

      await loadAdmin();
    } catch (error) {
      alert("Could not create category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Delete this category?")) {
      return;
    }

    try {
      await deleteCategory(id);
      await loadAdmin();
    } catch (error) {
      alert("Could not delete category. It may have stones assigned.");
    }
  };

  const handleDeleteStone = async (id) => {
    if (!confirm("Delete this stone?")) {
      return;
    }

    try {
      await deleteStone(id);
      await loadAdmin();
    } catch (error) {
      alert("Could not delete stone.");
    }
  };

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const completedOrders = orders.filter(
    (order) => order.status === "delivered"
  );

  if (loading || !profile) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="card-luxury rounded-xl p-8 text-gray-400">
          Loading admin dashboard...
        </div>
      </main>
    );
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
            Manage stones, categories, products, inventory, and orders.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin-dashboard/orders"
            className="btn-outline-gold px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <ShoppingBag size={18} />
            Manage Orders
          </Link>

          <Link
            to="/admin-dashboard/stones/create"
            className="btn-gold px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Stone
          </Link>
        </div>
      </div>

      <section className="grid md:grid-cols-4 gap-4 mb-10">
        <StatCard icon={<Gem />} title="Total Stones" value={stones.length} />
        <StatCard icon={<Tags />} title="Categories" value={categories.length} />
        <StatCard icon={<Clock />} title="Pending Orders" value={pendingOrders.length} />
        <StatCard icon={<PackageCheck />} title="Delivered" value={completedOrders.length} />
      </section>

      <section className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="card-luxury rounded-xl p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-luxury text-3xl">Stone Inventory</h2>
              <p className="text-sm text-gray-400 mt-1">
                Add, edit, delete, and manage product stock.
              </p>
            </div>

            <Link
              to="/admin-dashboard/stones/create"
              className="text-[#D4AF37] text-sm hover:text-[#f5d879]"
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
                  className="border border-[#D4AF37]/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-[#D4AF37]/50 transition"
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
                      {stone.category_detail?.name || "No Category"} •{" "}
                      {stone.origin} • Stock {stone.stock}
                    </p>

                    <p className="text-[#D4AF37] font-bold">
                      ${Number(stone.price).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/admin-dashboard/stones/${stone.id}/edit`}
                      className="btn-outline-gold px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Pencil size={15} />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDeleteStone(stone.id)}
                      className="border border-red-500/40 text-red-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-red-500/10"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-8">
          <div className="card-luxury rounded-xl p-6">
            <h2 className="font-luxury text-3xl mb-2">Create Category</h2>

            <p className="text-sm text-gray-400 mb-6">
              Add new stone categories for inventory organization.
            </p>

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

              <button className="btn-gold w-full py-3 rounded-xl">
                Save Category
              </button>
            </form>
          </div>

          <div className="card-luxury rounded-xl p-6">
            <h2 className="font-luxury text-3xl mb-2">Categories</h2>

            <p className="text-sm text-gray-400 mb-6">
              Delete categories that are not assigned to products.
            </p>

            {categories.length === 0 ? (
              <p className="text-gray-400">No categories found.</p>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex justify-between items-center border border-[#D4AF37]/20 rounded-lg p-3 hover:border-[#D4AF37]/50 transition"
                  >
                    <div>
                      <span className="block font-medium">{category.name}</span>
                      {category.description && (
                        <span className="block text-xs text-gray-500 mt-1">
                          {category.description}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-400 text-sm hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-luxury rounded-xl p-6">
            <h2 className="font-luxury text-3xl mb-2">Recent Orders</h2>

            <p className="text-sm text-gray-400 mb-6">
              View and update customer order status.
            </p>

            {orders.length === 0 ? (
              <p className="text-gray-400">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="border border-[#D4AF37]/20 rounded-lg p-3"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold">Order #{order.id}</span>
                      <span className="text-[#D4AF37] text-sm">
                        {order.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mt-1">
                      {order.full_name || order.username}
                    </p>

                    <p className="text-sm text-gray-400">
                      ${Number(order.total_price).toLocaleString()}
                    </p>
                  </div>
                ))}

                <Link
                  to="/admin-dashboard/orders"
                  className="btn-outline-gold block text-center py-3 rounded-xl mt-4"
                >
                  Manage All Orders
                </Link>
              </div>
            )}
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