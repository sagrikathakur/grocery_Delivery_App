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
      <div className="max-w-md mx-auto px-4 py-16 min-h-[70vh] flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="bg-white rounded-2xl p-8 border border-app-border shadow-xs w-full">
          <div className="size-16 rounded-full bg-app-orange/10 flex-center mx-auto mb-6">
            <ShoppingBag className="size-8 text-app-orange" />
          </div>
          <h2 className="text-xl font-bold text-app-green mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-app-text-light mb-8">
            Add some fresh items to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="w-full py-3 bg-app-orange hover:bg-app-orange-dark text-white rounded-xl font-semibold transition-all cursor-pointer"
          >
            Shop Groceries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen mb-20 animate-fade-in">
      <h1 className="text-2xl font-bold text-app-green mb-8">Secure Checkout</h1>

      {/* Checkout Progress Stepper */}
      <div className="flex justify-between items-center bg-white rounded-2xl p-4 border border-app-border mb-8 shadow-xs max-w-3xl">
        {[
          { id: "address", label: "Delivery", icon: MapPin },
          { id: "payment", label: "Payment", icon: CreditCard },
          { id: "review", label: "Review", icon: CheckCircle },
        ].map((s, idx, arr) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isCompleted = 
            (step === "payment" && idx === 0) || 
            (step === "review" && idx <= 1);

          return (
            <div key={s.id} className="flex-1 flex items-center">
              <div className="flex items-center gap-2.5">
                <div className={`size-8 rounded-full flex-center transition-colors ${
                  isActive ? "bg-app-orange text-white" : 
                  isCompleted ? "bg-app-green text-white" : "bg-app-cream text-app-text-light"
                }`}>
                  <Icon className="size-4" />
                </div>
                <span className={`text-sm font-semibold hidden md:inline ${
                  isActive || isCompleted ? "text-app-green" : "text-app-text-light"
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 border-t-2 border-dashed ${
                  isCompleted ? "border-app-green" : "border-app-border"
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Step details container */}
        <div className="lg:col-span-2 space-y-6">
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
              setStep={setStep}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
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

        {/* Sidebar: Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-app-border p-6 shadow-xs sticky top-8">
            <h3 className="font-bold text-app-green border-b border-app-border pb-4 mb-4 flex items-center gap-2">
              <ShoppingBag className="size-5 text-app-orange" />
              Order Summary
            </h3>

            {/* Item list */}
            <div className="max-h-[280px] overflow-y-auto divide-y divide-app-border pr-1 mb-4 no-scrollbar">
              {items.map((item) => (
                <div key={item.product._id || (item.product as any).id} className="flex items-center gap-3 py-3 first:pt-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="size-10 rounded-lg object-contain bg-app-cream p-1 border border-app-border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-app-green truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-app-text-light mt-0.5">{item.quantity} × {item.product.unit}</p>
                  </div>
                  <span className="text-xs font-bold text-app-green shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-2.5 text-xs text-app-text-light border-t border-app-border pt-4 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-app-green">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-app-green">
                  {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (8%)</span>
                <span className="font-semibold text-app-green">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-sm text-app-green border-t border-app-border pt-4 mb-6">
              <span>Total Amount</span>
              <span className="text-base text-app-orange">${total.toFixed(2)}</span>
            </div>

            <div className="bg-app-cream-dark p-3.5 rounded-xl border border-app-border flex items-center justify-center gap-2 text-xs text-app-green-light">
              <ShieldCheck className="size-4 text-app-green" />
              <span className="font-semibold">Secure SSL encrypted checkout</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;