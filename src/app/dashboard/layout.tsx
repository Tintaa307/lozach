import { redirect } from "next/navigation"
import { getUser } from "@/controllers/auth/auth-controller"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get user data
  const userResult = await getUser()

  if (!userResult.success || !userResult.data) {
    return redirect("/login")
  }

  const user = userResult.data

  // Check if user is admin
  if (user.role !== "admin") {
    return redirect("/")
  }

  return <>{children}</>
}
