import { SubscriberCreationException } from "@/exceptions/subscribers/subscribers-exceptions"
import { createClient } from "@/lib/supabase/server"

export class SubscribersRepository {
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
