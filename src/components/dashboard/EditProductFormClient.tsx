"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateProductClientAction } from "@/controllers/admin/admin-products-client-controller"
import {
  uploadProductImagesClientAction,
  deleteProductImagesClientAction,
} from "@/controllers/storage/storage-client-controller"
import { Product, UpdateProductValues } from "@/types/products/types"
import { toast } from "sonner"
import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { MiniCardManager } from "@/components/dashboard/MiniCardManager"
import Link from "next/link"

const parseNullableNumber = (value: string) => {
  if (value.trim() === "") {
    return null
  }

  return Number(value)
}

interface EditProductFormClientProps {
  product: Product
}

export function EditProductFormClient({ product }: EditProductFormClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImages, setIsUploadingImages] = useState(false)

  // Track new files selected by the user
  const [coverImageFiles, setCoverImageFiles] = useState<File[]>([])
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([])

  // Track which existing URLs remain (not removed by user)
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string | null>(
    product.image_url
  )
  const [currentAdditionalUrls, setCurrentAdditionalUrls] = useState<string[]>(
    product.images_urls || []
  )

  const [formData, setFormData] = useState<UpdateProductValues>({
    name: product.name,
    stock: product.stock,
    description: product.description || "",
    category: product.category,
    color: product.color,
    fabric: product.fabric,
    price: product.price,
    size: product.size,
    shipping_weight_grams: product.shipping_weight_grams ?? 500,
    shipping_height_cm: product.shipping_height_cm ?? 10,
    shipping_width_cm: product.shipping_width_cm ?? 20,
    shipping_length_cm: product.shipping_length_cm ?? 15,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const hasNewFiles =
        coverImageFiles.length > 0 || additionalImageFiles.length > 0

      // Build image values from existing URLs (ones user didn't remove)
      let finalImageUrl: string | null = currentCoverUrl
      let finalImagesUrls: string[] = [...currentAdditionalUrls]

      // Step 1: Upload new files if any
      if (hasNewFiles) {
        setIsUploadingImages(true)
        toast.info("Subiendo imágenes nuevas...")

        // Delete old images from storage before re-uploading
        await deleteProductImagesClientAction(product.id)

        // Combine: new cover file (or keep existing), plus new additional files
        const allFiles = [...coverImageFiles, ...additionalImageFiles]

        if (allFiles.length > 0) {
          const uploadResult = await uploadProductImagesClientAction(
            product.id,
            allFiles
          )

          if (uploadResult.status === 200 && uploadResult.data) {
            // If we uploaded a new cover, use it; otherwise keep existing
            if (coverImageFiles.length > 0) {
              finalImageUrl = uploadResult.data.image_url
              finalImagesUrls = [
                ...currentAdditionalUrls,
                ...uploadResult.data.images_urls,
              ]
            } else {
              // Only additional images were uploaded; first upload becomes part of images_urls
              finalImagesUrls = [
                ...currentAdditionalUrls,
                ...(uploadResult.data.image_url
                  ? [uploadResult.data.image_url]
                  : []),
                ...uploadResult.data.images_urls,
              ]
            }
          } else {
            toast.error(uploadResult.error || "Error al subir las imágenes")
            setIsUploadingImages(false)
            setIsLoading(false)
            return
          }
        }

        setIsUploadingImages(false)
      }

      // Step 2: Update product with all data + final image URLs
      const updateValues: UpdateProductValues = {
        ...formData,
        description: formData.description || null,
        // null = explicitly clear the image in DB; string = set the URL
        image_url: finalImageUrl,
        images_urls: finalImagesUrls,
      }

      const response = await updateProductClientAction(product.id, updateValues)

      if (response.status === 200) {
        toast.success("Producto actualizado exitosamente")
      } else {
        toast.error(response.error || "Error al actualizar el producto")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Error al actualizar el producto")
    } finally {
      setIsLoading(false)
    }
  }

  const addColor = (color: string) => {
    if (!formData.color?.includes(color)) {
      setFormData((prev) => ({
        ...prev,
        color: [...(prev.color || []), color],
      }))
    }
  }

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      color: prev.color?.filter((_, i) => i !== index) || [],
    }))
  }

  const addTalle = (talle: string) => {
    if (!formData.size?.talles.includes(talle)) {
      setFormData((prev) => ({
        ...prev,
        size: {
          ...prev.size!,
          talles: [...(prev.size?.talles || []), talle],
        },
      }))
    }
  }

  const removeTalle = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      size: {
        ...prev.size!,
        talles: prev.size?.talles.filter((_, i) => i !== index) || [],
      },
    }))
  }

  // Handle cover image changes from ImageUpload
  const handleCoverImagesChange = (images: string[]) => {
    if (images.length === 0) {
      // User removed the cover image
      setCurrentCoverUrl(null)
    }
    // If images[0] is a data URL (new file), we ignore it for the URL state
    // because the actual upload happens on submit via coverImageFiles
    // If it's an existing URL, keep it
    if (images.length > 0 && !images[0].startsWith("data:")) {
      setCurrentCoverUrl(images[0])
    }
  }

  // Handle additional images changes from ImageUpload
  const handleAdditionalImagesChange = (images: string[]) => {
    // Keep only the real URLs (not data: previews)
    const realUrls = images.filter((img) => !img.startsWith("data:"))
    setCurrentAdditionalUrls(realUrls)
  }

  return (
    <div className="flex flex-col gap-4 py-6 px-6 w-full">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar producto</h1>
          <p className="text-gray-600">
            Modifica la información del producto
          </p>
        </div>
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/catalog">Volver al catálogo</Link>
        </Button>
      </div>

      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  value={formData.stock || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, stock: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Categoría */}
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={formData.category || "adult"}
                  onValueChange={(value: "adult" | "child") =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adult">Adulto</SelectItem>
                    <SelectItem value="child">Niño</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tela */}
              <div className="space-y-2">
                <Label htmlFor="fabric">Tela</Label>
                <Input
                  id="fabric"
                  value={formData.fabric || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fabric: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <h3 className="font-semibold">Datos para Correo Argentino</h3>
                <p className="text-sm text-gray-600">
                  Se usan para cotizar el envío. Peso en gramos y medidas del
                  paquete en centímetros.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping_weight_grams">Peso (g)</Label>
                  <Input
                    id="shipping_weight_grams"
                    type="number"
                    min={1}
                    value={formData.shipping_weight_grams ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        shipping_weight_grams: parseNullableNumber(
                          e.target.value
                        ),
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping_height_cm">Alto (cm)</Label>
                  <Input
                    id="shipping_height_cm"
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={formData.shipping_height_cm ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        shipping_height_cm: parseNullableNumber(e.target.value),
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping_width_cm">Ancho (cm)</Label>
                  <Input
                    id="shipping_width_cm"
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={formData.shipping_width_cm ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        shipping_width_cm: parseNullableNumber(e.target.value),
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping_length_cm">Largo (cm)</Label>
                  <Input
                    id="shipping_length_cm"
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={formData.shipping_length_cm ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        shipping_length_cm: parseNullableNumber(e.target.value),
                      }))
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Colores */}
            <MiniCardManager
              items={formData.color || []}
              onAdd={addColor}
              onRemove={removeColor}
              placeholder="Agregar color"
              label="Colores"
              addButtonText="Agregar"
            />

            {/* Tallas */}
            <MiniCardManager
              items={formData.size?.talles || []}
              onAdd={addTalle}
              onRemove={removeTalle}
              placeholder="Agregar talla"
              label="Tallas"
              addButtonText="Agregar"
            />

            {/* Imagen de Portada */}
            <ImageUpload
              label="Imagen de Portada"
              maxImages={1}
              onImagesChange={handleCoverImagesChange}
              onFilesChange={setCoverImageFiles}
              images={currentCoverUrl ? [currentCoverUrl] : []}
              isMultiple={false}
            />

            {/* Imágenes Adicionales */}
            <ImageUpload
              label="Imágenes Adicionales (Máximo 5)"
              maxImages={5}
              onImagesChange={handleAdditionalImagesChange}
              onFilesChange={setAdditionalImageFiles}
              images={currentAdditionalUrls}
              isMultiple={true}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading || isUploadingImages}
                className="flex-1"
              >
                {isLoading
                  ? isUploadingImages
                    ? "Subiendo imágenes..."
                    : "Actualizando..."
                  : "Actualizar Producto"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/catalog">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
