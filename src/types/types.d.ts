// Legacy types - these are now in separate files
// This file is kept for backward compatibility
export interface Product {
  id: number
  created_at: string
  name: string
  stock: "consultar"
  description: string | null
  category: "adult" | "child"
  color: string[]
  fabric: string
  price: number
  size: {
    talles: string[]
  }
  image_url: string | null
  images_urls: string[]
  sku: string
}

export interface PublicUser {
  id: string
  created_at: Date
  name: string
  email: string
  role: "admin" | "user"
}

export type AppActionError = {
  statusCode: number
  message: string
  userMessage?: string
  fieldErrors?: Record<string, string[]>
}

export interface FormState {
  error?: string
  success?: boolean
  message?: string
}
