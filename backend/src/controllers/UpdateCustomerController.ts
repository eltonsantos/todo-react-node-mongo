import { FastifyRequest, FastifyReply } from "fastify"
import { UpdateCustomerService } from "../services/UpdateCustomerService"

class UpdateCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const { id } = request.query as { id: string }

    const { name, email, status } = request.body as { name: string, email: string, status: boolean }

    const customerService = new UpdateCustomerService()
    
    const customer = await customerService.execute({ id, name, email, status })

    reply.send(customer)
  }
}

export { UpdateCustomerController }