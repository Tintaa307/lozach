import { createClient } from "@/lib/supabase/server"
import { StorageException } from "@/exceptions/storage/storage-exceptions"

export class StorageService {
  async uploadProductImages(
    productId: number,
    files: File[]
  ): Promise<{ image_url: string | null; images_urls: string[] }> {
    try {
      const supabase = await createClient()

      // Crear carpeta con el ID del producto (raíz del bucket)
      const folderPath = `${productId}`

      let image_url: string | null = null
      const images_urls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}-${i}.${fileExt}`
        const filePath = `${folderPath}/${fileName}`

        console.log("[StorageService] uploading", {
          bucket: "products-images",
          filePath,
          name: file.name,
          type: file.type,
          size: file.size,
        })

        // Convertir File a ArrayBuffer para el servidor
        const arrayBuffer = await file.arrayBuffer()
        const fileBuffer = Buffer.from(arrayBuffer)

        // Subir archivo
        const { data, error } = await supabase.storage
          .from("products-images")
          .upload(filePath, fileBuffer, {
            upsert: true,
            contentType: file.type || "image/jpeg",
            cacheControl: "3600",
          })

        if (error) {
          console.error(
            `[StorageService] Error uploading file ${i + 1}:`,
            error
          )
          throw new StorageException(
            `Error al subir imagen ${i + 1} (${file.name}): ${error.message}`,
            `Error al subir la imagen ${file.name}`
          )
        }

        if (!data) {
          console.error(`[StorageService] No data returned for file ${i + 1}`)
          throw new StorageException(
            `No se recibieron datos al subir imagen ${i + 1} (${file.name})`,
            `Error al subir la imagen ${file.name}`
          )
        }

        // Obtener URL pública
        const { data: publicData } = supabase.storage
          .from("products-images")
          .getPublicUrl(data.path)

        const publicUrl = publicData.publicUrl

        console.log("[StorageService] uploaded ok", {
          path: data.path,
          publicUrl,
        })

        // La primera imagen es la imagen principal
        if (i === 0) {
          image_url = publicUrl
        } else {
          images_urls.push(publicUrl)
        }

        // Pequeño delay para evitar colisiones de nombres con timestamp
        if (i < files.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 10))
        }
      }

      return { image_url, images_urls }
    } catch (error) {
      console.error("[StorageService] upload error", error)
      if (error instanceof StorageException) {
        throw error
      }
      throw new StorageException(
        "Error interno al subir imágenes",
        "Error al subir las imágenes"
      )
    }
  }

  async deleteProductImages(productId: number): Promise<void> {
    try {
      const supabase = await createClient()
      const folderPath = `${productId}`

      // Listar archivos en la carpeta
      const { data: files, error: listError } = await supabase.storage
        .from("products-images")
        .list(folderPath)

      if (listError) {
        throw new StorageException(
          `Error al listar archivos: ${listError.message}`,
          "Error al eliminar las imágenes"
        )
      }

      if (files && files.length > 0) {
        // Eliminar todos los archivos
        const filePaths = files.map((file) => `${folderPath}/${file.name}`)

        const { error: deleteError } = await supabase.storage
          .from("products-images")
          .remove(filePaths)

        if (deleteError) {
          throw new StorageException(
            `Error al eliminar archivos: ${deleteError.message}`,
            "Error al eliminar las imágenes"
          )
        }
      }
    } catch (error) {
      console.error("[StorageService] delete error", error)
      if (error instanceof StorageException) {
        throw error
      }
      throw new StorageException(
        "Error interno al eliminar imágenes",
        "Error al eliminar las imágenes"
      )
    }
  }
}
