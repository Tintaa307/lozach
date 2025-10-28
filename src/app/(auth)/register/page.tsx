"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, User, Loader2 } from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { createUser } from "@/controllers/auth/auth-controller"

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      return false
    }
    if (password.length < 8) {
      return false
    }
    return true
  }

  const supabase = createClient()

  const handleSubmitWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://lozachurban.store/auth/callback",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        console.log(error)
        return
      }

      return
    } catch (error) {
      console.log(error)

      return
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (validatePasswords() === false) {
        return toast.error("Las contraseñas no coinciden")
      }

      const values = {
        name: name,
        email: email,
        password: password,
      }

      const response = await createUser(values)

      if (!response.success) {
        setIsLoading(false)
        if (response.fieldErrors) {
          Object.values(response.fieldErrors)
            .flat()
            .forEach((error) => toast.error(error))
        } else {
          toast.error(response.message || "Error al crear la cuenta")
        }
        return
      }

      setIsLoading(false)
      toast.success("Cuenta creada correctamente")
      return router.push(`/confirm?email=${values.email}`)
    } catch (error) {
      console.error(error)
      toast.error("Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex text-center items-center flex-col space-y-6">
          <Image
            src="/logo-big.png"
            alt="Lozach logo"
            width={200}
            height={80}
            priority
          />
          <p className="text-base text-gray-600">Accede a tu cuenta</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name field */}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs uppercase font-medium">
                NOMBRE COMPLETO
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="name"
                  type="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase font-medium">
                Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs uppercase font-medium"
              >
                Contraseña
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Confirm password field */}

            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-xs uppercase font-medium"
              >
                CONFIRMAR CONTRASEÑA
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Login button */}
          <Button
            type="submit"
            className="w-full bg-black hover:bg-black/90 text-white"
          >
            {isLoading ? (
              <Loader2 className="animate-spin size-5 text-white" />
            ) : (
              "CREAR CUENTA"
            )}
          </Button>

          {/* Social login */}
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex-grow h-px bg-gray-200"></div>
              <div className="px-4 text-xs text-gray-500">o</div>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>

            <div className="grid grid-cols- gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={handleSubmitWithGoogle}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path
                      fill="#4285F4"
                      d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                    />
                  </g>
                </svg>
                Google
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/register" className="text-black underline text-sm">
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
