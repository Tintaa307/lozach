"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Product } from "@/types/products/types"

interface ProductSearchBarProps {
  products: Product[]
  onFilteredProducts: (filteredProducts: Product[]) => void
  onSearchTerm: (searchTerm: string) => void
}

export function ProductSearchBar({
  products,
  onFilteredProducts,
  onSearchTerm,
}: ProductSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    onFilteredProducts(filtered)
    onSearchTerm(searchTerm)
  }, [searchTerm, products, onFilteredProducts, onSearchTerm])

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Buscar productos por nombre, descripción o categoría..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
