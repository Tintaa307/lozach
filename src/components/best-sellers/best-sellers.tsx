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

export default function BestSellers() {
  const [currentPage, setCurrentPage] = useState(1)

  // Mock product data
  const products: Product[] = [
    {
      id: 1,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 7,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 8,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 9,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 10,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 11,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 12,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 13,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 14,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 15,
      name: "Nombre",
      price: "$$$",
      imageUrl: "/placeholder.svg?height=200&width=300",
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
    <section className="w-full max-w-[1440px] mx-auto px-4 py-24">
      <div className="mb-2">
        <h2 className="text-2xl font-light">
          <span className="font-bold">BEST SELLERS</span> LO MÁS VENDIDO
        </h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {visibleProducts.map((product) => (
          <div key={product.id} className="group">
            <div className="relative aspect-[3/2] bg-gray-100 mb-2">
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              <Link href="#" className="absolute inset-0">
                <span className="sr-only">Ver producto</span>
              </Link>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">{product.name}</h3>
              <p>{product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4">
        <Button variant="default" className="bg-black hover:bg-black/90 h-11">
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
                    : "text-gray-500 hover:text-black hover:bg-gray-400/20"
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
            className="p-0 hover:bg-gray-400/20"
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
