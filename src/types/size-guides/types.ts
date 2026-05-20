export type SizeGuideCategory = "adult" | "child" | "unisex"

export interface SizeGuide {
  id: number
  name: string
  description: string | null
  category: SizeGuideCategory | null
  headers: string[]
  rows: string[][]
  note: string | null
  created_at: string
  updated_at: string
}

export interface CreateSizeGuideValues {
  name: string
  description?: string | null
  category?: SizeGuideCategory | null
  headers: string[]
  rows: string[][]
  note?: string | null
}

export interface UpdateSizeGuideValues {
  name?: string
  description?: string | null
  category?: SizeGuideCategory | null
  headers?: string[]
  rows?: string[][]
  note?: string | null
}
