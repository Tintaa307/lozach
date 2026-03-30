import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ShoppingBag,
  CircleCheck,
  Clock,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react"
import { getAllOrdersAction } from "@/controllers/admin/admin-orders-api-controller"
import { getUser } from "@/controllers/auth/auth-controller"
import { redirect } from "next/navigation"
import { OrdersTableClient } from "@/components/dashboard/OrdersTableClient"
import { AdminShell } from "@/components/dashboard/AdminShell"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function OrdersPage() {
  const userResult = await getUser()
  if (
    !userResult.success ||
    !userResult.data ||
    userResult.data.role !== "admin"
  ) {
    redirect("/login")
  }

  const user = userResult.data
  const ordersResult = await getAllOrdersAction()
  const orders =
    ordersResult.status === 200 && ordersResult.data ? ordersResult.data : []

  const totalOrders = orders.length
  const approvedOrders = orders.filter(
    (o) => o.collection_status === "approved"
  ).length
  const pendingOrders = orders.filter(
    (o) => o.collection_status === "pending"
  ).length
  const totalRevenue = orders
    .filter((o) => o.collection_status === "approved")
    .reduce((sum, order) => sum + order.total_amount, 0)

  const approvedRate =
    totalOrders > 0 ? Math.round((approvedOrders / totalOrders) * 100) : 0

  const sidebarUser = {
    name: user.name,
    email: user.email,
    avatar: "/avatars/admin.jpg",
  }

  return (
    <AdminShell user={sidebarUser}>
      <div className="flex flex-col gap-6 py-6 px-6 w-full">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ventas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Seguimiento y gestión de las órdenes de tu tienda
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Órdenes
              </CardTitle>
              <div className="rounded-lg bg-muted p-2">
                <ShoppingBag className="h-4 w-4 text-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {totalOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {approvedRate}% tasa de aprobación
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aprobadas
              </CardTitle>
              <div className="rounded-lg bg-emerald-100 dark:bg-emerald-950/50 p-2">
                <CircleCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {approvedOrders}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                <p className="text-xs text-emerald-600 font-medium">
                  Pagos confirmados
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendientes
              </CardTitle>
              <div className="rounded-lg bg-amber-100 dark:bg-amber-950/50 p-2">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {pendingOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Esperando confirmación
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingresos
              </CardTitle>
              <div className="rounded-lg bg-muted p-2">
                <TrendingUp className="h-4 w-4 text-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {formatCurrency(totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                De órdenes aprobadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Órdenes recientes</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {totalOrders} órdenes en total — Hacé click en una orden para
                  ver el detalle
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <OrdersTableClient orders={orders} />
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
