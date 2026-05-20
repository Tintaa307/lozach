"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Plus, Ruler, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteSizeGuideClientAction } from "@/controllers/admin/admin-size-guides-client-controller"
import { SizeGuide } from "@/types/size-guides/types"

interface SizeGuidesListClientProps {
  guides: SizeGuide[]
}

const CATEGORY_LABELS: Record<string, string> = {
  adult: "Adulto",
  child: "Niño",
  unisex: "Unisex",
}

export function SizeGuidesListClient({ guides }: SizeGuidesListClientProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (guide: SizeGuide) => {
    const confirmed = window.confirm(
      `¿Eliminar la guía de talles "${guide.name}"? Los productos que la usen quedarán sin guía.`
    )
    if (!confirmed) return

    setDeletingId(guide.id)
    startTransition(async () => {
      try {
        const response = await deleteSizeGuideClientAction(guide.id)
        if (response.status === 200) {
          toast.success("Guía eliminada")
          router.refresh()
        } else {
          toast.error(response.error ?? "Error al eliminar la guía")
        }
      } finally {
        setDeletingId(null)
      }
    })
  }

  return (
    <div className="flex flex-col gap-4 py-6 px-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guías de talles</h1>
          <p className="text-gray-600">
            Creá las tablas que los clientes verán en el detalle de cada producto.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/size-guides/new">
            <Plus className="h-4 w-4 mr-2" /> Nueva guía
          </Link>
        </Button>
      </div>

      {guides.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <Ruler className="h-10 w-10 text-gray-400" />
            <p className="text-gray-600">
              Todavía no creaste ninguna guía de talles.
            </p>
            <Button asChild>
              <Link href="/dashboard/size-guides/new">Crear la primera</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((guide) => (
            <Card key={guide.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{guide.name}</CardTitle>
                  {guide.category && (
                    <Badge variant="secondary" className="text-xs">
                      {CATEGORY_LABELS[guide.category] ?? guide.category}
                    </Badge>
                  )}
                </div>
                {guide.description && (
                  <p className="text-sm text-muted-foreground">
                    {guide.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-muted-foreground">
                  {guide.rows.length} fila{guide.rows.length === 1 ? "" : "s"} ·{" "}
                  {guide.headers.length} columna
                  {guide.headers.length === 1 ? "" : "s"}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/dashboard/size-guides/${guide.id}/edit`}>
                      <Edit className="h-3 w-3 mr-1" /> Editar
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(guide)}
                    disabled={isPending && deletingId === guide.id}
                  >
                    <Trash2 className="h-3 w-3" />
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
