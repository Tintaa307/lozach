import Link from "next/link"
import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  Clock3,
  Mail,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from "@/types/products/types"
import { OrderWithItems } from "@/types/order/order"
import { Subscriber } from "@/repositories/subscribers/subscribers-repository"

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
  })
}

const statusLabels: Record<string, string> = {
  approved: "Aprobada",
  pending: "Pendiente",
  rejected: "Rechazada",
  cancelled: "Cancelada",
}

interface DashboardOverviewClientProps {
  products: Product[]
  orders: OrderWithItems[]
  subscribers: Subscriber[]
}

export function DashboardOverviewClient({
  products,
  orders,
  subscribers,
}: DashboardOverviewClientProps) {
  const approvedOrders = orders.filter(
    (order) => order.collection_status === "approved"
  )
  const pendingOrders = orders.filter(
    (order) => order.collection_status === "pending"
  )
  const missingDescription = products.filter((product) => !product.description)
  const missingCoverImage = products.filter((product) => !product.image_url)
  const reviewStock = products.filter(
    (product) =>
      !product.stock || product.stock.trim().toLowerCase() === "consultar"
  )
  const totalRevenue = approvedOrders.reduce(
    (sum, order) => sum + order.total_amount,
    0
  )

  const recentOrders = orders.slice(0, 5)
  const recentSubscribers = subscribers.slice(0, 5)

  const actions = [
    {
      title: "Ver catálogo",
      description: "Buscar, editar y revisar productos cargados.",
      href: "/dashboard/catalog",
      icon: Package,
    },
    {
      title: "Nuevo producto",
      description: "Cargar una nueva prenda al catálogo.",
      href: "/dashboard/products",
      icon: Plus,
    },
    {
      title: "Controlar ventas",
      description: "Revisar órdenes, pagos y estados de envío.",
      href: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      title: "Ver suscriptores",
      description: "Consultar altas recientes del newsletter.",
      href: "/dashboard/newsletter",
      icon: Mail,
    },
  ]

  const alerts = [
    {
      label: "Órdenes pendientes",
      value: pendingOrders.length,
      helper: "Pagos todavía sin confirmar.",
      href: "/dashboard/orders",
    },
    {
      label: "Productos sin foto principal",
      value: missingCoverImage.length,
      helper: "Afecta conversión y consistencia visual.",
      href: "/dashboard/catalog",
    },
    {
      label: "Productos sin descripción",
      value: missingDescription.length,
      helper: "Conviene completar el copy de venta.",
      href: "/dashboard/catalog",
    },
    {
      label: "Stock a revisar",
      value: reviewStock.length,
      helper: "Marcados como consultar o vacíos.",
      href: "/dashboard/catalog",
    },
  ]

  return (
    <div className="flex flex-col gap-6 py-6 px-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Resumen operativo</h1>
        <p className="text-muted-foreground">
          Vista rápida del estado de la tienda, ventas y catálogo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Productos cargados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Catálogo visible en tienda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Órdenes pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requieren seguimiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos cobrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Suma de órdenes aprobadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Suscriptores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{subscribers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Base actual de newsletter
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {actions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="rounded-xl border p-4 transition-colors hover:bg-muted/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                  <action.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atención operativa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <Link
                key={alert.label}
                href={alert.href}
                className="flex items-start justify-between gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/60"
              >
                <div className="flex items-start gap-3">
                  <CircleAlert className="mt-0.5 h-4 w-4 text-amber-600" />
                  <div>
                    <p className="font-medium">{alert.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.helper}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{alert.value}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Últimas órdenes</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Últimos movimientos registrados
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/orders">
                Ver todas <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl border p-3"
                >
                  <div className="space-y-1">
                    <p className="font-medium">#{order.id.slice(0, 8)}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatDate(order.created_at)}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      {statusLabels[order.collection_status || "pending"] ||
                        order.collection_status ||
                        "Pendiente"}
                    </Badge>
                    <p className="text-sm font-medium mt-2">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Todavía no hay órdenes registradas.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Últimos suscriptores</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Altas recientes del newsletter
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/newsletter">
                Ver lista <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSubscribers.length > 0 ? (
              recentSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex items-center justify-between rounded-xl border p-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{subscriber.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(subscriber.created_at)}
                    </p>
                  </div>
                  <CircleCheck className="h-4 w-4 text-emerald-600" />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Todavía no hay suscriptores registrados.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
