import { SubscribersRepository } from "@/repositories/subscribers/subscribers-repository"

export class SubscribersService {
  private readonly subscriberRepository: SubscribersRepository

  constructor(subscriberRepository?: SubscribersRepository) {
    this.subscriberRepository =
      subscriberRepository || new SubscribersRepository()
  }

  async createSubscriber(email: string): Promise<void> {
    return await this.subscriberRepository.createSubscriber(email)
  }
}
