import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types/types"

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="w-full">
      <h2 className="text-lg md:text-xl font-semibold uppercase mb-4 md:mb-6 mt-16 md:mt-28">
        OTRAS PRENDAS RELACIONADAS{" "}
        <span className="text-black font-light block sm:inline">
          PARA COMBINAR
        </span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="bg-gray-100 aspect-square relative mb-2">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-sm sm:text-base">
                {product.name}
              </h3>
              <p className="text-sm sm:text-base">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
