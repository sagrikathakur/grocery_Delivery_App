import { useNavigate } from "react-router-dom";
import type { Product } from "../types"
import { Plus, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";

interface Props {
  product: Product;
}
const ProductCard = ({ product }: Props) => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow:md transition-all duration-300 group animate-fade-in cursor-pointer"
      onClick={() => navigate(`/products/${product._id}`)}>

      <div className="relative aspect-square overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover p-4 group-hover:p-2 transition-all duration-300" />


        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.discount > 0 && <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-app-orange text-white rounded-full"> {product.discount} % OFF </span>}

        </div>


      </div>
      {/* info */}

      <div className="p-3.5 text-zinc-700">
        <h3 className="text-sm leading-snug mb-1.5 line-clamp-2">{product.name}</h3>
        {
          product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="size-3 text-app-warning fill-app-warning" />
              <span className="text-xs font-medium text-app-text">{product.rating}</span>
            </div>

          )
        }

        {/* price and add */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-baseline gap-1 truncate">
            <span className="text-base font-semibold text-zinc-900">{currency}{product.price.toFixed(1)}</span>
            <span className="text-xs text-zinc-500">/{product.unit}</span>
            {
              product.originalPrice > product.price && <span className="text-sm text-app-text-light line-through ml-1.5 ">
                {currency}{product.originalPrice.toFixed(1)}
              </span>
            }
          </div>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              addToCart(product); 
              toast.success(`${product.name} added to cart!`); 
            }}
            className="size-8 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors flex items-center justify-center cursor-pointer shadow hover:shadow-md"
            aria-label="Add to cart"
          >
            <Plus className="size-4" />
          </button>
        </div>

      </div>

    </div>
  )
}

export default ProductCard

