import { useEffect, useState, useCallback } from "react";
import type { Order, OrderItem, Product } from "../types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { dummyDashboardOrdersData, statusColors } from "../assets/assets";
import toast from "react-hot-toast";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();

  const tabs = ["all", "Placed", "Out for Delivery", "Delivered"];
  const { clearCart, addToCart } = useCart();

  const fetchOrders = useCallback(async () => {
    setOrders(dummyDashboardOrdersData as unknown as Order[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (searchParams.get("clearCart")) {
      clearCart();
      setSearchParams({});
      setTimeout(fetchOrders, 2000);
    } else {
      fetchOrders();
    }
  }, [searchParams, clearCart, setSearchParams, fetchOrders]);

  const handleOrderAgain = (items: OrderItem[]) => {
    let addedAny = false;
    items.forEach((item) => {
      const prodId = typeof item.product === 'string' ? item.product : (item.product as any)?.id || (item.product as any)?._id || "";
      const prod: Product = {
        id: prodId,

        name: item.name,
        description: "",
        price: item.price,
        originalPrice: item.price,
        image: item.image,
        category: "groceries",
        unit: item.unit || "unit",
        stock: 100,
        isOrganic: false,
        rating: 4.5,
        reviewCount: 1,
        discount: 0,
        createdAt: new Date().toISOString()
      };
      if (addToCart(prod, item.quantity)) {
        addedAny = true;
      }
    });
    if (addedAny) {
      toast.success("Items added to cart");
    }
  };

  const filteredOrders = activeTab === "all"
    ? orders
    : orders.filter((o) => o.status.toLowerCase() === activeTab.toLowerCase());

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 mb-2">My Orders</h1>
      <p className="text-sm text-zinc-500 mb-6">Track and manage your past and active orders</p>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-4 text-sm font-medium border-b-2 capitalize transition-colors whitespace-nowrap ${activeTab === tab
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200">
          <p className="text-zinc-500 text-sm">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={(order as any)._id || order.id} className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                <div>
                  <p className="text-xs text-zinc-400">Order ID: {(order as any)._id || order.id}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status as keyof typeof statusColors] || "bg-zinc-100 text-zinc-700"}`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => navigate(`/orders/${(order as any)._id || order.id}/track`)}
                    className="px-4 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Track Order
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="py-4 space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <p className="font-medium text-zinc-900">{item.name}</p>
                        <p className="text-xs text-zinc-400">Qty: {item.quantity} · ${item.price} each</p>
                      </div>
                    </div>
                    <p className="font-semibold text-zinc-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <div>
                  <span className="text-xs text-zinc-400">Total Amount: </span>
                  <span className="text-base font-bold text-zinc-900">${order.total.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handleOrderAgain(order.items)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl hover:bg-zinc-50 transition-colors"
                >
                  Order Again
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;