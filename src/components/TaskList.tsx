import type { Task } from "../types"
import TaskCard from "./TaskCard"

interface TaskListProps {
  tasks: Task[]
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<Task>) => void
  onToast: (msg: string) => void
}

const TaskList = ({ tasks, onDelete, onUpdate, onToast }: TaskListProps) => {
  if (tasks.length === 0) return (
    <div style={{ padding: "32px 24px", textAlign: "center" }}>
      <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>No tenes tareas todavia.</p>
    </div>
  )

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={onDelete} onUpdate={onUpdate} onToast={onToast} />
      ))}
    </div>
  )
}

export default TaskList
