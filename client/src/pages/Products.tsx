import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { categoriesData } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import FilterPanel from "../components/FilterPanel";
import { Search } from "lucide-react";
import api from "../config/api";
import type { Product } from "../types";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Sync category state whenever the URL query parameter changes
  useEffect(() => {
    const catFromUrl = searchParams.get("category") || "all";
    setSelectedCategory(catFromUrl);
  }, [searchParams]);

  const handleSelectCategory = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    if (categorySlug === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categorySlug);
    }
    setSearchParams(searchParams);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory && selectedCategory !== "all") {
        params.category = selectedCategory;
      }
      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await api.get("/products", { params });
      const productList = response.data?.products || [];
      setProducts(productList);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">All Products</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Explore our wide range of fresh produce and daily essentials
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Main Content: Left Sidebar + Right Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <FilterPanel
          categories={categoriesData}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        <div className="flex-1 w-full min-w-0">
          {loading ? (
            <Loading />
          ) : products.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-zinc-500 text-base">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id || (product as any)._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
