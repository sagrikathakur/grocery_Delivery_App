import { assets, heroSectionData } from '../../assets/assets'
import { ArrowRightIcon, LeafIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[540px] lg:min-h-[600px] mb-12 flex items-center w-full">
      <img
        src={assets.hero_bg}
        alt="hero"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-r from-app-green via-app-green/75 to-transparent flex items-center">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-xl">

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-5">
              Nourish your home with{" "}
              <span className="text-orange-300">Earth's Finest</span>
            </h1>

            <p className="text-base text-white/80 leading-relaxed mb-8 max-w-md">
              {heroSectionData.description}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link
                to="/products"
                className="px-7 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all flex-center gap-2 active:scale-[0.98] shrink-0 shadow-lg shadow-orange-500/25"
              >
                Shop Now <ArrowRightIcon className="size-4" />
              </Link>

              <Link
                to="/products"
                className="px-7 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20 flex-center gap-2 active:scale-[0.98] shrink-0 backdrop-blur-xs"
              >
                Browse Categories <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
