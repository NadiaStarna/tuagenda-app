import { useState } from "react"
import type { Task } from "../types"

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id">) => void
  userId: string
}

const TaskForm = ({ onSubmit, userId }: TaskFormProps) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Task["priority"]>("media")
  const [category, setCategory] = useState<Task["category"]>("personal")
  const [dueDate, setDueDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      status: "pendiente",
      priority,
      category,
      dueDate,
      userId,
      createdAt: new Date().toISOString(),
    })
    setTitle("")
    setDescription("")
    setDueDate("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
      <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])}>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value as Task["category"])}>
        <option value="trabajo">Trabajo</option>
        <option value="personal">Personal</option>
        <option value="salud">Salud</option>
        <option value="estudio">Estudio</option>
        <option value="hogar">Hogar</option>
        <option value="otro">Otro</option>
      </select>
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <button type="submit">Crear Tarea</button>
    </form>
  )
}

export default TaskForm
