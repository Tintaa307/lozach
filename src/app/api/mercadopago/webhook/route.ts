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

    // Validate required fields — still return 200 to prevent MP retries
    if (!body.data?.id || !body.type) {
      console.error("Invalid webhook payload:", body)
      return new Response("OK", { status: 200 })
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
      return new Response("OK", { status: 200 })
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
    // Always return 200 to prevent MercadoPago from retrying infinitely.
    // Errors are logged for debugging but the webhook is acknowledged.
    console.error("Webhook processing error:", error)
    return new Response("OK", { status: 200 })
  }
}
