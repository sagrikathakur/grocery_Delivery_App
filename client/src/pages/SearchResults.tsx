import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { Search } from "lucide-react";
import api from "../config/api";
import type { Product } from "../types";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || searchParams.get("query") || "";

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .get("/products", { params: { search: query.trim() } })
      .then((res) => {
        const productList: Product[] = res.data?.products || [];
        setResults(productList);
      })
      .catch((err) => {
        console.error("Search failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
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

      {loading ? (
        <Loading />
      ) : !query.trim() || results.length === 0 ? (
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
            <ProductCard key={product.id || (product as any)._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;