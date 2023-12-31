import { useEffect, useState, useRef, FormEvent } from "react"
import { FiEdit, FiTrash } from "react-icons/fi"
import { api } from "./services/api"

interface CustomerProps {
  id: string
  name: string
  email: string
  status: boolean
  created_at: string
}

export function App() {

  const [customers, setCustomers] = useState<CustomerProps[]>([])
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const statusRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    const response = await api.get("/customers")
    setCustomers(response.data)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!nameRef.current?.value || !emailRef.current?.value) return

    if (isEditing && editingId) {
      await handleUpdate(editingId)
    } else {
      const response = await api.post("/customer", {
        name: nameRef.current?.value,
        email: emailRef.current?.value
      })
  
      setCustomers(allCustomers => [...allCustomers, response.data])
    }

    nameRef.current.value = ''
    emailRef.current.value = ''
    setIsEditing(false)
    setEditingId(null)
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/customer", {
        params: {
          id
        }
      })

      const allCustomers = customers.filter((customer) => customer.id !== id)

      setCustomers(allCustomers)

    } catch (error) {
      console.log(error)
    }
  }

  async function handleUpdate(id: string) {
    try {
      const response = await api.put(`/customer?id=${id}`, {
        name: nameRef.current?.value,
        email: emailRef.current?.value,
        status: statusRef.current?.checked || false
      })

      const updatedCustomer = response.data

      setCustomers(allCustomers =>
        allCustomers.map(customer =>
          customer.id === id ? updatedCustomer : customer
        )
      )
  
      console.log("Usuário atualizado:", updatedCustomer)

    } catch (error) {
      console.log(error)
    }
  }

  function startEditing(id: string) {
    const customerToEdit = customers.find((customer) => customer.id === id);
    if (customerToEdit) {
      if (nameRef.current) {
        nameRef.current.value = customerToEdit.name;
      }
      if (emailRef.current) {
        emailRef.current.value = customerToEdit.email;
      }
      if (statusRef.current) {
        statusRef.current.checked = customerToEdit.status;
      }
      setIsEditing(true);
      setEditingId(id);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-10">
      <main className="my-10 w-full md:max-w-2x1">
        <h1 className="text-4x1 font-medium text-white">Clientes</h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-white">Nome:</label>
          <input ref={nameRef} type="text" placeholder="Digite o nome" className="w-full mb-5 p-2 rounded" />

          <label className="font-medium text-white">Email:</label>
          <input ref={emailRef} type="text" placeholder="Digite o email" className="w-full mb-5 p-2 rounded" />

          <label className="font-medium text-white">Status:</label>
          <input ref={statusRef} type="checkbox" className="mb-5" />

          <input type="submit" value={isEditing ? "Atualizar" : "Cadastrar"} className="w-full cursor-pointer bg-green-500 p-2 rounded font-medium" />
        </form>

        <section className="flex flex-col gap-4">
          {customers.map((customer) => (
            <article key={customer.id} className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200">
              <p>
                <span className="font-medium">Nome:</span>
                {customer.name}
              </p>
              <p>
                <span className="font-medium">Email:</span>
                {customer.email}
              </p>
              <p>
                <span className="font-medium">Status:</span>
                {customer.status ? "ATIVO" : "INATIVO"}
              </p>

              <button onClick={() => handleDelete(customer.id)} className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2">
                <FiTrash size={18} color="#fff" />
              </button>
              <button onClick={() => startEditing(customer.id)} className="bg-blue-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-8 -top-2">
                <FiEdit size={18} color="#fff" />
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}