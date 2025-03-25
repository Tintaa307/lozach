"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

interface Product {
  id: number
  name: string
  price: string
  collection: string
  imageUrl: string
}

export default function Features() {
  const [currentPage, setCurrentPage] = useState(1)

  // Mock product data
  const products: Product[] = [
    {
      id: 1,
      name: "Nombre",
      price: "$$$",
      collection: "Colección",
      imageUrl: "/placeholder.svg?height=300&width=220",
    },
    {
      id: 2,
      name: "Nombre",
      price: "$$$",
      collection: "Colección",
      imageUrl: "/placeholder.svg?height=300&width=220",
    },
    {
      id: 3,
      name: "Nombre",
      price: "$$$",
      collection: "Colección",
      imageUrl: "/placeholder.svg?height=300&width=220",
    },
    {
      id: 4,
      name: "Nombre",
      price: "$$$",
      collection: "Colección",
      imageUrl: "/placeholder.svg?height=300&width=220",
    },
    {
      id: 5,
      name: "Nombre",
      price: "$$$",
      collection: "Colección",
      imageUrl: "/placeholder.svg?height=300&width=220",
    },
    {
      id: 6,
      name: "Nombre",
      price: "$$$",
      collection: "Colección",
      imageUrl: "/placeholder.svg?height=300&width=220",
    },
  ]

  const totalPages = Math.ceil(products.length / 4)
  const productsPerPage = 4
  const startIndex = (currentPage - 1) * productsPerPage
  const visibleProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  )

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 py-8">
      <div className="mb-2">
        <h2 className="text-2xl font-light">
          <span className="font-bold">OUTLET</span> OFERTAS IMPERDIBLES
        </h2>
      </div>

      <div className="relative h-auto">
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {visibleProducts.map((product) => (
            <div key={product.id} className="group">
              <div className="relative aspect-[3/4] bg-gray-100 mb-2">
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
                <p className="text-xs text-gray-500">{product.collection}</p>
                <h3 className="font-medium">{product.name}</h3>
                <p>{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="absolute left-0 top-[calc(50%_-_40px)] -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Página anterior"
          variant={"outline"}
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </Button>

        <Button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="absolute right-0 top-[calc(50%_-_40px)] -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Página siguiente"
          variant={"outline"}
        >
          <ChevronRight className="w-6 h-6 text-black" />
        </Button>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 gap-4">
        <Button variant={"default"} className="h-11">
          <Link href="#" className="">
            VER TODO
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={cn(
                "w-6 h-6 flex items-center justify-center text-sm",
                currentPage === page ? "font-bold" : "text-gray-500"
              )}
            >
              {page}
            </button>
          ))}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Siguiente página"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
