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
      isDefault: addr.id === id,
    }));
    setAddresses(updated);

    // Update in-memory reference
    dummyAddressData.forEach((addr) => {
      addr.isDefault = addr.id === id;
    });

    toast.success("Default address updated!");
  };

  const handleDeleteAddress = (id: string) => {
    if (addresses.length <= 1) {
      toast.error("You must have at least one address.");
      return;
    }

    const wasDefault = addresses.find((addr) => addr.id === id)?.isDefault;

    // Filter local state
    let updated = addresses.filter((addr) => addr.id !== id);
    if (wasDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);

    // Filter in-memory database reference
    const idx = dummyAddressData.findIndex((addr) => addr.id === id);
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
      id: "addr_" + Math.random().toString(36).substring(2, 9),
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-600"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Manage Addresses</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Add, remove, or update your delivery destinations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Address List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900 mb-2">Saved Locations</h2>
          {addresses.length === 0 ? (
            <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-200">
              <MapPin className="size-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-zinc-500 font-medium">No addresses saved yet</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 rounded-2xl border transition-all ${addr.isDefault
                    ? "bg-emerald-50/40 border-emerald-500/30 ring-1 ring-emerald-500/20"
                    : "bg-white border-zinc-200 hover:border-zinc-300"
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className={`p-2.5 rounded-xl h-fit ${addr.isDefault ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-600"
                      }`}>
                      {getLabelIcon(addr.label)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-900">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-md">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-600 mt-1 font-medium">{addr.address}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-200"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Add New Address Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 mb-6 text-zinc-900">
            <Plus className="size-5 text-orange-500" />
            <h2 className="text-lg font-semibold">Add New Address</h2>
          </div>

          <form onSubmit={handleSaveAddress} className="space-y-4">
            {/* Label Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                Location Label
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Home", "Work", "Other"].map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setLabel(lbl)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-center gap-1.5 transition-all ${label === lbl
                        ? "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
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
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="e.g. 123 Main St, Apt 4B"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-zinc-900"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Portland"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-zinc-900"
              />
            </div>

            {/* State & Zip Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. OR"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="e.g. 97201"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-zinc-900"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Check className="size-4" />
              Save Address
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addresses;