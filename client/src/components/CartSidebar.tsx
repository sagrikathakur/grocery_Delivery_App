
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartSidebar = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    items,
    removeFromCart,
    updateQuality,
    clearCart,
    cartTotal,
    cartCount,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-xs"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-zinc-900">Your Cart</h2>
            {cartCount > 0 && (
              <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center shadow-xs">
                <ShoppingBag className="size-10" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-800">Your cart is empty</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  Looks like you haven't added any fresh groceries yet.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors shadow-xs cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => {
              const productId = item.product._id || (item.product as any).id;
              return (
                <div
                  key={productId}
                  className="flex gap-3 p-3 bg-white rounded-xl border border-zinc-100 shadow-xs hover:border-zinc-200 transition-all"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-zinc-50 border border-zinc-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-zinc-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(productId)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        ${item.product.price.toFixed(2)} / {item.product.unit || "item"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50">
                        <button
                          onClick={() => updateQuality(productId, item.quantity - 1)}
                          className="p-1 text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-zinc-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuality(productId, item.quantity + 1)}
                          className="p-1 text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-zinc-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-zinc-100 bg-white space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-zinc-500">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Taxes & shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="px-3 py-3 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-red-600 transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/10 cursor-pointer active:scale-[0.99]"
              >
                Proceed to Checkout
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;