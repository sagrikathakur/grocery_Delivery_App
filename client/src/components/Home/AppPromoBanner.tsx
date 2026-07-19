
import { appPromoBannerData } from '../../assets/assets'
import deliveryTruck from '../../assets/delivery_truck.svg'

const AppPromoBanner = () => {
  return (
    <section className="pb-16">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-app-green via-app-green-light to-app-green-lighter text-white shadow-2xl">
        {/* Decorative background blur shapes */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center px-8 py-12 sm:px-12 md:px-16 md:py-16 relative z-10">
          {/* Text Content */}
          <div className="md:col-span-7 flex flex-col items-start text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-white/10 text-orange-300 rounded-full mb-6">
              GreenCart Mobile App
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white">
              {appPromoBannerData.title}
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-lg font-sans">
              {appPromoBannerData.description}
            </p>


          </div>

          {/* Image Content */}
          <div className="md:col-span-5 flex justify-center relative">
            <div className="relative group/img w-full max-w-[280px] sm:max-w-[320px] md:max-w-[420px]">
              {/* Soft shadow under the truck */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90%] h-4 bg-black/35 rounded-full blur-lg transition-all duration-500 group-hover/img:w-[98%] group-hover/img:bg-black/45" />

              <img
                src={deliveryTruck}
                alt="Delivery Truck"
                className="w-full h-auto object-contain transition-all duration-500 hover:-translate-y-2 hover:scale-[1.04]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


export default AppPromoBanner
