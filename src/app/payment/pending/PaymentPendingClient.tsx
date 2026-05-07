"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Clock,
  Package,
  Home,
  Upload,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BANK_TRANSFER_PAYMENT_TYPE,
  CASH_STORE_PAYMENT_TYPE,
  TRANSFER_PAYMENT_WINDOW_MS,
} from "@/lib/utils/payment-utils"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

const formatTimer = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`
}

const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp,application/pdf"
const MAX_BYTES = 10 * 1024 * 1024

type UploadState = "idle" | "uploading" | "uploaded" | "error"

export default function PaymentPendingClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [now, setNow] = useState<number | null>(null)
  const [deadline, setDeadline] = useState<number | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const paymentMethod = searchParams.get("payment_method")
  const externalReference = searchParams.get("external_reference")
  const amount = Number(searchParams.get("amount"))
  const isBankTransfer = paymentMethod === BANK_TRANSFER_PAYMENT_TYPE
  const isCashStore = paymentMethod === CASH_STORE_PAYMENT_TYPE

  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "lozacharg@gmail.com"

  const bankDetails = useMemo(
    () =>
      [
        { label: "Alias", value: process.env.NEXT_PUBLIC_BANK_TRANSFER_ALIAS },
        { label: "CBU/CVU", value: process.env.NEXT_PUBLIC_BANK_TRANSFER_CBU },
        {
          label: "Titular",
          value: process.env.NEXT_PUBLIC_BANK_TRANSFER_HOLDER,
        },
        { label: "Banco", value: process.env.NEXT_PUBLIC_BANK_TRANSFER_BANK },
      ].filter((item): item is { label: string; value: string } =>
        Boolean(item.value)
      ),
    []
  )

  const remainingMs =
    isBankTransfer && deadline !== null && now !== null
      ? Math.max(0, deadline - now)
      : null
  const isExpired = remainingMs !== null && remainingMs === 0
  const isCritical =
    remainingMs !== null && remainingMs > 0 && remainingMs < 5 * 60 * 1000

  useEffect(() => {
    const id = searchParams.get("payment_id")
    setPaymentId(id)
  }, [searchParams])

  useEffect(() => {
    if (!isBankTransfer) {
      setDeadline(null)
      setNow(null)
      return
    }
    const start = Date.now()
    setDeadline(start + TRANSFER_PAYMENT_WINDOW_MS)
    setNow(start)
    const interval = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => window.clearInterval(interval)
  }, [isBankTransfer])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setUploadError(null)
    if (!file) {
      setSelectedFile(null)
      return
    }
    if (file.size > MAX_BYTES) {
      setUploadError("El archivo supera 10 MB.")
      setSelectedFile(null)
      return
    }
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Adjuntá el comprobante antes de continuar.")
      return
    }
    if (!externalReference) {
      toast.error("Falta la referencia de la orden.")
      return
    }
    if (isExpired) {
      toast.error("El plazo para enviar el comprobante venció.")
      return
    }

    setUploadState("uploading")
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append("external_reference", externalReference)
      formData.append("file", selectedFile)

      const response = await fetch("/api/payment/transfer-proof", {
        method: "POST",
        body: formData,
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok || !payload?.success) {
        const message =
          payload?.message || "No se pudo subir el comprobante."
        setUploadState("error")
        setUploadError(message)
        toast.error(message)
        return
      }

      setUploadState("uploaded")
      toast.success(
        "¡Comprobante recibido! Vamos a confirmarte por email."
      )

      window.setTimeout(() => {
        router.push("/profile/my-orders")
      }, 1500)
    } catch (error) {
      console.error(error)
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo subir el comprobante."
      setUploadState("error")
      setUploadError(message)
      toast.error(message)
    }
  }

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
                  : isCashStore
                    ? "Pedido reservado para retirar"
                    : "Pago Pendiente"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isBankTransfer ? (
                <div className="space-y-4 text-left">
                  <div className="space-y-2 text-center">
                    <p className="text-gray-600">
                      Realizá la transferencia y enviá el comprobante para que
                      podamos reservar tu pedido.
                    </p>
                    {Number.isFinite(amount) && amount > 0 && (
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(amount)}
                      </p>
                    )}
                    {externalReference && (
                      <p className="text-xs text-gray-500">
                        Referencia:{" "}
                        <span className="font-mono">
                          {externalReference}
                        </span>
                      </p>
                    )}
                  </div>

                  <div
                    className={`rounded-lg border p-4 text-center ${
                      isExpired
                        ? "border-red-200 bg-red-50 text-red-700"
                        : isCritical
                          ? "border-amber-300 bg-amber-50 text-amber-800"
                          : "border-amber-200 bg-amber-50 text-amber-800"
                    }`}
                    role="timer"
                    aria-live="polite"
                  >
                    <p className="text-xs uppercase tracking-wide font-medium">
                      Tiempo restante para enviar el comprobante
                    </p>
                    <p className="text-3xl font-mono font-bold tabular-nums mt-1">
                      {remainingMs === null
                        ? formatTimer(TRANSFER_PAYMENT_WINDOW_MS)
                        : formatTimer(remainingMs)}
                    </p>
                    <p className="text-xs mt-1">
                      {isExpired
                        ? "El plazo venció. Si ya transferiste, escribinos."
                        : "El pedido se libera si no recibimos el comprobante a tiempo."}
                    </p>
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
                            <span className="text-right font-medium break-all">
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

                  <div className="rounded-lg border bg-white p-4 space-y-3">
                    <p className="font-medium text-gray-900 text-sm">
                      Subí el comprobante
                    </p>

                    {uploadState === "uploaded" ? (
                      <div className="flex items-start gap-3 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                        <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">¡Comprobante recibido!</p>
                          <p className="text-xs">
                            Te avisamos por email cuando se confirme el pago.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={ACCEPTED_TYPES}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="flex flex-col gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-center"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={
                              uploadState === "uploading" || isExpired
                            }
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {selectedFile
                              ? "Cambiar archivo"
                              : "Adjuntar comprobante"}
                          </Button>
                          {selectedFile && (
                            <p className="text-xs text-gray-600 truncate">
                              {selectedFile.name} (
                              {(selectedFile.size / 1024).toFixed(0)} KB)
                            </p>
                          )}
                          {uploadError && (
                            <p className="flex items-start gap-2 text-xs text-red-600">
                              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                              {uploadError}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            PNG, JPG, WEBP o PDF. Hasta 10 MB.
                          </p>
                        </div>

                        <Button
                          type="button"
                          className="w-full bg-black hover:bg-black/90 text-white"
                          onClick={handleUpload}
                          disabled={
                            !selectedFile ||
                            uploadState === "uploading" ||
                            isExpired
                          }
                        >
                          {uploadState === "uploading" ? (
                            <span className="flex items-center justify-center gap-2">
                              Enviando{" "}
                              <Loader2 className="w-4 h-4 animate-spin" />
                            </span>
                          ) : (
                            "Ya transferí"
                          )}
                        </Button>
                      </>
                    )}
                  </div>

                  <p className="text-center text-xs text-gray-500">
                    También podés enviar el comprobante a{" "}
                    <a href={`mailto:${supportEmail}`} className="underline">
                      {supportEmail}
                    </a>
                    .
                  </p>
                </div>
              ) : isCashStore ? (
                <div className="space-y-3 text-left">
                  <p className="text-gray-600">
                    Reservamos tu pedido. Vas a pagar en efectivo cuando lo
                    retires en la tienda.
                  </p>
                  {Number.isFinite(amount) && amount > 0 && (
                    <p className="text-center text-2xl font-bold text-gray-900">
                      Total a pagar: {formatCurrency(amount)}
                    </p>
                  )}
                  {externalReference && (
                    <p className="text-center text-xs text-gray-500">
                      Referencia:{" "}
                      <span className="font-mono">{externalReference}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Te vamos a confirmar por email los datos de la tienda y el
                    horario para retirar.
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
