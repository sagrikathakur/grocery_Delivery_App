import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import api from "../config/api";
import type { Product } from "../types";

const FlashDeals = () => {
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        const productList: Product[] = res.data?.products || [];
        const deals = productList.filter(
          (product) => (product.discount && product.discount > 0) || product.originalPrice > product.price
        );
        setDealProducts(deals);
      })
      .catch((err) => {
        console.error("Failed to fetch flash deals:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 py-8 px-6 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl text-white shadow-md text-center">
        <h1 className="text-3xl font-bold tracking-tight">Flash Deals</h1>
        <p className="text-sm sm:text-base text-white/90 mt-2 font-medium">
          Grab the best discounts on fresh groceries and essentials
        </p>
      </div>

      {loading ? (
        <Loading />
      ) : dealProducts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-zinc-500 text-base">No active deals right now. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {dealProducts.map((product) => (
            <ProductCard key={product.id || (product as any).id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashDeals;
