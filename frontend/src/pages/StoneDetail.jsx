import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";

import PriceChart from "../components/PriceChart";
import { addToCart } from "../services/cartService";
import {
  getPriceHistory,
  getStone,
  toggleWishlist,
} from "../services/stoneService";
import { isAuthenticated } from "../services/authService";
import { createReview, getReviews } from "../services/reviewService";

function StoneDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stone, setStone] = useState(null);
  const [history, setHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [message, setMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    loadStone();
  }, [id]);

  const loadStone = async () => {
    try {
      const data = await getStone(id);
      const priceData = await getPriceHistory(id);
      const reviewData = await getReviews(id);

      setStone(data);
      setHistory(priceData.results || priceData);
      setReviews(reviewData.results || reviewData);
      setMainImage(data.images?.[0]?.image || "");
    } catch (error) {
      console.error("Stone detail error:", error);
    }
  };

  const handleAddToCartAndCheckout = async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (stone.stock <= 0) {
      setMessage("This product is currently out of stock.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setIsAdding(true);

      await addToCart(stone.id, 1);

      navigate("/checkout");
    } catch (error) {
      const detail = error.response?.data?.detail;

      setMessage(detail || "Could not add product to cart.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    try {
      await toggleWishlist(stone.id);
      setMessage("Wishlist updated.");
      setTimeout(() => setMessage(""), 2500);
    } catch {
      setMessage("Could not update wishlist.");
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    try {
      await createReview({
        stone: stone.id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });

      setReviewForm({
        rating: 5,
        comment: "",
      });

      setMessage("Review submitted successfully.");
      await loadStone();

      setTimeout(() => setMessage(""), 2500);
    } catch {
      setMessage("You may have already reviewed this product.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!stone) {
    return <div className="p-10">Loading...</div>;
  }

  const rating = Number(stone.average_rating || 0);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      {message && (
        <div className="fixed top-24 right-6 bg-[#151515] border border-[#D4AF37]/40 text-white px-6 py-4 rounded-xl shadow-xl z-50">
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-12">
        <section>
          <div className="card-luxury rounded-xl overflow-hidden h-[500px]">
            {mainImage ? (
              <img
                src={mainImage}
                alt={stone.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No image
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4 flex-wrap">
            {stone.images?.map((img) => (
              <button
                key={img.id}
                onClick={() => setMainImage(img.image)}
                className="w-20 h-20 border border-[#D4AF37]/30 rounded overflow-hidden"
              >
                <img
                  src={img.image}
                  alt={img.alt_text || stone.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="text-[#D4AF37] uppercase text-sm">
            {stone.category_detail?.name}
          </p>

          <h1 className="font-luxury text-5xl mt-3">{stone.name}</h1>

          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={
                  star <= Math.round(rating)
                    ? "text-[#D4AF37] fill-[#D4AF37]"
                    : "text-gray-600"
                }
              />
            ))}

            <span className="text-gray-400 text-sm">
              {rating.toFixed(1)} / 5 ({reviews.length} reviews)
            </span>
          </div>

          <p className="text-3xl text-[#D4AF37] font-bold mt-6">
            ${Number(stone.price).toLocaleString()}
          </p>

          <p className="text-gray-300 mt-6 leading-7">{stone.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-8 text-sm">
            <Info label="Weight" value={`${stone.weight} ct`} />
            <Info label="Color" value={stone.color} />
            <Info label="Clarity" value={stone.clarity} />
            <Info label="Origin" value={stone.origin} />
            <Info label="Stock" value={stone.stock} />
            <Info label="Rating" value={`${rating.toFixed(1)}/5`} />
          </div>

          {stone.certification_file && (
            <a
              href={stone.certification_file}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-6 text-[#D4AF37] underline"
            >
              View Certificate
            </a>
          )}

          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={handleAddToCartAndCheckout}
              disabled={isAdding || stone.stock <= 0}
              className="btn-gold px-10 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? "Processing..." : "Buy Now"}
            </button>

            <button
              onClick={handleWishlist}
              className="border border-[#D4AF37] px-10 py-3 rounded hover:bg-[#D4AF37] hover:text-black transition"
            >
              Wishlist
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Clicking Buy Now will add this item to your cart and take you
            directly to checkout.
          </p>
        </section>
      </div>

      <section className="mt-16">
        <PriceChart history={history} />
      </section>

      <section className="grid lg:grid-cols-[1fr_420px] gap-8 mt-16">
        <div className="card-luxury rounded-xl p-6">
          <h2 className="font-luxury text-3xl mb-6">Customer Reviews</h2>

          {reviews.length === 0 ? (
            <p className="text-gray-400">
              No reviews yet. Be the first to review.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-[#D4AF37]/20 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold">
                      {review.full_name || review.username}
                    </h3>

                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={15}
                          className={
                            star <= review.rating
                              ? "text-[#D4AF37] fill-[#D4AF37]"
                              : "text-gray-600"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-300 mt-3">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={handleReviewSubmit}
          className="card-luxury rounded-xl p-6 h-fit"
        >
          <h2 className="font-luxury text-3xl mb-6">Write a Review</h2>

          <label className="block mb-4">
            <span className="block text-sm text-gray-400 mb-2">Rating</span>

            <select
              className="input-dark w-full"
              value={reviewForm.rating}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  rating: e.target.value,
                })
              }
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </label>

          <textarea
            className="input-dark w-full min-h-32"
            placeholder="Share your experience..."
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm({
                ...reviewForm,
                comment: e.target.value,
              })
            }
            required
          />

          <button className="btn-gold w-full py-3 rounded mt-4">
            Submit Review
          </button>
        </form>
      </section>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="card-luxury p-4 rounded">
      <p className="text-gray-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

export default StoneDetail;