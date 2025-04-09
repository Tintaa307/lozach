// /api/recent-view/route.ts

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = createClient()

  const body = await req.json()
  const { product_id } = body

  if (!product_id) {
    return NextResponse.json({
      success: false,
      message: "Falta el ID del producto",
      status: 400,
    })
  }

  const {
    data: { user },
    error: authError,
  } = await (await supabase).auth.getUser()

  if (authError || !user) {
    return NextResponse.json({
      success: false,
      message: "Usuario no autenticado",
      status: 401,
    })
  }

  const user_id = user.id

  const { error } = await (await supabase).from("user_recent_views").upsert({
    user_id,
    product_id,
    viewed_at: new Date().toISOString(),
  })

  if (error) {
    console.log("Error al actualizar la vista reciente:", error.message)
    return NextResponse.json({
      success: false,
      message: "Error al actualizar la vista reciente",
      status: 500,
    })
  }

  return NextResponse.json({
    success: true,
    message: "Vista reciente actualizada correctamente",
    status: 200,
  })
}
