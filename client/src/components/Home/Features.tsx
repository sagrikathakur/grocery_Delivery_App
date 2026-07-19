import { heroSectionData } from '../../assets/assets'

const Features = () => {
  return (
    <section className="py-8 my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {heroSectionData.hero_features.map((feature, idx) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-4 p-5 bg-white border border-zinc-100 rounded-2xl hover:shadow-lg hover:-translate-y-1 hover:border-emerald-100 transition-all duration-300 group"
            >
              <div className="flex-center size-12 bg-emerald-50 text-app-green rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shrink-0">
                <IconComponent className="size-6" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-800 text-[15px] sm:text-base leading-tight mb-0.5">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500">
                  {feature.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  )
}

export default Features
