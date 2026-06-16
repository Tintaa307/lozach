import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

export interface ShippingStatusEmailProps {
  name: string
  orderId: string
  variant: "in_transit" | "delivered"
  trackingNumber?: string | null
  trackingUrl?: string | null
  supportEmail: string
}

const COPY = {
  in_transit: {
    title: "¡Tu pedido está en camino! 🚚",
    preview: "Despachamos tu pedido y ya está viajando con Correo Argentino.",
    summary:
      "Despachamos tu pedido y ya está en camino con Correo Argentino. Te avisamos para que puedas seguirlo.",
    cta: "Seguí tu envío",
    closing:
      "Te volveremos a escribir cuando el pedido sea entregado. ¡Gracias por tu compra!",
  },
  delivered: {
    title: "Tu pedido fue entregado ✅",
    preview: "Correo Argentino marcó tu pedido como entregado.",
    summary:
      "Correo Argentino nos informó que tu pedido fue entregado. ¡Esperamos que lo disfrutes!",
    cta: "Ver detalle del envío",
    closing:
      "Si no recibiste el pedido o tenés algún inconveniente, respondé este mail y lo resolvemos.",
  },
} as const

export default function ShippingStatusEmail({
  name,
  orderId,
  variant,
  trackingNumber,
  trackingUrl,
  supportEmail,
}: ShippingStatusEmailProps) {
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
          <Heading style={{ fontSize: 22, color: "#111827", marginBottom: 8 }}>
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
            {trackingNumber && (
              <>
                <Text style={{ margin: 0, color: "#6B7280", fontSize: 12 }}>
                  Número de seguimiento
                </Text>
                <Text
                  style={{
                    margin: "4px 0 0",
                    color: "#111827",
                    fontSize: 16,
                    fontFamily: "monospace",
                  }}
                >
                  {trackingNumber}
                </Text>
              </>
            )}
          </Section>

          {trackingUrl && (
            <Section style={{ textAlign: "center", margin: "8px 0 16px" }}>
              <Button
                href={trackingUrl}
                style={{
                  backgroundColor: "#111827",
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "12px 20px",
                  borderRadius: 8,
                  textDecoration: "none",
                }}
              >
                {copy.cta}
              </Button>
            </Section>
          )}

          <Text style={{ color: "#6B7280", fontSize: 13 }}>{copy.closing}</Text>

          <Hr style={{ borderColor: "#E5E7EB", margin: "24px 0" }} />
          <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
            ¿Necesitás ayuda? Escribinos a {supportEmail}.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
