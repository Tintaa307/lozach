"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { OrderItem } from "@/types/order-items/order-items"
import { cn } from "@/lib/utils"
import { useState, useMemo } from "react"
import { Search } from "lucide-react"

export interface Product {
  id: number
  created_at: string
  name: string
  stock: "consultar"
  description: string | null
  category: "adult" | "child"
  color: string[]
  fabric: string
  price: number
  size: { talles: string[] }
  image_url: string | null
  images_urls: string[]
  sku: string
}

export interface Order {
  id: string
  created_at: string
  updated_at: string
  total_amount: number
  subtotal: number
  user_id: string
  payment_id: string | null
  payment_type: string | null
  collection_id: string | null
  collection_status: string | null
  external_reference: string | null
  currency: string
  phone: string
  email_sent?: boolean
  processed_at?: string | null
}

export type ShippingStatus = "draft" | "shipped" | "ready" | "cancelled"

export interface Shipping {
  id: string
  created_at: string
  order_id: string
  shipping_method: "home" | "express" | "store"
  shipping_cost: number
  user_id: string
  provider: "CA"
  shipping_status: ShippingStatus
  address: string
  details: string
  postal_code: string
  city: string
  state: string
  phone: string
  identifier: string
  updated_at: string
}

type Props = {
  orders: {
    order: Order
    items: { product: Product; orderItem: OrderItem }[]
    shipping: Shipping
  }[]
}

const statusConfig: Record<
  ShippingStatus,
  {
    label: string
    variant: "default" | "secondary" | "destructive" | "outline"
  }
> = {
  draft: { label: "Borrador", variant: "outline" },
  ready: { label: "Listo para enviar", variant: "default" },
  shipped: { label: "Enviado", variant: "secondary" },
  cancelled: { label: "Cancelado", variant: "destructive" },
}

const shippingMethodLabels: Record<Shipping["shipping_method"], string> = {
  home: "Envío a domicilio",
  express: "Envío express",
  store: "Retiro en tienda",
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString))
}

export default function MyOrdersSection({ orders }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const ordersPerPage = 5

  // Filter orders based on search term
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders

    return orders.filter(({ order, items, shipping }) => {
      const searchLower = searchTerm.toLowerCase()

      // Search by order ID
      if (order.id.toLowerCase().includes(searchLower)) return true

      // Search by shipping identifier
      if (
        shipping.identifier &&
        typeof shipping.identifier === "string" &&
        shipping.identifier.toLowerCase().includes(searchLower)
      )
        return true

      // Search by product names
      if (
        items.some(({ product, orderItem }) =>
          (orderItem.product_name || product.name)
            .toLowerCase()
            .includes(searchLower)
        )
      )
        return true

      // Search by shipping status
      if (
        statusConfig[shipping.shipping_status]?.label
          .toLowerCase()
          .includes(searchLower)
      )
        return true

      // Search by payment type
      if (
        order.payment_type &&
        typeof order.payment_type === "string" &&
        order.payment_type.toLowerCase().includes(searchLower)
      )
        return true

      // Search by shipping method
      const shippingMethodLabel = shippingMethodLabels[shipping.shipping_method]
      if (
        shippingMethodLabel &&
        typeof shippingMethodLabel === "string" &&
        shippingMethodLabel.toLowerCase().includes(searchLower)
      )
        return true

      return false
    })
  }, [orders, searchTerm])

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const startIndex = (currentPage - 1) * ordersPerPage
  const endIndex = startIndex + ordersPerPage
  const currentOrders = filteredOrders.slice(startIndex, endIndex)

  // Reset to first page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return (
    <section className="min-h-screen bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex justify-center items-center flex-col">
          <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Mis Pedidos
          </h1>
          <p className="mt-2 text-neutral-600">
            Revisa el estado y detalles de tus compras
          </p>

          {/* Search Bar */}
          <div className="relative mt-6 w-full max-w-md">
            <Input
              type="text"
              placeholder="Buscar por ID, producto, estado, método de pago..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full"
            />

            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
          </div>

          {/* Results count */}
          {searchTerm && (
            <p className="mt-2 text-sm text-neutral-500">
              {filteredOrders.length} de {orders.length} pedidos encontrados
            </p>
          )}
        </div>

        <div className="space-y-6">
          {currentOrders.map(({ order, items, shipping }) => {
            const statusKey = (
              shipping && shipping.shipping_status in statusConfig
                ? (shipping.shipping_status as ShippingStatus)
                : "draft"
            ) as ShippingStatus
            const statusInfo = statusConfig[statusKey]

            return (
              <Card
                key={order.id}
                className="border-neutral-200 bg-white text-black shadow-sm"
              >
                <CardHeader className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold">
                        Pedido #{order.id}
                      </CardTitle>
                      <p className="mt-1 text-sm text-neutral-600">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <Badge
                      variant={statusInfo.variant}
                      className={cn("w-fit text-sm h-8 select-none", {
                        "bg-blue-500 hover:bg-blue-500":
                          order.collection_status === "approved",
                      })}
                    >
                      {statusInfo.label}
                    </Badge>
                  </div>

                  <Separator className="bg-neutral-200" />
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Products */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">
                      Artículos Pedidos
                    </h3>
                    <div className="space-y-4">
                      {items.map(({ product, orderItem }) => (
                        <div
                          key={orderItem.id}
                          className="flex gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
                        >
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                            <Image
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <h4 className="font-medium leading-tight">
                                  {orderItem.product_name || product.name}
                                </h4>
                                <p className="whitespace-nowrap text-lg font-semibold">
                                  {formatCurrency(
                                    orderItem.unit_price,
                                    order.currency
                                  )}
                                </p>
                              </div>

                              <div className="mt-2 space-y-1 text-sm text-neutral-600">
                                <p>Color: {orderItem.color}</p>
                                <p>Tela: {product.fabric || "N/A"}</p>
                                <p>Talle: {orderItem.size}</p>
                                <p>SKU: {product.sku}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-neutral-200" />

                  {/* Shipping Info */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-3 text-lg font-semibold">
                        Información de Envío
                      </h3>
                      <div className="space-y-2 text-sm text-neutral-800">
                        <p>
                          <span className="text-neutral-600">Método:</span>{" "}
                          {shippingMethodLabels[shipping.shipping_method] ??
                            "Método desconocido"}
                        </p>
                        <p>
                          <span className="text-neutral-600">Dirección:</span>{" "}
                          {shipping.address}
                        </p>
                        <p>
                          <span className="text-neutral-600">Ciudad:</span>{" "}
                          {shipping.city}, {shipping.state}
                        </p>
                        <p>
                          <span className="text-neutral-600">CP:</span>{" "}
                          {shipping.postal_code}
                        </p>
                        {shipping.details && (
                          <p>
                            <span className="text-neutral-600">Detalles:</span>{" "}
                            {shipping.details}
                          </p>
                        )}
                        <p>
                          <span className="text-neutral-600">Teléfono:</span>{" "}
                          {shipping.phone}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-lg font-semibold">
                        Resumen del Pedido
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-neutral-800">
                          <span>Subtotal</span>
                          <span>
                            {formatCurrency(order.subtotal, order.currency)}
                          </span>
                        </div>
                        <div className="flex justify-between text-neutral-800">
                          <span>Envío</span>
                          <span>
                            {formatCurrency(
                              shipping.shipping_cost,
                              order.currency
                            )}
                          </span>
                        </div>
                        <Separator className="bg-neutral-200" />
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span>
                            {formatCurrency(order.total_amount, order.currency)}
                          </span>
                        </div>
                        {order.payment_type && (
                          <p className="mt-3 text-neutral-600">
                            Método de pago:{" "}
                            {order.payment_type === "mercadopago"
                              ? "Mercado Pago"
                              : "Efectivo"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredOrders.length === 0 && (
          <Card className="border-neutral-200 bg-white shadow-sm">
            <CardContent className="py-12 text-center">
              <p className="text-lg text-neutral-600">
                {searchTerm
                  ? "No se encontraron pedidos con ese criterio"
                  : "No tienes pedidos aún"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}

        {/* Pagination Info */}
        {filteredOrders.length > 0 && (
          <div className="mt-4 text-center text-sm text-neutral-500">
            Mostrando {startIndex + 1} -{" "}
            {Math.min(endIndex, filteredOrders.length)} de{" "}
            {filteredOrders.length} pedidos
          </div>
        )}
      </div>
    </section>
  )
}
