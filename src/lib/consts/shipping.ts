import { CheckoutShippingMethod, ShippingMethod } from "@/types/shipping/shipping"

export const SHIPPING_COSTS: Record<CheckoutShippingMethod, number> =
  Object.freeze({
    home: 5463,
    branch: 4300,
    store: 0,
  })

export const SHIPPING_METHOD_LABELS: Record<ShippingMethod, string> =
  Object.freeze({
    home: "Envío a domicilio",
    branch: "Retiro en sucursal Correo Argentino",
    express: "Envío express",
    store: "Retiro en tienda",
  })

export const SHIPPING_STATUS_LABELS = Object.freeze({
  draft: "Borrador",
  ready: "Listo para despachar",
  shipped: "Despachado",
  cancelled: "Cancelado",
})

export const ARGENTINA_PROVINCES: ReadonlyArray<string> = Object.freeze([
  "Buenos Aires",
  "Ciudad Autónoma de Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
])
