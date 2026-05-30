import type { Task } from "../types"

interface TaskCardProps {
  task: Task
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<Task>) => void
}

const TaskCard = ({ task, onDelete, onUpdate }: TaskCardProps) => {
  const toggleComplete = () => {
    onUpdate(task.id, {
      status: task.status === "completada" ? "pendiente" : "completada",
    })
  }

  return (
    <div className="task-card">
      <input type="checkbox" checked={task.status === "completada"} onChange={toggleComplete} />
      <div>
        <h3 style={{ textDecoration: task.status === "completada" ? "line-through" : "none" }}>
          {task.title}
        </h3>
        <p>{task.description}</p>
        <span>Prioridad: {task.priority}</span>
        <span> | Estado: {task.status}</span>
        <span> | Categoría: {task.category}</span>
      </div>
      <button onClick={() => onDelete(task.id)}>Eliminar</button>
    </div>
  )
}

export default TaskCard
