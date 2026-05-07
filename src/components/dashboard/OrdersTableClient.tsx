"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CircleCheck,
  Clock,
  CircleX,
  CreditCard,
  CalendarDays,
  Loader,
  ChevronDown,
  Package,
  Palette,
  Ruler,
  ShoppingBag,
  FileText,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"
import { OrderWithItems } from "@/types/order/order"
import {
  BANK_TRANSFER_PAYMENT_TYPE,
  getPaymentTypeLabel,
} from "@/lib/utils/payment-utils"
import {
  approveBankTransferOrder,
  rejectBankTransferOrder,
} from "@/controllers/admin/admin-transfer-controller"
import { useRouter } from "next/navigation"

const statusConfig: Record<
  string,
  {
    label: string
    icon: React.ReactNode
    className: string
  }
> = {
  approved: {
    label: "Aprobada",
    icon: <CircleCheck className="h-3.5 w-3.5" />,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
  },
  pending: {
    label: "Pendiente",
    icon: <Clock className="h-3.5 w-3.5" />,
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
  },
  in_process: {
    label: "En proceso",
    icon: <Loader className="h-3.5 w-3.5" />,
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
  },
  cancelled: {
    label: "Cancelada",
    icon: <CircleX className="h-3.5 w-3.5" />,
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800",
  },
  rejected: {
    label: "Rechazada",
    icon: <CircleX className="h-3.5 w-3.5" />,
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800",
  },
}

function getStatus(status: string) {
  return (
    statusConfig[status] || {
      label: status,
      icon: <Clock className="h-3.5 w-3.5" />,
      className: "bg-muted text-muted-foreground",
    }
  )
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

interface OrdersTableClientProps {
  orders: OrderWithItems[]
}

type ReviewState = "idle" | "approving" | "rejecting"

export function OrdersTableClient({ orders }: OrdersTableClientProps) {
  const router = useRouter()
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [reviewState, setReviewState] = useState<
    Record<string, ReviewState>
  >({})
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({})

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId))
  }

  const setOrderReviewState = (orderId: string, value: ReviewState) => {
    setReviewState((prev) => ({ ...prev, [orderId]: value }))
  }

  const handleApprove = async (orderId: string) => {
    setOrderReviewState(orderId, "approving")
    try {
      const result = await approveBankTransferOrder(orderId)
      if (result.success) {
        toast.success("Orden aprobada. Se envió el email al cliente.")
        router.refresh()
      } else {
        toast.error(result.message || "No se pudo aprobar la orden.")
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado."
      toast.error(message)
    } finally {
      setOrderReviewState(orderId, "idle")
    }
  }

  const handleReject = async (orderId: string) => {
    const reason = rejectReason[orderId]?.trim() || undefined
    setOrderReviewState(orderId, "rejecting")
    try {
      const result = await rejectBankTransferOrder(orderId, reason)
      if (result.success) {
        toast.success("Comprobante rechazado. Se notificó al cliente.")
        setRejectReason((prev) => ({ ...prev, [orderId]: "" }))
        router.refresh()
      } else {
        toast.error(result.message || "No se pudo rechazar el comprobante.")
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado."
      toast.error(message)
    } finally {
      setOrderReviewState(orderId, "idle")
    }
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">No hay órdenes todavía</p>
        <p className="text-sm text-muted-foreground mt-1">
          Las órdenes aparecerán acá cuando tus clientes realicen compras
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="pl-6 w-[50px]" />
          <TableHead className="w-[100px]">Orden</TableHead>
          <TableHead>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              Fecha
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              Pago
            </div>
          </TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right pr-6">Monto</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const status = getStatus(order.collection_status || "pending")
          const isExpanded = expandedOrderId === order.id
          const itemCount = order.order_items?.length || 0
          const shipping = Array.isArray(order.shipping)
            ? order.shipping[0]
            : undefined
          const shippingAmount = shipping?.shipping_cost || 0
          const discountAmount = Math.max(
            0,
            order.subtotal + shippingAmount - order.total_amount
          )

          return (
            <>
              <TableRow
                key={order.id}
                className="cursor-pointer"
                onClick={() => toggleExpand(order.id)}
              >
                <TableCell className="pl-6 w-[50px]">
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-medium">
                      {order.id.slice(0, 8)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {itemCount} {itemCount === 1 ? "producto" : "productos"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {formatDate(order.created_at)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(order.created_at)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {order.payment_type ? (
                    <Badge
                      variant="outline"
                      className="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800 gap-1.5 font-medium capitalize"
                    >
                      <CreditCard className="h-3 w-3" />
                      {getPaymentTypeLabel(order.payment_type)}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`gap-1.5 font-medium ${status.className}`}
                  >
                    {status.icon}
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6 font-semibold tabular-nums">
                  {formatCurrency(order.total_amount)}
                </TableCell>
              </TableRow>

              {isExpanded && (
                <TableRow
                  key={`${order.id}-detail`}
                  className="hover:bg-transparent bg-muted/30"
                >
                  <TableCell colSpan={6} className="p-0">
                    <div className="px-6 py-4 border-t border-dashed">
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Detalle de la orden
                        </span>
                      </div>

                      {order.order_items && order.order_items.length > 0 ? (
                        <div className="space-y-2">
                          {order.order_items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between rounded-lg border bg-background px-4 py-3"
                            >
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium">
                                  {item.product_name}
                                </span>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  {item.color && (
                                    <span className="flex items-center gap-1">
                                      <Palette className="h-3 w-3" />
                                      {item.color}
                                    </span>
                                  )}
                                  {item.size && (
                                    <span className="flex items-center gap-1">
                                      <Ruler className="h-3 w-3" />
                                      Talle {item.size}
                                    </span>
                                  )}
                                  {item.sku && (
                                    <span className="font-mono">
                                      SKU: {item.sku}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-6 text-sm">
                                <div className="text-right">
                                  <span className="text-muted-foreground">
                                    {item.quantity} x{" "}
                                  </span>
                                  <span className="tabular-nums">
                                    {formatCurrency(item.unit_price)}
                                  </span>
                                </div>
                                <span className="font-semibold tabular-nums min-w-[80px] text-right">
                                  {formatCurrency(
                                    item.unit_price * item.quantity
                                  )}
                                </span>
                              </div>
                            </div>
                          ))}

                          {/* Totals */}
                          <div className="flex justify-end pt-2 pr-4">
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between gap-8">
                                <span className="text-muted-foreground">
                                  Subtotal
                                </span>
                                <span className="tabular-nums">
                                  {formatCurrency(order.subtotal)}
                                </span>
                              </div>
                              <div className="flex justify-between gap-8">
                                <span className="text-muted-foreground">
                                  Envío
                                </span>
                                <span className="tabular-nums">
                                  {formatCurrency(shippingAmount)}
                                </span>
                              </div>
                              {discountAmount > 0 && (
                                <div className="flex justify-between gap-8 text-emerald-700">
                                  <span>Descuento transferencia</span>
                                  <span className="tabular-nums">
                                    -{formatCurrency(discountAmount)}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between gap-8 border-t pt-1 font-semibold">
                                <span>Total</span>
                                <span className="tabular-nums">
                                  {formatCurrency(order.total_amount)}
                                </span>
                              </div>
                              <div className="flex justify-between gap-8 pt-2">
                                <span className="text-muted-foreground">
                                  Email cliente
                                </span>
                                <span>
                                  {order.email_sent ? "Enviado" : "Pendiente"}
                                </span>
                              </div>
                              <div className="flex justify-between gap-8">
                                <span className="text-muted-foreground">
                                  Procesada
                                </span>
                                <span>
                                  {order.processed_at
                                    ? formatDate(order.processed_at)
                                    : "No"}
                                </span>
                              </div>
                              <div className="flex justify-between gap-8">
                                <span className="text-muted-foreground">
                                  Estado envío
                                </span>
                                <span>
                                  {shipping?.shipping_status || "Sin registro"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground py-2">
                          No hay productos registrados para esta orden
                        </p>
                      )}

                      {order.payment_type === BANK_TRANSFER_PAYMENT_TYPE && (
                        <div className="mt-6 rounded-lg border bg-background p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              Comprobante de transferencia
                            </span>
                            {order.payment_proof_status && (
                              <Badge
                                variant="outline"
                                className={`gap-1.5 font-medium ${
                                  order.payment_proof_status === "approved"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : order.payment_proof_status === "rejected"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                {order.payment_proof_status === "approved"
                                  ? "Aprobado"
                                  : order.payment_proof_status === "rejected"
                                    ? "Rechazado"
                                    : "Pendiente de revisión"}
                              </Badge>
                            )}
                          </div>

                          {order.payment_proof_url ? (
                            <>
                              <div className="grid gap-3 sm:grid-cols-[160px_1fr] items-start">
                                <div className="rounded-md overflow-hidden border bg-muted aspect-square flex items-center justify-center">
                                  {/\.pdf$/i.test(
                                    order.payment_proof_url
                                  ) ? (
                                    <FileText className="h-10 w-10 text-muted-foreground" />
                                  ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={order.payment_proof_url}
                                      alt="Comprobante de transferencia"
                                      className="object-cover w-full h-full"
                                    />
                                  )}
                                </div>
                                <div className="space-y-2 text-sm">
                                  <a
                                    href={order.payment_proof_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                  >
                                    Abrir comprobante
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                  {order.payment_proof_uploaded_at && (
                                    <p className="text-xs text-muted-foreground">
                                      Subido el{" "}
                                      {formatDate(
                                        order.payment_proof_uploaded_at
                                      )}{" "}
                                      a las{" "}
                                      {formatTime(
                                        order.payment_proof_uploaded_at
                                      )}
                                    </p>
                                  )}
                                  {order.payment_proof_rejection_reason &&
                                    order.payment_proof_status === "rejected" && (
                                      <p className="text-xs text-red-600">
                                        Motivo previo:{" "}
                                        {order.payment_proof_rejection_reason}
                                      </p>
                                    )}
                                </div>
                              </div>

                              {order.payment_proof_status !== "approved" && (
                                <div className="space-y-2 pt-1">
                                  <textarea
                                    placeholder="Motivo del rechazo (opcional, se envía al cliente)"
                                    value={rejectReason[order.id] || ""}
                                    onChange={(e) =>
                                      setRejectReason((prev) => ({
                                        ...prev,
                                        [order.id]: e.target.value,
                                      }))
                                    }
                                    className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 resize-none min-h-[60px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    disabled={
                                      reviewState[order.id] !== undefined &&
                                      reviewState[order.id] !== "idle"
                                    }
                                  />
                                  <div className="flex gap-2 flex-wrap">
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => handleApprove(order.id)}
                                      disabled={
                                        reviewState[order.id] !== undefined &&
                                        reviewState[order.id] !== "idle"
                                      }
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                      {reviewState[order.id] === "approving" ? (
                                        <span className="flex items-center gap-1">
                                          Aprobando
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1">
                                          <CircleCheck className="h-3.5 w-3.5" />
                                          Aprobar pago
                                        </span>
                                      )}
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleReject(order.id)}
                                      disabled={
                                        reviewState[order.id] !== undefined &&
                                        reviewState[order.id] !== "idle"
                                      }
                                    >
                                      {reviewState[order.id] === "rejecting" ? (
                                        <span className="flex items-center gap-1">
                                          Rechazando
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1">
                                          <CircleX className="h-3.5 w-3.5" />
                                          Rechazar
                                        </span>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              El cliente todavía no subió el comprobante.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          )
        })}
      </TableBody>
    </Table>
  )
}
