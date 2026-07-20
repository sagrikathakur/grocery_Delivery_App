import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem, Product } from "../types";

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quality?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuality: (productId: string, quality: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("app_cart");
      return saved ? JSON.parse(saved) : [];
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

  const addToCart = (product: Product, quality: number = 1) => {
    setItems((prevItems) => {
      const getProdId = (p: Product) => p._id || (p as any).id;
      const targetId = getProdId(product);
      const existingItem = prevItems.find((item) => getProdId(item.product) === targetId);

      if (existingItem) {
        return prevItems.map((item) =>
          getProdId(item.product) === targetId
            ? { ...item, quantity: item.quantity + quality }
            : item
        );
      }
      return [...prevItems, { product, quantity: quality }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => (item.product._id || (item.product as any).id) !== productId)
    );
  };

  const updateQuality = (productId: string, quality: number) => {
    if (quality <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        (item.product._id || (item.product as any).id) === productId
          ? { ...item, quantity: quality }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
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