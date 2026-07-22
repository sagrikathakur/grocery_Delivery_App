import { useParams, useNavigate } from "react-router-dom";
import { dummyDashboardOrdersData } from "../assets/assets";
import { ArrowLeft, Phone, MapPin } from "lucide-react";
import LiveMap from "../components/OrderTracking/LiveMap";
import OrderTimeLine from "../components/OrderTracking/OrderTimeLine";

const OrderTracking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const order = dummyDashboardOrdersData.find((o) => o._id === id);

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <button onClick={() => navigate("/orders")} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 mb-6">
        <ArrowLeft className="size-4" /> Back to Orders
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-zinc-900">Track Order #{order._id.slice(-6)}</h1>
              <p className="text-xs text-zinc-500 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
              {order.status}
            </span>
          </div>

          <LiveMap order={order} liveLocation={order.liveLocation} />

          {order.deliveryPartner && (
            <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-xs text-zinc-500 font-medium">Delivery Agent</p>
                <p className="font-bold text-zinc-900">{order.deliveryPartner.name}</p>
                <p className="text-xs text-zinc-500">{order.deliveryPartner.phone}</p>
              </div>
              <a href={`tel:${order.deliveryPartner.phone}`} className="p-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-lg border border-zinc-200">
                <Phone className="size-4" />
              </a>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <OrderTimeLine order={order} />

          <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4">Delivery Address</h3>
            <div className="flex gap-2">
              <MapPin className="size-4 text-zinc-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-zinc-800">{order.shippingAddress.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
