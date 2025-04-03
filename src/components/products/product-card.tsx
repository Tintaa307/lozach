"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Product } from "@/types/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const discount = product.price
    ? Math.round(((product.price - product.price) / product.price) * 100)
    : 0

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[3/4] w-full overflow-hidden bg-[#f8f7f2] relative">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className={`h-full w-full object-cover object-center transition-transform duration-300 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        />

        {/* Badges */}
        {/* <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-black text-white hover:bg-black">NUEVO</Badge>
          )}
          {product.isSale && (
            <Badge className="bg-black text-white hover:bg-black">
              -{discount}%
            </Badge>
          )}
        </div> */}

        {/* Quick actions */}
        <div
          className={`absolute inset-x-0 bottom-0 flex justify-center p-2 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button className="w-full bg-black text-white hover:bg-zinc-800">
            AÑADIR
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-sm font-medium text-zinc-900 truncate">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center">
          <p className="text-sm font-medium text-zinc-900">
            {product.price.toFixed(2)} $
          </p>
          {/* {product.price && (
            <p className="ml-2 text-sm text-zinc-500 line-through">
              {Number(product.price.toFixed(2)) + 2000} $
            </p>
          )} */}
        </div>
      </div>
    </div>
  )
}
