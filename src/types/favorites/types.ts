export interface Favorite {
  id: number
  user_id: string
  product_id: number
  created_at: string
}

export interface FavoriteWithProduct extends Favorite {
  product: {
    id: number
    name: string
    price: number
    image_url: string | null
    category: "adult" | "child"
  }
}
