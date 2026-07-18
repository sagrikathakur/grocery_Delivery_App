import { BikeIcon, SearchIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {

  const user: any = { name: "john", email: "john@gmail.com", isAdmin: true }
  const { cartCount, setIsCartOpen } = {
    cartCount: 0,
    setIsCartOpen: (_date: any) => { },


  };

  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()


  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }


  // logout//
  const handleLogout = () => {
    setUserMenuOpen(false)
    navigate("/")

  }






  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-app-border ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">

        {/* logo */}
        <Link to='/' className="flex items-center gap-2 text-[22px] font-medium shrink-0" >
          <BikeIcon size={24} /> Instacart
        </Link>


        <div className="w-full flex items-center justify-end gap-4 lg:gap-10">


          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-600">

            <Link to='/'>Home</Link>
            <Link to='/products'>Products</Link>
            <Link to='/deals' className="text-app-orange">Deals</Link>


          </div>

          {/* form */}

          <form onSubmit={handleSearch} action="" className="hidden sm:flex flex-1 max-w-sm text-xs sm:text-sm">
            <div className="relative w-full">


              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <input type="text" placeholder="Search products.." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-8 p-2 bg-orange-50 rounded-full ring ring-app-orange/15 focus:ring-app-orange/30" />
            </div>



          </form>


          {/* right action */}

          <div className="flex items-center gap-3">
            {/* cart and user */}
            <button className="relative p-2 rounded-xl " onClick={() => setIsCartOpen(true)}>

              <ShoppingCartIcon className="size-5 text-zinc-900" />
              {
                cartCount > 0 && <span className="absolute -top-1 -right-1 size-4 bg-app-orange text-white text-[10px] rounded-full flex-center">
                  {cartCount}
                </span>
              }




            </button>


            {/* user */}
            <div className="relative">
              {
                user && (
                  <>
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-1.5 p-2 rounded-xl text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer">
                      <UserIcon className="size-5" />
                      <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-50 text-sm text-zinc-700">
                        <div className="px-4 py-2 border-b border-zinc-100">
                          <p className="font-semibold text-zinc-900 truncate">{user.name}</p>
                          <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                        </div>
                        <Link to="/orders" className="block px-4 py-2 hover:bg-zinc-100 transition-colors" onClick={() => setUserMenuOpen(false)}>My Orders</Link>
                        <Link to="/addresses" className="block px-4 py-2 hover:bg-zinc-100 transition-colors" onClick={() => setUserMenuOpen(false)}>My Addresses</Link>
                        <Link to="/products" className="block px-4 py-2 hover:bg-zinc-100 transition-colors" onClick={() => setUserMenuOpen(false)}>Products</Link>
                        <Link to="/deals" className="block px-4 py-2 hover:bg-zinc-100 transition-colors" onClick={() => setUserMenuOpen(false)}>Deals</Link>
                        {user.isAdmin && (
                          <Link to="/admin" className="block px-4 py-2 hover:bg-zinc-100 transition-colors" onClick={() => setUserMenuOpen(false)}>Admin Panel</Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-red-600 hover:bg-zinc-50 transition-colors cursor-pointer border-t border-zinc-100 mt-1"
                        >
                          Log out
                        </button>
                      </div>
                    )}
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar