import { z } from "zod"

const sizeGuideRow = z
  .array(z.string())
  .min(1, "Cada fila debe tener al menos una celda")

export const CreateSizeGuideSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().nullable().optional(),
    category: z
      .enum(["adult", "child", "unisex"], {
        errorMap: () => ({
          message: "La categoría debe ser 'adult', 'child' o 'unisex'",
        }),
      })
      .nullable()
      .optional(),
    headers: z
      .array(z.string().min(1, "Los encabezados no pueden estar vacíos"))
      .min(2, "Agregá al menos dos columnas (talle + medida)"),
    rows: z
      .array(sizeGuideRow)
      .min(1, "Agregá al menos una fila de medidas"),
    note: z.string().nullable().optional(),
  })
  .superRefine((value, ctx) => {
    const columnCount = value.headers.length
    value.rows.forEach((row, index) => {
      if (row.length !== columnCount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `La fila ${index + 1} debe tener ${columnCount} celdas`,
          path: ["rows", index],
        })
      }
    })
  })

export const UpdateSizeGuideSchema = CreateSizeGuideSchema

export type CreateSizeGuideValues = z.infer<typeof CreateSizeGuideSchema>
export type UpdateSizeGuideValues = z.infer<typeof UpdateSizeGuideSchema>
