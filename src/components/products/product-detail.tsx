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
import { useCart } from "@/context/CartContext"
import { toast } from "sonner"
import { capitalizeFirstLetter, cn } from "@/lib/utils"
import { createFavorite } from "@/actions/favorites/favorites"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavorite = async (id: number) => {
    if (!id) return

    try {
      const response = await createFavorite(id)

      if (response.status !== 200) {
        toast.warning(response.message)
        return
      }

      setIsFavorite(true)
      return toast.success("Producto agregado a favoritos")
    } catch (error) {
      console.error("Error adding to favorites:", error)
      return toast.error("Error al agregar a favoritos")
    }
  }

  const { addItem } = useCart()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh]">
      {/* Product Image */}
      <div className="bg-gray-100 aspect-square relative w-full h-auto max-h-[70vh] md:max-h-[80vh]">
        <Image
          src={product.image_url || "/example-image.jpg"}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Product Info */}
      <div className="space-y-4 md:space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold uppercase">
              {product.name}
            </h1>
            <p className="text-base lg:text-lg font-medium mt-1">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="p-2"
            aria-label="Add to favorites"
            onClick={() => handleFavorite(product.id)}
          >
            <Heart
              className={cn("h-5 w-5", {
                "fill-red-500 text-red-500": isFavorite,
              })}
            />
          </Button>
        </div>

        {/* Size Selector */}
        <div className="space-y-2">
          <Label htmlFor="size" className="text-sm font-medium">
            Talle
          </Label>
          <Select
            onValueChange={(value) => setSelectedSize(value)}
            defaultValue={product.size?.talles?.[0]}
            value={selectedSize}
          >
            <SelectTrigger className="h-10 md:h-11 cursor-pointer">
              <SelectValue placeholder="Seleccionar talle..." />
            </SelectTrigger>
            <SelectContent id="size">
              {product.size?.talles?.map((talle) => (
                <SelectItem
                  className="cursor-pointer"
                  key={talle}
                  value={talle}
                >
                  {talle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color" className="text-sm font-medium">
            Color
          </Label>
          <Select
            onValueChange={(value) => setSelectedColor(value)}
            defaultValue={product.color?.[0]}
            value={selectedColor}
          >
            <SelectTrigger className="h-10 md:h-11 cursor-pointer">
              <SelectValue placeholder="Seleccionar color..." />
            </SelectTrigger>
            <SelectContent id="color">
              {product.color?.map((c) => (
                <SelectItem className="cursor-pointer" key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-1 md:space-y-2">
          <h2 className="text-sm font-medium">Descripción</h2>
          <p className="text-sm text-gray-600">{product.description}</p>
        </div>

        {/* Fabric */}
        <div className="space-y-1 md:space-y-2">
          <h2 className="text-sm font-medium">Material</h2>
          <p className="text-sm text-gray-600">{product.fabric}</p>
        </div>

        {/* Stock */}
        <div className="space-y-1 md:space-y-2">
          <h2 className="text-sm font-medium">Stock</h2>
          <p className="text-sm text-gray-600">
            {capitalizeFirstLetter(product.stock)}
          </p>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="space-y-4 pt-2 md:pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Cantidad:</span>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={decreaseQuantity}
                className="px-3 py-2 border-r border-gray-300 touch-manipulation"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="px-3 py-2 border-l border-gray-300 touch-manipulation"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Button
            onClick={() => {
              if (!selectedSize || !selectedColor) {
                return toast.warning(
                  "Por favor, selecciona un talle y un color."
                )
              }

              addItem({
                id: product.id,
                name: product.name,
                image: product.image_url,
                price: product.price,
                quantity: quantity,
                size: selectedSize,
                color: selectedColor,
              })
            }}
            className="w-full bg-black hover:bg-black/90 text-white h-11 md:h-12"
          >
            AGREGAR AL CARRITO
          </Button>
        </div>
      </div>
    </div>
  )
}
