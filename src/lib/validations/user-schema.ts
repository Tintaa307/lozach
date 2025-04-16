import { z } from "zod"

export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
})

export const UserLoginSchema = UserSchema.pick({
  email: true,
  password: true,
})

export const NewsletterSubscriptionSchema = z.object({
  email: z.string().email({ message: "El email no es válido" }),
})
