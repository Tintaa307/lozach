"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, ShoppingBag } from "lucide-react"
import { toast } from "sonner"

import { createPreference } from "@/controllers/payment/payment-controller"
import { useCart } from "@/context/CartContext"
import { SHIPPING_COSTS } from "@/lib/consts/shipping"
import { actionErrorHandler } from "@/lib/handlers/actionErrorHandler"
import { PaymentSchema } from "@/lib/validations/payment-schema"
import { Address } from "@/types/address/address"
import { AppActionException } from "@/types/exceptions"
import {
  CheckoutShippingMethod,
  CorreoArgentinoAgency,
  ShippingQuote,
} from "@/types/shipping/shipping"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type CheckoutForm = {
  identifier: string
  address: string
  details: string
  postal_code: string
  city: string
  state: string
  phone: string
  shipping_method: CheckoutShippingMethod
  agency_code?: string
  agency_name?: string
  agency_address?: string
  save_info: boolean
}

const EMPTY_FORM = {
  identifier: "",
  address: "",
  details: "",
  postal_code: "",
  city: "",
  state: "",
  phone: "",
  agency_code: "",
  agency_name: "",
  agency_address: "",
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

const mapAddressToForm = (address: Address) => ({
  identifier: String(address.identifier),
  address: address.address,
  details: address.details || "",
  postal_code: String(address.postal_code),
  city: address.city,
  state: address.state,
  phone: address.phone,
  agency_code: "",
  agency_name: "",
  agency_address: "",
})

export default function CheckoutClient({
  address,
}: {
  address: Address | null
}) {
  const { cartItems, subtotal } = useCart()
  const router = useRouter()
  const isSubmittingRef = useRef(false)

  const [method, setMethod] = useState<CheckoutShippingMethod>("home")
  const [saveInfo, setSaveInfo] = useState(false)
  const [useSavedAddress, setUseSavedAddress] = useState(Boolean(address))
  const [isLoading, setIsLoading] = useState(false)
  const [isQuoting, setIsQuoting] = useState(false)
  const [isLoadingAgencies, setIsLoadingAgencies] = useState(false)
  const [quote, setQuote] = useState<ShippingQuote | null>(null)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [agenciesError, setAgenciesError] = useState<string | null>(null)
  const [agencies, setAgencies] = useState<CorreoArgentinoAgency[]>([])

  const [formData, setFormData] = useState<CheckoutForm>({
    ...(address ? mapAddressToForm(address) : EMPTY_FORM),
    shipping_method: "home",
    save_info: false,
  })

  const quoteItems = useMemo(
    () => cartItems.map((item) => ({ quantity: item.quantity })),
    [cartItems]
  )

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      shipping_method: method,
      save_info: saveInfo,
    }))
  }, [method, saveInfo])

  useEffect(() => {
    if (method !== "branch") {
      setAgencies([])
      setAgenciesError(null)
      setFormData((prev) => ({
        ...prev,
        agency_code: "",
        agency_name: "",
        agency_address: "",
      }))
    }
  }, [method])

  useEffect(() => {
    if (method === "store") {
      setQuote({
        cost: 0,
        estimatedDays: null,
        provider: "Correo Argentino",
        weightKg: 0,
        source: "fallback",
        deliveredType: "D",
      })
      setQuoteError(null)
      return
    }

    if (!formData.postal_code.trim()) {
      setQuote(null)
      return
    }

    let cancelled = false
    const timeoutId = window.setTimeout(async () => {
      setIsQuoting(true)
      setQuoteError(null)

      try {
        const endpoint =
          method === "branch"
            ? "/api/shipping/calculate-branch"
            : "/api/shipping/calculate"
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products: quoteItems,
            postalCode: formData.postal_code.trim(),
          }),
        })
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload.message || "No se pudo cotizar el envío.")
        }

        if (!cancelled) {
          setQuote(payload as ShippingQuote)
        }
      } catch (error) {
        if (!cancelled) {
          setQuote(null)
          setQuoteError(
            error instanceof Error ? error.message : "No se pudo cotizar el envío."
          )
        }
      } finally {
        if (!cancelled) {
          setIsQuoting(false)
        }
      }
    }, 300)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [formData.postal_code, method, quoteItems])

  useEffect(() => {
    if (method !== "branch") {
      return
    }

    if (!formData.state.trim()) {
      setAgencies([])
      setAgenciesError(null)
      return
    }

    let cancelled = false
    const timeoutId = window.setTimeout(async () => {
      setIsLoadingAgencies(true)
      setAgenciesError(null)

      try {
        const params = new URLSearchParams({
          province: formData.state.trim(),
        })

        if (formData.postal_code.trim()) {
          params.set("postalCode", formData.postal_code.trim())
        }
        if (formData.city.trim()) {
          params.set("city", formData.city.trim())
        }

        const response = await fetch(`/api/shipping/agencies?${params}`)
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(
            payload.message || "No se pudieron cargar las sucursales."
          )
        }

        if (!cancelled) {
          const nextAgencies = payload as CorreoArgentinoAgency[]
          setAgencies(nextAgencies)
          if (
            formData.agency_code &&
            !nextAgencies.some((agency) => agency.code === formData.agency_code)
          ) {
            setFormData((prev) => ({
              ...prev,
              agency_code: "",
              agency_name: "",
              agency_address: "",
            }))
          }
        }
      } catch (error) {
        if (!cancelled) {
          setAgencies([])
          setAgenciesError(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar las sucursales."
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoadingAgencies(false)
        }
      }
    }, 300)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [formData.agency_code, formData.city, formData.postal_code, formData.state, method])

  const shippingCost =
    method === "store" ? 0 : quote?.cost ?? SHIPPING_COSTS[method]
  const total = subtotal + shippingCost
  const selectedAgency = agencies.find(
    (agency) => agency.code === formData.agency_code
  )

  const setField = (field: keyof CheckoutForm, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const useSaved = () => {
    if (!address) return
    setFormData((prev) => ({
      ...prev,
      ...mapAddressToForm(address),
      shipping_method: method,
      save_info: saveInfo,
    }))
    setUseSavedAddress(true)
  }

  const useNewAddress = () => {
    setFormData((prev) => ({
      ...prev,
      ...EMPTY_FORM,
      shipping_method: method,
      save_info: saveInfo,
    }))
    setUseSavedAddress(false)
  }

  const handleAgencyChange = (agencyCode: string) => {
    const agency = agencies.find((item) => item.code === agencyCode)
    setFormData((prev) => ({
      ...prev,
      agency_code: agency?.code || "",
      agency_name: agency?.name || "",
      agency_address: agency?.address || "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmittingRef.current) return
    if (method === "branch" && !formData.agency_code) {
      toast.error("Seleccioná una sucursal de Correo Argentino.")
      return
    }

    isSubmittingRef.current = true
    setIsLoading(true)

    try {
      const validated = PaymentSchema.safeParse(formData)
      if (!validated.success) {
        validated.error.issues.forEach((issue) => toast.error(issue.message))
        return
      }

      const preference = await actionErrorHandler(async () =>
        createPreference({
          identifier: formData.identifier,
          address: formData.address,
          details: formData.details,
          postal_code: formData.postal_code,
          city: formData.city,
          state: formData.state,
          phone: formData.phone,
          shipping_method: formData.shipping_method,
          shipping_cost: shippingCost,
          agency_code: formData.agency_code,
          agency_name: formData.agency_name,
          agency_address: formData.agency_address,
          save_info: formData.save_info,
          products: cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
          })),
        })
      )

      if (preference.success && preference.data) {
        router.push(preference.data.init_point as string)
      } else {
        toast.error(preference.message || "No se pudo crear la preferencia.")
      }
    } catch (error) {
      if (error instanceof AppActionException) {
        if (
          error.statusCode === 401 &&
          error.userMessage?.includes("sesión iniciada")
        ) {
          toast.error("Tu sesión expiró. Iniciá sesión para continuar.")
          router.push("/login")
          return
        }

        toast.error(error.message)
      }
    } finally {
      setIsLoading(false)
      isSubmittingRef.current = false
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-24 justify-center items-center flex">
        <Card className="max-w-xl w-full mx-4 text-center">
          <CardContent className="p-8 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
              <p className="text-gray-600">
                Agregá productos para continuar con la compra.
              </p>
            </div>
            <Button onClick={() => (window.location.href = "/products")}>
              Ver productos
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Finalizar compra
            </h1>
            <p className="text-gray-600">
              Cotización con Correo Argentino y pago por Mercado Pago.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              {address && (
                <Card>
                  <CardHeader>
                    <CardTitle>Dirección guardada</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p>{address.address}</p>
                    <p>
                      {address.city}, {address.state} - {address.postal_code}
                    </p>
                    <p>{address.phone}</p>
                    <div className="flex gap-3">
                      <Button type="button" onClick={useSaved} disabled={useSavedAddress}>
                        Usar esta dirección
                      </Button>
                      <Button type="button" variant="outline" onClick={useNewAddress}>
                        Cargar otra
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Método de entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={method}
                    onValueChange={(value) =>
                      setMethod(value as CheckoutShippingMethod)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="home" id="home" />
                      <Label htmlFor="home" className="flex-1 cursor-pointer">
                        A domicilio
                      </Label>
                      <span>
                        {formatCurrency(
                          method === "home" ? shippingCost : SHIPPING_COSTS.home
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="branch" id="branch" />
                      <Label htmlFor="branch" className="flex-1 cursor-pointer">
                        Retiro en sucursal Correo Argentino
                      </Label>
                      <span>
                        {formatCurrency(
                          method === "branch"
                            ? shippingCost
                            : SHIPPING_COSTS.branch
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="store" id="store" />
                      <Label htmlFor="store" className="flex-1 cursor-pointer">
                        Retiro en tienda
                      </Label>
                      <span className="text-green-600">Gratis</span>
                    </div>
                  </RadioGroup>

                  {method === "branch" && (
                    <div className="space-y-3 border rounded-lg p-4">
                      <Label>Sucursal</Label>
                      {!formData.state.trim() ? (
                        <p className="text-sm text-gray-600">
                          Completá provincia, ciudad y código postal en Datos de
                          entrega para ver las sucursales disponibles.
                        </p>
                      ) : (
                        <>
                          <Select
                            value={formData.agency_code}
                            onValueChange={handleAgencyChange}
                            disabled={
                              isLoadingAgencies || agencies.length === 0
                            }
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  isLoadingAgencies
                                    ? "Cargando sucursales..."
                                    : "Seleccioná una sucursal"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {agencies.map((agency) => (
                                <SelectItem
                                  key={agency.code}
                                  value={agency.code}
                                >
                                  {agency.name} - {agency.address}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {agencies.length > 0 && (
                            <p className="text-xs text-gray-500">
                              {agencies.length} sucursales disponibles para los
                              datos ingresados.
                            </p>
                          )}
                        </>
                      )}
                      {selectedAgency && (
                        <div className="text-sm text-gray-600 rounded-md bg-gray-50 p-3">
                          <p className="font-medium">{selectedAgency.name}</p>
                          <p>{selectedAgency.address}</p>
                          <p>
                            {selectedAgency.city}, {selectedAgency.province}{" "}
                            {selectedAgency.postalCode}
                          </p>
                        </div>
                      )}
                      {agenciesError && (
                        <p className="text-sm text-red-600">{agenciesError}</p>
                      )}
                    </div>
                  )}

                  {quoteError && method !== "store" && (
                    <p className="text-sm text-amber-700">
                      {quoteError}. Se usará una tarifa estimada.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Datos de entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="identifier">DNI / CUIT</Label>
                      <Input
                        id="identifier"
                        value={formData.identifier}
                        onChange={(e) => setField("identifier", e.target.value)}
                        disabled={useSavedAddress}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        disabled={useSavedAddress}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">
                      Dirección {method === "store" ? "(opcional)" : ""}
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setField("address", e.target.value)}
                      disabled={useSavedAddress}
                    />
                  </div>
                  <div>
                    <Label htmlFor="details">Detalles</Label>
                    <Input
                      id="details"
                      value={formData.details}
                      onChange={(e) => setField("details", e.target.value)}
                      disabled={useSavedAddress}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="postal_code">Código postal</Label>
                      <Input
                        id="postal_code"
                        value={formData.postal_code}
                        onChange={(e) => setField("postal_code", e.target.value)}
                        disabled={useSavedAddress}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setField("city", e.target.value)}
                        disabled={useSavedAddress}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Provincia</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setField("state", e.target.value)}
                        disabled={useSavedAddress}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="save-info"
                      checked={saveInfo}
                      onCheckedChange={(checked) => setSaveInfo(Boolean(checked))}
                      disabled={method === "store"}
                    />
                    <Label htmlFor="save-info" className="text-sm">
                      Guardar estos datos para futuras compras
                    </Label>
                  </div>
                </CardContent>
              </Card>

            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded">
                      <Image
                        src={item.image_url || "/example-image.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.color} · {item.size} · x{item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>
                      {method === "store"
                        ? "Gratis"
                        : isQuoting
                          ? "Calculando..."
                          : formatCurrency(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                {method !== "store" && quote && (
                  <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                    <p>
                      {quote.provider} · {quote.weightKg.toFixed(2)} kg estimados
                    </p>
                    {quote.estimatedDays && (
                      <p>{quote.estimatedDays} días hábiles aproximados</p>
                    )}
                    {quote.source === "fallback" && (
                      <p className="text-amber-700">
                        Tarifa estimada hasta completar la configuración de MiCorreo.
                      </p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={
                    isLoading ||
                    isQuoting ||
                    (method === "branch" && !formData.agency_code)
                  }
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      Procesando <Loader2 className="w-4 h-4 animate-spin" />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Proceder al pago <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
