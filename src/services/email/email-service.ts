import { EmailSendingException } from "@/exceptions/email/email-exceptions"
import { AdminOrderNotificationBody, EmailBody } from "@/types/email/email"
import { Resend } from "resend"
import OrderConfirmationEmail from "@/components/email-templates/buy-template"
import AdminOrderNotificationEmail from "@/components/email-templates/admin-order-template"

export class EmailService {
  private readonly resend: Resend
  private readonly adminNotificationEmail: string

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY)
    this.adminNotificationEmail =
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      process.env.ORDER_NOTIFICATION_EMAIL ||
      "lozacharg@gmail.com"
  }

  async sendOrderConfirmationEmail(emailBody: EmailBody): Promise<void> {
    const { email, name, buyedProducts, order, shipping, orderItems } =
      emailBody

    const { error } = await this.resend.emails.send({
      from: "Lozach <compras@lozachurban.store>",
      to: email,
      subject: "¡Tu compra en Lozach ha sido realizada con éxito!",
      react: OrderConfirmationEmail({
        email,
        name,
        buyedProducts,
        order,
        shipping,
        orderItems,
      }),
      text: "",
    })

    if (error) {
      throw new EmailSendingException(error.message)
    }

    return
  }

  async sendAdminOrderNotificationEmail(
    emailBody: AdminOrderNotificationBody
  ): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: "Lozach <compras@lozachurban.store>",
      to: this.adminNotificationEmail,
      subject: `Nueva orden recibida #${emailBody.order.id.slice(0, 8)}`,
      react: AdminOrderNotificationEmail(emailBody),
      text: "",
    })

    if (error) {
      throw new EmailSendingException(error.message)
    }
  }
}
