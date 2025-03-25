"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/types"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[80vh]">
      {/* Product Images */}
      <div className="space-y-4 flex gap-2 flex-row-reverse h-[70vh]">
        {/* Main Image */}
        <div className="bg-gray-100 aspect-square relative">
          <Image
            src={product.images[selectedImage] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {product.images.map((image, index) => (
            <div
              key={index}
              className={`bg-gray-100 aspect-square relative -mt-4 ${
                selectedImage === index ? "ring-2 ring-black/20" : ""
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${product.name} thumbnail ${index + 1}`}
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold uppercase">{product.name}</h1>
            <p className="text-base font-medium">${product.price.toFixed(2)}</p>
          </div>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="p-2"
            aria-label="Add to favorites"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        {/* Size Selector */}
        <div className="space-y-2">
          <Label htmlFor="size" className="text-sm font-medium">
            Talle
          </Label>
          <Select>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Seleccionar talle..." />
            </SelectTrigger>
            <SelectContent id="size">
              {product.sizes.map((size) => (
                <SelectItem className="cursor-pointer" key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-sm font-medium">Descripción</h2>
          <p className="text-sm text-gray-600">{product.description}</p>
        </div>

        {/* Characteristics */}
        <div className="space-y-2">
          <h2 className="text-sm font-medium uppercase">Características</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            {product.characteristics.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Care */}
        <div className="space-y-2">
          <h2 className="text-sm font-medium uppercase">Cuidados</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            {product.care.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Discount */}
        {product.discount && (
          <div className="border border-gray-300 rounded p-3">
            <p className="text-sm">
              <span className="font-medium">
                {product.discount.percentage}% OFF
              </span>{" "}
              {product.discount.method}
            </p>
          </div>
        )}

        {/* Quantity and Add to Cart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Cantidad:</span>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={decreaseQuantity}
                className="px-3 py-1 border-r border-gray-300"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="px-3 py-1 border-l border-gray-300"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Button className="w-full bg-black hover:bg-black/90 text-white h-11">
            AGREGAR AL CARRITO
          </Button>
        </div>
      </div>
    </div>
  )
}
