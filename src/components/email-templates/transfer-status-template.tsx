import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

export interface TransferStatusEmailProps {
  name: string
  orderId: string
  totalAmount: number
  currency: string
  variant: "reserved" | "rejected"
  rejectionReason?: string | null
  supportEmail: string
}

const formatMoney = (amount: number, currency: string) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

const COPY = {
  reserved: {
    title: "¡Recibimos tu comprobante!",
    preview: "Reservamos tu pedido. Lo confirmamos en cuanto validemos el pago.",
    summary:
      "Recibimos el comprobante de tu transferencia y reservamos tu pedido. Vamos a validarlo y te avisaremos por mail cuando se confirme.",
    cta: "Mientras tanto, podés ver el estado en Mis pedidos.",
  },
  rejected: {
    title: "No pudimos validar tu comprobante",
    preview: "Tu comprobante de transferencia fue rechazado.",
    summary:
      "Revisamos el comprobante de transferencia y no pudimos validar el pago. Por favor, volvé a enviarnos un comprobante válido o escribinos para coordinar.",
    cta: "Si tenés dudas, respondé este mail y te ayudamos.",
  },
} as const

export default function TransferStatusEmail({
  name,
  orderId,
  totalAmount,
  currency,
  variant,
  rejectionReason,
  supportEmail,
}: TransferStatusEmailProps) {
  const copy = COPY[variant]

  return (
    <Html>
      <Head />
      <Preview>{copy.preview}</Preview>
      <Body
        style={{
          backgroundColor: "#F9FAFB",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            backgroundColor: "#FFFFFF",
            margin: "32px auto",
            maxWidth: 560,
            padding: 32,
            borderRadius: 12,
          }}
        >
          <Heading
            style={{ fontSize: 22, color: "#111827", marginBottom: 8 }}
          >
            {copy.title}
          </Heading>
          <Text style={{ color: "#374151", fontSize: 14, lineHeight: "22px" }}>
            Hola {name}, {copy.summary}
          </Text>

          <Section
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: 8,
              padding: 16,
              margin: "16px 0",
            }}
          >
            <Text style={{ margin: 0, color: "#6B7280", fontSize: 12 }}>
              Pedido
            </Text>
            <Text
              style={{
                margin: "4px 0 8px",
                color: "#111827",
                fontSize: 14,
                fontFamily: "monospace",
              }}
            >
              #{orderId.slice(0, 8)}
            </Text>
            <Text style={{ margin: 0, color: "#6B7280", fontSize: 12 }}>
              Total
            </Text>
            <Text style={{ margin: "4px 0 0", color: "#111827", fontSize: 16 }}>
              {formatMoney(totalAmount, currency)}
            </Text>
          </Section>

          {variant === "rejected" && rejectionReason && (
            <Section
              style={{
                backgroundColor: "#FEF2F2",
                borderRadius: 8,
                padding: 16,
                margin: "16px 0",
              }}
            >
              <Text style={{ margin: 0, color: "#991B1B", fontSize: 13 }}>
                <strong>Motivo:</strong> {rejectionReason}
              </Text>
            </Section>
          )}

          <Text style={{ color: "#6B7280", fontSize: 13 }}>{copy.cta}</Text>

          <Hr style={{ borderColor: "#E5E7EB", margin: "24px 0" }} />
          <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
            ¿Necesitás ayuda? Escribinos a {supportEmail}.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
