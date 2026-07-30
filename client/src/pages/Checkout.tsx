import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CheckoutAddress from "../components/Checkout/CheckoutAddress";
import CheckoutPayment from "../components/Checkout/CheckoutPayment";
import CheckoutReview from "../components/Checkout/CheckoutReview";
import api from "../config/api";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  CheckCircle,
  ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();

  const [userAddresses, setUserAddresses] = useState<any[]>([]);
  const [step, setStep] = useState<string>("address"); // "address" | "payment" | "review"
  const [address, setAddress] = useState<any>({
    id: "",
    label: "Home",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
    lat: 40.7128,
    lng: -74.006,
  });
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    api.get("/addresses")
      .then((res) => {
        if (res.data?.addresses && res.data.addresses.length > 0) {
          setUserAddresses(res.data.addresses);
          const defaultAddr = res.data.addresses.find((a: any) => a.isDefault) || res.data.addresses[0];
          setAddress(defaultAddr);
        }
      })
      .catch((err) => {
        console.error("Failed to load user addresses for checkout:", err);
      });
  }, []);

  // Cart summary calculations
  const deliveryFee = cartTotal > 20 ? 0 : 5.00;
  const tax = cartTotal * 0.08;
  const total = cartTotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
  if (items.length === 0) return;
  setLoading(true);

  const payload = {
    items: items.map((item) => ({
      product: item.product.id,
      quantity: item.quantity,
    })),
    shippingAddress: {
      label: address.label || "Home",
      address: address.address,
      city: address.city,
      state: address.state,
      zip: address.zip,
      lat: address.lat || 40.7128,
      lng: address.lng || -74.006,
    },
    paymentMethod: paymentMethod || "card",
  };

  try {
    const res = await api.post("/orders", payload);
    const createdOrder = res.data?.order || res.data;
    const orderId = createdOrder?.id || createdOrder?._id;

    clearCart();
    toast.success("Order placed successfully!");
    if (orderId) {
      navigate(`/orders/${orderId}/track`);
    } else {
      navigate("/orders");
    }
  } catch (error: any) {
    console.error("Failed to place order:", error);
    const msg = error.response?.data?.message || "Failed to place order. Please try again.";
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};

  // Empty cart handler
  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Your Cart is Empty</h2>
        <p className="text-zinc-500 mb-6 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. Explore our fresh products and start shopping!
        </p>
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-orange-500/20"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Checkout Progress Stepper */}
      <div className="flex items-center justify-center max-w-2xl mx-auto mb-10">
        {[
          { id: "address", label: "Address", icon: MapPin },
          { id: "payment", label: "Payment", icon: CreditCard },
          { id: "review", label: "Review Order", icon: ShieldCheck },
        ].map((s, idx, arr) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isCompleted =
            (step === "payment" && s.id === "address") ||
            (step === "review" && (s.id === "address" || s.id === "payment"));

          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-initial">
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${isCompleted
                      ? "bg-emerald-500 text-white"
                      : isActive
                        ? "bg-app-green text-white ring-4 ring-app-green/20"
                        : "bg-app-cream border border-app-border text-app-text-light"
                    }`}
                >
                  {isCompleted ? <CheckCircle className="size-5" /> : <Icon className="size-5" />}
                </div>
                <span
                  className={`text-sm font-semibold hidden sm:inline ${isActive || isCompleted ? "text-zinc-900" : "text-zinc-400"
                    }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-colors ${isCompleted ? "bg-emerald-500" : "bg-zinc-200"
                    }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Grid: Left Steps + Right Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {step === "address" && (
            <CheckoutAddress
              user={{ addresses: userAddresses }}
              address={address}
              setAddress={setAddress}
              setStep={setStep}
            />
          )}

          {step === "payment" && (
            <CheckoutPayment
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              setStep={setStep}
            />
          )}

          {step === "review" && (
            <CheckoutReview
              address={address}
              items={items}
              handlePlaceOrder={handlePlaceOrder}
              loading={loading}
              total={total}
            />
          )}

        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm sticky top-24">
          <h3 className="text-lg font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">
            Order Summary
          </h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm text-zinc-600">
              <span>Subtotal ({items.length} items)</span>
              <span className="font-semibold text-zinc-900">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-600">
              <span>Delivery Fee</span>
              {deliveryFee === 0 ? (
                <span className="font-semibold text-emerald-600">FREE</span>
              ) : (
                <span className="font-semibold text-zinc-900">${deliveryFee.toFixed(2)}</span>
              )}
            </div>
            <div className="flex justify-between text-sm text-zinc-600">
              <span>Estimated Tax (8%)</span>
              <span className="font-semibold text-zinc-900">${tax.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-zinc-100 flex justify-between items-center">
              <span className="text-base font-bold text-zinc-900">Total Amount</span>
              <span className="text-xl font-bold text-emerald-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5">
            <ShieldCheck className="size-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              Guaranteed 10-minute ultra-fast delivery. Fresh & organic quality items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;