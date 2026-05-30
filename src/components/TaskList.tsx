import type { Task } from "../types"
import TaskCard from "./TaskCard"

interface TaskListProps {
  tasks: Task[]
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<Task>) => void
}

const TaskList = ({ tasks, onDelete, onUpdate }: TaskListProps) => {
  if (tasks.length === 0) return <p>No tenés tareas todavía.</p>

  return (
    <ul>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </ul>
  )
}

export default TaskList
