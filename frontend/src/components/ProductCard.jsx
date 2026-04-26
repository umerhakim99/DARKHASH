import { Link, useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { toggleWishlist } from "../services/stoneService";
import { isAuthenticated } from "../services/authService";

function ProductCard({ stone }) {
  const navigate = useNavigate();
  const primaryImage = stone.images?.[0]?.image;
  const rating = Number(stone.average_rating || 0);

  const handleWishlist = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    try {
      await toggleWishlist(stone.id);
    } catch {
      alert("Could not update wishlist");
    }
  };

  return (
    <Link
      to={`/stones/${stone.id}`}
      className="card-luxury rounded-2xl overflow-hidden hover:-translate-y-2 transition block group"
    >
      <div className="relative h-64 bg-black overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={stone.name}
            className="h-full w-full object-cover product-image-hover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#111] via-[#1a1a1a] to-black flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-luxury text-xl">
              GEM
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

        <button
          onClick={handleWishlist}
          type="button"
          className="absolute top-4 right-4 icon-link bg-black/50 border border-[#D4AF37]/30"
        >
          <Heart size={18} />
        </button>

        {stone.is_featured && (
          <span className="absolute top-4 left-4 badge-gold">
            Featured
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs text-[#D4AF37] uppercase tracking-widest">
          {stone.category_detail?.name || "Precious Stone"}
        </p>

        <h3 className="font-semibold text-xl mt-2 group-hover:text-[#D4AF37] transition">
          {stone.name}
        </h3>

        <div className="flex items-center gap-1 mt-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={15}
              className={
                star <= Math.round(rating)
                  ? "text-[#D4AF37] fill-[#D4AF37]"
                  : "text-gray-600"
              }
            />
          ))}

          <span className="text-xs text-gray-400 ml-1">
            {rating.toFixed(1)}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-400 mt-3">
          <span>{stone.weight} ct</span>
          <span>{stone.origin}</span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-[#D4AF37] font-bold text-xl">
            ${Number(stone.price).toLocaleString()}
          </p>

          <span className="text-xs text-gray-500 group-hover:text-[#D4AF37] transition">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;