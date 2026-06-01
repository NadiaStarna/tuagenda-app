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
  const [search, setSearch] = useState("")
  const [toast, setToast] = useState("")
  const [emailLoading, setEmailLoading] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "" as Task["priority"] | "",
    category: "" as Task["category"] | "",
    dueDate: "",
    status: "" as Task["status"] | "",
  })

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  const handleSendEmail = async () => {
    if (!user?.email) return
    setEmailLoading(true)
    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, tasks }),
      })
      if (res.ok) {
        showToast("Email enviado correctamente")
      } else {
        showToast("Error al enviar el email")
      }
    } catch {
      showToast("Error al enviar el email")
    } finally {
      setEmailLoading(false)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    await addTask({
      title: newTask.title,
      description: newTask.description,
      priority: (newTask.priority || "media") as Task["priority"],
      category: (newTask.category || "personal") as Task["category"],
      dueDate: newTask.dueDate,
      status: (newTask.status || "pendiente") as Task["status"],
      userId: user?.uid || "",
      createdAt: new Date().toISOString(),
    })
    setNewTask({ title: "", description: "", priority: "", category: "", dueDate: "", status: "" })
    setShowForm(false)
    showToast("Tarea creada correctamente")
  }

  const togglePriority = (p: string) => {
    setFilterPriority((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === "Todo" || task.status === filterStatus
    const priorityMatch = filterPriority.length === 0 || filterPriority.includes(task.priority)
    const searchMatch = task.title.toLowerCase().includes(search.toLowerCase()) || task.description.toLowerCase().includes(search.toLowerCase())
    return statusMatch && priorityMatch && searchMatch
  })

  const stats = {
    total: tasks.length,
    completadas: tasks.filter((t) => t.status === "completada").length,
    pendientes: tasks.filter((t) => t.status === "pendiente").length,
    enProgreso: tasks.filter((t) => t.status === "en_progreso").length,
    vencidas: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completada").length,
  }

  const progreso = tasks.length > 0 ? Math.round((stats.completadas / tasks.length) * 100) : 0

  const priorityOrder = { alta: 0, media: 1, baja: 2 }
  const proximaTarea = tasks
    .filter((t) => t.status !== "completada")
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])[0]

  if (loading) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "rgba(58, 74, 55, 0.85)"
    }}>
      <p style={{ color: "white", fontWeight: "700", fontSize: "18px" }}>Cargando tus tareas...</p>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "var(--card-bg)", backdropFilter: "blur(8px)" }}>

      {toast && (
        <div style={{
          position: "fixed", bottom: "24px", right: "24px",
          background: "var(--moss)", color: "white",
          padding: "12px 20px", borderRadius: "10px",
          fontSize: "14px", fontWeight: "600", zIndex: 999,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          animation: "fadeIn 0.3s ease"
        }}>
          {toast}
        </div>
      )}

      <header style={{
        background: "var(--card-bg)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "60px", position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        <span style={{ fontWeight: "800", fontSize: "16px", color: "var(--cinnamon)", letterSpacing: "0.05em" }}>
          TUAGENDA
        </span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={toggleTheme} style={{
            padding: "7px 12px", background: "var(--card-bg)",
            border: "1px solid var(--border)", color: "var(--text)", fontSize: "16px",
          }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button onClick={handleSendEmail} disabled={emailLoading} style={{
            padding: "7px 12px", background: "rgba(158, 90, 58, 0.1)",
            border: "1px solid var(--rose-ash)", color: "var(--cinnamon)", fontSize: "13px",
            opacity: emailLoading ? 0.7 : 1
          }}>
            {emailLoading ? "Enviando..." : "Enviar por email"}
          </button>
          <button onClick={handleLogout} style={{
            padding: "7px 12px", background: "var(--moss)",
            border: "none", color: "white", fontSize: "13px"
          }}>
            Salir
          </button>
        </div>
      </header>

      <div style={{ padding: "24px 16px", maxWidth: "1200px", margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--moss)" }}>Organiza tu dia ✨</h1>
          <button onClick={() => setShowForm(true)} style={{
            padding: "10px 20px", background: "var(--cinnamon)",
            border: "none", color: "white", fontSize: "14px", fontWeight: "600",
            boxShadow: "0 4px 12px rgba(138, 74, 42, 0.3)"
          }}>
            + Nueva Tarea
          </button>
        </div>

        {/* BARRA DE PROGRESO */}
        <div style={{
          background: "var(--card-bg)", backdropFilter: "blur(16px)",
          borderRadius: "12px", padding: "16px 20px",
          border: "1px solid var(--border)", marginBottom: "16px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)" }}>Progreso general</span>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--moss)" }}>{progreso}%</span>
          </div>
          <div style={{ height: "8px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progreso}%`,
              background: "linear-gradient(90deg, var(--sage), var(--moss))",
              borderRadius: "99px", transition: "width 0.5s ease"
            }} />
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
            {stats.completadas} de {stats.total} tareas completadas
          </p>
        </div>

        {/* ESTADISTICAS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Total", value: stats.total, color: "var(--cinnamon)" },
            { label: "Completadas", value: stats.completadas, color: "var(--moss)" },
            { label: "Pendientes", value: stats.pendientes, color: "var(--rose-ash)" },
            { label: "En Progreso", value: stats.enProgreso, color: "var(--quartz)" },
            { label: "Vencidas", value: stats.vencidas, color: "#dc2626" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "var(--card-bg)", backdropFilter: "blur(16px)",
              borderRadius: "12px", padding: "14px", border: "1px solid var(--border)", textAlign: "center"
            }}>
              <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "4px", fontWeight: "600", textTransform: "uppercase" }}>
                {stat.label}
              </p>
              <p style={{ fontSize: "24px", fontWeight: "800", color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {showForm && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 200, padding: "20px"
          }}>
            <div style={{
              background: "var(--card-bg)", backdropFilter: "blur(20px)",
              borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "500px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)", border: "1px solid var(--border)",
              maxHeight: "90vh", overflowY: "auto"
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px", color: "var(--moss)" }}>
                Crear Nueva Tarea
              </h2>
              <form onSubmit={handleAddTask} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <input placeholder="Titulo de la tarea" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
                <textarea placeholder="Descripcion" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} rows={3} style={{ resize: "none" }} />
                <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}>
                  <option value="">Prioridad</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
                <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Task["status"] })}>
                  <option value="">Estado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                </select>
                <select value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value as Task["category"] })}>
                  <option value="">Categoria</option>
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
                    flex: 1, padding: "11px", background: "var(--card-bg)",
                    border: "1px solid var(--border)", color: "var(--text)"
                  }}>Cancelar</button>
                  <button type="submit" style={{
                    flex: 1, padding: "11px", background: "var(--cinnamon)",
                    border: "none", color: "white", fontWeight: "700"
                  }}>Crear Tarea</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* LAYOUT */}
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "24px", marginBottom: "32px" }}>

          {/* SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{
              background: "var(--card-bg)", backdropFilter: "blur(16px)",
              borderRadius: "12px", padding: "20px", border: "1px solid var(--border)",
            }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "16px", color: "var(--moss)" }}>Filtros</h3>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px", display: "block", fontWeight: "600" }}>Estado</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="Todo">Todo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px", display: "block", fontWeight: "600" }}>Prioridad</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["alta", "media", "baja"].map((p) => (
                    <button key={p} onClick={() => togglePriority(p)} style={{
                      padding: "6px 12px",
                      background: filterPriority.includes(p) ? "var(--moss)" : "var(--card-bg)",
                      color: filterPriority.includes(p) ? "white" : "var(--text)",
                      border: "1px solid var(--border)", fontSize: "13px", fontWeight: "500", textTransform: "capitalize"
                    }}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {proximaTarea && (
              <div style={{
                background: "var(--card-bg)", backdropFilter: "blur(16px)",
                borderRadius: "12px", padding: "20px", border: "1px solid var(--border)",
              }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px", color: "var(--moss)" }}>
                  Proxima tarea
                </h3>
                <div onClick={() => setSearch(proximaTarea.title)} style={{
                  padding: "10px 12px",
                  background: "rgba(138, 74, 42, 0.08)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  <p style={{ fontWeight: "700", color: "var(--text)", marginBottom: "4px", fontSize: "14px" }}>{proximaTarea.title}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "4px" }}>
                    Prioridad: {proximaTarea.priority}
                  </p>
                  {proximaTarea.dueDate && (
                    <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                      📅 {new Date(proximaTarea.dueDate).toLocaleDateString("es-AR")}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* LISTA */}
          <div style={{
            background: "var(--card-bg)", backdropFilter: "blur(16px)",
            borderRadius: "12px", border: "1px solid var(--border)", overflow: "hidden"
          }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--moss)", marginBottom: "12px" }}>Lista de Tareas</h3>
              <input placeholder="Buscar tareas..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%" }} />
            </div>
            <div style={{ maxHeight: "360px", overflowY: "auto" }}>
              <TaskList tasks={filteredTasks} onDelete={deleteTask} onUpdate={updateTask} onToast={showToast} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tasks
