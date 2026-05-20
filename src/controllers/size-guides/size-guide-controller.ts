"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { SizeGuideService } from "@/services/size-guides/size-guide-service"

const sizeGuideService = new SizeGuideService()

export const getSizeGuides = async () => {
  return actionHandler(async () => {
    return await sizeGuideService.getAll()
  })
}

export const getSizeGuideById = async (id: number) => {
  return actionHandler(async () => {
    return await sizeGuideService.getById(id)
  })
}
