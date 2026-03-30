"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, Edit, Eye } from "lucide-react"
import Link from "next/link"
import DeleteProductButton from "@/components/admin/DeleteProductButton"
import { ProductSearchBar } from "@/components/dashboard/ProductSearchBar"
import { Product, CategoryType } from "@/types/products/types"

type CategoryFilter = "all" | CategoryType

interface DashboardClientProps {
  allProducts: Product[]
  currentPage: number
  itemsPerPage: number
  basePath: string
}

export function DashboardClient({
  allProducts,
  currentPage,
  itemsPerPage,
  basePath,
}: DashboardClientProps) {
  const [searchFilteredProducts, setSearchFilteredProducts] =
    useState<Product[]>(allProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")

  const filteredProducts = useMemo(() => {
    if (categoryFilter === "all") return searchFilteredProducts
    return searchFilteredProducts.filter((p) => p.category === categoryFilter)
  }, [searchFilteredProducts, categoryFilter])

  // Calcular paginación basada en productos filtrados
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const products = filteredProducts.slice(startIndex, endIndex)

  const hasActiveFilters = searchTerm || categoryFilter !== "all"

  // Resetear página cuando cambie la búsqueda o categoría
  useEffect(() => {
    if (hasActiveFilters && currentPage > 1) {
      window.history.replaceState({}, "", basePath)
    }
  }, [basePath, searchTerm, categoryFilter, currentPage, hasActiveFilters])

  return (
    <div className="flex flex-col gap-4 py-6 px-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo</h1>
          <p className="text-gray-600">
            Administra productos, variantes y contenido de la tienda
          </p>
        </div>
        <Link href="/dashboard/products">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Productos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Productos en catálogo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productos Adultos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allProducts.filter((p) => p.category === "adult").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Productos para adultos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productos Niños
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allProducts.filter((p) => p.category === "child").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Productos para niños
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                allProducts.filter(
                  (p) =>
                    !p.stock || p.stock.trim().toLowerCase() === "consultar"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Productos con stock a revisar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Productos</CardTitle>
              <p className="text-sm text-muted-foreground">
                Mostrando {products.length} de {filteredProducts.length}{" "}
                productos
                {hasActiveFilters && (
                  <span className="text-blue-600">
                    {searchTerm && ` · búsqueda: "${searchTerm}"`}
                    {categoryFilter !== "all" &&
                      ` · categoría: ${categoryFilter === "adult" ? "Adulto" : "Niño"}`}
                  </span>
                )}
              </p>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => {
                  setCategoryFilter("all")
                  setSearchTerm("")
                  setSearchFilteredProducts(allProducts)
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <div className="flex-1">
              <ProductSearchBar
                products={allProducts}
                onFilteredProducts={setSearchFilteredProducts}
                onSearchTerm={setSearchTerm}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Categoría:
              </span>
              <div className="flex gap-1">
                {(
                  [
                    { value: "all", label: "Todos" },
                    { value: "adult", label: "Adultos" },
                    { value: "child", label: "Niños" },
                  ] as { value: CategoryFilter; label: string }[]
                ).map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={categoryFilter === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(value)}
                    className="text-xs"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={product.image_url || "/example-image.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category === "adult" ? "Adulto" : "Niño"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">
                          ${product.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Stock: {product.stock}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <Link href={`/products/${product.id}`}>
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <Link href={`/dashboard/products/${product.id}/edit`}>
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Link>
                        </Button>
                        <DeleteProductButton
                          productId={product.id}
                          productName={product.name}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {hasActiveFilters
                  ? "No se encontraron productos con los filtros aplicados"
                  : "No hay productos creados"}
              </p>
              {hasActiveFilters ? (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setCategoryFilter("all")
                    setSearchTerm("")
                    setSearchFilteredProducts(allProducts)
                  }}
                >
                  Limpiar filtros
                </Button>
              ) : (
                <Link href="/dashboard/products">
                  <Button className="mt-4">Crear Primer Producto</Button>
                </Link>
              )}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                asChild
              >
                      <Link href={`${basePath}?page=${currentPage - 1}`}>
                        Anterior
                      </Link>
                    </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      asChild
                    >
                      <Link href={`${basePath}?page=${page}`}>{page}</Link>
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                asChild
              >
                  <Link href={`${basePath}?page=${currentPage + 1}`}>
                    Siguiente
                  </Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
