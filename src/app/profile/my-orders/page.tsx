import React from "react"
import MyOrdersSection, { Order, Product, Shipping } from "./client-orders"
import { getUser } from "@/controllers/auth/auth-controller"
import { redirect } from "next/navigation"
import { getOrders } from "@/controllers/order/order-controller"
import { getOrderItemsByOrderId } from "@/controllers/order-items/order-items-controller"
import { OrderItem } from "@/types/order-items/order-items"
import { actionErrorHandler } from "@/lib/handlers/actionErrorHandler"
import { getShippingByOrderId } from "@/controllers/shipping/shipping-controller"
import { getProductById } from "@/controllers/products/product-controller"

const ServerMyOrders = async () => {
  const user = await getUser()

  if (!user.success || !user.data) {
    redirect("/login")
  }

  const userOrders = await getOrders(user.data.id)

  console.log(userOrders)

  if (!userOrders.success || !userOrders.data) {
    redirect("/profile")
  }

  // Create the proper array structure for each order
  const ordersData = await Promise.all(
    userOrders.data.map(async (order) => {
      // Get order items for this specific order
      const orderItems = await actionErrorHandler(async () => {
        const orderItems = await getOrderItemsByOrderId(order.id)
        return orderItems.data as OrderItem[]
      })

      // Get products and pair with order items for this specific order
      const items: { product: Product; orderItem: OrderItem }[] = []
      for (const orderItem of orderItems) {
        const product = await actionErrorHandler(async () => {
          const product = await getProductById(orderItem.product_id)
          return product.data as Product
        })
        items.push({ product, orderItem })
      }

      // Get shipping for this specific order
      const shipping = await actionErrorHandler(async () => {
        const shipping = await getShippingByOrderId(order.id)
        return shipping.data as Shipping
      })

      console.log(shipping)

      return {
        order: order as Order,
        items: items,
        shipping: shipping as Shipping,
      }
    })
  )

  return <MyOrdersSection orders={ordersData} />
}

export default ServerMyOrders
