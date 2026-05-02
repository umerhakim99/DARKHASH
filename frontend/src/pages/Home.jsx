import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Truck, RotateCcw } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { getStones } from "../services/stoneService";
import { isAdmin } from "../services/authService";

function Home() {
  const [featuredStones, setFeaturedStones] = useState([]);
  const adminUser = isAdmin();

  useEffect(() => {
    loadFeaturedStones();
  }, []);

  const loadFeaturedStones = async () => {
    try {
      const data = await getStones();
      const stones = data.results || data;
      setFeaturedStones(stones.slice(0, 4));
    } catch (error) {
      console.error("Featured stones error:", error);
    }
  };

  return (
    <main>
      <section className="relative overflow-hidden border-b border-[#D4AF37]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <p className="text-[#D4AF37] uppercase tracking-[0.35em] text-sm mb-6">
              Precious by Nature
            </p>

            <h1 className="font-luxury text-5xl md:text-7xl leading-tight">
              Discover the World’s Finest Precious Stones
            </h1>

            <p className="text-gray-300 mt-8 text-lg max-w-xl leading-8">
              A modern marketplace for certified sapphires, rubies, emeralds,
              diamonds, and rare collector stones.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/stones" className="btn-gold px-8 py-3 rounded-xl">
                Shop Now
              </Link>

              {adminUser && (
                <Link
                  to="/admin-dashboard"
                  className="btn-outline-gold px-8 py-3 rounded-xl"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="card-luxury rounded-2xl p-4 lg:p-6">
            <div className="bg-[#151515] rounded-xl min-h-[360px] flex items-center justify-center">
              <div className="w-64 h-64 rounded-full border-[18px] border-[#D4AF37] flex items-center justify-center shadow-2xl shadow-[#D4AF37]/20">
                <div className="w-44 h-44 rounded-full bg-blue-700 blur-[1px] flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="font-luxury text-4xl">GEMLUXE</h2>
                    <p className="text-[#D4AF37] tracking-[0.3em] text-xs mt-2">
                      CERTIFIED STONES
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Feature
              icon={<ShieldCheck />}
              title="Certified Stones"
              text="100% Authentic"
            />
            <Feature icon={<Lock />} title="Secure Payment" text="Safe" />
            <Feature icon={<Truck />} title="All Ove The Country Shipping" text="Fast & Reliable" />
            <Feature icon={<RotateCcw />} title="7-Day Returns" text="Hassle-Free" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-sm">
              Curated Selection
            </p>
            <h2 className="font-luxury text-4xl mt-2">Featured Stones</h2>
          </div>

          <Link to="/stones" className="text-[#D4AF37] hover:text-[#f5d879]">
            View All
          </Link>
        </div>

        {featuredStones.length === 0 ? (
          <div className="card-luxury rounded-xl p-8 text-gray-400">
            No featured stones available yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredStones.map((stone) => (
              <ProductCard key={stone.id} stone={stone} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="card-luxury rounded-xl p-6 flex items-center gap-4">
      <div className="text-[#D4AF37]">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-400">{text}</p>
      </div>
    </div>
  );
}

export default Home;