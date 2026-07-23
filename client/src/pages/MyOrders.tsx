import { useEffect, useState, useCallback } from "react";
import type { Order, OrderItem } from "../types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { dummyDashboardOrdersData, dummyProducts, statusColors } from "../assets/assets";
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
    items.forEach((item) => {
      const prod = dummyProducts.find((p) => p._id === item.product);
      if (prod) addToCart(prod, item.quantity);
    });
    toast.success("Items added to cart");
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
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen mb-20">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">My Orders</h1>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const count = tab === "all"
            ? orders.length
            : orders.filter((o) => o.status.toLowerCase() === tab.toLowerCase()).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 capitalize cursor-pointer ${activeTab === tab
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
                }`}
            >
              {tab === "all" ? "All Orders" : tab} ({count})
            </button>
          );
        })}
      </div>

      {/* List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-100 p-8 text-center shadow-sm">
          <p className="text-zinc-500 text-sm">No orders found.</p>
          <button onClick={() => navigate("/products")} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold">
            Shop Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-zinc-100">
                <div>
                  <h3 className="font-bold text-zinc-900">Order #{order._id.slice(-6)}</h3>
                  <p className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusColors[order.status] || "bg-zinc-100 text-zinc-800"}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.product} className="flex items-center gap-4">
                    <div className="size-16 bg-zinc-50 border border-zinc-100 rounded-xl overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-zinc-900 truncate">{item.name}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">{item.quantity} × {item.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-zinc-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-zinc-100">
                <p className="font-bold text-zinc-900">Total: ${order.total.toFixed(2)}</p>
                <div className="flex gap-3">
                  {order.status === "Delivered" && (
                    <button onClick={() => handleOrderAgain(order.items)} className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg cursor-pointer">
                      Order Again
                    </button>
                  )}
                  {order.status !== "Cancelled" && (
                    <button onClick={() => navigate(`/orders/${order._id}/track`)} className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg cursor-pointer">
                      Track Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;