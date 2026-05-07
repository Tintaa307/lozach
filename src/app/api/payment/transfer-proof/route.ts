import { NextRequest, NextResponse } from "next/server"
import { PaymentService } from "@/services/payment/payment-service"
import { AppActionException } from "@/types/exceptions"

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "application/pdf",
])

const MAX_SIZE_BYTES = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const externalReference = formData.get("external_reference")
    const file = formData.get("file")

    if (typeof externalReference !== "string" || !externalReference.trim()) {
      return NextResponse.json(
        { success: false, message: "Referencia inválida." },
        { status: 400 }
      )
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Adjuntá el comprobante." },
        { status: 400 }
      )
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, message: "El archivo está vacío." },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: "El archivo supera 10 MB." },
        { status: 400 }
      )
    }

    if (file.type && !ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Formato no permitido. Subí imagen o PDF.",
        },
        { status: 400 }
      )
    }

    const paymentService = new PaymentService()
    const result = await paymentService.uploadBankTransferProof(
      externalReference.trim(),
      file
    )

    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (error) {
    if (error instanceof AppActionException) {
      return NextResponse.json(
        {
          success: false,
          message: error.userMessage || error.message,
        },
        { status: error.statusCode || 400 }
      )
    }

    const message =
      error instanceof Error ? error.message : "Error al subir el comprobante."
    console.error("[transfer-proof:upload]", error)
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    )
  }
}
