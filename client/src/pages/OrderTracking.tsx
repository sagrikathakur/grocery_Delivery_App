import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Order } from '../types';
import { dummyDashboardOrdersData } from '../assets/assets';
import Loading from '../components/Loading';
import LiveMap from '../components/OrderTracking/LiveMap';
import OrderOTP from '../components/OrderTracking/OrderOTP';
import OrderTimeLine from '../components/OrderTracking/OrderTimeLine';
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  Info, 
  Truck, 
  User 
} from 'lucide-react';
import toast from 'react-hot-toast';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const foundOrder = dummyDashboardOrdersData.find((o) => o._id === id);
    if (foundOrder) setOrder(foundOrder as unknown as Order);
    setLoading(false);
  }, [id, navigate]);

  // Simulated live movements for active orders in transit
  useEffect(() => {
    if (!order || order.status !== "Out for Delivery") {
      if (order) setLiveLocation(order.liveLocation || null);
      return;
    }

    const destLat = order.shippingAddress.lat || 40.7128;
    const destLng = order.shippingAddress.lng || -74.006;
    setLiveLocation({ lat: destLat + 0.004, lng: destLng + 0.004 });

    const interval = setInterval(() => {
      setLiveLocation((prev) => {
        if (!prev) return null;
        const latDiff = destLat - prev.lat;
        const lngDiff = destLng - prev.lng;

        if (Math.abs(latDiff) < 0.0001 && Math.abs(lngDiff) < 0.0001) {
          clearInterval(interval);
          return { lat: destLat, lng: destLng };
        }

        return {
          lat: prev.lat + latDiff * 0.15,
          lng: prev.lng + lngDiff * 0.15,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [order]);

  if (loading) return <Loading />;
  
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-app-cream">
        <div className="bg-white rounded-2xl p-8 border border-app-border text-center shadow-xs max-w-sm">
          <Info className="size-12 text-app-orange mx-auto mb-4" />
          <h2 className="text-xl font-bold text-app-green mb-2">Order Not Found</h2>
          <p className="text-sm text-app-text-light mb-6">We couldn't retrieve the details for order ID #{id?.slice(-6)}.</p>
          <button onClick={() => navigate("/orders")} className="px-6 py-2.5 bg-app-orange hover:bg-app-orange-dark text-white rounded-xl text-sm font-semibold transition-all cursor-pointer">
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  // --- Sub-render Methods for Modular JSX ---

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/orders")}
          className="size-10 rounded-full border border-app-border bg-white flex-center hover:bg-app-cream-dark transition-colors cursor-pointer"
          title="Back to Orders"
        >
          <ArrowLeft className="size-5 text-app-green" />
        </button>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-app-green">Track Order</h1>
            <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
              order.status === "Delivered" ? "bg-green-100 text-green-700" :
              order.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
            }`}>
              {order.status}
            </span>
          </div>
          <p className="text-xs text-app-text-light mt-1">
            Order ID: <span className="font-mono font-bold text-app-green">#{order._id}</span> • Placed on {new Date(order.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      <div className="bg-white px-5 py-3 rounded-2xl border border-app-border flex items-center gap-3 shadow-xs">
        <div className="size-10 rounded-full bg-app-orange/10 flex-center">
          <Truck className="size-5 text-app-orange" />
        </div>
        <div>
          <p className="text-xs text-app-text-light font-medium">Estimated Delivery</p>
          <p className="text-sm font-bold text-app-green">
            {order.status === "Delivered" ? "Delivered successfully" :
             order.status === "Cancelled" ? "Order Cancelled" :
             order.status === "Out for Delivery" ? "Arriving in 10-15 mins" : "Within 45-60 mins"}
          </p>
        </div>
      </div>
    </div>
  );

  const renderMapCard = () => (
    <div className="bg-white rounded-2xl border border-app-border p-4 shadow-xs">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-app-green">Delivery Map</h2>
        {order.status === "Out for Delivery" && (
          <span className="flex items-center gap-1.5 text-xs text-app-orange font-bold animate-pulse-soft">
            <span className="size-2 rounded-full bg-app-orange" />
            Live Tracking Partner
          </span>
        )}
      </div>
      <LiveMap order={order} liveLocation={liveLocation} />
    </div>
  );

  const renderPartnerCard = () => {
    if (!order.deliveryPartner) return null;
    return (
      <div className="bg-white rounded-2xl border border-app-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-full bg-app-cream-dark border border-app-border overflow-hidden flex-center shrink-0">
            {order.deliveryPartner.avatar ? (
              <img src={order.deliveryPartner.avatar} alt={order.deliveryPartner.name} className="w-full h-full object-cover" />
            ) : (
              <User className="size-6 text-app-green-light" />
            )}
          </div>
          <div>
            <p className="text-xs text-app-text-light font-medium">Your Delivery Hero</p>
            <h3 className="text-base font-bold text-app-green">{order.deliveryPartner.name}</h3>
            <p className="text-xs text-app-text-light flex items-center gap-1 mt-0.5 capitalize">
              <Truck className="size-3" /> Delivery Rider
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast.success(`Calling ${order.deliveryPartner?.name}...`)}
            className="px-4 py-2.5 rounded-xl border border-app-border bg-white text-app-green hover:bg-app-cream-dark font-semibold text-sm flex items-center gap-2 cursor-pointer"
          >
            <Phone className="size-4" /> Call
          </button>
          <button 
            onClick={() => toast.success(`Opening chat with ${order.deliveryPartner?.name}...`)}
            className="px-4 py-2.5 rounded-xl bg-app-green hover:bg-app-green-light text-white font-semibold text-sm flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="size-4" /> Chat
          </button>
        </div>
      </div>
    );
  };

  const renderItemsList = () => (
    <div className="bg-white rounded-2xl border border-app-border p-6 shadow-xs">
      <h3 className="font-semibold text-app-green mb-4 flex items-center gap-2">
        <ShoppingBag className="size-5" />
        Order Items ({order.items.length})
      </h3>
      <div className="divide-y divide-app-border">
        {order.items.map((item) => (
          <div key={item.product} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            <div className="size-16 bg-app-cream-dark border border-app-border rounded-xl overflow-hidden flex-center p-2 shrink-0">
              <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-app-green truncate">{item.name}</h4>
              <p className="text-xs text-app-text-light mt-0.5">{item.quantity} × {item.unit}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-app-green">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAddressCard = () => (
    <div className="bg-white rounded-2xl border border-app-border p-6 shadow-xs">
      <h3 className="font-semibold text-app-green mb-4 flex items-center gap-2">
        <MapPin className="size-4 text-app-orange" />
        Delivery Address
      </h3>
      <div>
        <p className="text-xs bg-app-orange/10 text-app-orange px-2 py-0.5 rounded-md inline-block font-bold mb-2">
          {order.shippingAddress.label}
        </p>
        <p className="text-sm font-semibold text-app-green leading-relaxed">
          {order.shippingAddress.address}
        </p>
        <p className="text-xs text-app-text-light mt-1">
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
        </p>
      </div>
    </div>
  );

  const renderPaymentSummary = () => (
    <div className="bg-white rounded-2xl border border-app-border p-6 shadow-xs">
      <h3 className="font-semibold text-app-green mb-4 flex items-center gap-2">
        <CreditCard className="size-4 text-app-green-lighter" />
        Payment Summary
      </h3>
      
      <div className="space-y-2 text-sm border-b border-app-border pb-4 mb-4 text-app-text-light">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>${order.deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${order.tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-app-green mb-4">
        <span>Total Bill</span>
        <span>${order.total.toFixed(2)}</span>
      </div>

      <div className="bg-app-cream-dark p-3.5 rounded-xl border border-app-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <CreditCard className="size-4 text-app-green" />
          <span className="font-medium text-app-green capitalize">Payment: {order.paymentMethod}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full font-bold ${
          order.isPaid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
        }`}>
          {order.isPaid ? "Paid" : "Pending"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen mb-20 animate-fade-in">
      {renderHeader()}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Map and Details */}
        <div className="lg:col-span-2 space-y-6">
          {renderMapCard()}
          {renderPartnerCard()}
          {renderItemsList()}
        </div>

        {/* Right Side: Progress, Shipping details, Summary */}
        <div className="space-y-6">
          <OrderOTP order={order} />
          <OrderTimeLine order={order} />
          {renderAddressCard()}
          {renderPaymentSummary()}
        </div>

      </div>
    </div>
  );
}

export default OrderTracking