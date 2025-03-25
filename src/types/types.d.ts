export interface Product {
  id: string
  name: string
  price: number
  description: string
  sizes: string[]
  characteristics: string[]
  care: string[]
  discount?: {
    percentage: number
    method: string
  }
  images: string[]
}
