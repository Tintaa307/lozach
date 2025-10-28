export interface RecentView {
  id: number
  user_id: string
  product_id: number
  viewed_at: string
  created_at: string
}

export interface RecentViewWithProduct extends RecentView {
  product: {
    id: number
    name: string
    price: number
    image_url: string | null
    category: "adult" | "child"
  }
}
