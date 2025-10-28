import { Order } from "@/types/order/order"
import { Product } from "@/types/products/types"
import { Shipping, ShippingStatus } from "@/types/shipping/shipping"
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"

type Props = {
  logoUrl?: string
  name: string
  buyedProducts: Product[]
  order: Order
  shipping: Shipping
}

const formatMoney = (amount: number, currency: string) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const getShippingMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    home: "Envío a domicilio",
    express: "Envío express",
    store: "Retiro en tienda",
  }
  return labels[method] || method
}

const getStatusBadgeColor = (status: ShippingStatus) => {
  const colors: Record<ShippingStatus, string> = {
    draft: "#6B7280",
    ready: "#3B82F6",
    shipped: "#10B981",
    cancelled: "#EF4444",
  }
  return colors[status] || "#6B7280"
}

const getStatusLabel = (status: ShippingStatus) => {
  const labels: Record<ShippingStatus, string> = {
    draft: "Borrador",
    ready: "Listo para enviar",
    shipped: "Enviado",
    cancelled: "Cancelado",
  }
  return labels[status] || status
}

export default function OrderConfirmationEmail({
  logoUrl = "https://lozachurban.store/logo-big.png",
  name,
  buyedProducts = [],
  order,
  shipping,
}: Props) {
  const previewText = `Gracias por tu compra, ${name}. Tu pedido #${order.id.slice(
    0,
    8
  )} ha sido confirmado.`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src={logoUrl}
              alt="Lozach"
              width="200"
              height="70"
              style={logo}
            />
          </Section>

          <Hr style={divider} />

          {/* Dark Hero Section */}
          <Section style={hero}>
            <Heading style={heroHeading}>¡Gracias por tu compra!</Heading>
            <Text style={heroSubheading}>Tu pedido ha sido confirmado.</Text>
          </Section>

          {/* Greeting */}
          <Section style={content}>
            <Text style={greeting}>Hola {name},</Text>
            <Text style={paragraph}>
              Gracias por comprar en Lozach. Estamos emocionados de enviarte tu
              pedido. Recibirás un email de confirmación de envío con detalles
              de seguimiento una vez que tus artículos estén en camino.
            </Text>
          </Section>

          {/* Order Summary Card */}
          <Section style={card}>
            <Heading as="h2" style={cardHeading}>
              Resumen del Pedido
            </Heading>

            <Row style={summaryRow}>
              <Column>
                <Text style={summaryLabel}>ID del Pedido</Text>
                <Text style={summaryValue}>#{order.id.slice(0, 8)}</Text>
              </Column>
              <Column>
                <Text style={summaryLabel}>Fecha</Text>
                <Text style={summaryValue}>{formatDate(order.created_at)}</Text>
              </Column>
            </Row>

            <Row style={summaryRow}>
              <Column>
                <Text style={summaryLabel}>Método de Pago</Text>
                <Text style={summaryValue}>Mercado Pago</Text>
              </Column>
            </Row>

            <Hr style={cardDivider} />

            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Subtotal</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>
                  {formatMoney(order.subtotal, order.currency)}
                </Text>
              </Column>
            </Row>

            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Envío</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>
                  {formatMoney(shipping.shipping_cost, order.currency)}
                </Text>
              </Column>
            </Row>

            <Hr style={cardDivider} />

            <Row style={totalRow}>
              <Column>
                <Text style={totalLabelBold}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={totalValueBold}>
                  {formatMoney(order.total_amount, order.currency)}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Product List */}
          <Section style={card}>
            <Heading as="h2" style={cardHeading}>
              Artículos Pedidos
            </Heading>

            {buyedProducts.map((product, index) => (
              <div key={product.id}>
                {index > 0 && <Hr style={productDivider} />}
                <Row style={productRow}>
                  <Column style={productImageColumn}>
                    {product.image_url ? (
                      <Img
                        src={product.image_url}
                        alt={product.name}
                        width="80"
                        height="80"
                        style={productImage}
                      />
                    ) : (
                      <div style={productImagePlaceholder}>
                        <Text style={placeholderText}>Sin imagen</Text>
                      </div>
                    )}
                  </Column>
                  <Column style={productDetailsColumn}>
                    <Text style={productName}>{product.name}</Text>
                    <Text style={productDetail}>
                      Color: {product.color.join(", ")}
                    </Text>
                    <Text style={productDetail}>Tela: {product.fabric}</Text>
                    <Text style={productDetail}>
                      Talle: {product.size.talles.join(", ")}
                    </Text>
                    <Text style={productDetail}>SKU: {product.sku}</Text>
                  </Column>
                  <Column style={productPriceColumn} align="right">
                    <Text style={productPrice}>
                      {formatMoney(product.price, order.currency)}
                    </Text>
                    <Text style={productQuantity}>Cant: 1</Text>
                  </Column>
                </Row>
              </div>
            ))}
          </Section>

          {/* Shipping Information */}
          <Section style={card}>
            <Heading as="h2" style={cardHeading}>
              Información de Envío
            </Heading>

            <Row style={shippingRow}>
              <Column>
                <Text style={shippingLabel}>Método</Text>
                <Text style={shippingValue}>
                  {getShippingMethodLabel(shipping.shipping_method)}
                </Text>
              </Column>
              <Column>
                <Text style={shippingLabel}>Proveedor</Text>
                <Text style={shippingValue}>
                  {shipping.provider === "CA" ? "Correo Argentino" : "CA"}
                </Text>
              </Column>
            </Row>

            <Row style={shippingRow}>
              <Column>
                <Text style={shippingLabel}>Estado</Text>
                <div
                  style={{
                    ...statusBadge,
                    backgroundColor: getStatusBadgeColor(
                      shipping.shipping_status
                    ),
                  }}
                >
                  <Text style={statusBadgeText}>
                    {getStatusLabel(shipping.shipping_status)}
                  </Text>
                </div>
              </Column>
            </Row>

            <Hr style={cardDivider} />

            {shipping.shipping_method === "store" ? (
              <div>
                <Text style={addressHeading}>Retiro en tienda</Text>
                <Text style={addressText}>
                  Tu pedido estará listo para retirar en nuestra tienda. Te
                  enviaremos una notificación cuando esté listo. Por favor trae
                  una identificación válida y tu número de pedido.
                </Text>
                <Text style={addressText}>
                  <strong>ID de Seguimiento:</strong> {shipping.identifier}
                </Text>
              </div>
            ) : (
              <div>
                <Text style={addressHeading}>Dirección de Entrega</Text>
                <Text style={addressText}>{shipping.address}</Text>
                {shipping.details && (
                  <Text style={addressText}>{shipping.details}</Text>
                )}
                <Text style={addressText}>
                  {shipping.city}, {shipping.state} {shipping.postal_code}
                </Text>
                <Text style={addressText}>Teléfono: {shipping.phone}</Text>
                <Text style={addressText}>
                  <strong>ID de Seguimiento:</strong> {shipping.identifier}
                </Text>
              </div>
            )}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              ¿Necesitas ayuda? Responde a este email o contacta a nuestro
              equipo de soporte.
            </Text>

            <Row style={socialRow}>
              <Column align="center">
                <Link
                  href="https://instagram.com/lozachurban"
                  style={socialLink}
                >
                  Instagram
                </Link>
                <Text style={footerSeparator}>•</Text>
                <Link href="mailto:lozacharg@gmail.com" style={socialLink}>
                  Soporte por Email
                </Link>
              </Column>
            </Row>

            <Text style={copyright}>
              © {new Date().getFullYear()} Lozach. Todos los derechos
              reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

const container = {
  margin: "0 auto",
  maxWidth: "600px",
  width: "100%",
}

const header = {
  padding: "32px 24px",
  textAlign: "center" as const,
}

const logo = {
  margin: "0 auto",
  display: "block",
}

const divider = {
  borderColor: "#E5E5E5",
  margin: "0",
}

const hero = {
  backgroundColor: "#0F0F0F",
  padding: "48px 24px",
  textAlign: "center" as const,
}

const heroHeading = {
  color: "#FFFFFF",
  fontSize: "32px",
  fontWeight: "700",
  lineHeight: "1.2",
  margin: "0 0 12px 0",
}

const heroSubheading = {
  color: "#D1D5DB",
  fontSize: "18px",
  lineHeight: "1.5",
  margin: "0",
}

const content = {
  padding: "32px 24px",
  textAlign: "center" as const,
}

const greeting = {
  fontSize: "18px",
  fontWeight: "600",
  lineHeight: "1.5",
  margin: "0 0 16px 0",
  color: "#111111",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.75",
  margin: "0",
  color: "#4B5563",
}

const card = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E5E5E5",
  borderRadius: "8px",
  margin: "0 auto 24px auto",
  padding: "24px",
  maxWidth: "552px",
}

const cardHeading = {
  fontSize: "20px",
  fontWeight: "600",
  lineHeight: "1.4",
  margin: "0 0 20px 0",
  color: "#111111",
}

const summaryRow = {
  marginBottom: "16px",
}

const summaryLabel = {
  fontSize: "14px",
  color: "#6B7280",
  margin: "0 0 4px 0",
}

const summaryValue = {
  fontSize: "16px",
  color: "#111111",
  fontWeight: "500",
  margin: "0",
}

const cardDivider = {
  borderColor: "#E5E5E5",
  margin: "16px 0",
}

const totalRow = {
  marginBottom: "8px",
}

const totalLabel = {
  fontSize: "15px",
  color: "#4B5563",
  margin: "0",
}

const totalValue = {
  fontSize: "15px",
  color: "#111111",
  margin: "0",
}

const totalLabelBold = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#111111",
  margin: "0",
}

const totalValueBold = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#111111",
  margin: "0",
}

const productRow = {
  marginBottom: "20px",
  display: "table",
  width: "100%",
}

const productImageColumn = {
  width: "80px",
  verticalAlign: "top" as const,
  paddingRight: "16px",
  display: "table-cell",
}

const productImage = {
  borderRadius: "6px",
  objectFit: "cover" as const,
}

const productImagePlaceholder = {
  width: "80px",
  height: "80px",
  backgroundColor: "#F3F4F6",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const placeholderText = {
  fontSize: "12px",
  color: "#9CA3AF",
  margin: "0",
}

const productDetailsColumn = {
  verticalAlign: "top" as const,
  paddingRight: "12px",
}

const productName = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#111111",
  margin: "0 0 8px 0",
  lineHeight: "1.3",
}

const productDetail = {
  fontSize: "14px",
  color: "#6B7280",
  margin: "0 0 4px 0",
  lineHeight: "1.4",
}

const productPriceColumn = {
  verticalAlign: "top" as const,
  width: "auto",
  minWidth: "80px",
  whiteSpace: "nowrap" as const,
}

const productPrice = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#111111",
  margin: "0 0 4px 0",
  whiteSpace: "nowrap" as const,
}

const productQuantity = {
  fontSize: "14px",
  color: "#6B7280",
  margin: "0",
  lineHeight: "1.4",
}

const productDivider = {
  borderColor: "#E5E5E5",
  margin: "16px 0",
}

const shippingRow = {
  marginBottom: "16px",
}

const shippingLabel = {
  fontSize: "14px",
  color: "#6B7280",
  margin: "0 0 4px 0",
}

const shippingValue = {
  fontSize: "16px",
  color: "#111111",
  fontWeight: "500",
  margin: "0",
}

const statusBadge = {
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "12px",
  marginTop: "4px",
}

const statusBadgeText = {
  fontSize: "13px",
  color: "#FFFFFF",
  fontWeight: "500",
  margin: "0",
}

const addressHeading = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#111111",
  margin: "0 0 12px 0",
}

const addressText = {
  fontSize: "15px",
  color: "#4B5563",
  lineHeight: "1.6",
  margin: "0 0 6px 0",
}

const footer = {
  padding: "32px 24px",
  textAlign: "center" as const,
}

const footerText = {
  fontSize: "14px",
  color: "#6B7280",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
}

const socialRow = {
  marginBottom: "16px",
}

const socialLink = {
  color: "#111111",
  fontSize: "14px",
  textDecoration: "none",
  fontWeight: "500",
}

const footerSeparator = {
  display: "inline",
  margin: "0 8px",
  color: "#D1D5DB",
  fontSize: "14px",
}

const copyright = {
  fontSize: "13px",
  color: "#9CA3AF",
  margin: "0",
}
