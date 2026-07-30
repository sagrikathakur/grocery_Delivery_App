import Hero from '../components/Home/Hero'
import Features from '../components/Home/Features'
import HomeCategories from '../components/Home/HomeCategories'
import PopularProducts from '../components/Home/PopularProducts'
import AppPromoBanner from '../components/Home/AppPromoBanner'
import NewsLetter from '../components/Home/NewsLetter'

const Home = () => {
  return (
    <div className="min-h-screen pb-12">
      {/* Full width Hero section */}
      <Hero />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Features />
        <HomeCategories />
        <PopularProducts />
        <AppPromoBanner />
        <NewsLetter />
      </div>
    </div>
  )
}

export default Home
