"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Upload } from "lucide-react"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  label: string
  maxImages?: number
  onImagesChange: (images: string[]) => void
  onFilesChange?: (files: File[]) => void
  images: string[]
  isMultiple?: boolean
}

export function ImageUpload({
  label,
  maxImages = 5,
  onImagesChange,
  onFilesChange,
  images,
  isMultiple = false,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [displayImages, setDisplayImages] = useState<string[]>(images)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    )

    if (imageFiles.length === 0) {
      alert("Por favor selecciona solo archivos de imagen")
      return
    }

    // Actualizar archivos seleccionados
    const newFiles = isMultiple
      ? [...selectedFiles, ...imageFiles].slice(0, maxImages)
      : [imageFiles[0]]

    setSelectedFiles(newFiles)
    onFilesChange?.(newFiles)

    // Generar previews para mostrar
    if (isMultiple) {
      const newImages = [...(images?.length ? images : displayImages)]
      imageFiles.forEach((file) => {
        if (newImages.length < maxImages) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            if (result && !newImages.includes(result)) {
              newImages.push(result)
              setDisplayImages(newImages)
              onImagesChange(newImages)
            }
          }
          reader.readAsDataURL(file)
        }
      })
    } else {
      const file = imageFiles[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          setDisplayImages([result])
          onImagesChange([result])
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeImage = (index: number) => {
    const sourceImages = images?.length ? images : displayImages
    const newImages = sourceImages.filter((_, i) => i !== index)
    const newFiles = selectedFiles.filter((_, i) => i !== index)

    setSelectedFiles(newFiles)
    onFilesChange?.(newFiles)
    setDisplayImages(newImages)
    onImagesChange(newImages)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={isMultiple}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-primary">
              Haz clic para subir
            </span>{" "}
            o arrastra y suelta
          </div>
          <div className="text-xs text-gray-500">
            {isMultiple
              ? `Máximo ${maxImages} imágenes`
              : "Una imagen de portada"}
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {(images.length > 0 || displayImages.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(images.length > 0 ? images : displayImages).map((image, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
