import { StorageService } from "@/services/storage/storage-service"
import { ApiResponse } from "@/types/base/types"
import { createClient } from "@/lib/supabase/server"

const storageService = new StorageService()

export async function uploadProductImagesAction(
  productId: number,
  files: File[]
): Promise<ApiResponse<{ image_url: string | null; images_urls: string[] }>> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        status: 401,
        data: undefined,
        message: "Usuario no autenticado",
      }
    }

    // Verificar que el usuario es admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (userError || !userData || userData.role !== "admin") {
      return {
        status: 403,
        data: undefined,
        message: "No autorizado para subir imágenes",
      }
    }

    const result = await storageService.uploadProductImages(productId, files)

    return {
      status: 200,
      data: result,
      message: "Imágenes subidas exitosamente",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      data: undefined,
      message: errorMessage || "Error al subir las imágenes",
    }
  }
}

export async function deleteProductImagesAction(
  productId: number
): Promise<ApiResponse<void>> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        status: 401,
        data: undefined,
        message: "Usuario no autenticado",
      }
    }

    // Verificar que el usuario es admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (userError || !userData || userData.role !== "admin") {
      return {
        status: 403,
        data: undefined,
        message: "No autorizado para eliminar imágenes",
      }
    }

    await storageService.deleteProductImages(productId)

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
      data: undefined,
      message: errorMessage || "Error al eliminar las imágenes",
    }
  }
}
