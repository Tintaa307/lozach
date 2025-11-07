"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { getProductsByNamesClientAction } from "@/controllers/products/product-client-controller"

interface Product {
  id: number
  name: string
  price: number
  image_url: string
  category: string
}

export default function BestSellers() {
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const products_names = [
    "Buzo canguro frisa estampado",
    "Cargos jean rectos",
    "Babucha frisa recta",
    "Babucha con puño",
    "Buzo canguro estampado frisa",
    "Babuchas rusticas",
  ]

  const getProducts = async () => {
    setIsLoading(true)
    try {
      const response = await getProductsByNamesClientAction(products_names)

      if (response.status !== 200 || !response.data) {
        console.log(
          response.error || response.message || "Error al obtener productos"
        )
        return
      }

      setProducts(response.data as Product[])
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  const productsPerPage = 6
  const totalPages = Math.ceil(products.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const visibleProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  )

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <section
      id="best-sellers"
      className="w-full max-w-[1440px] mx-auto px-4 py-24"
    >
      <div className="mb-2">
        <h2 className="text-2xl font-light">
          <span className="font-bold">BEST SELLERS</span> LO MÁS VENDIDO
        </h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {isLoading
          ? // Skeleton loader
            Array.from({ length: productsPerPage }).map((_, index) => (
              <div key={`skeleton-${index}`} className="animate-pulse">
                <div className="relative aspect-3/2 bg-gray-200 mb-2 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))
          : // Actual products
            visibleProducts.map((product) => (
              <div
                onClick={() => router.push(`/products/${product.id}`)}
                key={product.id}
                className="group"
              >
                <div className="relative aspect-3/2 bg-gray-100 mb-2 overflow-hidden">
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Link href="#" className="absolute inset-0">
                    <span className="sr-only">Ver producto</span>
                  </Link>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p>
                    $
                    {product.price.toString().length > 4
                      ? product.price.toFixed(0).toString().slice(0, 2) +
                        "." +
                        product.price
                          .toFixed(2)
                          .toString()
                          .slice(2, product.price.toString().length)
                      : product.price.toFixed(0)}
                  </p>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4">
        <Link href="/products">
          <Button variant="default" className="bg-black hover:bg-black/90 h-11">
            VER TODO
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
            (page) => (
              <Button
                key={page}
                variant="ghost"
                size="icon"
                className={cn(
                  "w-6 h-6 p-0",
                  currentPage === page
                    ? "font-bold text-black"
                    : "text-gray-500 hover:text-black hover:bg-gray-400/20"
                )}
                onClick={() => goToPage(page)}
                disabled={isLoading}
              >
                {page}
              </Button>
            )
          )}

          <Button
            variant="ghost"
            size="icon"
            className="p-0 hover:bg-gray-400/20"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
