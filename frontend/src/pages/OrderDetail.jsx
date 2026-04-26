import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrder } from "../services/orderService";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    const data = await getOrder(id);
    setOrder(data);
  };

  if (!order) {
    return <div className="p-10">Loading order...</div>;
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-sm">
          Order Details
        </p>

        <h1 className="font-luxury text-5xl mt-2">Order #{order.id}</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <section className="card-luxury rounded-xl p-6">
          <h2 className="font-luxury text-3xl mb-6">Items</h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="border border-[#D4AF37]/20 rounded-xl p-4 flex items-center gap-4"
              >
                {item.stone_detail.images?.[0]?.image ? (
                  <img
                    src={item.stone_detail.images[0].image}
                    alt={item.stone_detail.name}
                    className="w-20 h-20 rounded object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-black rounded flex items-center justify-center text-[#D4AF37]">
                    GEM
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="font-semibold">{item.stone_detail.name}</h3>
                  <p className="text-gray-400">Qty: {item.quantity}</p>
                </div>

                <p className="text-[#D4AF37] font-bold">
                  ${Number(item.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="card-luxury rounded-xl p-6">
            <h2 className="font-luxury text-3xl mb-4">Summary</h2>

            <Info label="Status" value={order.status} />
            <Info label="Payment Method" value={order.payment_method} />
            <Info label="Payment Status" value={order.payment_status} />
            <Info
              label="Total"
              value={`$${Number(order.total_price).toLocaleString()}`}
            />
          </div>

          <div className="card-luxury rounded-xl p-6">
            <h2 className="font-luxury text-3xl mb-4">Delivery</h2>

            <Info label="Name" value={order.full_name} />
            <Info label="Phone" value={order.phone} />
            <Info label="Email" value={order.email} />
            <Info
              label="Address"
              value={`${order.address_line_1}, ${order.address_line_2 || ""}`}
            />
            <Info label="City" value={order.city} />
            <Info label="Province" value={order.province} />
            <Info label="Country" value={order.country} />
            <Info label="Postal Code" value={order.postal_code} />
          </div>
        </aside>
      </div>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#D4AF37]/10 py-3">
      <span className="text-gray-400">{label}</span>
      <span className="text-right capitalize">{value}</span>
    </div>
  );
}

export default OrderDetail;