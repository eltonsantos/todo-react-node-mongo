import prismaClient from "../prisma"

interface UpdateCustomerProps {
  id: string
  name: string
  email: string
  status: boolean
}

class UpdateCustomerService {
  async execute({ id, name, email, status }: UpdateCustomerProps) {

    if (!id) {
      throw new Error("Solicitação inválida")
    }

    const findCustomer = await prismaClient.customer.findFirst({
      where: {
        id: id
      }
    })

    if (!findCustomer) {
      throw new Error("Cliente não existe")
    }

    const updatedCustomer = await prismaClient.customer.update({
      where: {
        id: findCustomer.id
      },
      data: {
        name,
        email,
        status,
        updated_at: new Date()
      }
    })

    return updatedCustomer
    
  }
}

export { UpdateCustomerService }