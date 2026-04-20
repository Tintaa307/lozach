export type CategoryType = "adult" | "child"

export interface Product {
  id: number
  created_at: string
  name: string
  stock: string
  description: string | null
  category: CategoryType
  color: string[]
  fabric: string
  price: number
  size: {
    talles: string[]
  }
  image_url: string | null
  images_urls: string[]
  sku: string
  shipping_weight_grams: number | null
  shipping_height_cm: number | null
  shipping_width_cm: number | null
  shipping_length_cm: number | null
}

export interface CreateProductValues {
  name: string
  stock: string
  description?: string
  category: CategoryType
  color: string[]
  fabric: string
  price: number
  size: {
    talles: string[]
  }
  image_url?: string
  images_urls?: string[]
  shipping_weight_grams?: number | null
  shipping_height_cm?: number | null
  shipping_width_cm?: number | null
  shipping_length_cm?: number | null
}

export interface UpdateProductValues {
  name?: string
  stock?: string
  description?: string | null
  category?: CategoryType
  color?: string[]
  fabric?: string
  price?: number
  size?: {
    talles: string[]
  }
  image_url?: string | null
  images_urls?: string[]
  shipping_weight_grams?: number | null
  shipping_height_cm?: number | null
  shipping_width_cm?: number | null
  shipping_length_cm?: number | null
}

export interface ProductFilters {
  category?: CategoryType
  color?: string[]
  fabric?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}
