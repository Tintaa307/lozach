import { notFound } from "next/navigation"
import ProductDetail from "@/components/products/product-detail"
import RelatedProducts from "@/components/products/related-products"
import { getProductById, getRelatedProducts } from "@/actions/products/products"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id)

  if (!product) {
    notFound()
  }

  const relatedProducts = getRelatedProducts(params.id)

  return (
    <main className="w-full mx-auto px-4 py-24 min-h-screen">
      <ProductDetail product={product} />
      <RelatedProducts products={relatedProducts} />
    </main>
  )
}
