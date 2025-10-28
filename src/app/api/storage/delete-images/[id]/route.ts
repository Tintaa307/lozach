import { NextRequest, NextResponse } from "next/server"
import { deleteProductImagesAction } from "@/controllers/storage/storage-controller"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: "ID de producto inválido" },
        { status: 400 }
      )
    }

    const result = await deleteProductImagesAction(productId)

    if (result.status === 200) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: result.status || 400 })
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return NextResponse.json(
      { success: false, message: errorMessage || "Error interno del servidor" },
      { status: 500 }
    )
  }
}
