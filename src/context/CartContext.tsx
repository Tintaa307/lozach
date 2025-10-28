"use client"

import axios from "axios"
import React, { createContext, useContext, useState, ReactNode } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  size: string
  image_url: string
  color: string
}

interface CartContextType {
  cartItems: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, change: number) => void
  clearCart: () => void
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addItem = async (newItem: CartItem) => {
    // Flag opcional para evitar duplicados
    let alreadyCalled = false

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size
      )
      if (existingIndex >= 0) {
        const updatedItems = [...prevItems]
        // Solo suma si no se ha procesado ya
        if (!alreadyCalled) {
          updatedItems[existingIndex].quantity += newItem.quantity
          alreadyCalled = true
        }
        return updatedItems
      } else {
        return [...prevItems, newItem]
      }
    })

    try {
      const response = await axios.post("/api/last-cart", {
        product_id: newItem.id,
      })
      if (response.status !== 200) {
        console.error("Error al agregar al carrito:", response.data)
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error)
    }
  }

  const removeItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, change: number) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map((item) => {
            if (item.id === id) {
              const newQuantity = Math.max(0, item.quantity + change)
              return newQuantity === 0
                ? null
                : { ...item, quantity: newQuantity }
            }
            return item
          })
          .filter(Boolean) as CartItem[]
    )
  }

  const clearCart = () => setCartItems([])

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
