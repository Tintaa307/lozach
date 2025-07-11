"use client"

import { Suspense, useEffect, useState } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filter"
import type { Product } from "@/types/types"
import { getProducts } from "@/actions/products/products"
import ProductGridSkeleton from "./loading"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const ProductListingContent = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleProducts = async () => {
    try {
      const response = await getProducts()

      if (response.status !== 200) {
        return
      }

      const data = response.data as Product[]

      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      return
    }
  }

  useEffect(() => {
    handleProducts()
  }, [])

  if (!products.length) {
    return (
      <main className="min-h-screen bg-white py-12 md:py-28">
        <ProductGridSkeleton />
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-white py-24 md:py-28">
      <h1 className="text-center font-semibold text-3xl md:text-4xl mb-4">
        Todos nuestros <span className="font-light">productos</span>
      </h1>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop filters sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <ProductFilters
              products={products}
              setProducts={setFilteredProducts}
            />
          </div>

          {/* Product grid */}
          <div className="flex-1">
            {/* Mobile header with filter and sort */}
            <div className="md:hidden mb-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-zinc-500">
                  {filteredProducts.length} productos
                </p>
              </div>

              {/* Mobile filter button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 mb-4"
                  >
                    <Filter className="h-4 w-4" />
                    Filtrar productos
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-full sm:max-w-md overflow-y-auto"
                >
                  <SheetHeader className="mb-4">
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <ProductFilters
                    products={products}
                    setProducts={setFilteredProducts}
                    onClose={() => setIsFilterOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop sort options */}
            <div className="hidden md:flex justify-start items-center mb-6">
              <p className="text-sm text-zinc-500">
                {filteredProducts.length} productos
              </p>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 gap-y-12 md:gap-y-24">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty state */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-zinc-500 mb-6">
                  Intenta con otros filtros o categorías
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilteredProducts(products)
                    setIsFilterOpen(false)
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}

            {/* Pagination */}
            {/* {filteredProducts.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronUp className="h-4 w-4 rotate-90" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 bg-black text-white border-black hover:bg-zinc-800 hover:text-white"
                  >
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8">
                    4
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8">
                    5
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronDown className="h-4 w-4 rotate-90" />
                    <span className="sr-only">Next page</span>
                  </Button>
                </nav>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductListing() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductListingContent />
    </Suspense>
  )
}
