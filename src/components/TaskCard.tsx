import { useState } from "react"
import type { Task } from "../types"

interface TaskCardProps {
  task: Task
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<Task>) => void
}

const priorityBadge: Record<Task["priority"], { bg: string; color: string; label: string }> = {
  alta: { bg: "#fee2e2", color: "#dc2626", label: "Alta" },
  media: { bg: "#fef9c3", color: "#a16207", label: "Media" },
  baja: { bg: "#dbeafe", color: "#2563eb", label: "Baja" },
}

const TaskCard = ({ task, onDelete, onUpdate }: TaskCardProps) => {
  const [showMenu, setShowMenu] = useState(false)

  const toggleComplete = () => {
    onUpdate(task.id, {
      status: task.status === "completada" ? "pendiente" : "completada",
    })
  }

  const badge = priorityBadge[task.priority]

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "14px 24px",
      borderBottom: "1px solid #e5e7eb",
      background: "#ffffff",
      position: "relative",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
    >
      {/* CHECKBOX */}
      <div onClick={toggleComplete} style={{
        width: "18px",
        height: "18px",
        border: task.status === "completada" ? "none" : "2px solid #d1d5db",
        borderRadius: "4px",
        background: task.status === "completada" ? "#111111" : "white",
        cursor: "pointer",
        flexShrink: 0,
        marginTop: "3px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {task.status === "completada" && (
          <span style={{ color: "white", fontSize: "11px", fontWeight: "700" }}>✓</span>
        )}
      </div>

      {/* CONTENIDO */}
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: "15px",
          fontWeight: "600",
          color: task.status === "completada" ? "#9ca3af" : "#111111",
          textDecoration: task.status === "completada" ? "line-through" : "none",
          marginBottom: "6px"
        }}>
          {task.title}
        </p>
        {task.description && (
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>
            {task.description}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            PRIORIDAD
          </span>
          <span style={{
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "600",
            background: badge.bg,
            color: badge.color
          }}>
            {badge.label}
          </span>
          {task.dueDate && (
            <>
              <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                FECHA
              </span>
              <span style={{ fontSize: "12px", color: "#374151", display: "flex", alignItems: "center", gap: "4px" }}>
                📅 {new Date(task.dueDate).toLocaleDateString("es-AR")}
              </span>
            </>
          )}
          <span style={{ fontSize: "12px", color: "#6b7280" }}>
            Estado: {task.status.replace("_", " ").charAt(0).toUpperCase() + task.status.replace("_", " ").slice(1)}
          </span>
        </div>
      </div>

      {/* MENU */}
      <div style={{ position: "relative" }}>
        <button onClick={() => setShowMenu(!showMenu)} style={{
          background: "none",
          border: "none",
          fontSize: "18px",
          color: "#9ca3af",
          padding: "4px 8px",
          borderRadius: "6px",
        }}>
          ···
        </button>
        {showMenu && (
          <div style={{
            position: "absolute",
            right: 0,
            top: "100%",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 50,
            minWidth: "120px",
            overflow: "hidden"
          }}>
            <button onClick={() => { setShowMenu(false) }} style={{
              width: "100%",
              padding: "10px 16px",
              background: "none",
              border: "none",
              textAlign: "left",
              fontSize: "14px",
              color: "#374151",
              fontWeight: "400",
              borderRadius: "0"
            }}>
              Editar
            </button>
            <button onClick={() => { onDelete(task.id); setShowMenu(false) }} style={{
              width: "100%",
              padding: "10px 16px",
              background: "none",
              border: "none",
              textAlign: "left",
              fontSize: "14px",
              color: "#dc2626",
              fontWeight: "400",
              borderRadius: "0"
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
