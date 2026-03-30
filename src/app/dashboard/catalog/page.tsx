import { getAllProductsAction } from "@/controllers/admin/admin-products-api-controller"
import { getUser } from "@/controllers/auth/auth-controller"
import { redirect } from "next/navigation"
import { DashboardClient } from "@/components/dashboard/DashboardClient"
import { AdminShell } from "@/components/dashboard/AdminShell"

interface DashboardCatalogPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function DashboardCatalogPage({
  searchParams,
}: DashboardCatalogPageProps) {
  const userResult = await getUser()
  if (
    !userResult.success ||
    !userResult.data ||
    userResult.data.role !== "admin"
  ) {
    redirect("/login")
  }

  const user = userResult.data
  const resolvedSearchParams = await searchParams
  const currentPage = parseInt(resolvedSearchParams.page || "1")
  const itemsPerPage = 12

  const productsResult = await getAllProductsAction()
  const allProducts =
    productsResult.status === 200 && productsResult.data
      ? productsResult.data
      : []

  const sidebarUser = {
    name: user.name,
    email: user.email,
    avatar: "/avatars/admin.jpg",
  }

  return (
    <AdminShell user={sidebarUser}>
      <DashboardClient
        allProducts={allProducts}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        basePath="/dashboard/catalog"
      />
    </AdminShell>
  )
}
