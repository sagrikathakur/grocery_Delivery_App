import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem, Product } from "../types";
import toast from "react-hot-toast";

export const MAX_ITEM_LIMIT = 5;

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quality?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuality: (productId: string, quality: number) => boolean;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  MAX_ITEM_LIMIT: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const getProdId = (p: any): string => {
    if (!p) return "";
    if (typeof p === "string") return p;
    return p._id || p.id || "";
  };

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("app_cart");
      if (!saved) return [];
      const parsed: CartItem[] = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];

      let totalCount = 0;
      const sanitized: CartItem[] = [];

      for (const item of parsed) {
        if (!item || !item.product || sanitized.length >= MAX_ITEM_LIMIT) break;
        const qty = Math.min(item.quantity || 1, MAX_ITEM_LIMIT);
        if (totalCount + qty <= MAX_ITEM_LIMIT) {
          sanitized.push({ ...item, quantity: qty });
          totalCount += qty;
        } else if (MAX_ITEM_LIMIT - totalCount > 0) {
          sanitized.push({ ...item, quantity: MAX_ITEM_LIMIT - totalCount });
          totalCount = MAX_ITEM_LIMIT;
          break;
        }
      }
      return sanitized;
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("app_cart", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [items]);

  const addToCart = (product: Product, quality: number = 1): boolean => {
    const targetId = getProdId(product);
    const existingItem = items.find((item) => getProdId(item.product) === targetId);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const currentCartTotalCount = items.reduce((acc, item) => acc + item.quantity, 0);

    // 1. Per-product quantity limit check
    if (currentQty + quality > MAX_ITEM_LIMIT) {
      toast.error(
        `Cannot add product. Maximum limit is ${MAX_ITEM_LIMIT} items per product.${
          currentQty > 0 ? ` (Currently in cart: ${currentQty})` : ""
        }`
      );
      return false;
    }

    // 2. Total items in cart limit check
    if (currentCartTotalCount + quality > MAX_ITEM_LIMIT) {
      toast.error(
        `Cannot add to cart. Total cart count cannot exceed ${MAX_ITEM_LIMIT} items. (Current in cart: ${currentCartTotalCount})`
      );
      return false;
    }

    // 3. Max unique products limit check
    if (!existingItem && items.length >= MAX_ITEM_LIMIT) {
      toast.error(`Cannot add to cart. Maximum limit is ${MAX_ITEM_LIMIT} different products in cart.`);
      return false;
    }

    setItems((prevItems) => {
      const existingInPrev = prevItems.find((item) => getProdId(item.product) === targetId);
      const prevQty = existingInPrev ? existingInPrev.quantity : 0;
      const prevTotal = prevItems.reduce((acc, item) => acc + item.quantity, 0);

      if (prevQty + quality > MAX_ITEM_LIMIT) return prevItems;
      if (prevTotal + quality > MAX_ITEM_LIMIT) return prevItems;
      if (!existingInPrev && prevItems.length >= MAX_ITEM_LIMIT) return prevItems;

      if (existingInPrev) {
        return prevItems.map((item) =>
          getProdId(item.product) === targetId
            ? { ...item, quantity: item.quantity + quality }
            : item
        );
      }
      return [...prevItems, { product, quantity: quality }];
    });

    return true;
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => getProdId(item.product) !== productId)
    );
  };

  const updateQuality = (productId: string, quality: number): boolean => {
    if (quality <= 0) {
      removeFromCart(productId);
      return true;
    }

    if (quality > MAX_ITEM_LIMIT) {
      toast.error(`Maximum limit is ${MAX_ITEM_LIMIT} items per product.`);
      return false;
    }

    const currentOtherTotal = items
      .filter((item) => getProdId(item.product) !== productId)
      .reduce((acc, item) => acc + item.quantity, 0);

    if (currentOtherTotal + quality > MAX_ITEM_LIMIT) {
      toast.error(`Total cart count cannot exceed ${MAX_ITEM_LIMIT} items.`);
      return false;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        getProdId(item.product) === productId
          ? { ...item, quantity: quality }
          : item
      )
    );
    return true;
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = items.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuality,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        MAX_ITEM_LIMIT,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const cartProvider = CartProvider;

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}