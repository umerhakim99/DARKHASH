import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeFromCart } from "../services/cartService";
import { isAuthenticated } from "../services/authService";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  const handleRemove = async (stoneId) => {
    const data = await removeFromCart(stoneId);
    setCart(data);
  };

  if (!cart) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-luxury text-5xl mb-3">Your Cart</h1>

      <p className="text-gray-400 mb-8">
        Review your items before continuing to secure checkout.
      </p>

      {cart.items.length === 0 ? (
        <div className="card-luxury rounded-xl p-8">
          <p className="text-gray-400 mb-4">Your cart is empty.</p>
          <Link to="/stones" className="btn-gold inline-block px-6 py-3 rounded">
            Shop Stones
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <section className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="card-luxury rounded-xl p-5 flex items-center gap-5"
              >
                {item.stone_detail.images?.[0]?.image ? (
                  <img
                    src={item.stone_detail.images[0].image}
                    alt={item.stone_detail.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                ) : (
                  <div className="w-24 h-24 bg-black rounded flex items-center justify-center text-xs text-gray-500">
                    No Image
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="font-semibold">{item.stone_detail.name}</h3>
                  <p className="text-gray-400">Qty: {item.quantity}</p>
                  <p className="text-[#D4AF37]">
                    ${Number(item.total_price).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(item.stone)}
                  className="text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
          </section>

          <aside className="card-luxury rounded-xl p-6 h-fit">
            <h2 className="font-luxury text-2xl">Order Summary</h2>

            <div className="flex justify-between mt-6">
              <span>Total</span>
              <span className="text-[#D4AF37] font-bold">
                ${Number(cart.total_price).toLocaleString()}
              </span>
            </div>

            <Link
              to="/checkout"
              className="btn-gold block text-center mt-6 py-3 rounded"
            >
              Continue to Checkout
            </Link>

            <Link
              to="/stones"
              className="block text-center mt-4 text-[#D4AF37]"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;