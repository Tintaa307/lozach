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
import { createProductClientAction } from "@/controllers/admin/admin-product-client-controller"
import { updateProductClientAction } from "@/controllers/admin/admin-product-client-controller"
import { uploadProductImagesClientAction } from "@/controllers/storage/storage-client-controller"
import { CreateProductValues } from "@/types/products/types"
import { toast } from "sonner"
import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { MiniCardManager } from "@/components/dashboard/MiniCardManager"

export function ProductFormClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [coverImageFiles, setCoverImageFiles] = useState<File[]>([])
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([])
  const [formData, setFormData] = useState<CreateProductValues>({
    name: "",
    stock: "consultar",
    description: "",
    category: "adult",
    color: [],
    fabric: "",
    price: 0,
    size: { talles: [] },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Paso 1: Crear producto sin URLs de imágenes; se suben luego
      const response = await createProductClientAction(formData)

      if (response.status === 200 && response.data) {
        const productId = response.data.id
        toast.success("Producto creado exitosamente")

        // Paso 2: Subir imágenes si hay archivos seleccionados
        const allImageFiles = [...coverImageFiles, ...additionalImageFiles]
        if (allImageFiles.length > 0) {
          setIsUploadingImages(true)
          toast.info("Subiendo imágenes...")

          const uploadResult = await uploadProductImagesClientAction(
            productId,
            allImageFiles
          )
          console.log("[UploadImages] result", uploadResult)

          if (uploadResult.status === 200 && uploadResult.data) {
            // Paso 3: Actualizar producto con las URLs reales
            const updateResponse = await updateProductClientAction(productId, {
              image_url: uploadResult.data.image_url || undefined,
              images_urls: uploadResult.data.images_urls,
            })
            console.log("[UpdateProduct] response", updateResponse)

            if (updateResponse.status === 200) {
              toast.success(
                "Imágenes subidas y producto actualizado exitosamente"
              )
              // Reset form
              resetForm()
            } else {
              toast.error(
                updateResponse.error ||
                  "Error al actualizar el producto con las imágenes"
              )
            }
          } else {
            toast.error(uploadResult.error || "Error al subir las imágenes")
          }
          setIsUploadingImages(false)
        } else {
          // No hay imágenes, solo resetear el formulario
          resetForm()
        }
      } else {
        toast.error(response.error || "Error al crear el producto")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error("Error al crear el producto")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      stock: "consultar",
      description: "",
      category: "adult",
      color: [],
      fabric: "",
      price: 0,
      size: { talles: [] },
    })
    setCoverImageFiles([])
    setAdditionalImageFiles([])
  }

  const addColor = (color: string) => {
    if (!formData.color.includes(color)) {
      setFormData((prev) => ({
        ...prev,
        color: [...prev.color, color],
      }))
    }
  }

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      color: prev.color.filter((_, i) => i !== index),
    }))
  }

  const addTalle = (talle: string) => {
    if (!formData.size.talles.includes(talle)) {
      setFormData((prev) => ({
        ...prev,
        size: {
          ...prev.size,
          talles: [...prev.size.talles, talle],
        },
      }))
    }
  }

  const removeTalle = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      size: {
        ...prev.size,
        talles: prev.size.talles.filter((_, i) => i !== index),
      },
    }))
  }

  return (
    <div className="flex flex-col gap-4 py-6 px-6 w-full">
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Crear Nuevo Producto</h1>
          <p className="text-gray-600">Completa la información del producto</p>
        </div>
      </div>

      <Card className="w-[600px] mx-auto">
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
                  value={formData.name}
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
                  value={formData.stock}
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
                  value={formData.description}
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
                  value={formData.category}
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
                  value={formData.fabric}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fabric: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Precio */}
              <div className="space-y-2 md:col-span-2 col-span-1">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
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

            {/* Colores */}
            <MiniCardManager
              items={formData.color}
              onAdd={addColor}
              onRemove={removeColor}
              placeholder="Agregar color"
              label="Colores"
              addButtonText="Agregar"
            />

            {/* Tallas */}
            <MiniCardManager
              items={formData.size.talles}
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
              onImagesChange={() => {
                // No guardamos las URLs de imágenes en el estado
              }}
              onFilesChange={setCoverImageFiles}
              images={[]}
              isMultiple={false}
            />

            {/* Imágenes Adicionales */}
            <ImageUpload
              label="Imágenes Adicionales (Máximo 5)"
              maxImages={5}
              onImagesChange={() => {
                // No guardamos las URLs de imágenes en el estado
              }}
              onFilesChange={setAdditionalImageFiles}
              images={[]}
              isMultiple={true}
            />

            <Button
              type="submit"
              disabled={isLoading || isUploadingImages}
              className="w-full"
            >
              {isLoading
                ? "Creando..."
                : isUploadingImages
                ? "Subiendo imágenes..."
                : "Crear Producto"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
