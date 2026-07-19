import { Link } from "react-router-dom"
import { categoriesData } from "../../assets/assets"

const HomeCategories = () => {
  return (
    <section className="py-12 border-b border-zinc-100/80">
      <div className="max-w-7xl mx-auto">
        <div>
          <h2 className="text-2xl font-serif font-bold text-app-green">Browse Categories</h2>
          <p className="text-sm text-app-text-light mt-1">Explore our wide selection of handpicked quality items</p>
        </div>
        <div className="flex items-center gap-6 mt-8 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {categoriesData.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              onClick={() => window.scrollTo(0, 0)}
              className="flex flex-col items-center gap-3 group shrink-0 cursor-pointer"
            >
              <div className="size-24 sm:size-28 rounded-full overflow-hidden bg-orange-100 border border-zinc-100 shadow-xs flex-center group-hover:scale-105 group-hover:shadow-md group-hover:border-emerald-100 transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="size-16 sm:size-20 object-contain group-hover:rotate-2 transition-transform duration-300"
                />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-zinc-700 group-hover:text-emerald-700 transition-colors text-center max-w-[100px] sm:max-w-[120px] truncate">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeCategories