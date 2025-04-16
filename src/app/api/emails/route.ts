import { Resend } from "resend"
import { NextResponse } from "next/server"
import { NewsletterSubscriptionEmail } from "@/components/email-template"

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed", status: 405 })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const data = await req.json()

    if (!data) {
      return NextResponse.json({
        message: "No se recibieron datos.",
        status: 400,
      })
    }

    const { email } = data

    await resend.emails.send({
      from: "Lozach <newsletter@lozachurban.store>",
      to: ["lozacharg@gmail.com", email],
      subject: "Bienvenido a nuestro newsletter!",
      react: NewsletterSubscriptionEmail({
        userEmail: email,
      }),
      text: "",
    })

    return NextResponse.json({
      message: "El email fue enviado con éxito.",
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      message: "Hubo un error al enviar el email.",
      status: 500,
    })
  }
}
