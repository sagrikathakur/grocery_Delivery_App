import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Star, Plus, Minus, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import DummyReviewsSection from "../assets/DummyReviewsSection";
import ProductCard from "../components/ProductCard";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = dummyProducts.find((p) => p._id === id || (p as any).id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-zinc-800">Product Not Found</h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium cursor-pointer"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  const relatedProducts = dummyProducts.filter(
    (p) => p.category === product.category && p._id !== product._id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="size-4" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-100 shadow-xs">
        <div className="aspect-square bg-zinc-50 rounded-xl overflow-hidden border border-zinc-100 p-8 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain max-h-96"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            {product.isOrganic && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full inline-block">
                100% Organic
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">{product.name}</h1>
            <p className="text-zinc-600 text-sm leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                <Star className="size-4 fill-amber-500" />
                <span className="ml-1 text-sm font-bold text-zinc-900">{product.rating}</span>
              </div>
              <span className="text-zinc-400 text-sm">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-3xl font-bold text-zinc-900">${product.price.toFixed(2)}</span>
              <span className="text-sm text-zinc-500">/ {product.unit}</span>
              {product.originalPrice > product.price && (
                <span className="text-base text-zinc-400 line-through ml-2">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-4 pt-6 border-t border-zinc-100">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-zinc-700">Quantity:</span>
              <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  <Minus className="size-4" />
                </button>
                <span className="px-4 text-sm font-semibold text-zinc-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/10 cursor-pointer"
            >
              <ShoppingCart className="size-5" />
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </button>
        </div>
      </div>
    </div>

      {/* customer review */}
      {product.reviewCount > 0 && <DummyReviewsSection product={product} />}

      {/* related product  */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 mb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900">Related Products</h2>
            <p className="text-sm text-zinc-500 mt-1">You might also like these products from the same category</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 xl:gap-8">
            {relatedProducts.slice(0, 5).map((rp) => (
              <ProductCard key={rp._id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
