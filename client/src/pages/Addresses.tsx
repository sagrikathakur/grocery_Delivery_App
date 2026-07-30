import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Check,
  Home,
  Briefcase
} from "lucide-react";
import AddressCard from "../components/AddressCard";
import toast from "react-hot-toast";
import api from "../config/api";

const Addresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [label, setLabel] = useState<string>("Home");
  const [addressLine, setAddressLine] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zip, setZip] = useState<string>("");

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/addresses");
      if (res.data && Array.isArray(res.data.addresses)) {
        setAddresses(res.data.addresses);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSetDefault = async (id: string) => {
    const target = addresses.find((addr) => addr.id === id);
    try {
      const res = await api.put(`/addresses/${id}`, {
        isDefault: true,
        lat: target?.lat ?? 40.7128,
        lng: target?.lng ?? -74.006,
      });
      if (res.data && res.data.addresses) {
        setAddresses(res.data.addresses);
      } else {
        setAddresses((prev) =>
          prev.map((addr) => ({ ...addr, isDefault: addr.id === id }))
        );
      }
      toast.success("Default address updated!");
    } catch (error) {
      toast.error("Failed to update default address.");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (addresses.length <= 1) {
      toast.error("You must have at least one address.");
      return;
    }

    try {
      const res = await api.delete(`/addresses/${id}`);
      if (res.data && res.data.addresses) {
        setAddresses(res.data.addresses);
      } else {
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      }
      toast.success("Address removed successfully!");
    } catch (error) {
      toast.error("Failed to delete address.");
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addressLine.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      toast.error("Please fill in all address fields.");
      return;
    }

    const payload = {
      label: label,
      address: addressLine,
      city: city,
      state: state,
      zip: zip,
      isDefault: addresses.length === 0,
      lat: 40.7128,
      lng: -74.006,
    };

    try {
      const res = await api.post("/addresses", payload);
      if (res.data && res.data.address) {
        setAddresses((prev) => [res.data.address, ...prev]);
      } else {
        fetchAddresses();
      }
      toast.success("New address saved!");
    } catch (error) {
      toast.error("Failed to save address.");
    }

    // Reset Form
    setAddressLine("");
    setCity("");
    setState("");
    setZip("");
  };

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
          {loading ? (
            <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-200">
              <p className="text-zinc-500 font-medium animate-pulse">Loading addresses...</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-200">
              <MapPin className="size-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-zinc-500 font-medium">No addresses saved yet</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onSetDefault={handleSetDefault}
                onDelete={handleDeleteAddress}
              />
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
                    className={`py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      label === lbl
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
              className="w-full mt-2 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
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