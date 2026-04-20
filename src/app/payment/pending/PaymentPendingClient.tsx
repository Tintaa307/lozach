"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Clock, Package, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BANK_TRANSFER_PAYMENT_TYPE } from "@/lib/utils/payment-utils"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

export default function PaymentPendingClient() {
  const searchParams = useSearchParams()
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const paymentMethod = searchParams.get("payment_method")
  const externalReference = searchParams.get("external_reference")
  const amount = Number(searchParams.get("amount"))
  const isBankTransfer = paymentMethod === BANK_TRANSFER_PAYMENT_TYPE
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "lozacharg@gmail.com"
  const bankDetails = [
    {
      label: "Alias",
      value: process.env.NEXT_PUBLIC_BANK_TRANSFER_ALIAS,
    },
    {
      label: "CBU/CVU",
      value: process.env.NEXT_PUBLIC_BANK_TRANSFER_CBU,
    },
    {
      label: "Titular",
      value: process.env.NEXT_PUBLIC_BANK_TRANSFER_HOLDER,
    },
    {
      label: "Banco",
      value: process.env.NEXT_PUBLIC_BANK_TRANSFER_BANK,
    },
  ].filter((item): item is { label: string; value: string } =>
    Boolean(item.value)
  )

  useEffect(() => {
    const id = searchParams.get("payment_id")
    setPaymentId(id)
  }, [searchParams])

  return (
    <div className="min-h-screen py-24 flex items-center justify-center bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isBankTransfer
                  ? "Pedido pendiente por transferencia"
                  : "Pago Pendiente"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isBankTransfer ? (
                <div className="space-y-4 text-left">
                  <div className="space-y-2 text-center">
                    <p className="text-gray-600">
                      Tu pedido quedó registrado. Realizá la transferencia y
                      enviá el comprobante para que podamos confirmarlo.
                    </p>
                    {Number.isFinite(amount) && amount > 0 && (
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(amount)}
                      </p>
                    )}
                    {externalReference && (
                      <p className="text-xs text-gray-500">
                        Referencia:{" "}
                        <span className="font-mono">{externalReference}</span>
                      </p>
                    )}
                  </div>

                  {bankDetails.length > 0 ? (
                    <div className="rounded-lg border bg-gray-50 p-4 text-sm">
                      <p className="mb-3 font-medium text-gray-900">
                        Datos para transferir
                      </p>
                      <div className="space-y-2">
                        {bankDetails.map((item) => (
                          <div
                            key={item.label}
                            className="flex justify-between gap-4"
                          >
                            <span className="text-gray-500">
                              {item.label}
                            </span>
                            <span className="text-right font-medium">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      Los datos bancarios todavía no están configurados en el
                      sitio. Contactanos por email para coordinar la
                      transferencia.
                    </div>
                  )}

                  <p className="text-center text-sm text-gray-600">
                    Enviá el comprobante a{" "}
                    <a href={`mailto:${supportEmail}`} className="underline">
                      {supportEmail}
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Tu pago está siendo procesado. Esto puede tardar unos
                    minutos.
                  </p>
                  {paymentId && (
                    <p className="text-sm text-gray-500">
                      ID de pago:{" "}
                      <span className="font-mono">{paymentId}</span>
                    </p>
                  )}
                  <p className="text-gray-600">
                    Te notificaremos por email cuando se confirme tu pago.
                  </p>
                </div>
              )}

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
                    href={`mailto:${supportEmail}`}
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
