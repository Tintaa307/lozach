import { SubscriberCreationException } from "@/exceptions/subscribers/subscribers-exceptions"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@/lib/supabase/admin-client"

export interface Subscriber {
  id: string
  created_at: string
  email: string
}

export class SubscribersRepository {
  async getAllSubscribers(): Promise<Subscriber[]> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return (data as Subscriber[]) || []
  }

  async createSubscriber(email: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.from("subscribers").insert({
      email,
    })

    if (error) {
      throw new SubscriberCreationException(error.message)
    }

    return
  }
}
