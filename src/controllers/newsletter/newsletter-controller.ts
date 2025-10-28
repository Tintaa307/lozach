"use server"

import { NewsletterSubscriptionSchema } from "@/lib/validations/user-schema"
import { FormState } from "@/types/types"
import axios from "axios"
import { z } from "zod"
import { SubscribersService } from "@/services/subscribers/subscribers-service"
import { actionHandler } from "@/lib/handlers/actionHandler"

const subscribersService = new SubscribersService()

export const newsletterSubscription = async (
  prevState: FormState,
  formData: FormData
) => {
  try {
    const email = formData.get("email") as string

    const validatedData = NewsletterSubscriptionSchema.safeParse({ email })

    if (!validatedData.success) {
      return {
        error: validatedData.error.errors[0].message,
      }
    }

    // Crear suscriptor usando el service
    const createSubscriberResult = await actionHandler(async () => {
      return await subscribersService.createSubscriber(email)
    })

    if (!createSubscriberResult.success) {
      return {
        error: createSubscriberResult.message || "Error al crear el suscriptor",
      }
    }

    // Enviar email de confirmación
    try {
      const response = await axios.post("/api/emails", { email })

      if (response.status !== 200) {
        return {
          error:
            "Hubo un error al enviar el email de confirmación. Por favor intente nuevamente.",
        }
      }
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      // No retornamos error aquí porque el suscriptor ya se creó exitosamente
    }

    return {
      success: true,
      message: "Te has suscrito correctamente a nuestro newsletter.",
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        error: err.errors[0].message,
      }
    }

    console.error("Newsletter subscription error:", err)
    return {
      error: "Hubo un error al suscribirse. Por favor intente nuevamente.",
    }
  }
}
