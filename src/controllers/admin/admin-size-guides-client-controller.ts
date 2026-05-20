"use client"

import {
  createSizeGuide,
  updateSizeGuide,
  deleteSizeGuide,
} from "./admin-size-guides-controller"
import { ApiResponse } from "@/types/base/types"
import {
  CreateSizeGuideValues,
  SizeGuide,
  UpdateSizeGuideValues,
} from "@/types/size-guides/types"

export async function createSizeGuideClientAction(
  values: CreateSizeGuideValues
): Promise<ApiResponse<SizeGuide>> {
  try {
    const result = await createSizeGuide(values)

    if (result.success && result.data) {
      return {
        status: 200,
        data: result.data,
        message: "Guía de talles creada exitosamente",
      }
    }

    return {
      status: result.statusCode || 500,
      error: result.message || "Error al crear la guía de talles",
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage,
    }
  }
}

export async function updateSizeGuideClientAction(
  id: number,
  values: UpdateSizeGuideValues
): Promise<ApiResponse<SizeGuide>> {
  try {
    const result = await updateSizeGuide(id, values)

    if (result.success && result.data) {
      return {
        status: 200,
        data: result.data,
        message: "Guía de talles actualizada exitosamente",
      }
    }

    return {
      status: result.statusCode || 500,
      error: result.message || "Error al actualizar la guía de talles",
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage,
    }
  }
}

export async function deleteSizeGuideClientAction(
  id: number
): Promise<ApiResponse<void>> {
  try {
    const result = await deleteSizeGuide(id)

    if (result.success) {
      return {
        status: 200,
        data: undefined,
        message: "Guía de talles eliminada exitosamente",
      }
    }

    return {
      status: result.statusCode || 500,
      error: result.message || "Error al eliminar la guía de talles",
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage,
    }
  }
}
