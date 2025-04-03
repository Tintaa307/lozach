"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileCheck, PackageCheck } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { useCart } from "@/context/CartContext"
import { capitalizeFirstLetter } from "@/lib/utils"

export default function OrderConfirmation() {
  const [isLoading, setIsLoading] = useState(false)
  const { cartItems, subtotal } = useCart()

  // Genera un número de pedido único usando UUID y almacénalo en estado para que no cambie en cada render
  const [orderNumber] = useState(uuidv4())
  // Obtiene la fecha actual y la formatea (por ejemplo, en formato local)
  const [orderDate] = useState(
    new Date(Date.now()).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  )

  // Número de WhatsApp al que se enviará el pedido (puede venir de configuración o contexto)
  const whatsappNumber = "541160161399" // Reemplazar por el número real

  // Función para calcular el total del pedido
  const calculateOrderTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  // Formatea un valor numérico a moneda ARS sin decimales
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Formatea el precio unitario y añade "c/u"
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

  // Genera el mensaje de WhatsApp con los detalles del pedido
  const generateWhatsAppMessage = () => {
    let message = `Hola, quiero confirmar mi pedido #${orderNumber}:\n\n`

    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      message += `- Talle: ${capitalizeFirstLetter(item.size)}\n`
      message += `- Color: ${capitalizeFirstLetter(item.color)}\n`
      message += `- Cantidad: ${item.quantity}\n\n`
    })

    message += `Total: ${formatCurrency(calculateOrderTotal())}`

    return encodeURIComponent(message)
  }

  // Maneja la acción de ordenar vía WhatsApp
  const handleWhatsAppOrder = () => {
    setIsLoading(true)

    const whatsappMessage = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

    // Abre WhatsApp en una nueva pestaña
    window.open(whatsappUrl, "_blank")

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
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="bg-gray-200 h-16 w-16 flex-shrink-0">
                  <Image
                    src={item.image || "/example-image.jpg"}
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
                  <p className="font-medium">{formatCurrency(subtotal)}</p>
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
