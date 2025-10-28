import { PaymentService } from "@/services/payment/payment-service"
import { MercadoPagoConfig, Payment } from "mercadopago"

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN!

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json()

    // Validate required fields
    if (!body.data?.id || !body.type) {
      console.error("Invalid webhook payload:", body)
      return new Response("Invalid payload", { status: 400 })
    }

    const payment_id = body.data.id as string
    const topic = body.type as string

    if (!topic.includes("payment")) {
      return new Response("Not a payment notification", { status: 200 })
    }

    const client = new MercadoPagoConfig({
      accessToken: accessToken,
    })

    const payment = new Payment(client)
    const paymentDetails = await payment.get({ id: payment_id })

    if (!paymentDetails) {
      return new Response("Payment not found", { status: 404 })
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

    // Return different status codes based on error type
    if (error instanceof Error) {
      if (
        error.message.includes("not found") ||
        error.message.includes("404")
      ) {
        return new Response("Resource not found", { status: 404 })
      }
      if (
        error.message.includes("validation") ||
        error.message.includes("invalid")
      ) {
        return new Response("Invalid request", { status: 400 })
      }
    }

    return new Response("Internal server error", { status: 500 })
  }
}
