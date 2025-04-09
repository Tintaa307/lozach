import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const user = data.session?.user
      if (user) {
        const { error: insertError } = await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          name:
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            "Sin nombre",
        })
        if (insertError) {
          console.error(
            "Error al insertar/actualizar el usuario:",
            insertError.message
          )
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host") // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development"
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      console.log("Error exchanging code for session:", error.message)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
