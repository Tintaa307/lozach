import { Skeleton } from "@/components/ui/skeleton"
import { Minus, Plus, Heart } from "lucide-react"

export default function ProductSkeleton() {
  return (
    <div className="w-full mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images - Left Side */}
        <div className="space-y-4">
          {/* Main Product Image Skeleton */}
          <Skeleton className="w-full aspect-[3/4] rounded-none" />

          {/* Thumbnail Images Skeleton */}
          <div className="flex space-x-2">
            <Skeleton className="w-20 h-20 rounded-none" />
            <Skeleton className="w-20 h-20 rounded-none" />
            <Skeleton className="w-20 h-20 rounded-none" />
          </div>
        </div>

        {/* Product Details - Right Side */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            {/* Product Title */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-5 w-24" />
            </div>

            {/* Wishlist Button */}
            <div className="p-2">
              <Heart className="h-6 w-6 text-gray-200" />
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>

          {/* Material */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center space-x-4">
              <button
                className="p-1 border border-gray-200 rounded text-gray-200"
                disabled
              >
                <Minus className="h-4 w-4" />
              </button>
              <Skeleton className="h-8 w-12" />
              <button
                className="p-1 border border-gray-200 rounded text-gray-200"
                disabled
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
