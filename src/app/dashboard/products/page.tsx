import { getUser } from "@/controllers/auth/auth-controller"
import { redirect } from "next/navigation"
import { ProductFormClient } from "@/components/dashboard/ProductFormClient"
import { AdminShell } from "@/components/dashboard/AdminShell"

export default async function DashboardProductsPage() {
  // Verificar autenticación y rol de admin
  const userResult = await getUser()
  if (
    !userResult.success ||
    !userResult.data ||
    userResult.data.role !== "admin"
  ) {
    redirect("/login")
  }

  const user = userResult.data

  const sidebarUser = {
    name: user.name,
    email: user.email,
    avatar: "/avatars/admin.jpg",
  }

  return (
    <AdminShell user={sidebarUser}>
      <ProductFormClient />
    </AdminShell>
  )
}
