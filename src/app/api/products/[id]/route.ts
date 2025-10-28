import { NextRequest, NextResponse } from "next/server"
import {
  deleteProductAction,
  updateProductAction,
} from "@/controllers/admin/admin-products-api-controller"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID de producto inválido" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const result = await updateProductAction(id, body)

    if (result.status === 200) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: result.status || 400 })
    }
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "ID de producto inválido",
        },
        { status: 400 }
      )
    }

    const result = await deleteProductAction(id)

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
