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

// Mock product data
const products: Product[] = [
  {
    id: "1",
    name: "NOMBRE PRODUCTO",
    price: 10000.0,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    sizes: ["S", "M", "L", "XL"],
    characteristics: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Adipiscing elit, sed do eiusmod tempor",
      "Incididunt ut labore et dolore magna aliqua",
    ],
    care: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Adipiscing elit, sed do eiusmod tempor",
      "Incididunt ut labore et dolore magna aliqua",
    ],
    discount: {
      percentage: 20,
      method: "Transferencia Bancaria",
    },
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
    ],
  },
  {
    id: "2",
    name: "Nombre",
    price: 8500.0,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    sizes: ["S", "M", "L"],
    characteristics: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Adipiscing elit, sed do eiusmod tempor",
    ],
    care: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Adipiscing elit, sed do eiusmod tempor",
    ],
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
    ],
  },
  {
    id: "3",
    name: "Nombre",
    price: 9200.0,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    sizes: ["S", "M", "L", "XL"],
    characteristics: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Adipiscing elit, sed do eiusmod tempor",
    ],
    care: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Adipiscing elit, sed do eiusmod tempor",
    ],
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
    ],
  },
  {
    id: "4",
    name: "Nombre",
    price: 7800.0,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    sizes: ["S", "M", "L"],
    characteristics: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Adipiscing elit, sed do eiusmod tempor",
    ],
    care: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Adipiscing elit, sed do eiusmod tempor",
    ],
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
    ],
  },
  {
    id: "5",
    name: "Nombre",
    price: 11500.0,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    sizes: ["S", "M", "L", "XL"],
    characteristics: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Adipiscing elit, sed do eiusmod tempor",
    ],
    care: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Adipiscing elit, sed do eiusmod tempor",
    ],
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
    ],
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getRelatedProducts(currentId: string): Product[] {
  // Return all products except the current one, limited to 4
  return products.filter((product) => product.id !== currentId).slice(0, 4)
}

export function getAllProducts(): Product[] {
  return products
}
