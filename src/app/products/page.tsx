"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filter"

const products = [
  {
    id: 1,
    name: "Camiseta Oversize Estampada",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=300",
    isNew: true,
  },
  {
    id: 2,
    name: "Sudadera con Capucha Negra",
    price: 49.99,
    originalPrice: 69.99,
    image: "/placeholder.svg?height=400&width=300",
    isSale: true,
  },
  {
    id: 3,
    name: "Pantalón Cargo Beige",
    price: 59.99,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 4,
    name: "Chaqueta Bomber Vintage",
    price: 89.99,
    originalPrice: 119.99,
    image: "/placeholder.svg?height=400&width=300",
    isSale: true,
  },
  {
    id: 5,
    name: "Camiseta Gráfica Urban",
    price: 24.99,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 6,
    name: "Jeans Slim Fit Desgastados",
    price: 69.99,
    image: "/placeholder.svg?height=400&width=300",
    isNew: true,
  },
  {
    id: 7,
    name: "Zapatillas Urbanas Blancas",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=400&width=300",
    isSale: true,
  },
  {
    id: 8,
    name: "Gorra Snapback Logo",
    price: 19.99,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 9,
    name: "Sudadera Estampada Oversize",
    price: 54.99,
    image: "/placeholder.svg?height=400&width=300",
    isNew: true,
  },
  {
    id: 10,
    name: "Chaqueta Denim Premium",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=400&width=300",
    isSale: true,
  },
  {
    id: 11,
    name: "Camiseta Manga Larga Básica",
    price: 34.99,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 12,
    name: "Pantalón Jogger Técnico",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=300",
  },
]

export default function ProductListing() {
  const [activeCategory, setActiveCategory] = useState("VER TODO")

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
