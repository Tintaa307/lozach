import {
  InvalidPreferenceDataException,
  PaymentCreationException,
} from "@/exceptions/payment/payment-exceptions"
import { CreatePreferenceSchema } from "@/lib/validations/payment-schema"
import {
  CreatePreferenceResponse,
  CreatePreferenceValues,
  UpdatePreferenceValues,
} from "@/types/payment/payment"
import MercadoPagoConfig, { Preference } from "mercadopago"
import { AuthService } from "../auth/auth-service"
import { AuthMissingUserException } from "@/exceptions/auth/auth-exceptions"
import { ValidationException } from "@/exceptions/base/base-exceptions"
import { ProductService } from "../products/product-service"
import { ProductNotFoundException } from "@/exceptions/products/product-exceptions"
import { PreferenceResponse } from "mercadopago/dist/clients/preference/commonTypes"
import { OrderService } from "../orders/order-service"
import { AddressesService } from "../addresses/addresses-service"
import { OrderItemsService } from "../order-items/order-items-service"
import {
  OrderItemsCreationException,
  OrderItemsFetchException,
} from "@/exceptions/order-items/order-items-exceptions"
import { ShippingService } from "../shipping/shipping-service"
import { Order } from "@/types/order/order"
import { EmailService } from "../email/email-service"
import { Product } from "@/types/types"
import { createClient as createAdminClient } from "@/lib/supabase/admin-client"
import { CreateShippingValues } from "@/types/shipping/shipping"
import { CorreoArgentinoService } from "../shipping/correo-argentino-service"
import {
  buildShippingDetails,
  isStorePickup,
  normalizeShippingCostForMethod,
  shouldUseCorreoArgentino,
} from "@/lib/utils/shipping-utils"

const userService = new AuthService()
const productService = new ProductService()
const orderService = new OrderService()
const addressesService = new AddressesService()
const orderItemsService = new OrderItemsService()
const shippingService = new ShippingService()
const emailService = new EmailService()
const correoArgentinoService = new CorreoArgentinoService()

export class PaymentService {
  private readonly client: Preference

  constructor() {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN as string
    if (!accessToken) {
      throw new Error("MERCADO_PAGO_ACCESS_TOKEN is not set")
    }

    const config = new MercadoPagoConfig({ accessToken })

    this.client = new Preference(config)
  }

  async createPreference(
    body: CreatePreferenceValues
  ): Promise<CreatePreferenceResponse> {
    const {
      products,
      identifier,
      address,
      details,
      postal_code,
      city,
      state,
      phone,
      shipping_method,
      shipping_cost,
      agency_code,
      agency_name,
      agency_address,
      save_info,
    } = body

    const validatedData = CreatePreferenceSchema.safeParse(body)
    const shippingCostNumber = normalizeShippingCostForMethod(
      shipping_method,
      shipping_cost
    )

    if (!validatedData.success) {
      throw new InvalidPreferenceDataException(
        validatedData.error.message,
        "Revisa la información de los campos",
        validatedData.error.flatten().fieldErrors as Record<string, string[]>
      )
    }

    const user = await userService.getUser()

    if (!user) {
      throw new AuthMissingUserException(
        "No hay una sesión iniciada",
        "No hay una sesión iniciada"
      )
    }

    let totalAmount = 0
    const items = []
    const order_items = []

    for (const cartItem of products) {
      if (!cartItem.id) {
        throw new ValidationException("ID de producto no proporcionado")
      }

      const product = await productService.getProductById(cartItem.id)

      if (!product) {
        throw new ProductNotFoundException(
          "Producto no encontrado",
          "Producto no encontrado"
        )
      }

      // TODO: Checkear stock (para mas adelante)

      const totalPrice = product.price * cartItem.quantity
      totalAmount += totalPrice

      items.push({
        id: `${product.id}-${Date.now()}`,
        title: product.name,
        quantity: cartItem.quantity,
        unit_price: product.price,
        currency_id: "ARS",
      })

      const productDetails = {
        product_id: product.id,
        color: cartItem.color,
        size: cartItem.size,
        product_name: product.name,
        quantity: cartItem.quantity,
        unit_price: product.price,
        sku: product.sku,
      }

      order_items.push(productDetails)
    }

    const request_id = `${user.id}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`

    let createdOrderId: string | null = null

    try {
      const appUrl = (
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      ).replace(/\/$/, "")
      const isHttps = appUrl.startsWith("https://")

      const result = (await this.client.create({
        body: {
          items: items,
          payer: {
            email: user.email,
          },
          back_urls: {
            success: `${appUrl}/payment/success`,
            failure: `${appUrl}/payment/failure`,
            pending: `${appUrl}/payment/pending`,
          },
          shipments:
            shippingCostNumber > 0
              ? {
                  mode: "not_specified",
                  cost: shippingCostNumber,
                  free_shipping: false,
                }
              : {
                  local_pickup: shipping_method === "store",
                  cost: 0,
                  free_shipping: true,
                },
          notification_url: `${appUrl}/api/mercadopago/webhook`,
          // auto_return only works with HTTPS — omit on localhost/HTTP to avoid MP errors
          ...(isHttps ? { auto_return: "approved" } : {}),
          external_reference: request_id,
          metadata: {
            request_id,
          },
        },
      })) as PreferenceResponse

      if (!result || !result.init_point || !result.id) {
        throw new PaymentCreationException(
          "Error al crear la preferencia",
          "Error al crear la preferencia"
        )
      }

      const order = await orderService.createOrder({
        user_id: user.id,
        total_amount: totalAmount + shippingCostNumber,
        subtotal: totalAmount,
        payment_id: result.id,
        payment_type: "mercadopago",
        collection_id: result.id,
        collection_status: "pending",
        external_reference: request_id,
        currency: "ARS",
        phone: phone,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      })
      createdOrderId = order.id

      if (save_info && !isStorePickup(shipping_method)) {
        await addressesService.createAddress({
          address,
          details,
          postal_code: Number(postal_code),
          city,
          state,
          phone,
          identifier: Number(identifier),
          order_id: order.id,
          user_id: user.id,
        })
      }

      for (const item of order_items) {
        try {
          await orderItemsService.createOrderItem({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.product_name,
            sku: item.sku,
            currency: "ARS" as const,
            quantity: item.quantity,
            unit_price: item.unit_price,
            color: item.color,
            size: item.size,
          })
        } catch (error) {
          throw new OrderItemsCreationException(
            (error as Error).message,
            "Error al crear el item de la orden. Por favor intente nuevamente."
          )
        }
      }

      const shippingPayload: CreateShippingValues = {
        address,
        details: buildShippingDetails(details, {
          code: agency_code || "",
          name: agency_name || agency_code || "",
          address: agency_address || "",
        }),
        postal_code: Number(postal_code),
        city,
        state,
        phone,
        identifier: Number(identifier),
        order_id: order.id,
        user_id: user.id,
        shipping_method,
        shipping_cost: shippingCostNumber,
        shipping_status: "draft",
        provider: "CA",
      }

      await shippingService.createShipping(shippingPayload)

      try {
        const user = await userService.getUserById(order.user_id)
        await emailService.sendAdminOrderNotificationEmail({
          customerName: user.name,
          customerEmail: user.email,
          order,
          orderItems: order_items.map((item) => ({
            id: crypto.randomUUID(),
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.product_name,
            sku: item.sku,
            currency: "ARS",
            quantity: item.quantity,
            unit_price: item.unit_price,
            color: item.color,
            size: item.size,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })),
          shipping: shippingPayload,
        })
      } catch (error) {
        console.error("Error sending admin order notification:", error)
      }

      return {
        init_point: result.init_point,
      }
    } catch (error) {
      this.logMercadoPagoError("create_preference", error, {
        userId: user.id,
        shippingMethod: shipping_method,
      })

      if (createdOrderId) {
        await this.cleanupFailedOrderCreation(createdOrderId)
      }

      console.error(error)
      throw new PaymentCreationException(
        (error as Error).message,
        "Error al crear la preferencia. Por favor intente nuevamente."
      )
    }
  }

  async updatePreferenceByExternalReference(
    body: UpdatePreferenceValues
  ): Promise<void> {
    const { external_reference, payment_id, collection_status } = body

    if (!external_reference || !payment_id || !collection_status) {
      throw new InvalidPreferenceDataException(
        "Información de la preferencia no proporcionada",
        "Revisa la información de los campos"
      )
    }

    const order = await orderService.getOrderByExternalReferenceAdmin(
      external_reference
    )

    const alreadyApproved = order.collection_status === "approved"
    const isNewApproval = !alreadyApproved && collection_status === "approved"

    if (collection_status !== "approved") {
      if (
        order.collection_status !== collection_status ||
        order.payment_id !== payment_id
      ) {
        await orderService.updateOrder(order.id, {
          external_reference: external_reference,
          payment_id: payment_id,
          collection_status: collection_status,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    }

    if (isNewApproval) {
      await orderService.updateOrder(order.id, {
        collection_status: collection_status,
        external_reference: external_reference,
        payment_id: payment_id,
        processed_at: new Date().toISOString() as string,
        expires_at: null,
        updated_at: new Date().toISOString(),
      })

      const shipping = await shippingService.findShippingByOrderId(order.id)

      if (shipping) {
        await shippingService.updateShipping(order.id, {
          order_id: order.id,
          shipping_status: "ready",
          updated_at: new Date().toISOString(),
        })

        if (shouldUseCorreoArgentino(shipping.shipping_method)) {
          await this.tryImportShipmentToCorreo(order, shipping)
        }
      }

      // TODO: Remove stock from products
    }

    // Send confirmation email if approved and not already sent
    const shouldSendEmail =
      (alreadyApproved || collection_status === "approved") &&
      !order.email_sent

    if (shouldSendEmail) {
      await this.sendOrderConfirmationEmail(order)

      await orderService.updateOrder(order.id, {
        email_sent: true,
        updated_at: new Date().toISOString(),
      })
    }

    return
  }

  private async sendOrderConfirmationEmail(order: Order): Promise<void> {
    const orderItems = await orderItemsService.getOrderItemsByOrderId(
      order.id
    )

    if (!orderItems) {
      throw new OrderItemsFetchException(
        "Items de la orden no encontrados",
        "Items de la orden no encontrados"
      )
    }

    const buyedProducts = [] as Product[]

    for (const item of orderItems) {
      const product = await productService.getProductById(item.product_id)
      if (product) {
        buyedProducts.push(product)
      }
    }

    const shipping = await shippingService.findShippingByOrderId(order.id)

    const user = await userService.getUserById(order.user_id)

    if (!user) {
      throw new AuthMissingUserException(
        "Email no encontrado",
        "Email no encontrado"
      )
    }

    await emailService.sendOrderConfirmationEmail({
      email: user.email,
      name: user.name,
      buyedProducts,
      orderItems,
      order,
      shipping,
    })
  }

  private async tryImportShipmentToCorreo(
    order: Order,
    shipping: NonNullable<Awaited<ReturnType<ShippingService["findShippingByOrderId"]>>>
  ): Promise<void> {
    try {
      const [user, orderItems] = await Promise.all([
        userService.getUserById(order.user_id),
        orderItemsService.getOrderItemsByOrderId(order.id),
      ])

      await correoArgentinoService.importShipment({
        order,
        shipping,
        orderItems,
        recipientName: user.name,
        recipientEmail: user.email,
      })
    } catch (error) {
      console.error("[CorreoArgentino:importShipment]", {
        orderId: order.id,
        shippingMethod: shipping.shipping_method,
        error,
      })
    }
  }

  private async cleanupFailedOrderCreation(orderId: string): Promise<void> {
    const supabase = createAdminClient()

    const cleanups = [
      supabase.from("addresses").delete().eq("order_id", orderId),
      supabase.from("order_items").delete().eq("order_id", orderId),
      supabase.from("shipping").delete().eq("order_id", orderId),
    ]

    for (const cleanup of cleanups) {
      const { error } = await cleanup
      if (error) {
        console.error("Error cleaning up order resources:", orderId, error)
      }
    }

    const { error } = await supabase.from("orders").delete().eq("id", orderId)
    if (error) {
      console.error("Error cleaning up order:", orderId, error)
    }
  }

  private logMercadoPagoError(
    context: string,
    error: unknown,
    extra: Record<string, unknown> = {}
  ): void {
    const mpError = error as {
      message?: string
      status?: number
      cause?: unknown
      response?: { status?: number; data?: unknown }
    }

    console.error(`[MercadoPago:${context}]`, {
      message: mpError?.message || "Unknown MercadoPago error",
      status: mpError?.status || mpError?.response?.status || null,
      cause: mpError?.cause || null,
      response: mpError?.response?.data || null,
      ...extra,
    })
  }
}
