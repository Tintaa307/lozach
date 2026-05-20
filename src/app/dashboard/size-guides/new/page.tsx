import { redirect } from "next/navigation"

import { getUser } from "@/controllers/auth/auth-controller"
import { AdminShell } from "@/components/dashboard/AdminShell"
import { SizeGuideEditor } from "@/components/dashboard/SizeGuideEditor"

export default async function NewSizeGuidePage() {
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
      <SizeGuideEditor mode="create" />
    </AdminShell>
  )
}
