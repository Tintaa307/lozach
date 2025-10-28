import { getUser } from "@/controllers/auth/auth-controller"
import CheckoutClient from "./CheckoutClient"
import { redirect } from "next/navigation"

export default async function OrderConfirmation() {
  const userResult = await getUser()

  if (!userResult.success || !userResult.data) {
    redirect("/login")
  }

  // TODO: Traer la dirección del usuario si es que tiene una guardada

  return <CheckoutClient />
}
