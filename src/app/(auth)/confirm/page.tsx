"use client"

import { type FormEvent, Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { CheckCircle2, Lock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

const OtpVerificationContent = () => {
  const [otp, setOtp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const router = useRouter()
  const email = useSearchParams().get("email")
  const supabase = createClient()

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        email: email as string,
        token: otp,
        type: "email",
      })

      if (error) {
        console.log(error)
        return toast.warning("A ocurrido un error, por favor intenta de nuevo.")
      }

      if (session) {
        setIsVerified(true)
        return toast.success("Tu cuenta ha sido confirmada exitosamente.")
      }
    } catch (error) {
      console.log(error)
      return toast.warning("A ocurrido un error, por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinue = () => {
    router.push("/login")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {isVerified ? (
        <Card className="w-full max-w-md border border-gray-200">
          <CardHeader className="flex flex-col items-center space-y-3">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle>¡Verificación Exitosa!</CardTitle>
            <CardDescription className="text-center">
              Tu cuenta ha sido verificada correctamente. Ahora puedes acceder a
              todas las funcionalidades de nuestra plataforma.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600">
                Hemos enviado una confirmación a{" "}
                <span className="font-medium">{email}</span>
              </p>
            </div>

            <Button
              onClick={handleContinue}
              className="w-full bg-black hover:bg-black/90 h-11"
            >
              Continuar al inicio de sesión
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md border border-gray-200">
          <CardHeader className="flex flex-col items-center space-y-3">
            <div className="flex items-center justify-center w-12 h-12 bg-black rounded-full">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Verificación</CardTitle>
            <CardDescription>
              Ingrese el código de 6 dígitos enviado a su correo
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="size-12" />
                    <InputOTPSlot index={1} className="size-12" />
                    <InputOTPSlot index={2} className="size-12" />
                    <InputOTPSlot index={3} className="size-12" />
                    <InputOTPSlot index={4} className="size-12" />
                    <InputOTPSlot index={5} className="size-12" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                type="submit"
                className="w-full bg-black hover:bg-black/90 h-11"
                disabled={isSubmitting || otp.length !== 6}
              >
                {isSubmitting ? "Verificando..." : "Confirmar"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reenviar código
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

export default function OtpVerification() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <OtpVerificationContent />
    </Suspense>
  )
}
