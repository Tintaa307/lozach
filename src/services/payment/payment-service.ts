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
import { OrderNotFoundException } from "@/exceptions/orders/orders-exceptions"
import { EmailService } from "../email/email-service"
import { ShippingFetchException } from "@/exceptions/shipping/shipping-exceptions"
import { Product } from "@/types/types"

const userService = new AuthService()
const productService = new ProductService()
const orderService = new OrderService()
const addressesService = new AddressesService()
const orderItemsService = new OrderItemsService()
const shippingService = new ShippingService()
const emailService = new EmailService()

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
      save_info,
    } = body

    const validatedData = CreatePreferenceSchema.safeParse(body)

    const shippingCostNumber =
      shipping_cost !== "Gratis" ? Number(shipping_cost) : 0

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

    try {
      const result = (await this.client.create({
        body: {
          items: items,
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
            failure: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
            pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending`,
          },
          auto_return: "approved",
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
        subtotal: totalAmount - shippingCostNumber,
        payment_id: result.id,
        payment_type: "mercadopago",
        collection_id: result.id,
        collection_status: "pending",
        external_reference: request_id,
        currency: "ARS",
        phone: phone,
      })

      if (save_info) {
        await addressesService.createAddress({
          address,
          details,
          postal_code,
          city,
          state,
          phone,
          identifier,
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

      await shippingService.createShipping({
        address,
        details,
        postal_code,
        city,
        state,
        phone,
        identifier,
        order_id: order.id,
        user_id: user.id,
        shipping_method,
        shipping_cost: shippingCostNumber,
        shipping_status: "draft",
        provider: "CA",
      })

      return {
        init_point: result.init_point,
      }
    } catch (error) {
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

    const order = await orderService.getOrderByExternalReference(
      external_reference
    )

    if (!order) {
      throw new OrderNotFoundException(
        "Orden no encontrada",
        "Orden no encontrada"
      )
    }

    const alreadyApproved = order.collection_status === "approved"

    if (collection_status !== "approved") {
      if (
        order.collection_status !== collection_status ||
        order.payment_id !== payment_id
      ) {
        await orderService.updateOrder(order.id, {
          external_reference: external_reference,
          payment_id: payment_id,
          collection_status: collection_status,
        })
      }
    }

    if (alreadyApproved && !order.email_sent) {
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

      const shipping = await shippingService.getShippingByOrderId(order.id)

      if (!shipping) {
        throw new ShippingFetchException(
          "Envío no encontrado",
          "Envío no encontrado"
        )
      }

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
        order,
        shipping,
      })
    }

    if (!alreadyApproved && collection_status === "approved") {
      await orderService.updateOrder(order.id, {
        collection_status: collection_status,
        external_reference: external_reference,
        payment_id: payment_id,
        processed_at: new Date().toISOString() as string,
      })

      await shippingService.updateShipping(order.id, {
        order_id: order.id,
        shipping_status: "ready",
        updated_at: new Date().toISOString(),
      })

      if (order.email_sent) {
        return
      }

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

      const shipping = await shippingService.getShippingByOrderId(order.id)

      if (!shipping) {
        throw new ShippingFetchException(
          "Envío no encontrado",
          "Envío no encontrado"
        )
      }

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
        order,
        shipping,
      })

      // TODO: Remove stock from products
    }

    return
  }
}
