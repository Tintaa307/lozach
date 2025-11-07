import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getAllProductsAction } from "@/controllers/admin/admin-products-api-controller"
import { getUser } from "@/controllers/auth/auth-controller"
import { redirect } from "next/navigation"
import { DashboardClient } from "@/components/dashboard/DashboardClient"

interface DashboardPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
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
  const resolvedSearchParams = await searchParams
  const currentPage = parseInt(resolvedSearchParams.page || "1")
  const itemsPerPage = 12

  // Obtener todos los productos
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
    <div className="min-h-screen w-full">
      <SidebarProvider>
        <AppSidebar variant="inset" user={sidebarUser} />
        <SidebarInset className="flex-1 w-full">
          <SiteHeader />
          <div className="flex flex-1 flex-col w-full">
            <div className="@container/main flex flex-1 flex-col gap-2 w-full">
              <DashboardClient
                allProducts={allProducts}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
