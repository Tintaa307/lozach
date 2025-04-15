"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { getProductsByNames } from "@/actions/products/products"
import { Skeleton } from "@/components/ui/skeleton"

interface Product {
  id: number
  name: string
  price: number
  image_url: string
  category: string
}

export default function AuthorRecommendations() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  const products_names = [
    "Camisa lisa de vestir",
    "Campera rustica over",
    "Remera m/c estampada clasica",
  ]

  const getProducts = async () => {
    setIsLoading(true)
    try {
      const response = await getProductsByNames(products_names)

      if (response.status !== 200) {
        console.log(response.message)
        return
      }

      if (!response.data) {
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

  useEffect(() => {
    console.log("Products:", products)
  }, [products])

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
    <section id="author" className="w-full max-w-[1440px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-medium">
          <span className="font-bold">RECOMENDACIONES DE AUTOR</span>{" "}
          <span className="font-light">NUESTRAS FAVORITAS</span>
        </h2>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <ProductSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {visibleProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="relative aspect-[3/4] bg-gray-100 mb-2">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
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
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4">
        <Link href="/products">
          <Button variant="default" className="bg-black hover:bg-black/90">
            VER TODO
          </Button>
        </Link>

        {!isLoading && (
          <div className="flex items-center gap-2">
            {Array.from(
              { length: Math.min(totalPages, 5) },
              (_, i) => i + 1
            ).map((page) => (
              <Button
                key={page}
                variant="ghost"
                size="icon"
                className={cn(
                  "w-6 h-6 p-0",
                  currentPage === page
                    ? "font-bold text-black"
                    : "text-gray-500 hover:text-black hover:bg-transparent"
                )}
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="ghost"
              size="icon"
              className="p-0 hover:bg-transparent"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  )
}
