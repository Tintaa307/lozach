"use server"

import { createClient } from "@/lib/supabase/server"
import { UserLoginSchema, UserSchema } from "@/lib/validations/user-schema"
import { ZodError } from "zod"
import { v4 as UUIDv4 } from "uuid"

type CreateUserProps = {
  values: {
    name: string
    email: string
    password: string
  }
}

type LoginUserProps = {
  values: {
    email: string
    password: string
  }
}

export const createUser = async ({ values }: CreateUserProps) => {
  const supabase = createClient()

  try {
    UserSchema.parse(values)

    const { error } = await (
      await supabase
    ).auth.signUp({
      email: values.email,
      password: values.password,
    })

    if (error) {
      return {
        message: "Error al crear el usuario",
        status: 500,
      }
    }

    const { error: InsertError } = await (await supabase).from("users").insert({
      id: UUIDv4(),
      name: values.name,
      email: values.email,
    })

    if (InsertError) {
      return {
        message: "Error al crear el usuario",
        status: 500,
      }
    }

    return {
      message: "Usuario creado correctamente",
      status: 200,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        message: error.errors,
        status: 500,
      }
    }
  }
}

export const loginUser = async ({ values }: LoginUserProps) => {
  const supabase = createClient()

  try {
    UserLoginSchema.parse(values)

    const { error } = await (
      await supabase
    ).auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      return {
        message: "Error al iniciar sesión",
        status: 500,
      }
    }

    return {
      message: "Usuario creado correctamente",
      status: 200,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        message: error.errors,
        status: 500,
      }
    }
  }
}
