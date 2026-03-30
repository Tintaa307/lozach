import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Calendar } from "lucide-react"
import { getAllSubscribersAction } from "@/controllers/admin/admin-subscribers-api-controller"
import { getUser } from "@/controllers/auth/auth-controller"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/dashboard/AdminShell"

export default async function NewsletterPage() {
  const userResult = await getUser()
  if (
    !userResult.success ||
    !userResult.data ||
    userResult.data.role !== "admin"
  ) {
    redirect("/login")
  }

  const user = userResult.data
  const subscribersResult = await getAllSubscribersAction()
  const subscribers =
    subscribersResult.status === 200 && subscribersResult.data
      ? subscribersResult.data
      : []

  const totalSubscribers = subscribers.length

  const sidebarUser = {
    name: user.name,
    email: user.email,
    avatar: "/avatars/admin.jpg",
  }

  return (
    <AdminShell user={sidebarUser}>
      <div className="flex flex-col gap-4 py-6 px-6 w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Newsletter</h1>
            <p className="text-gray-600">
              Gestiona los suscriptores de tu newsletter
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Último suscriptor
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subscribers.length > 0
                  ? new Date(subscribers[0].created_at).toLocaleDateString(
                      "es-AR"
                    )
                  : "-"}
              </div>
              <p className="text-xs text-muted-foreground">
                Fecha de registro más reciente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Subscribers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Suscriptores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Fecha de registro</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="border-b">
                      <td className="p-2">
                        <span className="font-medium">{subscriber.email}</span>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(subscriber.created_at).toLocaleDateString(
                              "es-AR"
                            )}
                          </span>
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
    </AdminShell>
  )
}
