import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyAddressData } from "../assets/assets";
import { 
  ArrowLeft, 
  MapPin, 
  Trash2, 
  Plus, 
  Check, 
  Home, 
  Briefcase 
} from "lucide-react";
import toast from "react-hot-toast";

const Addresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<any[]>(dummyAddressData);

  // Form State
  const [label, setLabel] = useState<string>("Home"); // "Home" | "Work" | "Other"
  const [addressLine, setAddressLine] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zip, setZip] = useState<string>("");

  const handleSetDefault = (id: string) => {
    // Update local state
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr._id === id,
    }));
    setAddresses(updated);

    // Update in-memory reference
    dummyAddressData.forEach((addr) => {
      addr.isDefault = addr._id === id;
    });
    
    toast.success("Default address updated!");
  };

  const handleDeleteAddress = (id: string) => {
    if (addresses.length <= 1) {
      toast.error("You must have at least one address.");
      return;
    }

    const wasDefault = addresses.find((addr) => addr._id === id)?.isDefault;

    // Filter local state
    let updated = addresses.filter((addr) => addr._id !== id);
    if (wasDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);

    // Filter in-memory database reference
    const idx = dummyAddressData.findIndex((addr) => addr._id === id);
    if (idx !== -1) dummyAddressData.splice(idx, 1);
    
    // Maintain at least one default
    if (wasDefault && dummyAddressData.length > 0) {
      dummyAddressData[0].isDefault = true;
    }

    toast.success("Address removed successfully!");
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();

    if (!addressLine.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      toast.error("Please fill in all address fields.");
      return;
    }

    const newAddress = {
      _id: "addr_" + Math.random().toString(36).substring(2, 9),
      label: label,
      address: addressLine,
      city: city,
      state: state,
      zip: zip,
      isDefault: addresses.length === 0, // default if it's the only one
      lat: 40.7128,
      lng: -74.006,
    };

    // Update local state
    const updated = [...addresses, newAddress];
    setAddresses(updated);

    // Update in-memory database reference
    dummyAddressData.push(newAddress);

    // Reset Form
    setAddressLine("");
    setCity("");
    setState("");
    setZip("");
    
    toast.success("New address saved!");
  };

  // Helper to render label icons
  const getLabelIcon = (lbl: string) => {
    switch (lbl.toLowerCase()) {
      case "home":
        return <Home className="size-4" />;
      case "work":
        return <Briefcase className="size-4" />;
      default:
        return <MapPin className="size-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen mb-20 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="size-10 rounded-full border border-app-border bg-white flex-center hover:bg-app-cream-dark transition-colors cursor-pointer"
          title="Go Back"
        >
          <ArrowLeft className="size-5 text-app-green" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-app-green">Manage Addresses</h1>
          <p className="text-xs text-app-text-light mt-0.5">Add, remove, or update your delivery destinations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Saved Addresses List (col-span-2) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-app-green mb-2">Saved Locations</h2>
          
          {addresses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-app-border p-8 text-center text-app-text-light shadow-xs">
              <MapPin className="size-12 text-app-orange mx-auto mb-3 animate-pulse-soft" />
              <p className="font-semibold text-app-green">No addresses found</p>
              <p className="text-xs mt-1">Please add a shipping address using the form.</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr._id}
                className={`bg-white rounded-2xl border p-5 flex items-start justify-between gap-4 shadow-xs transition-all ${
                  addr.isDefault ? "border-app-green ring-2 ring-app-green/5" : "border-app-border"
                }`}
              >
                <div className="flex gap-3">
                  <div className={`size-10 rounded-full flex-center shrink-0 ${
                    addr.isDefault ? "bg-app-green text-white" : "bg-app-cream text-app-green"
                  }`}>
                    {getLabelIcon(addr.label)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-app-green">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-[9px] font-bold text-app-orange bg-app-orange/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-app-green mt-1">{addr.address}</p>
                    <p className="text-xs text-app-text-light mt-0.5">{addr.city}, {addr.state} {addr.zip}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr._id)}
                      className="px-3 py-1.5 border border-app-border hover:border-app-green text-app-green hover:bg-app-cream-dark text-xs font-semibold rounded-lg transition-all cursor-pointer"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="p-2 border border-app-border hover:border-red-200 text-app-text-light hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Add Address Form */}
        <div>
          <div className="bg-white rounded-2xl border border-app-border p-6 shadow-xs sticky top-8">
            <h2 className="text-lg font-bold text-app-green mb-5 flex items-center gap-2">
              <Plus className="size-5 text-app-orange" />
              Add New Address
            </h2>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              
              {/* Toggle Label Pills */}
              <div>
                <label className="text-xs font-bold text-app-green block mb-2">Location Label</label>
                <div className="flex gap-2">
                  {["Home", "Work", "Other"].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setLabel(lbl)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border flex-center gap-1.5 transition-all cursor-pointer ${
                        label === lbl 
                          ? "bg-app-green text-white border-app-green" 
                          : "bg-white text-app-text-light border-app-border hover:bg-app-cream-dark"
                      }`}
                    >
                      {getLabelIcon(lbl)}
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address Line */}
              <div>
                <label htmlFor="addressLine" className="text-xs font-bold text-app-green block mb-1.5">Street Address</label>
                <input
                  id="addressLine"
                  type="text"
                  placeholder="e.g. 123 Main St, Apt 4B"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-app-border text-sm focus:border-app-green bg-app-cream/30 focus:bg-white"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="text-xs font-bold text-app-green block mb-1.5">City</label>
                <input
                  id="city"
                  type="text"
                  placeholder="e.g. Portland"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-app-border text-sm focus:border-app-green bg-app-cream/30 focus:bg-white"
                  required
                />
              </div>

              {/* State & Zip Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className="text-xs font-bold text-app-green block mb-1.5">State</label>
                  <input
                    id="state"
                    type="text"
                    placeholder="e.g. OR"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-app-border text-sm focus:border-app-green bg-app-cream/30 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="text-xs font-bold text-app-green block mb-1.5">Zip Code</label>
                  <input
                    id="zip"
                    type="text"
                    placeholder="e.g. 97201"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-app-border text-sm focus:border-app-green bg-app-cream/30 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 mt-2 bg-app-orange hover:bg-app-orange-dark text-white rounded-xl font-semibold text-sm transition-all cursor-pointer flex-center gap-2"
              >
                <Check className="size-4" />
                Save Address
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Addresses;