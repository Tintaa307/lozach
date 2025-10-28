import { notFound } from "next/navigation"
import {
  getProductById,
  getProducts,
} from "@/controllers/products/product-controller"
import ProductDetailClient from "./ProductDetailClient"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  // Get product data
  const productResult = await getProductById(parseInt(id))

  if (productResult.status !== 200 || !productResult.data) {
    notFound()
  }

  const product = productResult.data

  // Get all products for related products
  const productsResult = await getProducts()
  const allProducts =
    productsResult.status === 200 ? productsResult.data || [] : []

  // Filter related products (same category, different product)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  return (
    <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-24 min-h-screen">
      <div className="flex flex-col gap-12 sm:gap-16 md:gap-20">
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
        />
      </div>
    </main>
  )
}
