"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileCheck, PackageCheck } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  size: string
  color: string
  quantity: number
  price: number
  imageUrl: string
}

interface OrderConfirmationProps {
  orderNumber: string
  orderDate: string
  items: OrderItem[]
  whatsappNumber: string
}

export default function OrderConfirmation({
  orderNumber = "720068",
  orderDate = "31/3/2025",
  items = [
    {
      id: "1",
      name: "Producto 1",
      size: "L",
      color: "Negro",
      quantity: 2,
      price: 49990,
      imageUrl: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "2",
      name: "Producto 1",
      size: "L",
      color: "Negro",
      quantity: 2,
      price: 49990,
      imageUrl: "/placeholder.svg?height=60&width=60",
    },
  ],
  whatsappNumber = "5491112345678",
}: OrderConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Calculate totals
  const calculateItemTotal = (item: OrderItem) => {
    return item.price * item.quantity
  }

  const calculateOrderTotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format price per unit
  const formatUnitPrice = (price: number) => {
    return (
      new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price) + " c/u"
    )
  }

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    let message = `Hola, quiero confirmar mi pedido #${orderNumber}:\n\n`

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - Talle: ${item.size}, Color: ${
        item.color
      }, Cantidad: ${item.quantity}\n`
    })

    message += `\nTotal: ${formatCurrency(calculateOrderTotal())}`

    return encodeURIComponent(message)
  }

  const handleWhatsAppOrder = () => {
    setIsLoading(true)

    // Generate WhatsApp link
    const whatsappMessage = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")

    // Reset loading state after a short delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <section className="min-h-screen mx-auto flex items-center">
      <div className="max-w-lg mx-auto border border-black/20 rounded-md bg-[#f9f9f7] p-6 shadow-lg">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-black rounded-full p-3 mb-3">
            <PackageCheck className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold">Confirma tu Pedido</h2>
          <p className="text-gray-500 text-sm">
            Pedido #{orderNumber} • {orderDate}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-4">
          <h3 className="font-medium mb-3">Resumen del Pedido</h3>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="bg-gray-200 h-16 w-16 flex-shrink-0">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Talle: {item.size} • Color: {item.color} • Cantidad:{" "}
                    {item.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatUnitPrice(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(calculateItemTotal(item))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3 mb-4">
          <div className="flex justify-between items-center">
            <p className="font-medium">Total:</p>
            <p className="font-bold">{formatCurrency(calculateOrderTotal())}</p>
          </div>
        </div>

        <Button
          onClick={handleWhatsAppOrder}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 h-12"
        >
          <FileCheck className="h-5 w-5" />
          Ordenar vía WhatsApp
          {isLoading && <span className="ml-2 animate-spin">⟳</span>}
          <ArrowRight className="h-5 w-5" />
        </Button>

        <p className="text-center text-xs text-gray-500 mt-2">
          Haz clic en el botón para confirmar tu pedido a través de WhatsApp
        </p>
      </div>
    </section>
  )
}
