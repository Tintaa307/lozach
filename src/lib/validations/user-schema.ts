import { z } from "zod"

export const UserSchema = z.object({
  email: z.string().email({ message: "El email no es válido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
})

export const UserLoginSchema = UserSchema.pick({
  email: true,
  password: true,
})

export const NewsletterSubscriptionSchema = z.object({
  email: z.string().email({ message: "El email no es válido" }),
})
