import { z } from "zod"

const nullablePositiveNumber = (label: string) =>
  z
    .number({
      invalid_type_error: `${label} debe ser un número`,
    })
    .positive(`${label} debe ser mayor a 0`)
    .nullable()
    .optional()

export const CreateProductSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  stock: z.string().min(1, "El stock es requerido"),
  description: z.string().optional(),
  category: z.enum(["adult", "child"], {
    errorMap: () => ({ message: "La categoría debe ser 'adult' o 'child'" }),
  }),
  color: z.array(z.string()).min(1, "Al menos un color es requerido"),
  fabric: z.string().min(1, "La tela es requerida"),
  price: z.number().positive("El precio debe ser positivo"),
  size: z.object({
    talles: z.array(z.string()).min(1, "Al menos una talla es requerida"),
  }),
  image_url: z.string().url("URL de imagen inválida").optional(),
  shipping_weight_grams: nullablePositiveNumber("El peso"),
  shipping_height_cm: nullablePositiveNumber("El alto"),
  shipping_width_cm: nullablePositiveNumber("El ancho"),
  shipping_length_cm: nullablePositiveNumber("El largo"),
})

export const UpdateProductSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  stock: z.string().min(1, "El stock es requerido").optional(),
  description: z.string().optional(),
  category: z
    .enum(["adult", "child"], {
      errorMap: () => ({ message: "La categoría debe ser 'adult' o 'child'" }),
    })
    .optional(),
  color: z
    .array(z.string())
    .min(1, "Al menos un color es requerido")
    .optional(),
  fabric: z.string().min(1, "La tela es requerida").optional(),
  price: z.number().positive("El precio debe ser positivo").optional(),
  size: z
    .object({
      talles: z.array(z.string()).min(1, "Al menos una talla es requerida"),
    })
    .optional(),
  image_url: z.string().url("URL de imagen inválida").optional(),
  shipping_weight_grams: nullablePositiveNumber("El peso"),
  shipping_height_cm: nullablePositiveNumber("El alto"),
  shipping_width_cm: nullablePositiveNumber("El ancho"),
  shipping_length_cm: nullablePositiveNumber("El largo"),
})

export type CreateProductValues = z.infer<typeof CreateProductSchema>
export type UpdateProductValues = z.infer<typeof UpdateProductSchema>
