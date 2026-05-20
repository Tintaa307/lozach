import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@/lib/supabase/admin-client"
import {
  CreateSizeGuideValues,
  SizeGuide,
  UpdateSizeGuideValues,
} from "@/types/size-guides/types"
import {
  SizeGuideCreationException,
  SizeGuideDeletionException,
  SizeGuideFetchException,
  SizeGuideNotFoundException,
  SizeGuideUpdateException,
} from "@/exceptions/size-guides/size-guide-exceptions"
import { ValidationException } from "@/exceptions/base/base-exceptions"
import { CreateSizeGuideSchema } from "@/lib/validations/size-guide-schema"

const SIZE_GUIDE_COLUMNS =
  "id, name, description, category, headers, rows, note, created_at, updated_at"

export class SizeGuideRepository {
  private normalizeRows(value: unknown): string[][] {
    if (!Array.isArray(value)) {
      return []
    }

    return value
      .map((row) => {
        if (!Array.isArray(row)) {
          return null
        }

        return row.map((cell) =>
          cell === null || cell === undefined ? "" : String(cell)
        )
      })
      .filter((row): row is string[] => row !== null)
  }

  private normalizeHeaders(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return []
    }

    return value.map((header) =>
      header === null || header === undefined ? "" : String(header)
    )
  }

  private normalize(record: Record<string, unknown>): SizeGuide {
    return {
      id: Number(record.id),
      name: String(record.name ?? ""),
      description:
        record.description === null || record.description === undefined
          ? null
          : String(record.description),
      category:
        record.category === null || record.category === undefined
          ? null
          : (String(record.category) as SizeGuide["category"]),
      headers: this.normalizeHeaders(record.headers),
      rows: this.normalizeRows(record.rows),
      note:
        record.note === null || record.note === undefined
          ? null
          : String(record.note),
      created_at: String(record.created_at ?? ""),
      updated_at: String(record.updated_at ?? ""),
    }
  }

  async getAll(): Promise<SizeGuide[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("size_guides")
      .select(SIZE_GUIDE_COLUMNS)
      .order("created_at", { ascending: false })

    if (error) {
      throw new SizeGuideFetchException(
        error.message,
        "Error al obtener las guías de talles"
      )
    }

    return (data ?? []).map((guide) => this.normalize(guide))
  }

  async getById(id: number): Promise<SizeGuide> {
    const supabase = await createClient()

    if (!id) {
      throw new ValidationException(
        "ID de guía de talles no proporcionado",
        undefined,
        "ID de guía de talles requerido"
      )
    }

    const { data, error } = await supabase
      .from("size_guides")
      .select(SIZE_GUIDE_COLUMNS)
      .eq("id", id)
      .single()

    if (error || !data) {
      throw new SizeGuideNotFoundException(
        error?.message || "Guía de talles no encontrada",
        "Guía de talles no encontrada"
      )
    }

    return this.normalize(data)
  }

  async create(values: CreateSizeGuideValues): Promise<SizeGuide> {
    const validated = CreateSizeGuideSchema.safeParse(values)

    if (!validated.success) {
      const fieldErrors: Record<string, string[]> = {}

      validated.error.issues.forEach((issue) => {
        const field = issue.path.join(".")
        if (!fieldErrors[field]) {
          fieldErrors[field] = []
        }
        fieldErrors[field].push(issue.message)
      })

      throw new ValidationException(
        validated.error.message,
        fieldErrors,
        "Error de validación en la guía de talles"
      )
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("size_guides")
      .insert({
        name: values.name,
        description: values.description ?? null,
        category: values.category ?? null,
        headers: values.headers,
        rows: values.rows,
        note: values.note ?? null,
      })
      .select(SIZE_GUIDE_COLUMNS)
      .single()

    if (error || !data) {
      throw new SizeGuideCreationException(
        error?.message ?? "Error al crear la guía de talles",
        "Error al crear la guía de talles"
      )
    }

    return this.normalize(data)
  }

  async update(id: number, values: UpdateSizeGuideValues): Promise<SizeGuide> {
    const supabase = createAdminClient()

    const payload: Record<string, unknown> = {}
    if (values.name !== undefined) payload.name = values.name
    if (values.description !== undefined)
      payload.description = values.description
    if (values.category !== undefined) payload.category = values.category
    if (values.headers !== undefined) payload.headers = values.headers
    if (values.rows !== undefined) payload.rows = values.rows
    if (values.note !== undefined) payload.note = values.note

    const { data, error } = await supabase
      .from("size_guides")
      .update(payload)
      .eq("id", id)
      .select(SIZE_GUIDE_COLUMNS)
      .single()

    if (error) {
      throw new SizeGuideUpdateException(
        error.message,
        "Error al actualizar la guía de talles"
      )
    }

    if (!data) {
      throw new SizeGuideNotFoundException(
        "Guía de talles no encontrada",
        "Guía de talles no encontrada"
      )
    }

    return this.normalize(data)
  }

  async delete(id: number): Promise<void> {
    const supabase = createAdminClient()

    const { error } = await supabase.from("size_guides").delete().eq("id", id)

    if (error) {
      throw new SizeGuideDeletionException(
        error.message,
        "Error al eliminar la guía de talles"
      )
    }
  }
}
