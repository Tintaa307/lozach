import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getUser } from "@/controllers/auth/auth-controller"
import { getProductById } from "@/controllers/products/product-controller"
import { redirect, notFound } from "next/navigation"
import { EditProductFormClient } from "@/components/dashboard/EditProductFormClient"

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
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
  const resolvedParams = await params
  const productId = parseInt(resolvedParams.id)

  if (isNaN(productId)) {
    notFound()
  }

  // Obtener el producto
  const productResult = await getProductById(productId)
  if (!productResult.success || !productResult.data) {
    notFound()
  }

  const product = productResult.data

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
              <EditProductFormClient product={product} />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
