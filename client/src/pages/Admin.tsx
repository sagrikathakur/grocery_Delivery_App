import React, { useState } from "react";
import { 
  dummyDashboardOrdersData, 
  dummyProducts, 
  dummyDeliveryPartnerData, 
  statusColors 
} from "../assets/assets";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  TrendingUp, 
  AlertCircle,
  Truck,
  Check,
  X
} from "lucide-react";
import toast from "react-hot-toast";

// Explicitly type-cast shared datasets to any[] at module-level to bypass shape-mismatch compiler warnings
const dbOrders = dummyDashboardOrdersData as any[];
const dbProducts = dummyProducts as any[];
const dbPartners = dummyDeliveryPartnerData as any[];

const Admin = () => {
  const [activeTab, setActiveTab] = useState<string>("overview"); // "overview" | "orders" | "products" | "partners"

  // Live component states initialized from local references
  const [orders, setOrders] = useState<any[]>([...dbOrders]);
  const [products, setProducts] = useState<any[]>([...dbProducts]);
  const [partners, setPartners] = useState<any[]>([...dbPartners]);

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

  // --- Calculations for Overview ---
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  // --- Order Handlers ---
  const handleStatusChange = (orderId: string, newStatus: string) => {
    // Update local state
    const updated = orders.map((o) => {
      if (o._id === orderId) {
        const hasHistory = o.statusHistory.some((h: any) => h.status === newStatus);
        const newHistory = hasHistory 
          ? o.statusHistory 
          : [...o.statusHistory, { 
              status: newStatus, 
              note: `Status updated to ${newStatus}`, 
              timestamp: new Date().toISOString(),
              _id: "hist_" + Math.random().toString(36).substring(2, 9)
            }];
        return { 
          ...o, 
          status: newStatus,
          statusHistory: newHistory,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    });
    setOrders(updated);

    // Update in-memory reference module
    const foundIdx = dbOrders.findIndex((o) => o._id === orderId);
    if (foundIdx !== -1) {
      dbOrders[foundIdx].status = newStatus;
      const history = dbOrders[foundIdx].statusHistory;
      const exists = history.some((h: any) => h.status === newStatus);
      if (!exists) {
        history.push({
          status: newStatus,
          note: `Status updated to ${newStatus}`,
          timestamp: new Date().toISOString(),
          _id: "hist_" + Math.random().toString(36).substring(2, 9)
        });
      }
      dbOrders[foundIdx].updatedAt = new Date().toISOString();
    }

    toast.success(`Order status updated to ${newStatus}`);
  };

  const handleAssignPartner = (orderId: string, partnerId: string) => {
    const selectedPartner = partners.find((p) => p._id === partnerId);
    if (!selectedPartner) return;

    // Update local state
    const updated = orders.map((o) => {
      if (o._id === orderId) {
        return { ...o, deliveryPartner: selectedPartner };
      }
      return o;
    });
    setOrders(updated);

    // Update shared database
    const foundIdx = dbOrders.findIndex((o) => o._id === orderId);
    if (foundIdx !== -1) {
      dbOrders[foundIdx].deliveryPartner = selectedPartner;
    }

    toast.success(`Rider ${selectedPartner.name} assigned to order!`);
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
    const prod = products.find((p) => p._id === prodId);
    if (prod) {
      setEditingProdId(prodId);
      setEditPrice(prod.price.toString());
      setEditStock(prod.stock.toString());
    }
  };

  const handleSaveProductEdit = (prodId: string) => {
    const numericPrice = parseFloat(editPrice);
    const numericStock = parseInt(editStock);

    if (isNaN(numericPrice) || isNaN(numericStock) || numericPrice < 0 || numericStock < 0) {
      toast.error("Please enter valid price and stock details.");
      return;
    }

    // Update local state
    const updated = products.map((p) => {
      if (p._id === prodId) {
        return { ...p, price: numericPrice, stock: numericStock };
      }
      return p;
    });
    setProducts(updated);

    // Update shared assets reference list
    const foundIdx = dbProducts.findIndex((p) => p._id === prodId);
    if (foundIdx !== -1) {
      dbProducts[foundIdx].price = numericPrice;
      dbProducts[foundIdx].stock = numericStock;
    }

    setEditingProdId(null);
    toast.success("Product updated successfully!");
  };

  const handleDeleteProduct = (prodId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    // Filter local state
    const updated = products.filter((p) => p._id !== prodId);
    setProducts(updated);

    // Update shared database reference
    const idx = dbProducts.findIndex((p) => p._id === prodId);
    if (idx !== -1) dbProducts.splice(idx, 1);

    toast.success("Product deleted successfully!");
  };

  const handleCreateProduct = (e: any) => {
    e.preventDefault();

    const priceNum = parseFloat(newProdPrice);
    const origPriceNum = parseFloat(newProdOrigPrice);
    const stockNum = parseInt(newProdStock);

    if (isNaN(priceNum) || isNaN(origPriceNum) || isNaN(stockNum)) {
      toast.error("Please provide numeric values for price and stock.");
      return;
    }

    const newProd = {
      _id: "prod_" + Math.random().toString(36).substring(2, 9),
      name: newProdName,
      description: newProdDesc || "Fresh organic product.",
      price: priceNum,
      originalPrice: origPriceNum,
      image: newProdImg || "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200",
      category: newProdCategory,
      unit: newProdUnit,
      stock: stockNum,
      isOrganic: true,
      rating: 4.5,
      reviewCount: 12,
      discount: origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : 0,
      createdAt: new Date().toISOString(),
    };

    // Update state and database reference array
    setProducts([newProd, ...products]);
    dbProducts.unshift(newProd);

    // Reset Form
    setNewProdName("");
    setNewProdDesc("");
    setNewProdPrice("");
    setNewProdOrigPrice("");
    setNewProdImg("");
    setShowAddProduct(false);

    toast.success("Product created successfully!");
  };

  // --- Partner Handlers ---
  const handleTogglePartnerStatus = (partnerId: string) => {
    // Update local state
    const updated = partners.map((p) => {
      if (p._id === partnerId) {
        return { ...p, isActive: !p.isActive };
      }
      return p;
    });
    setPartners(updated);

    // Update shared database reference
    const foundIdx = dbPartners.findIndex((p) => p._id === partnerId);
    if (foundIdx !== -1) {
      dbPartners[foundIdx].isActive = !dbPartners[foundIdx].isActive;
    }

    toast.success("Rider status updated successfully.");
  };

  const handleCreatePartner = (e: any) => {
    e.preventDefault();

    if (!newPartnerName.trim() || !newPartnerEmail.trim() || !newPartnerPhone.trim()) {
      toast.error("Please fill in all details.");
      return;
    }

    const newPartner = {
      _id: "partner_" + Math.random().toString(36).substring(2, 9),
      name: newPartnerName,
      email: newPartnerEmail,
      phone: newPartnerPhone,
      avatar: "",
      vehicleType: newPartnerVehicle,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update state and shared reference
    setPartners([...partners, newPartner]);
    dbPartners.push(newPartner);

    // Reset Form
    setNewPartnerName("");
    setNewPartnerEmail("");
    setNewPartnerPhone("");
    setShowAddPartner(false);

    toast.success("Delivery partner registered!");
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
          <h1 className="text-3xl font-extrabold text-app-green tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-app-text-light mt-1">Manage grocery items, customer orders, and delivery riders</p>
        </div>

        {/* Quick Tabs Menu Selector */}
        <div className="flex bg-white rounded-xl border border-app-border p-1 shadow-xs self-start md:self-auto">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isActive 
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

      {/* --- Tab Content 1: Overview Dashboard --- */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-app-border shadow-xs flex items-center gap-4">
              <div className="size-12 rounded-xl bg-app-green/5 text-app-green flex-center">
                <TrendingUp className="size-6" />
              </div>
              <div>
                <p className="text-xs text-app-text-light font-medium uppercase tracking-wider">Total Sales</p>
                <h3 className="text-xl font-bold text-app-green mt-0.5">${totalRevenue.toFixed(2)}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-app-border shadow-xs flex items-center gap-4">
              <div className="size-12 rounded-xl bg-app-orange/5 text-app-orange flex-center">
                <ShoppingBag className="size-6" />
              </div>
              <div>
                <p className="text-xs text-app-text-light font-medium uppercase tracking-wider">Total Orders</p>
                <h3 className="text-xl font-bold text-app-green mt-0.5">{orders.length}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-app-border shadow-xs flex items-center gap-4">
              <div className="size-12 rounded-xl bg-indigo-50 text-indigo-700 flex-center">
                <Package className="size-6" />
              </div>
              <div>
                <p className="text-xs text-app-text-light font-medium uppercase tracking-wider">Products</p>
                <h3 className="text-xl font-bold text-app-green mt-0.5">{products.length}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-app-border shadow-xs flex items-center gap-4">
              <div className="size-12 rounded-xl bg-red-50 text-red-600 flex-center">
                <AlertCircle className="size-6" />
              </div>
              <div>
                <p className="text-xs text-app-text-light font-medium uppercase tracking-wider">Out of Stock</p>
                <h3 className="text-xl font-bold text-app-green mt-0.5">{outOfStockCount}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-app-border shadow-xs flex items-center gap-4">
              <div className="size-12 rounded-xl bg-emerald-50 text-emerald-700 flex-center">
                <Users className="size-6" />
              </div>
              <div>
                <p className="text-xs text-app-text-light font-medium uppercase tracking-wider">Active Riders</p>
                <h3 className="text-xl font-bold text-app-green mt-0.5">{partners.filter(p => p.isActive).length}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-app-border p-6 shadow-xs">
            <h2 className="text-lg font-bold text-app-green mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-app-border text-app-text-light font-semibold">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Rider</th>
                    <th className="pb-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border font-medium text-app-green">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="py-4 font-mono text-xs">#{order._id.slice(-6)}</td>
                      <td className="py-4">{order.user.name || "Customer"}</td>
                      <td className="py-4 text-xs text-app-text-light">{order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[order.status] || "bg-zinc-100 text-zinc-800"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-xs">
                        {order.deliveryPartner ? (
                          <span className="flex items-center gap-1">
                            <Truck className="size-3 text-app-green-lighter" />
                            {order.deliveryPartner.name}
                          </span>
                        ) : (
                          <span className="text-app-text-light italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 text-right font-bold">${order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- Tab Content 2: Manage Orders --- */}
      {activeTab === "orders" && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-bold text-app-green">Customer Orders Manager ({orders.length})</h2>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-app-border p-6 shadow-xs flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-bold text-sm text-app-green">Order #{order._id}</span>
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

                <div className="flex flex-wrap items-center gap-4 lg:self-center shrink-0">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-app-text-light">Update Status</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="px-3 py-2 bg-app-cream rounded-xl border border-app-border text-xs font-semibold text-app-green focus:border-app-green focus:outline-none cursor-pointer"
                    >
                      {["Placed", "Confirmed", "Packed", "Out for Delivery", "Delivered", "Cancelled"].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-app-text-light">Assign Rider</label>
                    <select
                      value={order.deliveryPartner?._id || ""}
                      onChange={(e) => handleAssignPartner(order._id, e.target.value)}
                      className="px-3 py-2 bg-app-cream rounded-xl border border-app-border text-xs font-semibold text-app-green focus:border-app-green focus:outline-none cursor-pointer"
                    >
                      <option value="" disabled>Select Delivery Hero</option>
                      {partners.map((p) => (
                        <option key={p._id} value={p._id}>{p.name} ({p.vehicleType})</option>
                      ))}
                    </select>
                  </div>

                  {order.status === "Out for Delivery" && order.deliveryOtp && (
                    <div className="flex items-center gap-2 pl-4 border-l border-app-border">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-app-text-light">Verify Delivery OTP</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="6-digit OTP"
                            value={enteredOtps[order._id] || ""}
                            onChange={(e) => setEnteredOtps({ ...enteredOtps, [order._id]: e.target.value })}
                            className="w-24 px-2 py-1 border border-app-border rounded-lg text-xs focus:border-app-green focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleVerifyOtp(order._id, order.deliveryOtp)}
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

      {/* --- Tab Content 3: Products Catalog Manager --- */}
      {activeTab === "products" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-app-green">Catalog Inventory Manager ({products.length})</h2>
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="px-4 py-2.5 bg-app-orange hover:bg-app-orange-dark text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="size-4" /> Add New Product
            </button>
          </div>

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
                <label className="text-xs font-bold text-app-green block mb-1">Product Description</label>
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
                placeholder="Search catalog by name or category..."
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
                    <th className="pb-3">Inventory Stock</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border font-medium text-app-green">
                  {filteredProducts.map((p) => {
                    const isEditing = editingProdId === p._id;
                    return (
                      <tr key={p._id} className="hover:bg-app-cream/20">
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
                                <button onClick={() => handleSaveProductEdit(p._id)} className="p-1.5 border border-emerald-200 text-emerald-600 bg-emerald-50 rounded-lg cursor-pointer" title="Save">
                                  <Check className="size-4" />
                                </button>
                                <button onClick={() => setEditingProdId(null)} className="p-1.5 border border-zinc-200 text-zinc-500 bg-zinc-50 rounded-lg cursor-pointer" title="Cancel">
                                  <X className="size-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => handleEditProduct(p._id)} className="p-1.5 border border-app-border text-app-green hover:bg-app-cream-dark rounded-lg cursor-pointer" title="Edit Price/Stock">
                                  <Edit className="size-3.5" />
                                </button>
                                <button onClick={() => handleDeleteProduct(p._id)} className="p-1.5 border border-app-border hover:border-red-200 text-app-text-light hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer" title="Delete Product">
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

      {/* --- Tab Content 4: Riders (Delivery Partners) --- */}
      {activeTab === "partners" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-app-green">Delivery Fleet Manager ({partners.length})</h2>
            <button
              onClick={() => setShowAddPartner(!showAddPartner)}
              className="px-4 py-2.5 bg-app-orange hover:bg-app-orange-dark text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="size-4" /> Register New Rider
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
                Save & Register Rider
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partners.map((partner) => (
              <div key={partner._id} className="bg-white rounded-2xl border border-app-border p-6 shadow-xs flex justify-between gap-4">
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
                    onClick={() => handleTogglePartnerStatus(partner._id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      partner.isActive 
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
