import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile } from "../services/authService";
import { getOrders } from "../services/orderService";
import { isAuthenticated } from "../services/authService";

function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const user = await getProfile();

      if (user.is_staff) {
        navigate("/admin-dashboard");
        return;
      }

      const orderData = await getOrders();

      setProfile(user);
      setOrders(orderData.results || orderData);
    } catch (error) {
      navigate("/login");
    }
  };

  if (!profile) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-luxury text-5xl mb-3">
        Welcome, {profile.username}
      </h1>

      <p className="text-gray-400 mb-10">{profile.email}</p>

      <section className="grid md:grid-cols-3 gap-4 mb-10">
        <div className="card-luxury rounded-xl p-6">
          <p className="text-gray-400">Total Orders</p>
          <h2 className="text-3xl font-bold text-[#D4AF37]">
            {orders.length}
          </h2>
        </div>

        <div className="card-luxury rounded-xl p-6">
          <p className="text-gray-400">Account Type</p>
          <h2 className="text-3xl font-bold text-[#D4AF37]">Customer</h2>
        </div>

        <div className="card-luxury rounded-xl p-6">
          <p className="text-gray-400">Status</p>
          <h2 className="text-3xl font-bold text-[#D4AF37]">Active</h2>
        </div>
      </section>

      <section className="card-luxury rounded-xl p-6">
        <h2 className="font-luxury text-3xl mb-6">Order History</h2>

        {orders.length === 0 ? (
          <p className="text-gray-400">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                to={`/orders/${order.id}`}
                key={order.id}
                className="border border-[#D4AF37]/20 rounded p-4 flex justify-between hover:border-[#D4AF37] transition"
              >
                <div>
                  <p>Order #{order.id}</p>
                  <p className="text-gray-400 capitalize">{order.status}</p>
                </div>

                <p className="text-[#D4AF37] font-bold">
                  ${Number(order.total_price).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;