"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Loader2 } from "lucide-react"
import Image from "next/image"
import axios from "axios"
import { NewsletterSubscriptionSchema } from "@/lib/validations/user-schema"
import { z } from "zod"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      NewsletterSubscriptionSchema.parse({ email })

      const response = await axios.post("/api/emails", { email })

      if (response.status !== 200) {
        setError("Hubo un error al suscribirse. Por favor intente nuevamente.")
        return
      }

      if (!response.data) {
        setError("Hubo un error al suscribirse. Por favor intente nuevamente.")
        return
      }

      setIsSuccess(true)
      setEmail("")
      setError(null)
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)

      return
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
        setTimeout(() => {
          setError(null)
        }, 3000)
        return
      }

      setError("Hubo un error al suscribirse. Por favor intente nuevamente.")
      console.error("Subscription error:", err)
      return
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="w-full bg-[#161616] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-wider">NEWSLETTER</p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Suscribite a nuestro newsletter
              </h2>
              <p className="text-gray-400">
                ¿Querés recibir nuestras ofertas? ¡Suscribite y comenzá a
                disfrutarlas!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="lozach@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isSubmitting}
                  className="absolute w-11 right-0 top-0 h-full bg-gray-400/20 hover:bg-transparent"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <ArrowRight className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              {isSuccess && (
                <p className="text-green-400 text-sm">
                  ¡Gracias por suscribirte a nuestro newsletter!
                </p>
              )}
            </form>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative h-64 w-52">
              <Image
                src="/logo-big.png?height=400&width=400"
                alt="Decorative figure"
                fill
                className="object-contain brightness-200 contrast-125 invert"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
