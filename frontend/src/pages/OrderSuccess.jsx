import { Link, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function OrderSuccess() {
  const { id } = useParams();

  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-center">
      <div className="card-luxury rounded-2xl p-10">
        <CheckCircle size={80} className="text-green-400 mx-auto mb-6" />

        <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-sm">
          Order Confirmed
        </p>

        <h1 className="font-luxury text-5xl mt-4">
          Your Order Was Placed Successfully
        </h1>

        <p className="text-gray-400 mt-6">
          Thank you for shopping with GEMLUXE. Your order has been received and
          will be processed soon. Payment method: Cash on Delivery.
        </p>

        <div className="bg-black/40 border border-[#D4AF37]/20 rounded-xl p-5 mt-8">
          <p className="text-gray-400">Order Number</p>
          <h2 className="text-3xl text-[#D4AF37] font-bold">#{id}</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link to={`/orders/${id}`} className="btn-gold px-8 py-3 rounded">
            View Order Details
          </Link>

          <Link
            to="/stones"
            className="border border-[#D4AF37] px-8 py-3 rounded"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;