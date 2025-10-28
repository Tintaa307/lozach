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
import { updateProductClientAction } from "@/controllers/admin/admin-product-client-controller"
import { Product, UpdateProductValues } from "@/types/products/types"
import { toast } from "sonner"
import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { MiniCardManager } from "@/components/dashboard/MiniCardManager"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditProductFormClientProps {
  product: Product
}

export function EditProductFormClient({ product }: EditProductFormClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<UpdateProductValues>({
    name: product.name,
    stock: product.stock,
    description: product.description || "",
    category: product.category,
    color: product.color,
    fabric: product.fabric,
    price: product.price,
    size: product.size,
    image_url: product.image_url || "",
    images_urls: product.images_urls || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await updateProductClientAction(product.id, formData)

      if (response.success) {
        toast.success("Producto actualizado exitosamente")
      } else {
        toast.error(response.message || "Error al actualizar el producto")
        if (response.fieldErrors) {
          Object.entries(
            response.fieldErrors as Record<string, string[]>
          ).forEach(([field, errors]) => {
            errors.forEach((error) => {
              toast.error(`${field}: ${error}`)
            })
          })
        }
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

  return (
    <div className="flex flex-col gap-4 py-6 px-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Editar Producto</h1>
            <p className="text-gray-600">
              Modifica la información del producto
            </p>
          </div>
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
              onImagesChange={(images) =>
                setFormData((prev) => ({
                  ...prev,
                  image_url: images[0] || "",
                }))
              }
              images={formData.image_url ? [formData.image_url] : []}
              isMultiple={false}
            />

            {/* Imágenes Adicionales */}
            <ImageUpload
              label="Imágenes Adicionales (Máximo 5)"
              maxImages={5}
              onImagesChange={(images) =>
                setFormData((prev) => ({
                  ...prev,
                  images_urls: images,
                }))
              }
              images={formData.images_urls || []}
              isMultiple={true}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Actualizando..." : "Actualizar Producto"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
