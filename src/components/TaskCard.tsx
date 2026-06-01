import { useState } from "react"
import type { Task } from "../types"

interface TaskCardProps {
  task: Task
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<Task>) => void
  onToast: (msg: string) => void
}

const priorityBadge: Record<Task["priority"], { bg: string; color: string; label: string }> = {
  alta: { bg: "#fee2e2", color: "#dc2626", label: "Alta" },
  media: { bg: "#fef9c3", color: "#a16207", label: "Media" },
  baja: { bg: "#dbeafe", color: "#2563eb", label: "Baja" },
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

  const badge = priorityBadge[task.priority]

  if (editing) return (
    <div style={{
      padding: "16px 24px", borderBottom: "1px solid var(--border)",
      background: "var(--card-bg)", display: "flex", flexDirection: "column", gap: "10px"
    }}>
      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
      <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={2} style={{ resize: "none" }} />
      <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as Task["status"])}>
        <option value="pendiente">Pendiente</option>
        <option value="en_progreso">En Progreso</option>
        <option value="completada">Completada</option>
      </select>
      <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={handleSaveEdit} style={{
          padding: "8px 16px", background: "var(--cinnamon)",
          border: "none", color: "white", borderRadius: "8px"
        }}>Guardar</button>
        <button onClick={() => setEditing(false)} style={{
          padding: "8px 16px", background: "var(--card-bg)",
          border: "1px solid var(--border)", color: "var(--text)", borderRadius: "8px"
        }}>Cancelar</button>
      </div>
    </div>
  )

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "12px",
      padding: "14px 24px", borderBottom: "1px solid var(--border)",
      background: "var(--card-bg)", position: "relative", transition: "background 0.2s"
    }}>
      <div onClick={toggleComplete} style={{
        width: "18px", height: "18px",
        border: task.status === "completada" ? "none" : "2px solid var(--border)",
        borderRadius: "4px",
        background: task.status === "completada" ? "var(--moss)" : "transparent",
        cursor: "pointer", flexShrink: 0, marginTop: "3px",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {task.status === "completada" && (
          <span style={{ color: "white", fontSize: "11px", fontWeight: "700" }}>✓</span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: "15px", fontWeight: "600",
          color: task.status === "completada" ? "var(--text-muted)" : "var(--text)",
          textDecoration: task.status === "completada" ? "line-through" : "none",
          marginBottom: "6px", wordBreak: "break-word"
        }}>
          {task.title}
        </p>
        {task.description && (
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px", wordBreak: "break-word" }}>
            {task.description}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{
            padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600",
            background: badge.bg, color: badge.color
          }}>
            {badge.label}
          </span>
          {task.dueDate && (
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              📅 {new Date(task.dueDate).toLocaleDateString("es-AR")}
            </span>
          )}
          <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "capitalize" }}>
            {task.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div style={{ position: "relative", flexShrink: 0 }}>
        <button onClick={() => setShowMenu(!showMenu)} style={{
          background: "none", border: "none", fontSize: "18px",
          color: "var(--text-muted)", padding: "4px 8px", borderRadius: "6px",
        }}>
          ···
        </button>
        {showMenu && (
          <div style={{
            position: "absolute", right: 0, top: "100%",
            background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 50, minWidth: "120px", overflow: "hidden", backdropFilter: "blur(10px)"
          }}>
            <button onClick={() => { setEditing(true); setShowMenu(false) }} style={{
              width: "100%", padding: "10px 16px", background: "none",
              border: "none", textAlign: "left", fontSize: "14px", color: "var(--text)", borderRadius: "0"
            }}>
              Editar
            </button>
            <button onClick={handleDelete} style={{
              width: "100%", padding: "10px 16px", background: "none",
              border: "none", textAlign: "left", fontSize: "14px", color: "#dc2626", borderRadius: "0"
            }}>
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskCard
