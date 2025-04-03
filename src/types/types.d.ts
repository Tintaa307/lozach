export interface Product {
  id: number
  name: string
  stock: "consultar"
  description: string
  category: "adult" | "child"
  color: string[]
  fabric: string
  price: number
  size: {
    talles: string[]
  }
  image: string
}
