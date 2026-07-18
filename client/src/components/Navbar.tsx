import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  BikeIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
  MapPinIcon,
  MenuIcon,
  XIcon,
  ChevronDownIcon,
  LogOutIcon,
  ShoppingBagIcon,
  PlusIcon,
  MinusIcon,
  Trash2Icon,
  PercentIcon,
  ListOrderedIcon
} from 'lucide-react'
import { dummyCartData, dummyAddressData, categoriesData } from '../assets/assets'

interface CartItem {
  product: any
  quantity: number
}

const Navbar = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchRef = useRef<HTMLDivElement>(null)
  const addressRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // --- States ---
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Selected Address State
  const [selectedAddress, setSelectedAddress] = useState(() => {
    const defaultAddr = dummyAddressData.find((a) => a.isDefault) || dummyAddressData[0]
    return defaultAddr
  })

  // Simulated Auth State
  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(() => {
    const saved = localStorage.getItem('user')
    if (saved) return JSON.parse(saved)
    
    // Default to mock user for rich demo experience on first mount, 
    // unless the user explicitly logged out in this session.
    if (sessionStorage.getItem('demo_logged_out') === 'true') {
      return null
    }
    
    const defaultUser = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    }
    localStorage.setItem('user', JSON.stringify(defaultUser))
    return defaultUser
  })

  // Simulated Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart')
    if (saved) return JSON.parse(saved)
    // Seed with dummy cart data on first visit
    localStorage.setItem('cart', JSON.stringify(dummyCartData))
    return dummyCartData
  })

  // Sync Search Query from URL parameters if available
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setSearchQuery(q)
  }, [searchParams])

  // Click Outside & Escape listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowSuggestions(false)
      }
      if (addressRef.current && !addressRef.current.contains(target)) {
        setIsAddressDropdownOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileDropdownOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSuggestions(false)
        setIsAddressDropdownOpen(false)
        setIsProfileDropdownOpen(false)
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Sync auth state if login form was submitted (which triggers redirect to /)
  useEffect(() => {
    if (!user && sessionStorage.getItem('demo_logged_out') !== 'true') {
      // Auto-reconnect default user when coming back from login
      const defaultUser = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      }
      localStorage.setItem('user', JSON.stringify(defaultUser))
      setUser(defaultUser)
    }
    
    // Clear demo_logged_out flag when we hit login page or reload from login referrer
    if (document.referrer.includes('/login')) {
      sessionStorage.removeItem('demo_logged_out')
    }
  }, [])

  // Listen to Cart changes from storage (helps keep layout synced)
  useEffect(() => {
    const handleCartUpdate = () => {
      const saved = localStorage.getItem('cart')
      if (saved) {
        setCart(JSON.parse(saved))
      }
    }
    window.addEventListener('cart-updated', handleCartUpdate)
    return () => window.removeEventListener('cart-updated', handleCartUpdate)
  }, [])

  // --- Handlers ---
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId)
      return
    }
    const updated = cart.map((item) =>
      item.product._id === productId ? { ...item, quantity: newQuantity } : item
    )
    saveCart(updated)
    toast.success('Cart updated')
  }

  const handleRemoveItem = (productId: string) => {
    const updated = cart.filter((item) => item.product._id !== productId)
    saveCart(updated)
    toast.success('Item removed from cart')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    sessionStorage.setItem('demo_logged_out', 'true')
    setUser(null)
    toast.success('Signed out successfully')
    navigate('/login')
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term)
    setShowSuggestions(false)
    navigate(`/search?q=${encodeURIComponent(term)}`)
  }

  const handleCategoryClick = (categorySlug: string) => {
    setShowSuggestions(false)
    navigate(`/products?category=${categorySlug}`)
  }

  // --- Calculations ---
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 40
  const tax = subtotal * 0.08 // Simulated 8% Sales Tax
  const total = subtotal + deliveryFee + tax

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-app-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex items-center gap-2 text-app-green group">
              <span className="bg-app-orange p-2 rounded-xl text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
                <BikeIcon className="size-5 sm:size-6" />
              </span>
              <span className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-app-green">
                Instacart
              </span>
            </Link>

            {/* Address Picker (Desktop) */}
            <div ref={addressRef} className="hidden md:block relative">
              <button
                onClick={() => setIsAddressDropdownOpen(!isAddressDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-app-cream/70 hover:bg-app-cream border border-app-border/40 hover:border-app-border transition-all text-xs text-left"
              >
                <MapPinIcon className="size-4 text-app-orange shrink-0" />
                <div>
                  <span className="text-[10px] text-app-text-light block leading-tight">Deliver to</span>
                  <span className="text-app-green font-semibold block leading-tight truncate max-w-[100px]">
                    {selectedAddress.label}
                  </span>
                </div>
                <ChevronDownIcon className={`size-3 text-app-text-light transition-transform duration-250 ${isAddressDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Address dropdown */}
              {isAddressDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-app-border overflow-hidden z-50 animate-fade-in p-4">
                  <h4 className="text-xs font-semibold text-app-text-light uppercase tracking-wider mb-3">
                    Select Delivery Address
                  </h4>
                  <div className="space-y-2">
                    {dummyAddressData.map((addr) => (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => {
                          setSelectedAddress(addr)
                          setIsAddressDropdownOpen(false)
                          toast.success(`Address changed to ${addr.label}`)
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl border text-left transition-all ${
                          selectedAddress._id === addr._id
                            ? 'border-app-green bg-green-50/30'
                            : 'border-app-border hover:bg-app-cream/40'
                        }`}
                      >
                        <MapPinIcon
                          className={`size-4 mt-0.5 shrink-0 ${
                            selectedAddress._id === addr._id ? 'text-app-green' : 'text-app-text-light'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-app-text">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="text-[9px] bg-app-green/10 text-app-green px-1.5 py-0.2 rounded-full font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-app-text-light mt-0.5 truncate">
                            {addr.address}, {addr.city}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar & Suggestions Container (Desktop) */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-md lg:max-w-lg relative mx-2">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search fresh groceries, organic vegetables..."
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border border-app-border bg-app-cream/30 focus:bg-white focus:border-app-green focus:ring-2 focus:ring-app-green/15 outline-none text-zinc-900 transition-all text-sm"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
              </div>
            </form>

            {/* Suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-app-border overflow-hidden z-50 animate-fade-in p-4">
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-app-text-light uppercase tracking-wider mb-2">
                    Trending Searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Organic Bananas', 'Fresh Strawberry', 'Whole Milk', 'Avocado', 'Croissant'].map(
                      (term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleSuggestionClick(term)}
                          className="px-3 py-1.5 bg-app-cream hover:bg-app-cream-dark text-app-green rounded-full text-xs font-medium transition-colors"
                        >
                          {term}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-app-text-light uppercase tracking-wider mb-2">
                    Popular Categories
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categoriesData.slice(0, 4).map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => handleCategoryClick(cat.slug)}
                        className="flex items-center gap-3 p-2 hover:bg-app-cream/60 rounded-xl transition-colors text-left"
                      >
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="size-8 rounded-lg object-cover bg-app-cream shrink-0"
                        />
                        <span className="text-xs font-semibold text-app-text">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Deals link (Desktop) */}
            <Link
              to="/deals"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-app-text hover:text-app-orange transition-colors"
            >
              <PercentIcon className="size-4 text-app-orange" />
              <span>Deals</span>
            </Link>

            {/* Shop Products (Desktop) */}
            <Link
              to="/products"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-app-text hover:text-app-green transition-colors"
            >
              <ShoppingBagIcon className="size-4 text-app-text-light" />
              <span>Shop</span>
            </Link>

            {/* Simulated Auth User Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-app-cream border border-transparent hover:border-app-border/40 transition-all"
              >
                {user ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="size-8 sm:size-9 rounded-full object-cover border border-app-border bg-app-cream shrink-0"
                  />
                ) : (
                  <div className="size-8 sm:size-9 rounded-full bg-app-cream flex-center text-app-text-light border border-app-border shrink-0">
                    <UserIcon className="size-4 sm:size-5" />
                  </div>
                )}
                <ChevronDownIcon className="hidden sm:block size-3 text-app-text-light" />
              </button>

              {/* Profile dropdown menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-app-border overflow-hidden z-50 animate-fade-in py-2">
                  {user ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-app-border">
                        <p className="text-[10px] text-app-text-light uppercase font-bold tracking-wider">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-app-green truncate mt-0.5">{user.name}</p>
                        <p className="text-[11px] text-app-text-light truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-app-text hover:bg-app-cream transition-colors"
                      >
                        <ListOrderedIcon className="size-4 text-app-text-light" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/addresses"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-app-text hover:bg-app-cream transition-colors"
                      >
                        <MapPinIcon className="size-4 text-app-text-light" />
                        <span>Addresses</span>
                      </Link>
                      <div className="border-t border-app-border mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false)
                            handleLogout()
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOutIcon className="size-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-app-text hover:bg-app-cream transition-colors font-medium"
                    >
                      <UserIcon className="size-4 text-app-text-light" />
                      <span>Sign In / Register</span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-app-green hover:bg-app-green-light text-white px-3 sm:px-4 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg shadow-app-green/10"
            >
              <ShoppingCartIcon className="size-4 shrink-0" />
              <span className="hidden sm:inline text-sm">Cart</span>
              {cartItemCount > 0 && (
                <span className="bg-app-orange text-white text-[10px] font-bold h-5 min-w-[20px] px-1 flex-center rounded-full border border-app-green animate-pulse-soft">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-app-text-light hover:text-app-text hover:bg-app-cream rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Search input (below header bar) */}
      <div className="md:hidden px-4 pb-3 border-b border-app-border/40">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search groceries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-app-border bg-app-cream/30 focus:bg-white outline-none text-zinc-900 text-xs"
          />
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-app-text-light" />
        </form>
      </div>

      {/* Mobile Navigation Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-app-border bg-white py-4 px-4 space-y-4 shadow-lg animate-fade-in absolute top-full left-0 right-0 z-40">
          
          {/* Mobile Address selector */}
          <div className="border border-app-border rounded-xl p-3 bg-app-cream/35">
            <div className="flex items-center gap-2 text-xs font-semibold text-app-text mb-2">
              <MapPinIcon className="size-4 text-app-orange" />
              <span>Deliver to: {selectedAddress.label}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {dummyAddressData.map((addr) => (
                <button
                  key={addr._id}
                  type="button"
                  onClick={() => {
                    setSelectedAddress(addr)
                    toast.success(`Address changed to ${addr.label}`)
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg text-center border transition-all ${
                    selectedAddress._id === addr._id
                      ? 'border-app-green bg-green-50/40 text-app-green'
                      : 'border-app-border text-app-text-light bg-white'
                  }`}
                >
                  {addr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Links list */}
          <div className="flex flex-col gap-1.5">
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-app-text hover:bg-app-cream/50 transition-colors"
            >
              <ShoppingBagIcon className="size-4 text-app-text-light" />
              <span>Shop Products</span>
            </Link>
            <Link
              to="/deals"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-app-text hover:bg-app-cream/50 transition-colors"
            >
              <PercentIcon className="size-4 text-app-orange" />
              <span>Flash Deals</span>
            </Link>
            {user && (
              <>
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-app-text hover:bg-app-cream/50 transition-colors"
                >
                  <ListOrderedIcon className="size-4 text-app-text-light" />
                  <span>My Orders</span>
                </Link>
                <Link
                  to="/addresses"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-app-text hover:bg-app-cream/50 transition-colors"
                >
                  <MapPinIcon className="size-4 text-app-text-light" />
                  <span>Addresses</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Footer Auth Section */}
          <div className="border-t border-app-border pt-4">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="size-9 rounded-full object-cover border border-app-border bg-app-cream"
                  />
                  <div>
                    <p className="text-xs font-bold text-app-green leading-tight">{user.name}</p>
                    <p className="text-[10px] text-app-text-light truncate max-w-[140px] mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors border border-red-100"
                >
                  <LogOutIcon className="size-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex-center gap-2 bg-app-green hover:bg-app-green-light text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                <UserIcon className="size-4" />
                <span>Sign In / Register</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Cart Slide-over Drawer */}
      {isCartOpen && (
        <>
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="fixed inset-y-0 right-0 max-w-full flex z-50">
            <div className="w-screen max-w-md bg-white flex flex-col shadow-2xl animate-slide-in-right h-full">
              
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-app-border flex items-center justify-between bg-app-cream/35">
                <div className="flex items-center gap-2">
                  <ShoppingCartIcon className="size-5 text-app-green" />
                  <h2 className="text-lg font-bold text-app-green">Your Cart</h2>
                  <span className="bg-app-orange/10 text-app-orange text-xs px-2 py-0.5 rounded-full font-bold">
                    {cartItemCount} items
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 hover:bg-app-cream-dark/50 rounded-full text-app-text-light hover:text-app-text transition-colors"
                >
                  <XIcon className="size-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="size-16 rounded-full bg-app-cream flex-center mb-4">
                      <ShoppingBagIcon className="size-8 text-app-text-light" />
                    </div>
                    <h3 className="text-base font-bold text-app-text mb-1">Your cart is empty</h3>
                    <p className="text-xs text-app-text-light max-w-xs mb-6">
                      Add fresh ingredients and organic foods to get started!
                    </p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false)
                        navigate('/products')
                      }}
                      className="bg-app-green hover:bg-app-green-light text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex gap-4 p-3 rounded-xl border border-app-border bg-app-cream/10 hover:border-app-green/30 hover:bg-app-cream/25 transition-all"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="size-16 rounded-lg object-cover bg-app-cream shrink-0 border border-app-border/40"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-app-text truncate">{item.product.name}</h4>
                          <p className="text-[10px] text-app-text-light mt-0.5">{item.product.unit}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-extrabold text-app-green">₹{item.product.price}</span>
                          <div className="flex items-center border border-app-border rounded-lg bg-white overflow-hidden shadow-xs">
                            <button
                              onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                              className="p-1 hover:bg-app-cream text-app-text-light hover:text-app-text transition-colors"
                            >
                              <MinusIcon className="size-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold text-app-text min-w-[20px] text-center font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                              className="p-1 hover:bg-app-cream text-app-text-light hover:text-app-text transition-colors"
                            >
                              <PlusIcon className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="p-1 hover:bg-red-50 text-app-text-light hover:text-red-500 rounded-lg transition-colors self-start"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer Price Summary */}
              {cart.length > 0 && (
                <div className="border-t border-app-border bg-app-cream/35 px-6 py-5 space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-app-text-light">
                      <span>Subtotal</span>
                      <span className="font-semibold text-app-text">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-app-text-light">
                      <span>Delivery Fee</span>
                      {deliveryFee === 0 ? (
                        <span className="font-bold text-app-success">FREE</span>
                      ) : (
                        <span className="font-semibold text-app-text">₹{deliveryFee.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-app-text-light">
                      <span>Taxes (8%)</span>
                      <span className="font-semibold text-app-text">₹{tax.toFixed(2)}</span>
                    </div>
                    {deliveryFee > 0 && (
                      <div className="text-[10px] bg-app-orange/10 text-app-orange p-2 rounded-lg text-center font-medium">
                        Add ₹{(500 - subtotal).toFixed(2)} more for FREE delivery!
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-app-green pt-2 border-t border-app-border/60">
                      <span>Total Amount</span>
                      <span className="text-base font-extrabold text-app-green">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false)
                      navigate('/checkout')
                    }}
                    className="w-full bg-app-green hover:bg-app-green-light text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg shadow-app-green/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ShoppingCartIcon className="size-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  )
}

export default Navbar