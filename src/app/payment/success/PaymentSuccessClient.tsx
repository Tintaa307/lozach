"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, Home, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/context/CartContext"
import { verifyPaymentStatus } from "@/controllers/payment/payment-controller"

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isApproved, setIsApproved] = useState(false)
  const [paymentId, setPaymentId] = useState<string | null>(null)

  useEffect(() => {
    const externalReference = searchParams.get("external_reference")
    const id = searchParams.get("payment_id")
    setPaymentId(id)

    if (!externalReference) {
      setIsVerifying(false)
      return
    }

    verifyPaymentStatus(externalReference)
      .then((result) => {
        if (result.success && result.data?.status === "approved") {
          setIsApproved(true)
          clearCart()
        }
      })
      .catch(() => {
        // Verification failed — show unverified state
      })
      .finally(() => {
        setIsVerifying(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  if (isVerifying) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-gray-600">Verificando tu pago...</p>
        </div>
      </div>
    )
  }

  if (!isApproved) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="text-center">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Pago en proceso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Tu pago aún no ha sido confirmado. Esto puede tardar unos
                    minutos.
                  </p>
                  {paymentId && (
                    <p className="text-sm text-gray-500">
                      ID de pago:{" "}
                      <span className="font-mono">{paymentId}</span>
                    </p>
                  )}
                  <p className="text-gray-600">
                    Podés revisar el estado de tu pedido en &quot;Mis
                    Pedidos&quot;.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-black hover:bg-black/90 text-white"
                  >
                    <Link href="/profile/my-orders">
                      <Package className="h-4 w-4 mr-2" />
                      Ver Mis Pedidos
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
                    ¿Tienes alguna pregunta?{" "}
                    <a
                      href="mailto:lozacharg@gmail.com"
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

  return (
    <div className="min-h-screen py-24 flex items-center justify-center bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                ¡Pago Exitoso!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-gray-600">
                  Tu pago ha sido procesado correctamente.
                </p>
                {paymentId && (
                  <p className="text-sm text-gray-500">
                    ID de pago: <span className="font-mono">{paymentId}</span>
                  </p>
                )}
                <p className="text-gray-600">
                  Recibirás un email de confirmación con los detalles de tu
                  pedido.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-black hover:bg-black/90 text-white"
                >
                  <Link href="/profile/my-orders">
                    <Package className="h-4 w-4 mr-2" />
                    Ver Mis Pedidos
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
                  ¿Tienes alguna pregunta?{" "}
                  <a
                    href="mailto:lozacharg@gmail.com"
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
