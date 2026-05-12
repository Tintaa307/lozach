import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@/lib/supabase/admin-client"
import {
  CreateUserValues,
  LoginUserValues,
  PublicUser,
} from "@/types/auth/types"
import { UserLoginSchema, UserSchema } from "@/lib/validations/user-schema"
import {
  AuthCreationException,
  AuthLoginException,
  AuthMissingUserException,
} from "@/exceptions/auth/auth-exceptions"
import { ValidationException } from "@/exceptions/base/base-exceptions"

function mapSupabaseLoginError(error: {
  code?: string
  message: string
  status?: number
}): string {
  const code = error.code?.toLowerCase() ?? ""
  const message = error.message?.toLowerCase() ?? ""

  if (code === "invalid_credentials" || message.includes("invalid login")) {
    return "Email o contraseña incorrectos"
  }
  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Tu email todavía no fue confirmado. Revisá tu correo."
  }
  if (code === "user_not_found" || message.includes("user not found")) {
    return "No existe una cuenta con ese email"
  }
  if (
    code === "over_request_rate_limit" ||
    code === "over_email_send_rate_limit" ||
    message.includes("rate limit")
  ) {
    return "Demasiados intentos. Esperá unos minutos e intentá de nuevo."
  }
  if (message.includes("network") || message.includes("fetch")) {
    return "Error de conexión. Verificá tu internet."
  }
  return "No pudimos iniciar sesión. Intentá nuevamente."
}

function mapSupabaseSignUpError(error: {
  code?: string
  message: string
  status?: number
}): string {
  const code = error.code?.toLowerCase() ?? ""
  const message = error.message?.toLowerCase() ?? ""

  if (
    code === "user_already_exists" ||
    code === "email_exists" ||
    message.includes("already registered") ||
    message.includes("already exists") ||
    message.includes("user already")
  ) {
    return "Ya existe una cuenta con ese email"
  }
  if (
    code === "weak_password" ||
    message.includes("password should be") ||
    message.includes("weak password")
  ) {
    return "La contraseña es demasiado débil. Usá al menos 8 caracteres."
  }
  if (code === "invalid_email" || message.includes("invalid email")) {
    return "El email no es válido"
  }
  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    message.includes("rate limit")
  ) {
    return "Demasiados intentos. Esperá unos minutos e intentá de nuevo."
  }
  if (message.includes("network") || message.includes("fetch")) {
    return "Error de conexión. Verificá tu internet."
  }
  return "No pudimos crear la cuenta. Intentá nuevamente."
}

export class AuthRepository {
  async createUser(values: CreateUserValues): Promise<PublicUser> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    const validate_fields = UserSchema.safeParse(values)

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

    const { data: authData, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    })

    if (error) {
      throw new AuthCreationException(
        error.message,
        mapSupabaseSignUpError(error)
      )
    }

    // Supabase puede devolver un user "fantasma" cuando el email ya existe
    // (sin error) — detectamos identities vacíos para avisar bien al usuario.
    if (
      authData?.user &&
      Array.isArray(authData.user.identities) &&
      authData.user.identities.length === 0
    ) {
      throw new AuthCreationException(
        "Email already registered",
        "Ya existe una cuenta con ese email"
      )
    }

    if (!authData.user) {
      throw new AuthCreationException(
        "Usuario no creado correctamente",
        "Error al crear el usuario"
      )
    }

    // Use the admin client to insert the user profile
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .insert({
        id: authData.user.id,
        name: values.name,
        email: values.email,
      })
      .select()
      .single()

    console.log(userError)

    if (userError) {
      throw new AuthCreationException(
        userError.message,
        "No pudimos crear tu perfil. Intentá nuevamente."
      )
    }

    return userData as PublicUser
  }

  async loginUser(values: LoginUserValues): Promise<PublicUser> {
    const supabase = await createClient()

    const validate_fields = UserLoginSchema.safeParse(values)

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

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      throw new AuthLoginException(error.message, mapSupabaseLoginError(error))
    }

    // Get user data from users table
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("*")
      .eq("email", values.email)
      .single()

    if (userDataError) {
      throw new AuthMissingUserException(
        userDataError.message,
        "No encontramos tu perfil. Contactá a soporte."
      )
    }

    if (!userData) {
      throw new AuthMissingUserException(
        "Usuario no encontrado",
        "No encontramos tu perfil. Contactá a soporte."
      )
    }

    return userData as PublicUser
  }

  async getUser(): Promise<PublicUser> {
    const supabase = await createClient()

    const { data, error: userError } = await supabase.auth.getUser()

    if (userError) {
      let userMessage = ""
      switch (userError?.code) {
        case "not_authenticated":
          userMessage = "No hay una sesión iniciada."
          break
        default:
          userMessage = "Error al obtener el usuario, intente nuevamente."
      }

      throw new AuthMissingUserException(userError.message, userMessage)
    }

    const user = data.user

    if (!user) {
      throw new AuthMissingUserException(
        "No se pudo obtener el usuario",
        "No se pudo obtener el usuario"
      )
    }

    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("id, email, name, created_at, role")
      .eq("id", user.id)
      .single()

    if (userDataError?.code) {
      let userMessage = ""
      switch (userDataError?.code) {
        case "not_found":
          userMessage = "No se pudo obtener el usuario"
          break
        default:
          userMessage = "Error al obtener el usuario, intente nuevamente."
      }

      throw new AuthMissingUserException(userDataError.message, userMessage)
    }

    if (!userData) {
      throw new AuthMissingUserException(
        "No se pudo obtener el usuario",
        "No se pudo obtener el usuario"
      )
    }

    return userData as PublicUser
  }

  async getUserById(id: string): Promise<PublicUser> {
    const supabase = createAdminClient()

    const { error, data } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single()

    if (error?.code) {
      let userMessage = ""
      switch (error?.code) {
        case "not_found":
          userMessage = "No se pudo obtener el usuario"
          break
        default:
          userMessage = "Error al obtener el usuario, intente nuevamente."
      }

      throw new AuthMissingUserException(error.message, userMessage)
    }

    if (!data) {
      throw new AuthMissingUserException(
        "No se pudo obtener el usuario",
        "No se pudo obtener el usuario"
      )
    }

    return data as PublicUser
  }

  async logoutUser(): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new AuthLoginException(error.message, "Error al cerrar sesión")
    }
  }
}
