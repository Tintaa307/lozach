import { NextRequest, NextResponse } from "next/server"
import { createProductAction } from "@/controllers/admin/admin-products-api-controller"
import { CreateProductValues } from "@/types/products/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const values: CreateProductValues = body

    const result = await createProductAction(values)

    if (result.status === 200) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: result.status || 400 })
    }
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message:
          error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    )
  }
}
