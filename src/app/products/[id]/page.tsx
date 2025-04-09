"use client"

import { notFound } from "next/navigation"
import ProductDetail from "@/components/products/product-detail"
import RelatedProducts from "@/components/products/related-products"
import { getProductById, getProducts } from "@/actions/products/products"
import { useEffect, useState } from "react"
import { Product } from "@/types/types"
import ProductSkeleton from "./loading"
import axios from "axios"

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [productId, setProductId] = useState("")
  const [product, setProduct] = useState<Product | null>(null)

  const [otherProducts, setOtherProducts] = useState<Product[]>([])

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  const handleParams = async () => {
    const { id } = await params

    if (!id) {
      notFound()
    }

    return setProductId(id)
  }

  useEffect(() => {
    handleParams()
  }, [])

  const handleProduct = async () => {
    if (!productId) return notFound()
    try {
      const response = await getProductById(productId)

      if (response.status !== 200) {
        console.log(response)

        return
      }

      return setProduct(response.data as Product)
    } catch (error) {
      console.log(error)

      return
    }
  }

  const handleProducts = async () => {
    try {
      const response = await getProducts()

      if (response.status !== 200) {
        return
      }

      const data = response.data as Product[]

      setOtherProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      return
    }
  }

  useEffect(() => {
    if (product?.id) {
      const updateRecentView = async () => {
        try {
          await axios.post("/api/recent-view", { product_id: product.id })
        } catch (error) {
          console.error("Error al actualizar la vista reciente:", error)
        }
      }

      updateRecentView()
    }
  }, [product])

  useEffect(() => {
    if (productId) {
      handleProduct()
    }
  }, [productId])

  useEffect(() => {
    handleProducts()
  }, [])

  useEffect(() => {
    if (otherProducts.length > 0) {
      otherProducts.some((item) => {
        if (item.id !== product?.id) {
          setRelatedProducts((prev) => [...prev, item])
        }
      })
    }
  }, [otherProducts])

  if (!product) {
    return (
      <main className="w-full mx-auto px-4 py-24 min-h-screen">
        <ProductSkeleton />
      </main>
    )
  }

  return (
    <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-24 min-h-screen">
      <div className="flex flex-col gap-12 sm:gap-16 md:gap-20">
        <ProductDetail product={product} />
        <RelatedProducts products={relatedProducts.slice(0, 4)} />
      </div>
    </main>
  )
}
