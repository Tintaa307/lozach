import { getUser } from "@/controllers/auth/auth-controller"
import CheckoutClient from "./CheckoutClient"
import { redirect } from "next/navigation"
import { getAddress } from "@/controllers/address/address-controller"

export default async function OrderConfirmation() {
  const userResult = await getUser()

  if (!userResult.success || !userResult.data) {
    redirect("/login")
  }

  // TODO: Traer la dirección del usuario si es que tiene una guardada
  const addressResult = await getAddress(userResult.data.id)

  const address = addressResult.data || null

  return <CheckoutClient address={address} />
}
