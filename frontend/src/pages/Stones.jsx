import { useEffect, useState } from "react";
import { getCategories, getStones } from "../services/stoneService";
import ProductCard from "../components/ProductCard";

function Stones() {
  const [stones, setStones] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    origin: "",
    ordering: "-created_at",
    search: "",
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      const stonesData = await getStones(filters);
      const categoriesData = await getCategories();

      setStones(stonesData.results || stonesData);
      setCategories(categoriesData.results || categoriesData);
    } catch (error) {
      console.error("Stones loading error:", error);
    }
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-luxury text-5xl mb-8">All Stones</h1>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="card-luxury rounded-xl p-5 h-fit">
          <h2 className="font-semibold mb-4">Filters</h2>

          <div className="space-y-4">
            <input
              className="input-dark w-full"
              placeholder="Search stones..."
              onChange={(e) => updateFilter("search", e.target.value)}
            />

            <select
              className="input-dark w-full"
              onChange={(e) => updateFilter("category", e.target.value)}
            >
              <option value="">All Categories</option>

              {categories.map((cat) => (
                <option value={cat.id} key={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              className="input-dark w-full"
              placeholder="Origin"
              onChange={(e) => updateFilter("origin", e.target.value)}
            />

            <select
              className="input-dark w-full"
              onChange={(e) => updateFilter("ordering", e.target.value)}
            >
              <option value="-created_at">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="weight">Weight: Low to High</option>
              <option value="-weight">Weight: High to Low</option>
            </select>
          </div>
        </aside>

        <section>
          {stones.length === 0 ? (
            <p className="text-gray-400">No stones found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stones.map((stone) => (
                <ProductCard key={stone.id} stone={stone} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Stones;