import { Suspense } from "react"
import { getProducts } from "@/controllers/products/product-controller"
import ProductGridSkeleton from "./loading"
import ProductsClient from "./ProductsClient"

async function ProductListingContent() {
  const productsResult = await getProducts()
  const products = productsResult.success ? productsResult.data || [] : []

  return <ProductsClient initialProducts={products} />
}

export default function ProductListing() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductListingContent />
    </Suspense>
  )
}
