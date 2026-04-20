import { CorreoArgentinoService } from "@/services/shipping/correo-argentino-service"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const service = new CorreoArgentinoService()

const schema = z.object({
  products: z
    .array(
      z.object({
        id: z.number().optional(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  postalCode: z.string().trim().regex(/^\d{4,8}$/),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Datos inválidos para cotizar retiro en sucursal.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const quote = await service.quoteShipping({
      deliveryMethod: "branch",
      destinationPostalCode: parsed.data.postalCode,
      items: parsed.data.products,
    })

    return NextResponse.json(quote)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "No se pudo cotizar el retiro en sucursal.",
      },
      { status: 500 }
    )
  }
}
