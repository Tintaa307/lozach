import { EmailSendingException } from "@/exceptions/email/email-exceptions"
import { AdminOrderNotificationBody, EmailBody } from "@/types/email/email"
import { Resend } from "resend"
import OrderConfirmationEmail from "@/components/email-templates/buy-template"
import AdminOrderNotificationEmail from "@/components/email-templates/admin-order-template"
import TransferStatusEmail from "@/components/email-templates/transfer-status-template"
import { Order } from "@/types/order/order"

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

  async sendTransferReservedEmail(args: {
    email: string
    name: string
    order: Order
  }): Promise<void> {
    const { email, name, order } = args
    const supportEmail =
      process.env.NEXT_PUBLIC_SUPPORT_EMAIL || this.adminNotificationEmail

    const { error } = await this.resend.emails.send({
      from: "Lozach <compras@lozachurban.store>",
      to: email,
      subject: "Reservamos tu pedido — recibimos tu comprobante",
      react: TransferStatusEmail({
        name,
        orderId: order.id,
        totalAmount: order.total_amount,
        currency: order.currency,
        variant: "reserved",
        supportEmail,
      }),
      text: "",
    })

    if (error) {
      throw new EmailSendingException(error.message)
    }
  }

  async sendTransferRejectedEmail(args: {
    email: string
    name: string
    order: Order
    reason?: string | null
  }): Promise<void> {
    const { email, name, order, reason } = args
    const supportEmail =
      process.env.NEXT_PUBLIC_SUPPORT_EMAIL || this.adminNotificationEmail

    const { error } = await this.resend.emails.send({
      from: "Lozach <compras@lozachurban.store>",
      to: email,
      subject: "No pudimos validar tu comprobante",
      react: TransferStatusEmail({
        name,
        orderId: order.id,
        totalAmount: order.total_amount,
        currency: order.currency,
        variant: "rejected",
        rejectionReason: reason,
        supportEmail,
      }),
      text: "",
    })

    if (error) {
      throw new EmailSendingException(error.message)
    }
  }
}
