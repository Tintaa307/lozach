"use client"

import type React from "react"

import { useState } from "react"
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
import { Lock } from "lucide-react"

export default function OtpVerification() {
  const [otp, setOtp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate OTP
    if (otp.length !== 6) {
      return
    }

    setIsSubmitting(true)

    try {
      // Here you would verify the OTP with your backend
      console.log("Verifying OTP:", otp)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Handle successful verification
      console.log("OTP verified successfully")
    } catch (error) {
      console.error("Error verifying OTP:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    try {
      // Here you would call your API to resend the code
      console.log("Resending code...")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Code resent successfully")

      // Clear the inputs
      setOtp("")
    } catch (error) {
      console.error("Error resending code:", error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
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
          <form onSubmit={handleSubmit} className="space-y-6">
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
            onClick={handleResendCode}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Reenviar código
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
