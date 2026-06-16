import { AuthService } from "@/services/auth/auth-service"
import {
  CorreoArgentinoService,
  STATUS_RANK,
} from "@/services/shipping/correo-argentino-service"
import { EmailService } from "@/services/email/email-service"
import { OrderService } from "@/services/orders/order-service"
import { ShippingService } from "@/services/shipping/shipping-service"
import { UpdateShippingValues } from "@/types/shipping/shipping"

const shippingService = new ShippingService()
const correoArgentinoService = new CorreoArgentinoService()
const orderService = new OrderService()
const userService = new AuthService()
const emailService = new EmailService()

export interface ShipmentSyncSummary {
  checked: number
  statusUpdated: number
  inTransitEmails: number
  deliveredEmails: number
  errors: number
}

export class ShipmentTrackingService {
  /**
   * Recorre los envíos con tracking que todavía no están en un estado final,
   * consulta Correo Argentino y, ante la primera transición, avanza el estado
   * del envío y notifica al cliente ("en camino" / "entregado").
   */
  async syncPendingShipments(limit = 25): Promise<ShipmentSyncSummary> {
    const summary: ShipmentSyncSummary = {
      checked: 0,
      statusUpdated: 0,
      inTransitEmails: 0,
      deliveredEmails: 0,
      errors: 0,
    }

    const shipments = await shippingService.findShipmentsToSync(limit)

    for (const shipment of shipments) {
      summary.checked++

      try {
        const tracking = await correoArgentinoService.getTracking({
          trackingNumber: shipment.tracking_number as string,
        })

        const now = new Date().toISOString()
        const updates: UpdateShippingValues = { last_synced_at: now }

        if (tracking?.lastEventText) {
          updates.last_tracking_status = tracking.lastEventText
        }

        const mapped = tracking?.status ?? null

        // Avanzar el estado solo hacia adelante (nunca retroceder).
        if (
          mapped &&
          STATUS_RANK[mapped] > STATUS_RANK[shipment.shipping_status]
        ) {
          updates.shipping_status = mapped
          if (mapped === "delivered") {
            updates.delivered_at = now
          }
          summary.statusUpdated++
        }

        const needsInTransitEmail =
          mapped === "shipped" && !shipment.in_transit_email_sent
        const needsDeliveredEmail =
          mapped === "delivered" && !shipment.delivered_email_sent

        if (needsInTransitEmail || needsDeliveredEmail) {
          const order = await orderService.getOrderById(shipment.order_id)

          // Solo notificamos pedidos con el pago aprobado.
          if (order.collection_status === "approved") {
            const customer = await userService.getUserById(shipment.user_id)

            if (needsDeliveredEmail) {
              await emailService.sendShipmentDeliveredEmail({
                email: customer.email,
                name: customer.name,
                order,
                trackingNumber: shipment.tracking_number,
                trackingUrl: shipment.tracking_url,
              })
              updates.delivered_email_sent = true
              // Evita un "en camino" tardío si saltó directo a entregado.
              updates.in_transit_email_sent = true
              summary.deliveredEmails++
            } else if (needsInTransitEmail) {
              await emailService.sendShipmentInTransitEmail({
                email: customer.email,
                name: customer.name,
                order,
                trackingNumber: shipment.tracking_number,
                trackingUrl: shipment.tracking_url,
              })
              updates.in_transit_email_sent = true
              summary.inTransitEmails++
            }
          }
        }

        await shippingService.updateShipping(shipment.order_id, updates)
      } catch (error) {
        summary.errors++
        console.error("[ShipmentTracking:sync]", {
          orderId: shipment.order_id,
          trackingNumber: shipment.tracking_number,
          error,
        })
      }
    }

    return summary
  }
}
