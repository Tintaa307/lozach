"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProductsClientAction } from "@/controllers/products/product-client-controller"

interface SimpleProduct {
  id: number
  name: string
  price: number
  image_url: string | null
  category: string
}

interface SearchResultsProps {
  searchQuery: string
  onClose: () => void
  isDesktop?: boolean
}

export function SearchResults({
  searchQuery,
  onClose,
  isDesktop = false,
}: SearchResultsProps) {
  const [filteredProducts, setFilteredProducts] = useState<SimpleProduct[]>([])
  const [mockProducts, setMockProducts] = useState<SimpleProduct[]>([])

  const handleProducts = async () => {
    try {
      const response = await getProductsClientAction()

      if (response.status !== 200) {
        return
      }

      const data = response.data || []

      setFilteredProducts(data)
      setMockProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      return
    }
  }

  useEffect(() => {
    handleProducts()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([])
      return
    }

    // Filter products based on search query
    const filtered = mockProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [searchQuery])

  if (!searchQuery.trim()) return null

  return (
    <div
      className={`bg-white shadow-lg rounded-b-lg overflow-hidden ${
        isDesktop ? "border border-gray-200" : ""
      }`}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <p className="text-sm font-medium">
          {filteredProducts?.length} resultados para {searchQuery}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {filteredProducts && filteredProducts.length > 0 ? (
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredProducts?.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              onClick={onClose}
              className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <div className="w-[60px] h-[80px] relative shrink-0 bg-gray-100 rounded">
                <Image
                  src={product.image_url || "/example-image.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-3 flex-1">
                <h4 className="font-medium text-sm">{product.name}</h4>
                <p className="text-gray-500 text-xs">{product.category}</p>
                <p className="text-sm font-semibold mt-1">
                  ${product.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center">
          <Search className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No se encontraron productos</p>
          <p className="text-sm text-gray-400 mt-1">
            Intenta con otra búsqueda
          </p>
        </div>
      )}

      {filteredProducts && filteredProducts.length > 0 && (
        <div className="p-3 border-t border-gray-100">
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={onClose}
            asChild
          >
            <Link href={`/products?search=${searchQuery}`}>
              Ver todos los resultados
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
