export interface RecentCart {
  id: number
  user_id: string
  product_id: number
  added_at: string
  created_at: string
}

export interface RecentCartWithProduct extends RecentCart {
  product: {
    id: number
    name: string
    price: number
    image_url: string | null
    category: "adult" | "child"
  }
}
