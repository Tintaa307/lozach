import {
  CheckoutShippingMethod,
  CorreoArgentinoAgency,
  ShippingMethod,
} from "@/types/shipping/shipping"

export function normalizeShippingMethod(
  method: ShippingMethod
): CheckoutShippingMethod {
  if (method === "express") {
    return "home"
  }

  return method
}

export function isStorePickup(method: ShippingMethod): boolean {
  return normalizeShippingMethod(method) === "store"
}

export function isBranchPickup(method: ShippingMethod): boolean {
  return normalizeShippingMethod(method) === "branch"
}

export function shouldUseCorreoArgentino(method: ShippingMethod): boolean {
  return !isStorePickup(method)
}

export function normalizeShippingCostForMethod(
  method: ShippingMethod,
  cost: number
): number {
  if (isStorePickup(method)) {
    return 0
  }

  return Math.max(0, Math.round(cost))
}

export function buildShippingDetails(
  details: string,
  agency?: Pick<CorreoArgentinoAgency, "code" | "name" | "address"> | null
): string {
  const parts = [details.trim()].filter(Boolean)

  if (agency?.code) {
    parts.push(
      `Sucursal Correo Argentino: ${agency.name || agency.code} | Código: ${
        agency.code
      }`
    )
  }

  if (agency?.address) {
    parts.push(`Dirección sucursal: ${agency.address}`)
  }

  return parts.join(" | ")
}

export function extractAgencyCode(details?: string | null): string | null {
  if (!details) {
    return null
  }

  const match = details.match(/Código:\s*([A-Z0-9]+)/i)
  return match?.[1]?.toUpperCase() || null
}
