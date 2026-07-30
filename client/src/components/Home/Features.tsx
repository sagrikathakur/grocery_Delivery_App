import { heroSectionData } from "../../assets/assets";

const Features = () => {
  return (
    <section className="py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {heroSectionData.hero_features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200/80 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="size-14 rounded-2xl bg-white text-emerald-700 border border-zinc-200/60 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300 shadow-xs">
                <Icon className="size-6" />
              </div>
              <h3 className="font-bold text-zinc-900 text-base mb-1 group-hover:text-emerald-800 transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
