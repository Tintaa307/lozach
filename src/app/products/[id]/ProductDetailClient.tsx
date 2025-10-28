"use client"

import { useEffect } from "react"
import ProductDetail from "@/components/products/product-detail"
import RelatedProducts from "@/components/products/related-products"
import { Product } from "@/types/types"
import axios from "axios"

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  // Update recent view when component mounts
  useEffect(() => {
    const updateRecentView = async () => {
      try {
        await axios.post("/api/recent-view", { product_id: product.id })
      } catch (error) {
        console.error("Error al actualizar la vista reciente:", error)
      }
    }

    updateRecentView()
  }, [product.id])

  return (
    <div>
      <ProductDetail product={product} />
      <RelatedProducts products={relatedProducts} />
    </div>
  )
}
