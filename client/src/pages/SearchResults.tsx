import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || searchParams.get("query") || "";

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return dummyProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
          <Search className="size-6 text-orange-500" />
          Search Results for "{query}"
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Found {results.length} {results.length === 1 ? "product" : "products"}
        </p>
      </div>

      {!query.trim() || results.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-zinc-200 p-8">
          <p className="text-zinc-500 text-base mb-4">No products found matching your search term.</p>
          <Link
            to="/products"
            className="inline-block px-4 py-2 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {results.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;