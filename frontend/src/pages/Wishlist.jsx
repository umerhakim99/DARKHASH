import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getWishlist } from "../services/stoneService";
import { isAuthenticated } from "../services/authService";

function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const data = await getWishlist();
      setItems(data.results || data);
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-luxury text-5xl mb-8">Wishlist</h1>

      {items.length === 0 ? (
        <p className="text-gray-400">Your wishlist is empty.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard key={item.id} stone={item.stone_detail} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Wishlist;