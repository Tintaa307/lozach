"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { XCircle, ShoppingCart, Home, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentFailureClient() {
  const searchParams = useSearchParams()
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get("payment_id")
    const error = searchParams.get("error")
    setPaymentId(id)
    setErrorMessage(error)
  }, [searchParams])

  return (
    <div className="min-h-screen py-24 flex items-center justify-center bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Pago Fallido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-gray-600">
                  No pudimos procesar tu pago en este momento.
                </p>
                {paymentId && (
                  <p className="text-sm text-gray-500">
                    ID de pago: <span className="font-mono">{paymentId}</span>
                  </p>
                )}
                {errorMessage && (
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {errorMessage}
                  </p>
                )}
                <p className="text-gray-600">
                  Por favor, intenta nuevamente o contacta con nosotros si el
                  problema persiste.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-black hover:bg-black/90 text-white"
                >
                  <Link href="/checkout">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Intentar Nuevamente
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/cart">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Ver Mi Carrito
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Volver al Inicio
                  </Link>
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  ¿Necesitas ayuda?{" "}
                  <a
                    href="mailto:support@lozachurban.store"
                    className="text-black hover:underline"
                  >
                    Contáctanos
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
