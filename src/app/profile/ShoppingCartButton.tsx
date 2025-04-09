"use client"

import { CartItem, useCart } from "@/context/CartContext"
import { ShoppingCart } from "lucide-react"
import React from "react"

const ShoppingCartButton = ({ product }: { product: CartItem }) => {
  const { addItem } = useCart()
  return (
    <ShoppingCart
      onClick={() => addItem(product)}
      className="h-4 w-4 sm:h-5 sm:w-5 text-primary"
    />
  )
}

export default ShoppingCartButton
