"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  size: string
  image: string
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

  const addItem = (newItem: CartItem) => {
    setCartItems((prevItems) => {
      // Verifica si ya existe el producto con el mismo id y talle
      const existingIndex = prevItems.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size
      )
      if (existingIndex >= 0) {
        // Si ya existe, suma la cantidad
        const updatedItems = [...prevItems]
        updatedItems[existingIndex].quantity += newItem.quantity
        return updatedItems
      } else {
        // Sino, lo agrega al array
        return [...prevItems, newItem]
      }
    })
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
