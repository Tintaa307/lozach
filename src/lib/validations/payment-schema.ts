import { z } from "zod"

const numericString = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} es requerido`)
    .regex(/^\d+$/, `${label} debe contener solo números`)

const shippingMethodSchema = z.enum(["home", "branch", "store"], {
  errorMap: () => ({ message: "El método de envío es requerido" }),
})

const basePaymentSchema = z.object({
  identifier: numericString("El DNI"),
  address: z.string().trim().optional().default(""),
  details: z.string().trim().optional().default(""),
  postal_code: z.string().trim().optional().default(""),
  city: z.string().trim().optional().default(""),
  state: z.string().trim().optional().default(""),
  phone: z.string().trim().min(1, "El teléfono es requerido"),
  shipping_method: shippingMethodSchema,
  agency_code: z.string().trim().optional(),
  agency_name: z.string().trim().optional(),
  agency_address: z.string().trim().optional(),
  save_info: z.boolean().optional(),
})

const withShippingRefinements = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((data, ctx) => {
    if (data.shipping_method !== "store") {
      if (!data.address) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["address"],
          message: "La dirección es requerida",
        })
      }

      if (!data.postal_code || !/^\d+$/.test(data.postal_code)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["postal_code"],
          message: "El código postal debe contener solo números",
        })
      }

      if (!data.city) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["city"],
          message: "La ciudad es requerida",
        })
      }

      if (!data.state) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["state"],
          message: "La provincia es requerida",
        })
      }
    }

    if (data.shipping_method === "branch" && !data.agency_code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["agency_code"],
        message: "Seleccioná una sucursal de Correo Argentino",
      })
    }
  })

export const PaymentSchema = withShippingRefinements(basePaymentSchema)

export const CreatePreferenceSchema = withShippingRefinements(
  basePaymentSchema.extend({
    products: z
      .array(
        z.object({
          id: z.number(),
          quantity: z.number().int().positive("La cantidad debe ser mayor a 0"),
          color: z.string().min(1, "El color es requerido"),
          size: z.string().min(1, "El talle es requerido"),
        })
      )
      .min(1, "El carrito no puede estar vacío"),
    shipping_cost: z
      .number({
        invalid_type_error: "El costo de envío es inválido",
      })
      .min(0, "El costo de envío no puede ser negativo"),
    save_info: z.boolean(),
  })
)
