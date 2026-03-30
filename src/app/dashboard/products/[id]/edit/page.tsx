import { getUser } from "@/controllers/auth/auth-controller"
import { getProductById } from "@/controllers/products/product-controller"
import { redirect, notFound } from "next/navigation"
import { EditProductFormClient } from "@/components/dashboard/EditProductFormClient"
import { AdminShell } from "@/components/dashboard/AdminShell"

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
    <AdminShell user={sidebarUser}>
      <EditProductFormClient product={product} />
    </AdminShell>
  )
}
