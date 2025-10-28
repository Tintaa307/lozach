"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Plus, Minus, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/CartContext" // Asegúrate de la ruta correcta
import { useRouter } from "next/navigation"

export function CartSheet() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { cartItems, updateQuantity, removeItem, subtotal, isInitialized } =
    useCart()

  const router = useRouter()

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-black text-white text-xs flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="text-xl">TU CARRO</SheetTitle>
          <Separator />
        </SheetHeader>
        {!isInitialized ? (
          <div className="flex flex-col items-center justify-center space-y-4 flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="text-gray-500">Cargando carrito...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 flex-1">
            <div className="rounded-full bg-gray-100 p-6">
              <ShoppingCart className="h-8 w-8 text-gray-500" />
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-1">TU CARRO ESTÁ VACÍO</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Su carrito parece estar vacío. Es hora de mejorar tu estilo con
                algunas piezas nuevas.
              </p>
              <Button
                asChild
                className="w-full h-11"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/products">EXPLORAR LA COLECCIÓN</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
                      <Image
                        src={item.image_url || "/example-image.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm text-gray-500">
                        Talle: {item.size}
                      </span>
                      <span className="text-sm font-medium">${item.price}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease quantity</span>
                      </Button>
                      <span className="w-4 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase quantity</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="space-y-4 pt-6">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm font-medium">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Envío</span>
                  <span className="text-sm font-medium">
                    Calculado al finalizar
                  </span>
                </div>
              </div>
              <Button
                onClick={() => {
                  setIsOpen(false)
                  router.push("/checkout")
                }}
                className="w-full"
              >
                FINALIZAR COMPRA
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                CONTINUAR COMPRANDO
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
