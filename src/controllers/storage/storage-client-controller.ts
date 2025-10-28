"use client"

import { createClient } from "@/lib/supabase/client"
import { ApiResponse } from "@/types/base/types"

export async function uploadProductImagesClientAction(
  productId: number,
  files: File[]
): Promise<ApiResponse<{ image_url: string | null; images_urls: string[] }>> {
  try {
    console.log("[uploadProductImagesClientAction] start", { productId, files: files.map(f => ({ name: f.name, type: f.type, size: f.size })) })
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        status: 401,
        error: "Usuario no autenticado",
      }
    }

    // Crear FormData para enviar archivos
    const formData = new FormData()
    formData.append("productId", productId.toString())

    files.forEach((file, index) => {
      formData.append(`file_${index}`, file)
    })

    // Llamar al endpoint de la API
    const response = await fetch("/api/storage/upload-images", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()
    console.log("[uploadProductImagesClientAction] api response", { ok: response.ok, status: response.status, result })

    if (!response.ok) {
      return {
        status: 500,
        error: result.message || "Error al subir las imágenes",
      }
    }

    return {
      status: 200,
      data: result.data,
      message: "Imágenes subidas exitosamente",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage || "Error al subir las imágenes",
    }
  }
}

export async function deleteProductImagesClientAction(
  productId: number
): Promise<ApiResponse<void>> {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        status: 401,
        error: "Usuario no autenticado",
      }
    }

    // Llamar al endpoint de la API
    const response = await fetch(`/api/storage/delete-images/${productId}`, {
      method: "DELETE",
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        status: 500,
        error: result.message || "Error al eliminar las imágenes",
      }
    }

    return {
      status: 200,
      data: undefined,
      message: "Imágenes eliminadas exitosamente",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage || "Error al eliminar las imágenes",
    }
  }
}

