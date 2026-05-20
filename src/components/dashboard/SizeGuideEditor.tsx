"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  createSizeGuideClientAction,
  updateSizeGuideClientAction,
} from "@/controllers/admin/admin-size-guides-client-controller"
import {
  CreateSizeGuideValues,
  SizeGuide,
  SizeGuideCategory,
} from "@/types/size-guides/types"

type EditorMode = "create" | "edit"
type CategoryValue = SizeGuideCategory | "none"

interface SizeGuideEditorProps {
  mode: EditorMode
  guide?: SizeGuide
}

const DEFAULT_VALUES: CreateSizeGuideValues = {
  name: "",
  description: "",
  category: null,
  headers: ["Talle", "Pecho (cm)", "Cintura (cm)"],
  rows: [
    ["S", "", ""],
    ["M", "", ""],
    ["L", "", ""],
  ],
  note: "",
}

export function SizeGuideEditor({ mode, guide }: SizeGuideEditorProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const [name, setName] = useState(guide?.name ?? DEFAULT_VALUES.name)
  const [description, setDescription] = useState(
    guide?.description ?? DEFAULT_VALUES.description ?? ""
  )
  const [category, setCategory] = useState<CategoryValue>(
    guide?.category ?? "none"
  )
  const [note, setNote] = useState(guide?.note ?? DEFAULT_VALUES.note ?? "")
  const [headers, setHeaders] = useState<string[]>(
    guide?.headers?.length ? guide.headers : DEFAULT_VALUES.headers
  )
  const [rows, setRows] = useState<string[][]>(
    guide?.rows?.length ? guide.rows : DEFAULT_VALUES.rows
  )

  const updateHeader = (index: number, value: string) => {
    setHeaders((prev) => prev.map((header, i) => (i === index ? value : header)))
  }

  const addColumn = () => {
    setHeaders((prev) => [...prev, `Columna ${prev.length + 1}`])
    setRows((prev) => prev.map((row) => [...row, ""]))
  }

  const removeColumn = (index: number) => {
    if (headers.length <= 2) {
      toast.warning("La tabla debe tener al menos dos columnas")
      return
    }
    setHeaders((prev) => prev.filter((_, i) => i !== index))
    setRows((prev) => prev.map((row) => row.filter((_, i) => i !== index)))
  }

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? row.map((cell, j) => (j === colIndex ? value : cell))
          : row
      )
    )
  }

  const addRow = () => {
    setRows((prev) => [...prev, headers.map(() => "")])
  }

  const removeRow = (index: number) => {
    if (rows.length <= 1) {
      toast.warning("La tabla debe tener al menos una fila")
      return
    }
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)

    const payload: CreateSizeGuideValues = {
      name: name.trim(),
      description: description.trim() ? description.trim() : null,
      category: category === "none" ? null : category,
      note: note.trim() ? note.trim() : null,
      headers: headers.map((header) => header.trim()),
      rows: rows.map((row) => row.map((cell) => cell.trim())),
    }

    try {
      if (mode === "create") {
        const response = await createSizeGuideClientAction(payload)
        if (response.status === 200 && response.data) {
          toast.success("Guía de talles creada")
          router.push("/dashboard/size-guides")
          router.refresh()
        } else {
          toast.error(response.error ?? "Error al crear la guía de talles")
        }
      } else if (guide) {
        const response = await updateSizeGuideClientAction(guide.id, payload)
        if (response.status === 200 && response.data) {
          toast.success("Guía de talles actualizada")
          router.refresh()
        } else {
          toast.error(response.error ?? "Error al actualizar la guía de talles")
        }
      }
    } catch (error) {
      console.error("[SizeGuideEditor] submit error", error)
      toast.error("Error al guardar la guía de talles")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 py-6 px-6 w-full">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {mode === "create" ? "Nueva guía de talles" : "Editar guía de talles"}
          </h1>
          <p className="text-gray-600">
            Definí los encabezados y las filas que verán los clientes en el detalle del producto.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/size-guides">Volver</Link>
        </Button>
      </div>

      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Información general</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ej: Remeras adulto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría sugerida</Label>
                <Select
                  value={category}
                  onValueChange={(value: CategoryValue) => setCategory(value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sin categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin categoría</SelectItem>
                    <SelectItem value="adult">Adulto</SelectItem>
                    <SelectItem value="child">Niño</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Cómo usar esta guía"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="note">Nota al pie (opcional)</Label>
                <Input
                  id="note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Ej: Las medidas son aproximadas, tolerancia ±1 cm."
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Tabla de talles</h3>
                  <p className="text-sm text-gray-600">
                    La primera columna suele ser el talle. Las siguientes son las medidas.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={addColumn}>
                    <Plus className="h-4 w-4 mr-1" /> Columna
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={addRow}>
                    <Plus className="h-4 w-4 mr-1" /> Fila
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableHead key={index} className="min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <Input
                            value={header}
                            onChange={(event) =>
                              updateHeader(index, event.target.value)
                            }
                            placeholder={`Columna ${index + 1}`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeColumn(index)}
                            aria-label="Eliminar columna"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {headers.map((_, colIndex) => (
                        <TableCell key={colIndex} className="min-w-[140px]">
                          <Input
                            value={row[colIndex] ?? ""}
                            onChange={(event) =>
                              updateCell(rowIndex, colIndex, event.target.value)
                            }
                            placeholder={colIndex === 0 ? "Talle" : "Medida"}
                          />
                        </TableCell>
                      ))}
                      <TableCell className="w-12">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRow(rowIndex)}
                          aria-label="Eliminar fila"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving
                  ? "Guardando..."
                  : mode === "create"
                    ? "Crear guía"
                    : "Guardar cambios"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/size-guides">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
