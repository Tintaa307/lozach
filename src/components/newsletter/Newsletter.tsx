"use client"

import type React from "react"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Loader2 } from "lucide-react"
import Image from "next/image"
import { FormState } from "@/types/types"
import { newsletterSubscription } from "@/controllers/newsletter/newsletter-controller"

export default function Newsletter() {
  const [currentState, formAction, isPending] = useActionState<
    FormState,
    FormData
  >(newsletterSubscription, {})

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

            <form action={formAction} className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="lozach@example.com"
                  name="email"
                  className="h-11"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isPending}
                  className="absolute w-11 right-0 top-0 h-full bg-gray-400/20 hover:bg-transparent"
                >
                  {isPending ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <ArrowRight className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {currentState.error && (
                <p className="text-red-400 text-sm">{currentState.error}</p>
              )}

              {currentState.success && (
                <p className="text-green-400 text-sm">{currentState.message}</p>
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
