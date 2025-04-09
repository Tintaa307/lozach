import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = createClient()

  if (req.method !== "POST") {
    return NextResponse.json({
      success: false,
      message: "Método no permitido",
      status: 405,
    })
  }

  const body = await req.json()
  const { product_id } = body

  if (!product_id) {
    return NextResponse.json({
      success: false,
      message: "Falta el ID del producto",
      status: 400,
    })
  }

  const { user } = (await (await supabase).auth.getUser()).data

  if (!user) {
    return NextResponse.json({
      success: false,
      message: "No se ha encontrado el usuario",
      status: 404,
    })
  }

  const { error } = await (await supabase).from("user_recent_cart").insert({
    user_id: user.id,
    product_id,
    added_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.log(error)
    return NextResponse.json({
      success: false,
      message: error.message,
      status: 500,
    })
  }

  return NextResponse.json({
    success: true,
    message: "Producto agregado a los recientes del carrito correctamente",
    status: 200,
  })
}
