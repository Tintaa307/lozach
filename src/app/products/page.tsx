"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filter"
import { Product } from "@/types/types"
import { getProducts } from "@/actions/products/products"

export default function ProductListing() {
  const [activeCategory, setActiveCategory] = useState("VER TODO")
  const [products, setProducts] = useState<Product[]>([])

  const handleProducts = async () => {
    try {
      const response = await getProducts()

      if (response.status !== 200) {
        return
      }

      const data = response.data as Product[]

      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      return
    }
  }

  useEffect(() => {
    handleProducts()
  }, [])

  return (
    <div className="min-h-screen bg-white py-28">
      <h1 className="text-center font-semibold text-4xl mb-4">
        Todos nuestros <span className="font-light">productos</span>
      </h1>
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop filters sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <h2 className="text-lg font-medium mb-6">{activeCategory}</h2>
            <ProductFilters />
          </div>

          {/* Product grid */}
          <div className="flex-1">
            <div className="md:hidden mb-6">
              <h1 className="text-2xl font-medium mb-4">{activeCategory}</h1>
              <div className="flex justify-between items-center">
                <p className="text-sm text-zinc-500">
                  {products.length} productos
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Ordenar:</span>
                  <select className="text-sm border-none bg-transparent focus:outline-none focus:ring-0 cursor-pointer">
                    <option>Relevancia</option>
                    <option>Precio: Bajo a alto</option>
                    <option>Precio: Alto a bajo</option>
                    <option>Más reciente</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 gap-y-24">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronUp className="h-4 w-4 rotate-90" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 bg-black text-white border-black hover:bg-zinc-800 hover:text-white"
                >
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  2
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  3
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  4
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  5
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronDown className="h-4 w-4 rotate-90" />
                  <span className="sr-only">Next page</span>
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
