import { redirect } from "next/navigation"

import { getUser } from "@/controllers/auth/auth-controller"
import { getAllSizeGuides } from "@/controllers/admin/admin-size-guides-controller"
import { AdminShell } from "@/components/dashboard/AdminShell"
import { SizeGuidesListClient } from "@/components/dashboard/SizeGuidesListClient"

export default async function DashboardSizeGuidesPage() {
  const userResult = await getUser()
  if (
    !userResult.success ||
    !userResult.data ||
    userResult.data.role !== "admin"
  ) {
    redirect("/login")
  }

  const user = userResult.data
  const result = await getAllSizeGuides()
  const guides = result.success && result.data ? result.data : []

  const sidebarUser = {
    name: user.name,
    email: user.email,
    avatar: "/avatars/admin.jpg",
  }

  return (
    <AdminShell user={sidebarUser}>
      <SizeGuidesListClient guides={guides} />
    </AdminShell>
  )
}
