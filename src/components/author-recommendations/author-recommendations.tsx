"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Product {
  id: number
  name: string
  price: string
  imageUrl: string
}

export default function AuthorRecommendations() {
  const [currentPage, setCurrentPage] = useState(1)

  const products: Product[] = [
    {
      id: 1,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 2,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 3,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 4,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 5,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 6,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=400&width=300",
    },
  ]

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {visibleProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="relative aspect-[3/4] bg-gray-100 mb-2">
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">{product.name}</h3>
              <p>{product.price}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4">
        <Button variant="default" className="bg-black hover:bg-black/90">
          VER TODO
        </Button>

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
                    : "text-gray-500 hover:text-black hover:bg-transparent"
                )}
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            )
          )}

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
      </div>
    </section>
  )
}
