import { getUser } from "@/controllers/auth/auth-controller"
import NavbarClient from "@/components/navbar/Navbar"

export default async function NavbarServer() {
  // Get user data on the server
  const userResult = await getUser()

  // Ensure user is either PublicUser or null, never undefined
  const user = userResult.success && userResult.data ? userResult.data : null

  return <NavbarClient user={user} />
}
