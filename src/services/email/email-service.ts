import { EmailSendingException } from "@/exceptions/email/email-exceptions"
import { EmailBody } from "@/types/email/email"
import { Resend } from "resend"
import OrderConfirmationEmail from "@/components/email-templates/buy-template"

export class EmailService {
  private readonly resend: Resend

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY)
  }

  async sendOrderConfirmationEmail(emailBody: EmailBody): Promise<void> {
    const { email, name, buyedProducts, order, shipping } = emailBody

    const { error } = await this.resend.emails.send({
      from: "Lozach <compras@lozachurban.store>",
      to: email,
      subject: "¡Tu compra en Lozach ha sido realizada con éxito!",
      react: OrderConfirmationEmail({
        name,
        buyedProducts,
        order,
        shipping,
      }),
      text: "",
    })

    if (error) {
      throw new EmailSendingException(error.message)
    }

    return
  }
}
