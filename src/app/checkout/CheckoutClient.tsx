"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/context/CartContext"
import { ArrowRight, Loader2, ShoppingBag } from "lucide-react"
import { PaymentSchema } from "@/lib/validations/payment-schema"
import { toast } from "sonner"
import { SHIPPING_COSTS } from "@/lib/consts/shipping"
import { actionErrorHandler } from "@/lib/handlers/actionErrorHandler"
import { createPreference } from "@/controllers/payment/payment-controller"
import { AppActionException } from "@/types/exceptions"
import { useRouter } from "next/navigation"
import { Address } from "@/types/address/address"

export default function CheckoutClient({
  address,
}: {
  address: Address[] | null
}) {
  const { cartItems, subtotal } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [metodoEnvio, setMetodoEnvio] = useState("home")
  const [saveInfo, setSaveInfo] = useState(false)
  const [useSavedAddress, setUseSavedAddress] = useState(
    !!(address && address.length > 0)
  )
  const [showAddressForm, setShowAddressForm] = useState(false)

  // Usar la primera dirección guardada si existe, sino valores vacíos
  const savedAddress = address && address.length > 0 ? address[0] : null

  const [formData, setFormData] = useState({
    identifier: savedAddress?.identifier || "",
    address: savedAddress?.address || "",
    details: savedAddress?.details || "",
    postal_code: savedAddress?.postal_code || "",
    city: savedAddress?.city || "",
    state: savedAddress?.state || "",
    phone: savedAddress?.phone || "",
    shipping_method: metodoEnvio as "home" | "express" | "store",
    save_info: saveInfo,
  })

  const total =
    subtotal + SHIPPING_COSTS[metodoEnvio as keyof typeof SHIPPING_COSTS]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleUseSavedAddress = () => {
    if (savedAddress) {
      setFormData({
        identifier: savedAddress.identifier,
        address: savedAddress.address,
        details: savedAddress.details,
        postal_code: savedAddress.postal_code,
        city: savedAddress.city,
        state: savedAddress.state,
        phone: savedAddress.phone,
        shipping_method: metodoEnvio as "home" | "express" | "store",
        save_info: saveInfo,
      })
      setUseSavedAddress(true)
      setShowAddressForm(false)
    }
  }

  const handleUseNewAddress = () => {
    setFormData({
      identifier: "",
      address: "",
      details: "",
      postal_code: "",
      city: "",
      state: "",
      phone: "",
      shipping_method: metodoEnvio as "home" | "express" | "store",
      save_info: saveInfo,
    })
    setUseSavedAddress(false)
    setShowAddressForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const validatedData = PaymentSchema.safeParse(formData)

      if (!validatedData.success) {
        return validatedData.error.issues
          .map((issue) => toast.error(issue.message))
          .join(", ")
      }

      const preferenceProducts = cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }))

      const preference = await actionErrorHandler(async () => {
        return await createPreference({
          address: formData.address,
          details: formData.details,
          postal_code: formData.postal_code,
          city: formData.city,
          state: formData.state,
          phone: formData.phone,
          shipping_method: formData.shipping_method,
          save_info: formData.save_info,
          products: preferenceProducts,
          identifier: formData.identifier,
          shipping_cost:
            SHIPPING_COSTS[
              formData.shipping_method as keyof typeof SHIPPING_COSTS
            ] === 0
              ? "Gratis"
              : SHIPPING_COSTS[
                  formData.shipping_method as keyof typeof SHIPPING_COSTS
                ].toString(),
        })
      })

      if (preference.success && preference.data) {
        router.push(preference.data.init_point as string)
      } else {
        toast.error(
          preference.message || "Error al crear la preferencia de pago"
        )
      }
    } catch (error) {
      if (error instanceof AppActionException) {
        return toast.error(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-24 justify-center items-center flex">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-black" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Tu carrito está vacío
                </h1>
                <p className="text-gray-600 mb-6">
                  No tienes productos en tu carrito. Agrega algunos productos
                  para continuar con la compra.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => (window.location.href = "/products")}
                  className="w-full bg-black hover:bg-black/90 text-white h-12"
                >
                  Ver Productos
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="outline"
                  className="w-full h-12"
                >
                  Volver al Inicio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Finalizar Compra
            </h1>
            <p className="text-gray-600">
              Completa tu información para procesar el pedido
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna Derecha - Formulario */}
            <div className="space-y-6">
              {/* Dirección Guardada */}
              {savedAddress && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Dirección Guardada
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="space-y-2">
                        <p className="font-medium text-gray-900">
                          {savedAddress.identifier}
                        </p>
                        <p className="text-gray-700">{savedAddress.address}</p>
                        {savedAddress.details && (
                          <p className="text-gray-600">
                            {savedAddress.details}
                          </p>
                        )}
                        <p className="text-gray-600">
                          {savedAddress.city}, {savedAddress.state} -{" "}
                          {savedAddress.postal_code}
                        </p>
                        <p className="text-gray-600">{savedAddress.phone}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleUseSavedAddress}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        disabled={useSavedAddress}
                      >
                        {useSavedAddress
                          ? "✓ Usando esta dirección"
                          : "Usar esta dirección"}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleUseNewAddress}
                        variant="outline"
                        className="flex-1"
                      >
                        Usar dirección diferente
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Información de Entrega */}
              <Card className={useSavedAddress ? "opacity-50" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Información de Entrega</span>
                    {savedAddress && (
                      <span className="text-sm text-gray-500">
                        {useSavedAddress
                          ? "Usando dirección guardada"
                          : "Nueva dirección"}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="dni">DNI / CUIT</Label>
                    <Input
                      id="identifier"
                      value={formData.identifier}
                      onChange={(e) =>
                        handleInputChange("identifier", e.target.value)
                      }
                      placeholder="12345678"
                      disabled={useSavedAddress}
                    />
                  </div>

                  <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Calle, avenida, etc."
                      disabled={useSavedAddress}
                    />
                  </div>

                  <div>
                    <Label htmlFor="details">Casa, apartamento, etc.</Label>
                    <Input
                      id="details"
                      value={formData.details}
                      onChange={(e) =>
                        handleInputChange("details", e.target.value)
                      }
                      placeholder="Apartamento, piso, etc."
                      disabled={useSavedAddress}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="postal_code">Código postal</Label>
                      <Input
                        id="postal_code"
                        value={formData.postal_code}
                        onChange={(e) =>
                          handleInputChange("postal_code", e.target.value)
                        }
                        placeholder="1429"
                        disabled={useSavedAddress}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder="CABA"
                        disabled={useSavedAddress}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Provincia / Estado</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        placeholder="Buenos Aires"
                        disabled={useSavedAddress}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+54 9 11 1234-5678"
                      disabled={useSavedAddress}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="save-info"
                      checked={saveInfo}
                      onCheckedChange={(checked) =>
                        setSaveInfo(checked as boolean)
                      }
                    />
                    <Label htmlFor="save-info" className="text-sm">
                      Guardar mi información y consultar más rápidamente la
                      próxima vez
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Métodos de Envío */}
              <Card>
                <CardHeader>
                  <CardTitle>Métodos de envío</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={metodoEnvio}
                    onValueChange={(value) => setMetodoEnvio(value)}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="home" id="home" />
                      <Label htmlFor="home" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">A domicilio</p>
                            <p className="text-sm text-gray-500">
                              De 3 a 7 dias hábiles
                            </p>
                          </div>
                          <span className="font-medium">$5.463,76</span>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="express" id="express" />
                      <Label
                        htmlFor="express"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Envío express</p>
                            <p className="text-sm text-gray-500">
                              De 2 a 5 dias hábiles
                            </p>
                          </div>
                          <span className="font-medium">$8.200,00</span>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="store" id="store" />
                      <Label htmlFor="store" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Retiro en tienda</p>
                            <p className="text-sm text-gray-500">
                              Disponible de 10 a 18 h
                            </p>
                          </div>
                          <span className="font-medium text-green-600">
                            Gratis
                          </span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Productos */}
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-16 h-16 relative">
                        <Image
                          src={item.image_url || "/example-image.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          ${item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Desglose de costos */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Envío</span>
                      <span>
                        {metodoEnvio === "store"
                          ? "Gratis"
                          : `$${SHIPPING_COSTS[
                              metodoEnvio as keyof typeof SHIPPING_COSTS
                            ].toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500">Incluye impuestos</p>
                  </div>

                  {/* Botón de pago */}
                  <Button
                    onClick={handleSubmit}
                    className="w-full text-white h-12 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        Procesando...{" "}
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Proceder al pago <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Los envios se realizan de lunes a viernes de 08 a 18 hs.
                    Esto no incluye feriados.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
