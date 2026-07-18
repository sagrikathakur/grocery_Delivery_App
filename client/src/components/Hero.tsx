import { Link } from 'react-router-dom'
import { ArrowRightIcon, LeafIcon, ClockIcon } from 'lucide-react'
import { heroSectionData } from '../assets/assets'

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-green-50/20 via-white to-transparent pt-8 sm:pt-12 lg:pt-16 pb-6">
      
      {/* Decorative Blur Background Element */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-200/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-100/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text Content & Actions */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left animate-fade-in">
            
            {/* Organic Capsule Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-100 text-app-green text-xs font-bold uppercase tracking-wider mx-auto lg:mx-0">
              <LeafIcon className="size-3.5" />
              <span>🌿 Premium Fresh Groceries</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-app-green leading-none font-sans max-w-2xl mx-auto lg:mx-0">
              Fresh Groceries & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-app-orange to-orange-500 font-serif italic font-normal">
                Organic Produce
              </span> <br className="hidden sm:inline" />
              Delivered To You
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-app-text-light max-w-xl font-medium leading-relaxed mx-auto lg:mx-0">
              {heroSectionData.description}
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/products"
                className="w-full sm:w-auto bg-app-green hover:bg-app-green-light text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:shadow-app-green/10 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                <span>Shop Now</span>
                <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/deals"
                className="w-full sm:w-auto border border-app-orange/30 hover:border-app-orange text-app-orange hover:bg-orange-50/15 px-8 py-4 rounded-full font-bold transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center"
              >
                Browse Deals
              </Link>
            </div>

            {/* Simple stats indicator */}
            <div className="pt-4 border-t border-app-border/60 max-w-md mx-auto lg:mx-0 flex items-center justify-center lg:justify-start gap-8 text-xs text-app-text-light font-semibold">
              <div>
                <span className="text-lg font-extrabold text-app-green block">15k+</span>
                <span>Happy Clients</span>
              </div>
              <div className="w-px h-8 bg-app-border" />
              <div>
                <span className="text-lg font-extrabold text-app-green block">4.9 ★</span>
                <span>Rating Reviews</span>
              </div>
              <div className="w-px h-8 bg-app-border" />
              <div>
                <span className="text-lg font-extrabold text-app-green block">15 Min</span>
                <span>Average Delivery</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Container */}
          <div className="relative animate-fade-in lg:pl-4">
            <div className="relative w-full max-w-lg lg:max-w-none mx-auto aspect-square sm:aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-app-cream">
              <img
                src={heroSectionData.hero_image}
                alt="Fresh grocery basket"
                className="w-full h-full object-cover hover:scale-103 transition-transform duration-700"
              />
              
              {/* Overlay Glass Badge 1: Delivery Time */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-lg flex items-center gap-2.5 animate-pulse-soft">
                <span className="p-2 rounded-xl bg-app-orange text-white">
                  <ClockIcon className="size-4 shrink-0" />
                </span>
                <div>
                  <span className="text-[10px] text-app-text-light font-bold block leading-none">FASTEST</span>
                  <span className="text-xs text-app-green font-extrabold block leading-tight mt-1">15 Min delivery</span>
                </div>
              </div>

              {/* Overlay Glass Badge 2: Freshness guarantee */}
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-lg flex items-center gap-2.5 animate-pulse-soft delay-100">
                <span className="p-2 rounded-xl bg-app-green text-white">
                  <LeafIcon className="size-4 shrink-0" />
                </span>
                <div>
                  <span className="text-[10px] text-app-text-light font-bold block leading-none">100% ORGANIC</span>
                  <span className="text-xs text-app-green font-extrabold block leading-tight mt-1">Fresh Farm Picked</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Highlights Features Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {heroSectionData.hero_features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-5 rounded-2xl border border-app-border bg-white hover:border-app-green/30 hover:shadow-md transition-all duration-300 group"
              >
                <span className="p-3.5 rounded-xl bg-app-cream group-hover:bg-app-green/10 text-app-green group-hover:text-app-green-light transition-all shrink-0">
                  <Icon className="size-6 shrink-0" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-app-green leading-tight">{feature.title}</h3>
                  <p className="text-xs text-app-text-light mt-1 font-medium">{feature.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </section>
  )
}

export default Hero
