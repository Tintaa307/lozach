import { NextRequest, NextResponse } from "next/server"
import { uploadProductImagesAction } from "@/controllers/storage/storage-controller"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const productId = parseInt(formData.get("productId") as string)
    const debugFiles: string[] = []

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: "ID de producto inválido" },
        { status: 400 }
      )
    }

    // Extraer archivos del FormData
    const files: File[] = []
    let index = 0
    while (formData.has(`file_${index}`)) {
      const file = formData.get(`file_${index}`) as File
      if (file) {
        files.push(file)
        debugFiles.push(`${file.name} (${file.type}, ${file.size}b)`)
      }
      index++
    }
    console.log("[API upload-images] productId=", productId, "files=", debugFiles)

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No se proporcionaron archivos" },
        { status: 400 }
      )
    }

    const result = await uploadProductImagesAction(productId, files)
    console.log("[API upload-images] action result", result)

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
