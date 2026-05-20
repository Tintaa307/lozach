import { notFound, redirect } from "next/navigation"

import { getUser } from "@/controllers/auth/auth-controller"
import { getSizeGuideById } from "@/controllers/admin/admin-size-guides-controller"
import { AdminShell } from "@/components/dashboard/AdminShell"
import { SizeGuideEditor } from "@/components/dashboard/SizeGuideEditor"

interface EditSizeGuidePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditSizeGuidePage({
  params,
}: EditSizeGuidePageProps) {
  const userResult = await getUser()
  if (
    !userResult.success ||
    !userResult.data ||
    userResult.data.role !== "admin"
  ) {
    redirect("/login")
  }

  const resolvedParams = await params
  const guideId = parseInt(resolvedParams.id, 10)
  if (Number.isNaN(guideId)) {
    notFound()
  }

  const result = await getSizeGuideById(guideId)
  if (!result.success || !result.data) {
    notFound()
  }

  const user = userResult.data

  const sidebarUser = {
    name: user.name,
    email: user.email,
    avatar: "/avatars/admin.jpg",
  }

  return (
    <AdminShell user={sidebarUser}>
      <SizeGuideEditor mode="edit" guide={result.data} />
    </AdminShell>
  )
}
