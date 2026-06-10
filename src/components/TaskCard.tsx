import { useState } from "react"
import type { Task } from "../types"

interface TaskCardProps {
  task: Task
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<Task>) => void
  onToast: (msg: string) => void
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ""
  const [year, month, day] = dateStr.split("-")
  return `${day}/${month}/${year}`
}

const TaskCard = ({ task, onDelete, onUpdate, onToast }: TaskCardProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDesc, setEditDesc] = useState(task.description)
  const [editDate, setEditDate] = useState(task.dueDate || "")
  const [editStatus, setEditStatus] = useState(task.status)

  const toggleComplete = () => {
    onUpdate(task.id, {
      status: task.status === "completada" ? "pendiente" : "completada",
    })
  }

  const handleSaveEdit = () => {
    onUpdate(task.id, {
      title: editTitle,
      description: editDesc,
      dueDate: editDate,
      status: editStatus,
    })
    setEditing(false)
    onToast("Tarea actualizada correctamente")
  }

  const handleDelete = () => {
    onDelete(task.id)
    onToast("Tarea eliminada")
    setShowMenu(false)
  }

  if (editing) return (
    <div className="task-card__edit-form">
      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
      <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={2} style={{ resize: "none" }} />
      <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as Task["status"])}>
        <option value="pendiente">Pendiente</option>
        <option value="en_progreso">En Progreso</option>
        <option value="completada">Completada</option>
      </select>
      <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
      <div className="task-card__edit-actions">
        <button onClick={handleSaveEdit} className="task-card__edit-save">Guardar</button>
        <button onClick={() => setEditing(false)} className="task-card__edit-cancel">Cancelar</button>
      </div>
    </div>
  )

  return (
    <div className="task-card">
      <div
        className={`task-card__checkbox ${task.status === "completada" ? "task-card__checkbox--completed" : ""}`}
        onClick={toggleComplete}
      >
        {task.status === "completada" && <span className="task-card__checkbox-check">✓</span>}
      </div>

      <div className="task-card__content">
        <p className={`task-card__title ${task.status === "completada" ? "task-card__title--completed" : ""}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="task-card__description">{task.description}</p>
        )}
        <div className="task-card__meta">
          <span className={`task-card__badge task-card__badge--${task.priority}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          {task.dueDate && (
            <span className="task-card__date">📅 {formatDate(task.dueDate)}</span>
          )}
          <span className="task-card__status">{task.status.replace("_", " ")}</span>
        </div>
      </div>

      <div style={{ position: "relative", flexShrink: 0 }}>
        <button className="task-card__menu-btn" onClick={() => setShowMenu(!showMenu)}>···</button>
        {showMenu && (
          <div className="task-card__menu">
            <button className="task-card__menu-item" onClick={() => { setEditing(true); setShowMenu(false) }}>
              Editar
            </button>
            <button className="task-card__menu-item task-card__menu-item--danger" onClick={handleDelete}>
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskCard
