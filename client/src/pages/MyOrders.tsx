import { useEffect, useState, useCallback } from "react";
import type { Order, OrderItem } from "../types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { dummyDashboardOrdersData, dummyProducts } from "../assets/assets";
import { ShoppingBag, Truck, Eye } from "lucide-react";
import toast from "react-hot-toast";

const MyOrders = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
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
      setTimeout(() => {
        fetchOrders();
      }, 2000);
    } else {
      fetchOrders();
    }
  }, [searchParams, clearCart, setSearchParams, fetchOrders]);

  const handleOrderAgain = (orderItems: OrderItem[]) => {
    orderItems.forEach((item) => {
      const fullProduct = dummyProducts.find(
        (p) => p._id === item.product || (p as any).id === item.product
      );
      if (fullProduct) {
        addToCart(fullProduct, item.quantity);
      }
    });
    toast.success("Items added to cart!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Placed":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Placed
          </span>
        );
      case "Assigned":
      case "Packed":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            {status}
          </span>
        );
      case "Out for Delivery":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            Out for Delivery
          </span>
        );
      case "Delivered":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500"></span>
            Delivered
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-50 text-zinc-600 border border-zinc-200 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-zinc-400"></span>
            {status}
          </span>
        );
    }
  };

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter(
        (order) => order.status.toLowerCase() === activeTab.toLowerCase()
      );

  if (loading) {
    return (
      <div className="min-h-screen bg-app-cream flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-zinc-500 font-medium">
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 min-h-screen mb-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
          <ShoppingBag className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">My Orders</h1>
          <p className="text-sm text-zinc-500">
            View history and track your active deliveries
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const count =
            tab === "all"
              ? orders.length
              : orders.filter((o) => o.status.toLowerCase() === tab.toLowerCase())
                .length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 text-sm font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === tab
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
                }`}
            >
              <span className="capitalize">{tab === "all" ? "All Orders" : tab}</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${activeTab === tab
                    ? "bg-orange-100 text-orange-600"
                    : "bg-zinc-100 text-zinc-500"
                  }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-100 p-12 text-center shadow-xs">
          <div className="size-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="size-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-bold text-zinc-950">No Orders Found</h3>
          <p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">
            {activeTab === "all"
              ? "You haven't placed any orders yet. Start shopping to place your first order!"
              : `You don't have any orders with status "${activeTab}" right now.`}
          </p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-orange-500/10"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-zinc-100 shadow-xs p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-4 border-b border-zinc-100 gap-4">
                <div>
                  <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                    Order ID
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 mt-0.5">
                    #{order._id.substring(0, 12)}...
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {getStatusBadge(order.status)}
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${order.isPaid
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-zinc-50 text-zinc-600 border-zinc-200"
                      }`}
                  >
                    {order.paymentMethod === "cash" ? "COD" : "Online"} •{" "}
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.product} className="flex gap-4 items-center">
                    <div className="size-16 rounded-xl bg-zinc-50 border border-zinc-100 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-zinc-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Qty: {item.quantity} • {item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-zinc-900">
                        {currency}
                        {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary & Footer Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-4 mt-6 border-t border-zinc-100 gap-4">
                <div>
                  <span className="text-xs text-zinc-500">Total Bill</span>
                  <div className="text-lg font-bold text-app-green">
                    {currency}
                    {order.total.toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  {order.status !== "Delivered" && (
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                    >
                      <Truck className="size-3.5" /> Track Order
                    </button>
                  )}
                  {order.status === "Delivered" && (
                    <button
                      onClick={() => handleOrderAgain(order.items)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Order Again
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <Eye className="size-3.5" /> View Details
                  </button>
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