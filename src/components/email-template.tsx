import * as React from "react"
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface NewsletterSubscriptionEmailProps {
  userEmail?: string
  websiteName?: string
  websiteUrl?: string
  unsubscribeUrl?: string
}

export const NewsletterSubscriptionEmail = ({
  userEmail,
  websiteName = "Lozach",
  websiteUrl = "https://lozachurban.store",
  unsubscribeUrl = "https://lozachurban.store/unsubscribe",
}: NewsletterSubscriptionEmailProps) => {
  const currentYear = new Date().getFullYear()

  return (
    <Html>
      <Head />
      <Preview>¡Gracias por suscribirte a nuestro newsletter!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Link href={websiteUrl}>
              <Heading as="h1" style={logo}>
                {websiteName}
              </Heading>
            </Link>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={heading}>
              ¡Bienvenido a nuestro newsletter!
            </Heading>

            <Text style={paragraph}>Hola {userEmail},</Text>

            <Text style={paragraph}>
              ¡Gracias por suscribirte a nuestro newsletter! Estamos emocionados
              de tenerte como parte de nuestra comunidad.
            </Text>

            <Text style={paragraph}>
              A partir de ahora, recibirás actualizaciones de nuestro contenido
              más reciente, noticias, consejos y ofertas exclusivas directamente
              en tu bandeja de entrada.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={websiteUrl}>
                Visitar Nuestro Sitio
              </Button>
            </Section>

            <Text style={paragraph}>
              Si tienes alguna pregunta o sugerencia, no dudes en responder a
              este correo.
            </Text>

            <Text style={paragraph}>
              ¡Saludos!
              <br />
              El equipo de {websiteName}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              © {currentYear} {websiteName}. Todos los derechos reservados.
            </Text>
            <Text style={footerText}>
              Recibiste este email porque te suscribiste a nuestro newsletter.
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={footerLink}>
                Cancelar suscripción
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default NewsletterSubscriptionEmail

// Estilos
const main = {
  backgroundColor: "#f9f9f9",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
}

const logoContainer = {
  padding: "20px",
  textAlign: "center" as const,
}

const logo = {
  color: "#3b82f6",
  fontSize: "32px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  margin: "0",
}

const content = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
}

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "20px",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#4b5563",
  margin: "16px 0",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
}

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 24px",
}

const hr = {
  borderColor: "#e5e7eb",
  margin: "30px 0",
}

const footer = {
  textAlign: "center" as const,
  padding: "0 30px",
}

const footerText = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "8px 0",
}

const footerLink = {
  color: "#6b7280",
  textDecoration: "underline",
}
