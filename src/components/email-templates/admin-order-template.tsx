import { AdminOrderNotificationBody } from "@/types/email/email"
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
  }).format(amount)

export default function AdminOrderNotificationEmail({
  customerName,
  customerEmail,
  order,
  orderItems,
  shipping,
}: AdminOrderNotificationBody) {
  const previewText = `Nueva orden ${order.collection_status} #${order.id.slice(
    0,
    8
  )}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Nueva orden recibida</Heading>

          <Section style={section}>
            <Text style={label}>Orden</Text>
            <Text style={value}>#{order.id.slice(0, 8)}</Text>
            <Text style={label}>Estado de pago</Text>
            <Text style={value}>{order.collection_status || "pending"}</Text>
            <Text style={label}>Total</Text>
            <Text style={value}>
              {formatMoney(order.total_amount, order.currency)}
            </Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Cliente</Text>
            <Text style={value}>{customerName}</Text>
            <Text style={value}>{customerEmail}</Text>
            <Text style={value}>{order.phone}</Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Productos</Text>
            {orderItems.map((item) => (
              <Text key={item.id} style={itemText}>
                {item.quantity} x {item.product_name} | Color: {item.color} |
                Talle: {item.size} | SKU: {item.sku}
              </Text>
            ))}
          </Section>

          <Section style={section}>
            <Text style={label}>Envío</Text>
            <Text style={value}>Método: {shipping.shipping_method}</Text>
            <Text style={value}>
              Costo: {formatMoney(shipping.shipping_cost, order.currency)}
            </Text>
            <Text style={value}>{shipping.address}</Text>
            {!!shipping.details && <Text style={value}>{shipping.details}</Text>}
            <Text style={value}>
              {shipping.city}, {shipping.state} {shipping.postal_code}
            </Text>
            <Text style={value}>Tel: {shipping.phone}</Text>
            <Text style={value}>DNI/CUIT: {shipping.identifier}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: "24px 0",
}

const container = {
  margin: "0 auto",
  maxWidth: "640px",
  backgroundColor: "#ffffff",
  padding: "24px",
}

const heading = {
  fontSize: "28px",
  margin: "0 0 24px",
  color: "#111111",
}

const section = {
  marginBottom: "20px",
  padding: "16px",
  border: "1px solid #e5e5e5",
}

const label = {
  fontSize: "13px",
  fontWeight: "700",
  color: "#666666",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
}

const value = {
  fontSize: "15px",
  color: "#111111",
  margin: "0 0 6px",
}

const itemText = {
  fontSize: "14px",
  color: "#111111",
  margin: "0 0 8px",
}
