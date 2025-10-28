"use client"

import { useState } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filter"
import type { Product } from "@/types/types"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface ProductsClientProps {
  initialProducts: Product[]
}

export default function ProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-24">
      {/* Header + mobile filter trigger */}
      <div className="flex items-center justify-between lg:justify-center mb-8">
        <h1 className="text-3xl font-light text-center">
          <span className="font-bold">Todos nuestros </span>productos
        </h1>
        {/* Mobile trigger only */}
        <div className="lg:hidden">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <ProductFilters
                products={initialProducts}
                setProducts={setFilteredProducts}
                onClose={() => setIsFilterOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Layout with persistent sidebar on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block lg:col-span-1">
          <ProductFilters
            products={initialProducts}
            setProducts={setFilteredProducts}
          />
        </aside>

        {/* Products grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron productos</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setFilteredProducts(initialProducts)}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
