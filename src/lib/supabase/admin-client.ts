import { createServerClient } from "@supabase/ssr"

export const createClient = () =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // Service-role clients do not use end-user auth cookies.
        },
      },
    }
  )
