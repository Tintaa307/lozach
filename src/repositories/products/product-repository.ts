import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@/lib/supabase/admin-client"
import { Product } from "@/types/types"
import {
  CreateProductValues,
  ProductFilters,
  UpdateProductValues,
} from "@/types/products/types"
import {
  ProductNotFoundException,
  ProductCreationException,
  ProductUpdateException,
  ProductDeletionException,
  ProductFetchException,
} from "@/exceptions/products/product-exceptions"
import { ValidationException } from "@/exceptions/base/base-exceptions"
import { CreateProductSchema } from "@/lib/validations/product-schema"

export class ProductRepository {
  async getAllProducts(filters?: ProductFilters): Promise<Product[]> {
    const supabase = await createClient()

    try {
      let query = supabase.from("products").select("*")

      if (filters?.category) {
        query = query.eq("category", filters.category)
      }

      if (filters?.color && filters.color.length > 0) {
        query = query.overlaps("color", filters.color)
      }

      if (filters?.fabric) {
        query = query.eq("fabric", filters.fabric)
      }

      if (filters?.minPrice) {
        query = query.gte("price", filters.minPrice)
      }

      if (filters?.maxPrice) {
        query = query.lte("price", filters.maxPrice)
      }

      if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) {
        throw new ProductFetchException(
          error.message,
          "Error al obtener los productos"
        )
      }

      if (!data) {
        return []
      }

      return data as Product[]
    } catch (error) {
      if (error instanceof ProductFetchException) {
        throw error
      }
      throw new ProductFetchException(
        "Error interno al obtener productos",
        "Error al obtener los productos"
      )
    }
  }

  async getProductById(id: number): Promise<Product> {
    const supabase = await createClient()

    try {
      if (!id) {
        throw new ValidationException(
          "ID de producto no proporcionado",
          undefined,
          "ID de producto requerido"
        )
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        throw new ProductNotFoundException(
          error.message,
          "Producto no encontrado"
        )
      }

      if (!data) {
        throw new ProductNotFoundException(
          "Producto no encontrado",
          "Producto no encontrado"
        )
      }

      return data as Product
    } catch (error) {
      if (
        error instanceof ProductNotFoundException ||
        error instanceof ValidationException
      ) {
        throw error
      }
      throw new ProductFetchException(
        "Error interno al obtener el producto",
        "Error al obtener el producto"
      )
    }
  }

  async getProductsByIds(ids: number[]): Promise<Product[]> {
    const supabase = await createClient()

    try {
      if (!ids || ids.length === 0) {
        throw new ValidationException(
          "IDs de productos no proporcionados",
          undefined,
          "IDs de productos requeridos"
        )
      }

      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, category, color, size, fabric, sku")
        .in("id", ids)

      if (error) {
        throw new ProductFetchException(
          error.message,
          "Error al obtener los productos"
        )
      }

      if (!data || data.length === 0) {
        return []
      }

      return data as Product[]
    } catch (error) {
      if (
        error instanceof ProductFetchException ||
        error instanceof ValidationException
      ) {
        throw error
      }
      throw new ProductFetchException(
        "Error interno al obtener los productos",
        "Error al obtener los productos"
      )
    }
  }

  async getProductsByNames(names: string[]): Promise<Product[]> {
    const supabase = await createClient()

    try {
      if (!names || names.length === 0) {
        throw new ValidationException(
          "Nombres de productos no proporcionados",
          undefined,
          "Nombres de productos requeridos"
        )
      }

      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, category, color, size, fabric, sku")
        .in("name", names)
        .limit(6)

      if (error) {
        throw new ProductFetchException(
          error.message,
          "Error al obtener los productos"
        )
      }

      if (!data || data.length === 0) {
        return []
      }

      return data as Product[]
    } catch (error) {
      if (
        error instanceof ProductFetchException ||
        error instanceof ValidationException
      ) {
        throw error
      }
      throw new ProductFetchException(
        "Error interno al obtener los productos",
        "Error al obtener los productos"
      )
    }
  }

  async createProduct(values: CreateProductValues): Promise<Product> {
    const supabase = createAdminClient()

    const validate_fields = CreateProductSchema.safeParse(values)

    if (!validate_fields.success) {
      const fieldErrors: Record<string, string[]> = {}

      validate_fields.error.issues.forEach((error) => {
        const field = error.path.join(".")
        if (!fieldErrors[field]) {
          fieldErrors[field] = []
        }
        fieldErrors[field].push(error.message)
      })

      throw new ValidationException(
        validate_fields.error.message,
        fieldErrors,
        "Error de validación en los campos"
      )
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        name: values.name,
        stock: values.stock,
        description: values.description || null,
        category: values.category,
        color: values.color,
        fabric: values.fabric,
        price: values.price,
        size: values.size,
        image_url: values.image_url || null,
        images_urls: values.images_urls || [],
        created_at: new Date().toISOString(),
        sku:
          values.name.slice(0, 3).toUpperCase() +
          Math.random().toString(36).substring(2, 15),
      })
      .select()
      .single()

    if (error) {
      throw new ProductCreationException(
        error.message,
        "Error al crear el producto"
      )
    }

    return data as Product
  }

  async updateProduct(
    id: number,
    values: UpdateProductValues
  ): Promise<Product> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("products")
      .update({
        ...values,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new ProductUpdateException(
        error.message,
        "Error al actualizar el producto"
      )
    }

    if (!data) {
      throw new ProductNotFoundException(
        "Producto no encontrado",
        "Producto no encontrado"
      )
    }

    return data as Product
  }

  async deleteProduct(id: number): Promise<void> {
    const supabase = createAdminClient()

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      throw new ProductDeletionException(
        error.message,
        "Error al eliminar el producto"
      )
    }
  }

  async searchProducts(
    query: string,
    filters?: ProductFilters
  ): Promise<Product[]> {
    const supabase = await createClient()

    try {
      let searchQuery = supabase
        .from("products")
        .select("*")
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

      if (filters?.category) {
        searchQuery = searchQuery.eq("category", filters.category)
      }

      if (filters?.color && filters.color.length > 0) {
        searchQuery = searchQuery.overlaps("color", filters.color)
      }

      if (filters?.fabric) {
        searchQuery = searchQuery.eq("fabric", filters.fabric)
      }

      if (filters?.minPrice) {
        searchQuery = searchQuery.gte("price", filters.minPrice)
      }

      if (filters?.maxPrice) {
        searchQuery = searchQuery.lte("price", filters.maxPrice)
      }

      const { data, error } = await searchQuery

      if (error) {
        throw new ProductFetchException(
          error.message,
          "Error al buscar productos"
        )
      }

      return (data as Product[]) || []
    } catch (error) {
      if (error instanceof ProductFetchException) {
        throw error
      }
      throw new ProductFetchException(
        "Error interno al buscar productos",
        "Error al buscar productos"
      )
    }
  }
}
