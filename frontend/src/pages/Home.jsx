import { useEffect, useState } from "react";
import { ShieldCheck, Truck, RotateCcw, Lock, TrendingUp } from "lucide-react";
import { getCategories, getStones } from "../services/stoneService";
import ProductCard from "../components/ProductCard";

function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadHome();
  }, []);

  const loadHome = async () => {
    try {
      const stones = await getStones({ is_featured: true });
      const cats = await getCategories();

      setFeatured(stones.results || stones);
      setCategories(cats.results || cats);
    } catch (error) {
      console.error("Home loading error:", error);
    }
  };

  return (
    <main>
      <section className="min-h-[680px] flex items-center bg-gradient-to-r from-black via-[#111111] to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_20%,#D4AF37,transparent_30%)]" />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <p className="text-[#D4AF37] tracking-[0.25em] text-sm uppercase">
              Precious by Nature
            </p>

            <h1 className="font-luxury text-5xl md:text-7xl mt-4 leading-tight">
              Discover the World’s Finest Precious Stones
            </h1>

            <p className="text-gray-300 mt-6 text-lg max-w-xl">
              A modern marketplace for certified sapphires, rubies, emeralds,
              diamonds, and rare collector stones.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <a href="/stones" className="btn-gold px-8 py-3 rounded">
                Shop Now
              </a>

              <a
                href="/admin-dashboard"
                className="border border-[#D4AF37] px-8 py-3 rounded hover:bg-[#D4AF37] hover:text-black transition"
              >
                Admin Dashboard
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="rounded-2xl border border-[#D4AF37]/30 p-4 shadow-2xl">
              <div className="h-[440px] bg-[#151515] rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute w-72 h-72 rounded-full border-[18px] border-[#D4AF37] opacity-80" />
                <div className="absolute w-44 h-44 rounded-full bg-blue-700 blur-sm opacity-90" />
                <div className="relative text-center">
                  <h2 className="font-luxury text-5xl text-white">GEMLUXE</h2>
                  <p className="text-[#D4AF37] tracking-[0.3em] mt-3 text-sm">
                    CERTIFIED STONES
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid md:grid-cols-4 gap-4">
          {[
            [ShieldCheck, "Certified Stones", "100% Authentic"],
            [Lock, "Secure Payment", "Encrypted & Safe"],
            [Truck, "Worldwide Shipping", "Fast & Reliable"],
            [RotateCcw, "30-Day Returns", "Hassle-Free"],
          ].map(([Icon, title, text]) => (
            <div key={title} className="card-luxury rounded-xl p-5 flex gap-4">
              <Icon className="text-[#D4AF37]" />
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-gray-400 text-sm">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-luxury text-4xl">Featured Stones</h2>

          <a href="/stones" className="text-[#D4AF37]">
            View All
          </a>
        </div>

        {featured.length === 0 ? (
          <p className="text-gray-400">
            No featured stones yet. Run seed command or add stones from admin.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map((stone) => (
              <ProductCard key={stone.id} stone={stone} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="font-luxury text-4xl mb-8">Shop by Category</h2>

        {categories.length === 0 ? (
          <p className="text-gray-400">No categories yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/stones?category=${category.id}`}
                className="card-luxury p-8 rounded-xl text-center hover:border-[#D4AF37] transition"
              >
                <h3 className="text-xl font-luxury">{category.name}</h3>
                <p className="text-gray-400 text-sm mt-2">
                  Explore collection
                </p>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="card-luxury rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-[#D4AF37]" />
            <h2 className="font-luxury text-4xl">Market Trends</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Trend title="Gold Price Index" value="$2,384.60 / oz" change="+1.35%" />
            <Trend title="Diamond Index" value="18,732.40" change="-0.85%" danger />
            <Trend title="Emerald Index" value="9,875.20" change="+2.15%" />
          </div>
        </div>
      </section>
    </main>
  );
}

function Trend({ title, value, change, danger }) {
  return (
    <div className="bg-black/40 border border-[#D4AF37]/20 rounded-xl p-5">
      <p className="text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
      <p className={danger ? "text-red-400 mt-2" : "text-green-400 mt-2"}>
        {change}
      </p>
    </div>
  );
}

export default Home;