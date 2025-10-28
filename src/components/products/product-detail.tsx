"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/products/types"
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
import { createFavorite } from "@/controllers/favorites/favorite-controller"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const [isFavorite, setIsFavorite] = useState(false)

  // Crear array de todas las imágenes disponibles
  const allImages = [
    ...(product.image_url ? [product.image_url] : []),
    ...(product.images_urls || []),
  ].filter(Boolean) // Filtrar valores null/undefined

  // Debug: verificar qué imágenes tenemos
  console.log("Product images debug:", {
    image_url: product.image_url,
    images_urls: product.images_urls,
    allImages: allImages,
  })

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    )
  }

  const handleFavorite = async (id: number) => {
    if (!id) return

    try {
      const response = await createFavorite(id, "user-id") // TODO: Get actual user ID

      if (!response.success) {
        toast.warning(response.message || "Error al agregar a favoritos")
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
      {/* Product Image Carousel */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="bg-gray-100 aspect-square relative w-full h-auto max-h-[70vh] md:max-h-[80vh] rounded-lg overflow-hidden">
          {allImages.length > 0 || product.image_url ? (
            <>
              <Image
                src={
                  allImages.length > 0
                    ? allImages[currentImageIndex]
                    : product.image_url || ""
                }
                alt={`${product.name} - Imagen ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                priority
              />

              {/* Navigation arrows - only show if more than 1 image */}
              {allImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 shadow-md"
                    onClick={prevImage}
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 shadow-md"
                    onClick={nextImage}
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Image counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Sin imágenes disponibles
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors",
                  currentImageIndex === index
                    ? "border-black"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <Image
                  src={image}
                  alt={`${product.name} - Miniatura ${index + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        )}
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
                  {capitalizeFirstLetter(c)}
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
                image_url: allImages[0] || product.image_url || "",
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
