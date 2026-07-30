import { useEffect, useState } from "react"
import type { Product } from '../../types'
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import ProductCard from "../ProductCard";
import api from "../../config/api";

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get("/products").then(({ data }) => {
      setProducts(data.products.slice(0, 10));
    });
  }, []);

  return (
    <section className="pb-16">
      <div className="max-w-7xl mx-auto">
        <div className='flex items-center justify-between gap-8 mb-12'>

          <div >
            <h2 className="text-2xl font-semibold">Popular Products</h2>
            <p className="text-sm text-app-text-light mt-1">Top-Rated products this season</p>
          </div>

          <Link to='/products' className="text-sm font-semibold text-app-orange hover:text-app-orange-dark flex items-center gap-1 transition-colors"> View All <ArrowRightIcon className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6  xl:gap-8">

          {products.map((product: any) => (
            <ProductCard key={product.id || product.id} product={{ ...product, id: product.id || product.id }} />
          ))}

        </div>
      </div>
    </section>
  )
}

export default PopularProducts