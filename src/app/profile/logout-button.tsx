"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsLoading(true)

      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Error signing out:", error)
        setIsLoading(false)
        return
      }

      // Refrescar el router para limpiar el cache del servidor
      router.refresh()

      // Forzar una recarga completa de la página para limpiar todo el estado
      // y asegurar que el middleware detecte correctamente la ausencia de sesión
      window.location.href = "/login"
    } catch (error) {
      console.error("Error inesperado al cerrar sesión:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={isLoading}
      className="gap-2 self-start sm:self-center"
    >
      <LogOut className="h-4 w-4" />
      <span className="sm:inline">
        {isLoading ? "Cerrando sesión..." : "Cerrar Sesión"}
      </span>
    </Button>
  )
}
