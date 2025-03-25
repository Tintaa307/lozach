import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types/types"

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold uppercase mb-6">
        OTRAS PRENDAS RELACIONADAS{" "}
        <span className="text-black font-light">PARA COMBINAR</span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="bg-gray-100 aspect-square relative mb-2">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
