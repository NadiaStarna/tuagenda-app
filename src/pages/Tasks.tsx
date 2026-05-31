import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useTasks } from "../hooks/useTasks"
import { useTheme } from "../hooks/useTheme"
import { signOut } from "firebase/auth"
import { auth } from "../services/firebase"
import { useNavigate } from "react-router-dom"
import TaskList from "../components/TaskList"
import type { Task } from "../types"

const Tasks = () => {
  const { user } = useAuth()
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks(user?.uid || "")
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState("Todo")
  const [filterPriority, setFilterPriority] = useState<string[]>([])
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "media" as Task["priority"],
    category: "personal" as Task["category"],
    dueDate: "",
    status: "pendiente" as Task["status"],
  })

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  const handleSendEmail = async () => {
    if (!user?.email) return
    try {
      await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, tasks }),
      })
      alert("Email enviado correctamente")
    } catch {
      alert("Error al enviar el email")
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    await addTask({
      ...newTask,
      userId: user?.uid || "",
      createdAt: new Date().toISOString(),
    })
    setNewTask({ title: "", description: "", priority: "media", category: "personal", dueDate: "", status: "pendiente" })
    setShowForm(false)
  }

  const togglePriority = (p: string) => {
    setFilterPriority((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === "Todo" || task.status === filterStatus.toLowerCase().replace(" ", "_")
    const priorityMatch = filterPriority.length === 0 || filterPriority.includes(task.priority)
    return statusMatch && priorityMatch
  })

  const stats = {
    total: tasks.length,
    completadas: tasks.filter((t) => t.status === "completada").length,
    pendientes: tasks.filter((t) => t.status === "pendiente").length,
    enProgreso: tasks.filter((t) => t.status === "en_progreso").length,
    vencidas: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completada").length,
  }

  if (loading) return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "12px",
      background: "rgba(58, 74, 55, 0.85)"
    }}>
      <p style={{ color: "white", fontWeight: "700", fontSize: "18px", letterSpacing: "0.05em" }}>
        Cargando tus tareas...
      </p>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "var(--card-bg)", backdropFilter: "blur(8px)" }}>
      <header style={{
        background: "var(--card-bg)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        <span style={{ fontWeight: "800", fontSize: "16px", color: "var(--cinnamon)", letterSpacing: "0.05em" }}>
          TUAGENDA
        </span>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={toggleTheme} style={{
            padding: "7px 14px",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            fontSize: "16px",
          }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button onClick={handleSendEmail} style={{
            padding: "7px 14px",
            background: "rgba(158, 90, 58, 0.1)",
            border: "1px solid var(--rose-ash)",
            color: "var(--cinnamon)",
            fontSize: "13px",
          }}>
            Enviar resumen por email
          </button>
          <button onClick={handleLogout} style={{
            padding: "7px 14px",
            background: "var(--moss)",
            border: "none",
            color: "white",
            fontSize: "13px"
          }}>
            Cerrar sesion
          </button>
        </div>
      </header>

      <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--moss)" }}>Organiza tu dia ✨</h1>
          <button onClick={() => setShowForm(true)} style={{
            padding: "10px 20px",
            background: "var(--cinnamon)",
            border: "none",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(138, 74, 42, 0.3)"
          }}>
            + Crear Nueva Tarea
          </button>
        </div>

        {showForm && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
          }}>
            <div style={{
              background: "var(--card-bg)",
              backdropFilter: "blur(20px)",
              borderRadius: "16px",
              padding: "32px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              border: "1px solid var(--border)"
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px", color: "var(--moss)" }}>
                Crear Nueva Tarea
              </h2>
              <form onSubmit={handleAddTask} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <input placeholder="Titulo de la tarea" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
                <textarea placeholder="Descripcion" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} rows={3} style={{ resize: "none" }} />
                <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
                <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Task["status"] })}>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                </select>
                <select value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value as Task["category"] })}>
                  <option value="trabajo">Trabajo</option>
                  <option value="personal">Personal</option>
                  <option value="salud">Salud</option>
                  <option value="estudio">Estudio</option>
                  <option value="hogar">Hogar</option>
                  <option value="otro">Otro</option>
                </select>
                <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{
                    flex: 1, padding: "11px",
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)", color: "var(--text)"
                  }}>
                    Cancelar
                  </button>
                  <button type="submit" style={{
                    flex: 1, padding: "11px", background: "var(--cinnamon)",
                    border: "none", color: "white", fontWeight: "700"
                  }}>
                    Crear Tarea
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "24px", marginBottom: "32px" }}>
          <div style={{
            background: "var(--card-bg)",
            backdropFilter: "blur(16px)",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid var(--border)",
            height: "fit-content"
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "16px", color: "var(--moss)" }}>Filtros</h3>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px", display: "block", fontWeight: "600" }}>
                Filtrar por Estado
              </label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option>Todo</option>
                <option>Pendiente</option>
                <option>En Progreso</option>
                <option>Completada</option>
                <option>Archivada</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px", display: "block", fontWeight: "600" }}>
                Prioridad
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {["alta", "media", "baja"].map((p) => (
                  <button key={p} onClick={() => togglePriority(p)} style={{
                    padding: "6px 12px",
                    background: filterPriority.includes(p) ? "var(--moss)" : "var(--card-bg)",
                    color: filterPriority.includes(p) ? "white" : "var(--text)",
                    border: "1px solid var(--border)",
                    fontSize: "13px",
                    fontWeight: "500",
                    textTransform: "capitalize"
                  }}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            background: "var(--card-bg)",
            backdropFilter: "blur(16px)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            overflow: "hidden"
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--moss)" }}>Lista de Tareas</h3>
            </div>
            <TaskList tasks={filteredTasks} onDelete={deleteTask} onUpdate={updateTask} />
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "var(--moss)" }}>
            Estadisticas Rapidas
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
            {[
              { label: "Tareas Totales", value: stats.total, color: "var(--cinnamon)" },
              { label: "Completadas", value: stats.completadas, color: "var(--moss)" },
              { label: "Pendientes", value: stats.pendientes, color: "var(--rose-ash)" },
              { label: "En Progreso", value: stats.enProgreso, color: "var(--quartz)" },
              { label: "Vencidas", value: stats.vencidas, color: "#dc2626" },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: "var(--card-bg)",
                backdropFilter: "blur(16px)",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid var(--border)",
                textAlign: "center"
              }}>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase" }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: "32px", fontWeight: "800", color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tasks
