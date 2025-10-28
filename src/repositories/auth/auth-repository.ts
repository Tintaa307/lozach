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

    console.log(error)

    if (error) {
      throw new AuthCreationException(
        error.message,
        "Error al crear el usuario"
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
        "Error al crear el perfil de usuario"
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
      throw new AuthLoginException(error.message, "Error al iniciar sesión")
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
        "Error al obtener el usuario"
      )
    }

    if (!userData) {
      throw new AuthMissingUserException(
        "Usuario no encontrado",
        "Usuario no encontrado"
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
