"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error signing out:", error)
    }

    router.push("/login")
  }
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      className="gap-2 self-start sm:self-center"
    >
      <LogOut className="h-4 w-4" />
      <span className="sm:inline">Cerrar Sesión</span>
    </Button>
  )
}
