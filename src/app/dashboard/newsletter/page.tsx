import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Search, User, Calendar, Send } from "lucide-react"

// Mock data para suscriptores del newsletter
const subscribers = [
  {
    id: 1,
    email: "maria.gonzalez@email.com",
    name: "María González",
    subscribedAt: "2024-01-15",
    status: "active",
    source: "Website",
  },
  {
    id: 2,
    email: "carlos.lopez@email.com",
    name: "Carlos López",
    subscribedAt: "2024-01-14",
    status: "active",
    source: "Social Media",
  },
  {
    id: 3,
    email: "ana.martinez@email.com",
    name: "Ana Martínez",
    subscribedAt: "2024-01-13",
    status: "unsubscribed",
    source: "Website",
  },
  {
    id: 4,
    email: "luis.rodriguez@email.com",
    name: "Luis Rodríguez",
    subscribedAt: "2024-01-12",
    status: "active",
    source: "Referral",
  },
  {
    id: 5,
    email: "sofia.hernandez@email.com",
    name: "Sofía Hernández",
    subscribedAt: "2024-01-11",
    status: "active",
    source: "Website",
  },
]

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "active":
      return "default"
    case "unsubscribed":
      return "destructive"
    default:
      return "secondary"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "Activo"
    case "unsubscribed":
      return "Desuscrito"
    default:
      return "Desconocido"
  }
}

export default function NewsletterPage() {
  const sidebarUser = {
    name: "Admin",
    email: "admin@lozach.com",
    avatar: "/avatars/admin.jpg",
  }

  const totalSubscribers = subscribers.length
  const activeSubscribers = subscribers.filter(s => s.status === "active").length
  const unsubscribedSubscribers = subscribers.filter(s => s.status === "unsubscribed").length
  const websiteSubscribers = subscribers.filter(s => s.source === "Website").length

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
                    <h1 className="text-3xl font-bold">Newsletter</h1>
                    <p className="text-gray-600">
                      Gestiona los suscriptores de tu newsletter
                    </p>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Enviar Newsletter
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Suscriptores
                      </CardTitle>
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalSubscribers}</div>
                      <p className="text-xs text-muted-foreground">
                        Todos los suscriptores
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Activos
                      </CardTitle>
                      <User className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{activeSubscribers}</div>
                      <p className="text-xs text-muted-foreground">
                        Suscriptores activos
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Desuscritos
                      </CardTitle>
                      <Mail className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{unsubscribedSubscribers}</div>
                      <p className="text-xs text-muted-foreground">
                        Se desuscribieron
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Desde Website
                      </CardTitle>
                      <User className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{websiteSubscribers}</div>
                      <p className="text-xs text-muted-foreground">
                        Suscripciones web
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Search and Filters */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Lista de Suscriptores</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar suscriptores..."
                            className="pl-8 w-64"
                          />
                        </div>
                        <Button variant="outline">Filtrar</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">Nombre</th>
                            <th className="text-left p-2">Estado</th>
                            <th className="text-left p-2">Fuente</th>
                            <th className="text-left p-2">Fecha</th>
                            <th className="text-left p-2">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscribers.map((subscriber) => (
                            <tr key={subscriber.id} className="border-b">
                              <td className="p-2">
                                <span className="font-medium">{subscriber.email}</span>
                              </td>
                              <td className="p-2">
                                <span>{subscriber.name}</span>
                              </td>
                              <td className="p-2">
                                <Badge variant={getStatusBadgeVariant(subscriber.status)}>
                                  {getStatusText(subscriber.status)}
                                </Badge>
                              </td>
                              <td className="p-2">
                                <span className="text-sm">{subscriber.source}</span>
                              </td>
                              <td className="p-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{subscriber.subscribedAt}</span>
                                </div>
                              </td>
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm">
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <User className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {subscribers.length === 0 && (
                      <div className="text-center py-8">
                        <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No hay suscriptores registrados</p>
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
