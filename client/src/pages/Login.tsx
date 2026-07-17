import React, { useState } from 'react'
import { heroSectionData } from '../assets/assets'
import { BikeIcon, UserIcon, MailIcon, LockIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const Login = () => {
  const [isLoginState, setIsLoginState] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);

    setTimeout(() => window.location.href = "/", 1000)
  }








  return (
    <div className='min-h-screen flex'>
      {/* left side -> this will me image section */}

      <div className='hidden lg:flex lg:w-1/2 bg-app-green relative items-center justify-center'>

        <img src={heroSectionData.hero_image} alt="" className='absolute inset-0 object-cover h-full bg-center opacity-10' />


        <div className='relative text-center px-12'>
          <h2 className='text-4xl font-semibold text-white mb-4'>Welcome back to instaCart</h2>
          <p className='text-white/60 font-serif text-xl max-w-sm mx-auto'>Fresh groceries and organic produce , delivered at your doorstep</p>
        </div>


      </div>

      {/* right right  */}


      <div className=' flex-1 flex-center px-4 py-12 bg-app-cream'>
        <div className='w-full max-w-md'>
          <div className='text-center mb-8'>
            <Link to="/" className='inline-flex intems-center gap-2 mb-6' >
              <BikeIcon className='size-8 text-app-green' />
              <span className='text-2xl font-semibold text-app-green'>Instacart</span>
            </Link>


            <h1 className='text-2xl font-semibold text-app-green mb-2 '>{isLoginState ? "sign in to your account" : "sign up for an account"}</h1>
            <p>
              {isLoginState ? "Dont have an account" : "already have an account ?"}
              <button onClick={() => setIsLoginState(!isLoginState)}
                className='text-orange-500 ml-1 font-semibold hover:text-orange-600 transition-colors'>
                {isLoginState ? "Create one" : "Sign in"}
              </button>






            </p>
          </div>

          {/* form */}


          <form onSubmit={handleSubmit} className='space-y-5 animate-fade-in'>
            {
              !isLoginState && (
                <label className='text-sm flex flex-col gap-1.5 text-app-text-light font-medium'>
                  Name
                  <div className='relative'>
                    <UserIcon className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light' />
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLoginState}
                      className="w-full pl-10 pr-4 py-3  text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"
                    />
                  </div>
                </label>
              )
            }

            {/* email */}
            <label className='text-sm flex flex-col gap-1.5 text-app-text-light font-medium'>
              Email Address
              <div className='relative'>
                <MailIcon className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light' />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-app-border focus:border-app-green focus:ring-1 focus:ring-app-green outline-none bg-white text-zinc-900 transition-all text-sm"
                />
              </div>
            </label>

            <label className='text-sm flex flex-col gap-1.5 text-app-text-light font-medium'>
              Password
              <div className='relative'>
                <LockIcon className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light' />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-app-border focus:border-app-green focus:ring-1 focus:ring-app-green outline-none bg-white text-zinc-900 transition-all text-sm"
                />
              </div>
            </label>

            {isLoginState && (
              <div className="flex items-center justify-between text-xs text-app-text-light font-medium">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-app-green focus:ring-app-green size-4"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="text-orange-500 hover:text-orange-600 transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-app-orange text-white font-semibold rounded-xl hover:bg-app-orange-dark transition-colors disabled:opacity-60 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                isLoginState ? "Sign In" : "Create Account"
              )}
            </button>
          </form>





        </div>
      </div>













    </div>



  )
}

export default Login