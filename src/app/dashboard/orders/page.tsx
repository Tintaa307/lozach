import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Eye, CheckCircle, Clock, XCircle } from "lucide-react"

// Mock data para órdenes
const orders = [
  {
    id: "ORD-001",
    customer: "María González",
    email: "maria@email.com",
    total: 45000,
    status: "completed",
    date: "2024-01-15",
    items: 3,
  },
  {
    id: "ORD-002",
    customer: "Carlos López",
    email: "carlos@email.com",
    total: 32000,
    status: "pending",
    date: "2024-01-14",
    items: 2,
  },
  {
    id: "ORD-003",
    customer: "Ana Martínez",
    email: "ana@email.com",
    total: 28000,
    status: "processing",
    date: "2024-01-13",
    items: 1,
  },
  {
    id: "ORD-004",
    customer: "Luis Rodríguez",
    email: "luis@email.com",
    total: 67000,
    status: "cancelled",
    date: "2024-01-12",
    items: 4,
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "processing":
      return <Package className="h-4 w-4 text-blue-500" />
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Completada"
    case "pending":
      return "Pendiente"
    case "processing":
      return "Procesando"
    case "cancelled":
      return "Cancelada"
    default:
      return "Desconocido"
  }
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "completed":
      return "default"
    case "pending":
      return "secondary"
    case "processing":
      return "outline"
    case "cancelled":
      return "destructive"
    default:
      return "secondary"
  }
}

export default function OrdersPage() {
  const sidebarUser = {
    name: "Admin",
    email: "admin@lozach.com",
    avatar: "/avatars/admin.jpg",
  }

  const totalOrders = orders.length
  const completedOrders = orders.filter(o => o.status === "completed").length
  const pendingOrders = orders.filter(o => o.status === "pending").length
  const totalRevenue = orders
    .filter(o => o.status === "completed")
    .reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="min-h-screen w-full">
      <SidebarProvider>
        <AppSidebar variant="inset" user={sidebarUser} />
        <SidebarInset className="flex-1 w-full">
          <SiteHeader />
          <div className="flex flex-1 flex-col w-full">
            <div className="@container/main flex flex-1 flex-col gap-2 w-full">
              <div className="flex flex-col gap-4 py-6 px-6 w-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">Gestión de Órdenes</h1>
                    <p className="text-gray-600">
                      Administra las órdenes de tus clientes
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Órdenes
                      </CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalOrders}</div>
                      <p className="text-xs text-muted-foreground">
                        Todas las órdenes
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Completadas
                      </CardTitle>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{completedOrders}</div>
                      <p className="text-xs text-muted-foreground">
                        Órdenes completadas
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Pendientes
                      </CardTitle>
                      <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{pendingOrders}</div>
                      <p className="text-xs text-muted-foreground">
                        Órdenes pendientes
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Ingresos
                      </CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${totalRevenue.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ingresos totales
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Orders Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lista de Órdenes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">ID</th>
                            <th className="text-left p-2">Cliente</th>
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">Total</th>
                            <th className="text-left p-2">Estado</th>
                            <th className="text-left p-2">Fecha</th>
                            <th className="text-left p-2">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id} className="border-b">
                              <td className="p-2">
                                <span className="font-medium">{order.id}</span>
                              </td>
                              <td className="p-2">
                                <div>
                                  <div className="font-medium">{order.customer}</div>
                                  <div className="text-sm text-gray-500">
                                    {order.items} productos
                                  </div>
                                </div>
                              </td>
                              <td className="p-2">
                                <span className="text-sm">{order.email}</span>
                              </td>
                              <td className="p-2">
                                <span className="font-medium">
                                  ${order.total.toLocaleString()}
                                </span>
                              </td>
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(order.status)}
                                  <Badge variant={getStatusBadgeVariant(order.status)}>
                                    {getStatusText(order.status)}
                                  </Badge>
                                </div>
                              </td>
                              <td className="p-2">
                                <span className="text-sm">{order.date}</span>
                              </td>
                              <td className="p-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {orders.length === 0 && (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No hay órdenes registradas</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
