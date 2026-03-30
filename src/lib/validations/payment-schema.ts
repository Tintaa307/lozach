import { z } from "zod"

const numericString = (label: string) =>
  z
    .string()
    .min(1, `${label} es requerido`)
    .regex(/^\d+$/, `${label} debe contener solo números`)

export const PaymentSchema = z.object({
  identifier: numericString("El DNI"),
  address: z.string().min(1, "La dirección es requerida"),
  details: z.string().min(1, "La casa es requerida"),
  postal_code: numericString("El código postal"),
  city: z.string().min(1, "La ciudad es requerida"),
  state: z.string().min(1, "La provincia es requerida"),
  phone: z.string().min(1, "El teléfono es requerido"),
  shipping_method: z.enum(["home", "express", "store"], {
    errorMap: () => ({ message: "El método de envío es requerido" }),
  }),
  save_info: z.boolean().optional(),
})

export const CreatePreferenceSchema = z.object({
  products: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
      color: z.string(),
      size: z.string(),
    })
  ),
  identifier: numericString("El DNI"),
  address: z.string().min(1, "La dirección es requerida"),
  details: z.string().min(1, "La casa es requerida"),
  postal_code: numericString("El código postal"),
  city: z.string().min(1, "La ciudad es requerida"),
  state: z.string().min(1, "La provincia es requerida"),
  phone: z.string().min(1, "El teléfono es requerido"),
  shipping_method: z.enum(["home", "express", "store"], {
    errorMap: () => ({ message: "El método de envío es requerido" }),
  }),
  shipping_cost: z.enum(["5463", "8200", "Gratis"], {
    errorMap: () => ({ message: "El costo de envío es requerido" }),
  }),
  save_info: z.boolean(),
})
