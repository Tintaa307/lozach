"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  const supabase = createClient()
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error signing out:", error)
    } else {
      window.location.reload()
    }
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
