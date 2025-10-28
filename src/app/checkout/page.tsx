import { getUser } from "@/controllers/auth/auth-controller"
import CheckoutClient from "./CheckoutClient"
import { redirect } from "next/navigation"

export default async function OrderConfirmation() {
  const userResult = await getUser()

  if (!userResult.success || !userResult.data) {
    redirect("/login")
  }

  return <CheckoutClient />
}
