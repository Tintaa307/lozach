import { PaymentService } from "@/services/payment/payment-service"
import { MercadoPagoConfig, Payment } from "mercadopago"

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN!

// GET endpoint for MercadoPago webhook verification ping
export async function GET(): Promise<Response> {
  return new Response("OK", { status: 200 })
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json()

    if (!body.data?.id || !body.type) {
      console.error("Invalid webhook payload:", body)
      return new Response("Invalid webhook payload", { status: 400 })
    }

    const payment_id = body.data.id as string
    const topic = body.type as string

    if (!topic.includes("payment")) {
      return new Response("OK", { status: 200 })
    }

    const client = new MercadoPagoConfig({
      accessToken: accessToken,
    })

    const payment = new Payment(client)
    const paymentDetails = await payment.get({ id: payment_id })

    if (!paymentDetails) {
      console.error("Payment not found for id:", payment_id)
      return new Response("Payment not found", { status: 500 })
    }

    if (topic.includes("payment") && payment_id) {
      const paymentService = new PaymentService()

      await paymentService.updatePreferenceByExternalReference({
        collection_status:
          (paymentDetails.status as "pending" | "approved" | "rejected") ??
          "pending",
        external_reference: paymentDetails.external_reference ?? "",
        payment_id: payment_id,
      })
    }

    return new Response("OK", { status: 200 })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return new Response("Webhook processing error", { status: 500 })
  }
}
