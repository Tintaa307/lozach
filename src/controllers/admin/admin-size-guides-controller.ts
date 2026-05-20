"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { SizeGuideService } from "@/services/size-guides/size-guide-service"
import { AuthService } from "@/services/auth/auth-service"
import {
  CreateSizeGuideValues,
  SizeGuide,
  UpdateSizeGuideValues,
} from "@/types/size-guides/types"

const sizeGuideService = new SizeGuideService()
const authService = new AuthService()

async function verifyAdminRole() {
  const user = await authService.getUser()
  if (user.role !== "admin") {
    throw new Error("Solo los administradores pueden realizar esta acción")
  }
  return user
}

export const getAllSizeGuides = async () => {
  return actionHandler(async () => {
    const guides = await sizeGuideService.getAll()
    return guides as SizeGuide[]
  })
}

export const getSizeGuideById = async (id: number) => {
  return actionHandler(async () => {
    const guide = await sizeGuideService.getById(id)
    return guide as SizeGuide
  })
}

export const createSizeGuide = async (values: CreateSizeGuideValues) => {
  return actionHandler(async () => {
    await verifyAdminRole()
    const guide = await sizeGuideService.create(values)
    return guide as SizeGuide
  })
}

export const updateSizeGuide = async (
  id: number,
  values: UpdateSizeGuideValues
) => {
  return actionHandler(async () => {
    await verifyAdminRole()
    const guide = await sizeGuideService.update(id, values)
    return guide as SizeGuide
  })
}

export const deleteSizeGuide = async (id: number) => {
  return actionHandler(async () => {
    await verifyAdminRole()
    await sizeGuideService.delete(id)
    return undefined
  })
}
