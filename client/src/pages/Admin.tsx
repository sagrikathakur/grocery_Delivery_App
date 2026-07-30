import React, { useState } from "react";
import api from "../config/api";
import { statusColors } from "../assets/assets";
import {
  ShoppingBag,
  Package,
  Users,
  Plus,
  Trash2,
  Edit,
  Search,
  Truck,
  Check,
  X
} from "lucide-react";
import toast from "react-hot-toast";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<string>("orders"); // "orders" | "products" | "partners"

  // Live component states initialized from API
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin/all");
      if (res.data?.orders) {
        setOrders(res.data.orders);
      } else if (Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err) {
      try {
        const res2 = await api.get("/orders/all");
        if (res2.data?.orders) setOrders(res2.data.orders);
        else if (Array.isArray(res2.data)) setOrders(res2.data);
      } catch (e) {
        console.error("Failed to fetch admin orders:", e);
      }
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await api.get("/admin/partners");
      if (res.data?.partners) {
        setPartners(res.data.partners);
      }
    } catch (err) {
      console.error("Failed to fetch admin delivery partners:", err);
    }
  };

  React.useEffect(() => {
    api.get("/products")
      .then((res) => {
        if (res.data?.products) {
          const normalized = res.data.products.map((p: any) => ({
            ...p,
            id: p.id || p.id,
          }));
          setProducts(normalized);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch admin products:", err);
      });

    fetchOrders();
    fetchPartners();
  }, []);



  // Product Search State
  const [productSearch, setProductSearch] = useState<string>("");

  // OTP Verification State
  const [enteredOtps, setEnteredOtps] = useState<Record<string, string>>({});

  // Add Product Form States
  const [showAddProduct, setShowAddProduct] = useState<boolean>(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdOrigPrice, setNewProdOrigPrice] = useState("");
  const [newProdImg, setNewProdImg] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("fruits-vegetables");
  const [newProdUnit, setNewProdUnit] = useState("500g");
  const [newProdStock, setNewProdStock] = useState("100");

  // Inline editing product states
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editStock, setEditStock] = useState<string>("");

  // Add Partner Form States
  const [showAddPartner, setShowAddPartner] = useState<boolean>(false);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerEmail, setNewPartnerEmail] = useState("");
  const [newPartnerPhone, setNewPartnerPhone] = useState("");
  const [newPartnerVehicle, setNewPartnerVehicle] = useState<"bike" | "scooter" | "car">("bike");

  // --- Order Handlers ---
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  const handleAssignPartner = async (orderId: string, partnerId: string) => {
    const selectedPartner = partners.find((p) => p.id === partnerId);
    if (!selectedPartner) return;

    try {
      await api.put(`/admin/orders/${orderId}/assign`, { partnerId });
      toast.success(`Rider ${selectedPartner.name} assigned! Order is now Out for Delivery.`);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to assign rider");
    }
  };

  const handleVerifyOtp = (orderId: string, correctOtp: string) => {
    const entered = enteredOtps[orderId] || "";
    if (entered.trim() === correctOtp.trim()) {
      handleStatusChange(orderId, "Delivered");
      setEnteredOtps({ ...enteredOtps, [orderId]: "" });
      toast.success("OTP Verified! Order marked as Delivered.");
    } else {
      toast.error("Incorrect Delivery OTP. Please check and try again.");
    }
  };

  // --- Product Handlers ---
  const handleEditProduct = (prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setEditingProdId(prodId);
      setEditPrice(prod.price.toString());
      setEditStock(prod.stock.toString());
    }
  };

  const handleSaveProductEdit = async (prodId: string) => {
    const numericPrice = parseFloat(editPrice);
    const numericStock = parseInt(editStock);

    if (isNaN(numericPrice) || isNaN(numericStock) || numericPrice < 0 || numericStock < 0) {
      toast.error("Please enter valid price and stock details.");
      return;
    }

    try {
      await api.put(`/products/${prodId}`, { price: numericPrice, stock: numericStock });
    } catch (err) {
      // ignore or fallback to local state update
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, price: numericPrice, stock: numericStock } : p))
    );

    setEditingProdId(null);
    toast.success("Product updated successfully!");
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${prodId}`);
    } catch (err) {
      // ignore or fallback to local state update
    }

    setProducts((prev) => prev.filter((p) => p.id !== prodId));
    toast.success("Product deleted successfully!");
  };

  const handleCreateProduct = async (e: any) => {
    e.preventDefault();

    const priceNum = parseFloat(newProdPrice);
    const origPriceNum = parseFloat(newProdOrigPrice);
    const stockNum = parseInt(newProdStock);

    if (isNaN(priceNum) || isNaN(origPriceNum) || isNaN(stockNum)) {
      toast.error("Please provide numeric values for price and stock.");
      return;
    }

    const payload = {
      name: newProdName,
      description: newProdDesc || "Fresh organic product.",
      price: priceNum,
      originalPrice: origPriceNum,
      image: newProdImg || "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200",
      category: newProdCategory,
      unit: newProdUnit,
      stock: stockNum,
      isOrganic: true,
    };

    try {
      const res = await api.post("/products", payload);
      if (res.data?.product) {
        setProducts((prev) => [res.data.product, ...prev]);
      } else {
        const newProd = {
          id: "prod_" + Math.random().toString(36).substring(2, 9),
          ...payload,
          rating: 4.5,
          reviewCount: 12,
          discount: origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : 0,
          createdAt: new Date().toISOString(),
        };
        setProducts((prev) => [newProd, ...prev]);
      }
    } catch (err) {
      const newProd = {
        id: "prod_" + Math.random().toString(36).substring(2, 9),
        ...payload,
        rating: 4.5,
        reviewCount: 12,
        discount: origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : 0,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProd, ...prev]);
    }

    setNewProdName("");
    setNewProdDesc("");
    setNewProdPrice("");
    setNewProdOrigPrice("");
    setNewProdImg("");
    setShowAddProduct(false);

    toast.success("Product created successfully!");
  };

  // --- Partner Handlers ---
  const handleTogglePartnerStatus = async (partnerId: string) => {
    try {
      const res = await api.put(`/admin/partners/${partnerId}/status`);
      if (res.data?.partner) {
        setPartners((prev) =>
          prev.map((p) => (p.id === partnerId ? res.data.partner : p))
        );
      } else {
        setPartners((prev) =>
          prev.map((p) => (p.id === partnerId ? { ...p, isActive: !p.isActive } : p))
        );
      }
      toast.success("Rider status updated successfully.");
    } catch (err) {
      setPartners((prev) =>
        prev.map((p) => (p.id === partnerId ? { ...p, isActive: !p.isActive } : p))
      );
      toast.success("Rider status updated.");
    }
  };

  const handleCreatePartner = async (e: any) => {
    e.preventDefault();

    if (!newPartnerName.trim() || !newPartnerEmail.trim() || !newPartnerPhone.trim()) {
      toast.error("Please fill in all details.");
      return;
    }

    const payload = {
      name: newPartnerName,
      email: newPartnerEmail,
      phone: newPartnerPhone,
      vehicleType: newPartnerVehicle,
    };

    try {
      const res = await api.post("/admin/partners", payload);
      if (res.data?.partner) {
        setPartners((prev) => [res.data.partner, ...prev]);
      } else {
        fetchPartners();
      }
      toast.success("Delivery partner registered successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to register delivery partner.";
      toast.error(msg);
    }

    setNewPartnerName("");
    setNewPartnerEmail("");
    setNewPartnerPhone("");
    setShowAddPartner(false);
  };

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen mb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-app-border pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-app-green tracking-tight">Admin Panel</h1>
          <p className="text-sm text-app-text-light mt-1">Manage grocery orders, products catalog, and riders</p>
        </div>

        {/* Simplified Tabs Selector */}
        <div className="flex bg-white rounded-xl border border-app-border p-1 shadow-xs self-start md:self-auto">
          {[
            { id: "orders", label: "Orders", icon: ShoppingBag },
            { id: "products", label: "Products", icon: Package },
            { id: "partners", label: "Riders", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setEditingProdId(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${isActive
                  ? "bg-app-green text-white shadow-xs"
                  : "text-app-text-light hover:text-app-green hover:bg-app-cream-dark"
                  }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- Section 1: Customer Orders Manager --- */}
      {activeTab === "orders" && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-bold text-app-green">Orders List ({orders.length})</h2>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-app-border p-6 shadow-xs flex flex-col lg:flex-row justify-between gap-6">

                {/* Details Card */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-bold text-sm text-app-green">Order #{order.id}</span>
                    <span className="text-xs text-app-text-light">{new Date(order.createdAt).toLocaleString()}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${statusColors[order.status] || "bg-zinc-100"}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs text-app-text-light space-y-1">
                    <p><span className="font-semibold text-app-green">Customer:</span> {order.user.name} ({order.user.email})</p>
                    <p><span className="font-semibold text-app-green">Address:</span> {order.shippingAddress.label} — {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                    <p><span className="font-semibold text-app-green">Items:</span> {order.items.map((i: any) => `${i.name} (Qty: ${i.quantity})`).join(", ")}</p>
                    {order.deliveryOtp && ["Assigned", "Packed", "Out for Delivery"].includes(order.status) && (
                      <p><span className="font-semibold text-app-green">Delivery OTP:</span> <span className="font-mono bg-app-orange/10 text-app-orange border border-app-orange/20 px-2 py-0.5 rounded text-xs font-bold">{order.deliveryOtp}</span></p>
                    )}
                  </div>
                </div>

                {/* Operations Section */}
                <div className="flex flex-wrap items-center gap-4 lg:self-center shrink-0">


                  {/* Rider Assign */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-app-text-light">Rider</label>
                    <select
                      value={order.deliveryPartner?.id || ""}
                      onChange={(e) => handleAssignPartner(order.id, e.target.value)}
                      className="px-3 py-2 bg-app-cream rounded-xl border border-app-border text-xs font-semibold text-app-green focus:border-app-green focus:outline-none cursor-pointer"
                    >
                      <option value="" disabled>Select Rider</option>
                      {partners.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.vehicleType})</option>
                      ))}
                    </select>
                  </div>

                  {/* OTP Verify Panel */}
                  {order.status === "Out for Delivery" && order.deliveryOtp && (
                    <div className="flex items-center gap-2 pl-4 border-l border-app-border">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-app-text-light">Verify OTP</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="6-digit OTP"
                            value={enteredOtps[order.id] || ""}
                            onChange={(e) => setEnteredOtps({ ...enteredOtps, [order.id]: e.target.value })}
                            className="w-24 px-2 py-1 border border-app-border rounded-lg text-xs focus:border-app-green focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleVerifyOtp(order.id, order.deliveryOtp)}
                            className="px-2.5 py-1.5 bg-app-green hover:bg-app-green-light text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                          >
                            Verify
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-right pl-4 border-l border-app-border">
                    <p className="text-[10px] text-app-text-light font-bold">Total Bill</p>
                    <p className="text-lg font-extrabold text-app-orange">${order.total.toFixed(2)}</p>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Section 2: Products Catalog Inventory --- */}
      {activeTab === "products" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-app-green">Inventory Catalog ({products.length})</h2>

            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="px-4 py-2.5 bg-app-orange hover:bg-app-orange-dark text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="size-4" /> Add Product
            </button>
          </div>

          {/* Add Product Inline Form */}
          {showAddProduct && (
            <form onSubmit={handleCreateProduct} className="bg-white rounded-2xl border border-app-border p-6 shadow-xs space-y-4 max-w-2xl animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-app-border">
                <h3 className="font-bold text-app-green">New Product Details</h3>
                <button type="button" onClick={() => setShowAddProduct(false)} className="text-app-text-light hover:text-app-green cursor-pointer">
                  <X className="size-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-app-green block mb-1">Product Name</label>
                  <input type="text" placeholder="e.g. Organic Strawberries" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-app-border text-xs focus:border-app-green" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-app-green block mb-1">Category</label>
                  <select value={newProdCategory} onChange={(e) => setNewProdCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-app-border text-xs focus:border-app-green focus:outline-none cursor-pointer">
                    <option value="fruits-vegetables">Fruits & Vegetables</option>
                    <option value="dairy-eggs">Dairy & Eggs</option>
                    <option value="bakery">Bakery</option>
                    <option value="beverages">Beverages</option>
                    <option value="pantry-staples">Pantry Staples</option>
                    <option value="snacks">Snacks</option>
                    <option value="frozen-foods">Frozen Foods</option>
                    <option value="personal-care">Personal Care</option>
                    <option value="baby-care">Baby Care</option>
                    <option value="meat-seafood">Meat & Seafood</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-app-green block mb-1">Selling Price ($)</label>
                  <input type="number" step="0.01" placeholder="e.g. 2.99" value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-app-border text-xs focus:border-app-green" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-app-green block mb-1">Original Price ($)</label>
                  <input type="number" step="0.01" placeholder="e.g. 3.50" value={newProdOrigPrice} onChange={(e) => setNewProdOrigPrice(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-app-border text-xs focus:border-app-green" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-app-green block mb-1">Stock Quantity</label>
                  <input type="number" placeholder="100" value={newProdStock} onChange={(e) => setNewProdStock(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-app-border text-xs focus:border-app-green" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-app-green block mb-1">Measurement Unit</label>
                  <input type="text" placeholder="e.g. 500g, 1L, 6pcs" value={newProdUnit} onChange={(e) => setNewProdUnit(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-app-border text-xs focus:border-app-green" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-app-green block mb-1">Image URL (Optional)</label>
                  <input type="text" placeholder="Image web address" value={newProdImg} onChange={(e) => setNewProdImg(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-app-border text-xs focus:border-app-green" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-app-green block mb-1">Description</label>
                <textarea rows={2} placeholder="Brief product summary..." value={newProdDesc} onChange={(e) => setNewProdDesc(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-app-border text-xs focus:border-app-green" />
              </div>

              <button type="submit" className="px-5 py-2.5 bg-app-green hover:bg-app-green-light text-white text-xs font-semibold rounded-xl cursor-pointer">
                Create Catalog Item
              </button>
            </form>
          )}

          <div className="bg-white rounded-2xl border border-app-border p-6 shadow-xs space-y-4">
            <div className="relative max-w-sm">
              <Search className="size-4 text-app-text-light absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-app-border text-xs focus:border-app-green bg-app-cream/30 focus:bg-white"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-app-border text-app-text-light font-semibold">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price ($)</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border font-medium text-app-green">
                  {filteredProducts.map((p) => {
                    const isEditing = editingProdId === p.id;
                    return (
                      <tr key={p.id} className="hover:bg-app-cream/20">
                        <td className="py-3 flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="size-10 rounded-lg object-contain bg-app-cream p-1 border border-app-border shrink-0" />
                          <div className="min-w-0">
                            <p className="font-bold truncate text-sm">{p.name}</p>
                            <p className="text-[10px] text-app-text-light font-semibold capitalize">{p.unit}</p>
                          </div>
                        </td>
                        <td className="py-3 capitalize text-app-text-light">{p.category.replace("-", " ")}</td>
                        <td className="py-3">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-16 px-1.5 py-1 rounded border border-app-border text-xs font-semibold focus:outline-none"
                            />
                          ) : (
                            <span className="font-bold text-sm">${p.price.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="py-3">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value)}
                              className="w-16 px-1.5 py-1 rounded border border-app-border text-xs font-semibold focus:outline-none"
                            />
                          ) : (
                            <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${p.stock <= 0 ? "bg-red-50 text-red-600 font-bold" : "bg-app-cream text-app-green"}`}>
                              {p.stock <= 0 ? "Out of Stock" : `${p.stock} units`}
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button onClick={() => handleSaveProductEdit(p.id)} className="p-1.5 border border-emerald-200 text-emerald-600 bg-emerald-50 rounded-lg cursor-pointer" title="Save">
                                  <Check className="size-4" />
                                </button>
                                <button onClick={() => setEditingProdId(null)} className="p-1.5 border border-zinc-200 text-zinc-500 bg-zinc-50 rounded-lg cursor-pointer" title="Cancel">
                                  <X className="size-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => handleEditProduct(p.id)} className="p-1.5 border border-app-border text-app-green hover:bg-app-cream-dark rounded-lg cursor-pointer" title="Edit">
                                  <Edit className="size-3.5" />
                                </button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 border border-app-border hover:border-red-200 text-app-text-light hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer" title="Delete">
                                  <Trash2 className="size-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- Section 3: Riders Fleet Management --- */}
      {activeTab === "partners" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-app-green">Delivery riders fleet ({partners.length})</h2>

            <button
              onClick={() => setShowAddPartner(!showAddPartner)}
              className="px-4 py-2.5 bg-app-orange hover:bg-app-orange-dark text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="size-4" /> Add Rider
            </button>
          </div>

          {showAddPartner && (
            <form onSubmit={handleCreatePartner} className="bg-white rounded-2xl border border-app-border p-6 shadow-xs space-y-4 max-w-md animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-app-border">
                <h3 className="font-bold text-app-green">New Rider Registration</h3>
                <button type="button" onClick={() => setShowAddPartner(false)} className="text-app-text-light hover:text-app-green cursor-pointer">
                  <X className="size-5" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-app-green block mb-1">Rider Full Name</label>
                <input type="text" placeholder="e.g. John Miller" value={newPartnerName} onChange={(e) => setNewPartnerName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-app-border text-xs focus:border-app-green" required />
              </div>

              <div>
                <label className="text-xs font-bold text-app-green block mb-1">Email Address</label>
                <input type="email" placeholder="e.g. john@example.com" value={newPartnerEmail} onChange={(e) => setNewPartnerEmail(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-app-border text-xs focus:border-app-green" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-app-green block mb-1">Phone Number</label>
                  <input type="tel" placeholder="9876543210" value={newPartnerPhone} onChange={(e) => setNewPartnerPhone(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-app-border text-xs focus:border-app-green" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-app-green block mb-1">Vehicle Type</label>
                  <select value={newPartnerVehicle} onChange={(e: any) => setNewPartnerVehicle(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-app-border text-xs focus:border-app-green focus:outline-none cursor-pointer">
                    <option value="bike">Motorcycle (Bike)</option>
                    <option value="scooter">Scooter</option>
                    <option value="car">Delivery Car</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="px-5 py-2.5 bg-app-green hover:bg-app-green-light text-white text-xs font-semibold rounded-xl cursor-pointer">
                Register Rider
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partners.map((partner) => (
              <div key={partner.id} className="bg-white rounded-2xl border border-app-border p-6 shadow-xs flex justify-between gap-4">
                <div className="flex gap-4">
                  <div className="size-12 rounded-full bg-app-cream-dark flex-center shrink-0 text-app-green">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-app-green text-base">{partner.name}</h3>
                    <p className="text-xs text-app-text-light font-medium mt-0.5">{partner.email} • {partner.phone}</p>
                    <span className="text-[10px] font-bold text-app-green bg-app-cream border border-app-border px-2 py-0.5 rounded mt-2 inline-block uppercase tracking-wider">
                      {partner.vehicleType}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${partner.isActive ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}`}>
                    {partner.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => handleTogglePartnerStatus(partner.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${partner.isActive
                      ? "border-red-200 text-red-600 hover:bg-red-50"
                      : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                      }`}
                  >
                    {partner.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
