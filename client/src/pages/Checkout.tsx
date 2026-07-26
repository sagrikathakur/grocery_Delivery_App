import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CheckoutAddress from "../components/Checkout/CheckoutAddress";
import CheckoutPayment from "../components/Checkout/CheckoutPayment";
import CheckoutReview from "../components/Checkout/CheckoutReview";
import { dummyAddressData, dummyDashboardOrdersData } from "../assets/assets";
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

  const [step, setStep] = useState<string>("address"); // "address" | "payment" | "review"
  const [address, setAddress] = useState<any>({
    _id: dummyAddressData[0]?._id || "",
    label: dummyAddressData[0]?.label || "",
    address: dummyAddressData[0]?.address || "",
    city: dummyAddressData[0]?.city || "",
    state: dummyAddressData[0]?.state || "",
    zip: dummyAddressData[0]?.zip || "",
    isDefault: dummyAddressData[0]?.isDefault || false,
    lat: dummyAddressData[0]?.lat || 40.7128,
    lng: dummyAddressData[0]?.lng || -74.006,
  });
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [loading, setLoading] = useState<boolean>(false);

  // Cart summary calculations
  const deliveryFee = cartTotal > 20 ? 0 : 5.00;
  const tax = cartTotal * 0.08;
  const total = cartTotal + deliveryFee + tax;

  const mockUser = {
    name: "John Doe",
    email: "john@gmail.com",
    addresses: dummyAddressData,
  };



  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    setLoading(true);

    // Simulate order placement delay for rich user feedback
    setTimeout(() => {
      const orderId = "order_" + Math.random().toString(36).substring(2, 9);
      
      const newOrder = {
        _id: orderId,
        user: {
          _id: "user_john",
          name: mockUser.name,
          email: mockUser.email,
        },
        items: items.map((item) => ({
          product: item.product._id || (item.product as any).id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
          unit: item.product.unit,
        })),
        shippingAddress: {
          label: address.label,
          address: address.address,
          city: address.city,
          state: address.state,
          zip: address.zip,
          lat: address.lat,
          lng: address.lng,
        },
        paymentMethod: paymentMethod,
        subtotal: cartTotal,
        deliveryFee: deliveryFee,
        tax: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2)),
        status: "Placed",
        statusHistory: [
          {
            status: "Placed",
            note: "Order placed successfully",
            timestamp: new Date().toISOString(),
            _id: "hist_" + Math.random().toString(36).substring(2, 9),
          },
        ],
        deliveryPartner: {
          _id: "69bbfc3866db7c6cdea47ede",
          name: "Rahul",
          email: "rahul@example.com",
          phone: "987654321",
          vehicleType: "bike",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        deliveryOtp: Math.floor(100000 + Math.random() * 900000).toString(),
        isPaid: paymentMethod === "card",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Push to the in-memory array so the order page can resolve it
      dummyDashboardOrdersData.push(newOrder as any);

      // Clean the cart and direct user to active order tracking
      clearCart();
      setLoading(false);
      toast.success("Order placed successfully!");
      navigate(`/orders/${orderId}/track`);
    }, 1500);
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isActive
                      ? "bg-app-green text-white ring-4 ring-app-green/20"
                      : "bg-app-cream border border-app-border text-app-text-light"
                  }`}
                >
                  {isCompleted ? <CheckCircle className="size-5" /> : <Icon className="size-5" />}
                </div>
                <span
                  className={`text-sm font-semibold hidden sm:inline ${
                    isActive || isCompleted ? "text-zinc-900" : "text-zinc-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-colors ${
                    isCompleted ? "bg-emerald-500" : "bg-zinc-200"
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
              user={mockUser}
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