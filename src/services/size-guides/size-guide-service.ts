import { SizeGuideRepository } from "@/repositories/size-guides/size-guide-repository"
import {
  CreateSizeGuideValues,
  SizeGuide,
  UpdateSizeGuideValues,
} from "@/types/size-guides/types"

export class SizeGuideService {
  private readonly repository: SizeGuideRepository

  constructor(repository?: SizeGuideRepository) {
    this.repository = repository ?? new SizeGuideRepository()
  }

  async getAll(): Promise<SizeGuide[]> {
    return this.repository.getAll()
  }

  async getById(id: number): Promise<SizeGuide> {
    return this.repository.getById(id)
  }

  async create(values: CreateSizeGuideValues): Promise<SizeGuide> {
    return this.repository.create(values)
  }

  async update(id: number, values: UpdateSizeGuideValues): Promise<SizeGuide> {
    return this.repository.update(id, values)
  }

  async delete(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
