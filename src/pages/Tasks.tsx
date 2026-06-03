import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useTasks } from "../hooks/useTasks"
import { useTheme } from "../hooks/useTheme"
import { signOut } from "firebase/auth"
import { auth } from "../services/firebase"
import { useNavigate } from "react-router-dom"
import TaskList from "../components/TaskList"
import type { Task } from "../types"

const TODAY = new Date().toISOString().split("T")[0]

const formatDate = (dateStr: string) => {
  if (!dateStr) return ""
  const [year, month, day] = dateStr.split("-")
  return `${day}/${month}/${year}`
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return isMobile
}

const Tasks = () => {
  const { user } = useAuth()
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks(user?.uid || "")
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [showForm, setShowForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState("Todo")
  const [filterPriority, setFilterPriority] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [toast, setToast] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [taskLoading, setTaskLoading] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "" as Task["priority"] | "",
    category: "" as Task["category"] | "",
    dueDate: "",
    status: "" as Task["status"] | "",
  })

  const showToast = (msg: string) => {
    setToastVisible(false)
    setToast("")
    setTimeout(() => {
      setToast(msg)
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 3000)
    }, 50)
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  const handleSendEmail = async () => {
    if (!user?.email) return
    setEmailLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
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
    setTaskLoading(true)
    try {
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
    } catch {
      showToast("Error al crear la tarea")
    } finally {
      setTaskLoading(false)
    }
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

  const priorityOrder: Record<string, number> = { alta: 0, media: 1, baja: 2 }
  const proximaTarea = tasks
    .filter((t) => t.status !== "completada")
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        const dateDiff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        if (dateDiff !== 0) return dateDiff
      }
      if (a.dueDate && !b.dueDate) return -1
      if (!a.dueDate && b.dueDate) return 1
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })[0]

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

      {toastVisible && (
        <div style={{
          position: "fixed", bottom: "24px", right: "16px",
          background: "var(--moss)", color: "white",
          padding: "12px 20px", borderRadius: "10px",
          fontSize: "14px", fontWeight: "600", zIndex: 999,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          animation: "fadeIn 0.3s ease",
          maxWidth: "calc(100vw - 32px)"
        }}>
          {toast}
        </div>
      )}

      <header style={{
        background: "var(--card-bg)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)", padding: "0 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "60px", position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        transition: "background 0.3s, border-color 0.3s"
      }}>
        <span style={{ fontWeight: "800", fontSize: "16px", color: "var(--cinnamon)", letterSpacing: "0.05em" }}>
          TUAGENDA
        </span>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button onClick={toggleTheme} style={{
            padding: "7px 10px", background: "var(--card-bg)",
            border: "1px solid var(--border)", color: "var(--text)", fontSize: "16px",
          }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button onClick={handleSendEmail} disabled={emailLoading} style={{
            padding: "7px 10px", background: "rgba(158, 90, 58, 0.1)",
            border: "1px solid var(--rose-ash)", color: "var(--cinnamon)",
            fontSize: isMobile ? "16px" : "13px",
            opacity: emailLoading ? 0.7 : 1
          }}>
            {isMobile ? "📧" : (emailLoading ? "Enviando..." : "Enviar resumen por email")}
          </button>
          <button onClick={handleLogout} style={{
            padding: "7px 10px", background: "var(--moss)",
            border: "none", color: "white", fontSize: "13px"
          }}>
            Salir
          </button>
        </div>
      </header>

      <div style={{ padding: isMobile ? "16px 12px" : "24px 16px", maxWidth: "1200px", margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "12px" }}>
          <h1 style={{ fontSize: isMobile ? "20px" : "28px", fontWeight: "800", color: "var(--moss)" }}>
            Organiza tu dia ✨
          </h1>
          <button onClick={() => setShowForm(true)} style={{
            padding: isMobile ? "8px 14px" : "10px 20px",
            background: "var(--cinnamon)", border: "none", color: "white",
            fontSize: "13px", fontWeight: "600",
            boxShadow: "0 4px 12px rgba(138, 74, 42, 0.3)", whiteSpace: "nowrap"
          }}>
            + {isMobile ? "Nueva" : "Nueva Tarea"}
          </button>
        </div>

        <div style={{
          background: "var(--card-bg)", backdropFilter: "blur(16px)",
          borderRadius: "12px", padding: "16px 20px",
          border: "1px solid var(--border)", marginBottom: "16px",
          transition: "background 0.3s, border-color 0.3s"
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

        <div className="stats-grid">
          {[
            { label: "Total", value: stats.total, color: "var(--cinnamon)" },
            { label: "Completadas", value: stats.completadas, color: "var(--moss)" },
            { label: "Pendientes", value: stats.pendientes, color: "var(--rose-ash)" },
            { label: "En Progreso", value: stats.enProgreso, color: "var(--quartz)" },
            { label: "Vencidas", value: stats.vencidas, color: "#dc2626" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "var(--card-bg)", backdropFilter: "blur(16px)",
              borderRadius: "12px", padding: "14px", border: "1px solid var(--border)",
              textAlign: "center", transition: "background 0.3s, border-color 0.3s"
            }}>
              <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "4px", fontWeight: "600", textTransform: "uppercase" }}>
                {stat.label}
              </p>
              <p style={{ fontSize: "22px", fontWeight: "800", color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {showForm && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 200, padding: "16px"
          }}>
            <div style={{
              background: "var(--card-bg)", backdropFilter: "blur(20px)",
              borderRadius: "16px", padding: "20px",
              width: "100%", maxWidth: "460px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)", border: "1px solid var(--border)",
            }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "14px", color: "var(--moss)" }}>
                Crear Nueva Tarea
              </h2>
              <form onSubmit={handleAddTask} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div>
                  <label style={{ fontSize: "10px", fontWeight: "700", color: "var(--moss)", marginBottom: "3px", display: "block", letterSpacing: "0.05em" }}>TITULO</label>
                  <input placeholder="Ej: Estudiar para el examen" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required style={{ padding: "7px 10px", fontSize: "14px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "10px", fontWeight: "700", color: "var(--moss)", marginBottom: "3px", display: "block", letterSpacing: "0.05em" }}>DESCRIPCION</label>
                  <textarea placeholder="Ej: Repasar capitulos 3 y 4" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} rows={2} style={{ resize: "none", padding: "7px 10px", fontSize: "14px" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div>
                    <label style={{ fontSize: "10px", fontWeight: "700", color: "var(--moss)", marginBottom: "3px", display: "block", letterSpacing: "0.05em" }}>PRIORIDAD</label>
                    <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })} style={{ padding: "7px 10px", fontSize: "14px" }}>
                      <option value="">Seleccionar</option>
                      <option value="alta">Alta</option>
                      <option value="media">Media</option>
                      <option value="baja">Baja</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", fontWeight: "700", color: "var(--moss)", marginBottom: "3px", display: "block", letterSpacing: "0.05em" }}>ESTADO</label>
                    <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Task["status"] })} style={{ padding: "7px 10px", fontSize: "14px" }}>
                      <option value="">Seleccionar</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="en_progreso">En Progreso</option>
                      <option value="completada">Completada</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div>
                    <label style={{ fontSize: "10px", fontWeight: "700", color: "var(--moss)", marginBottom: "3px", display: "block", letterSpacing: "0.05em" }}>CATEGORIA</label>
                    <select value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value as Task["category"] })} style={{ padding: "7px 10px", fontSize: "14px" }}>
                      <option value="">Seleccionar</option>
                      <option value="trabajo">Trabajo</option>
                      <option value="personal">Personal</option>
                      <option value="salud">Salud</option>
                      <option value="estudio">Estudio</option>
                      <option value="hogar">Hogar</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", fontWeight: "700", color: "var(--moss)", marginBottom: "3px", display: "block", letterSpacing: "0.05em" }}>FECHA LIMITE</label>
                    <input type="date" value={newTask.dueDate} min={TODAY} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} style={{ padding: "7px 10px", fontSize: "14px" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                  <button type="button" onClick={() => setShowForm(false)} disabled={taskLoading} style={{
                    flex: 1, padding: "9px", background: "var(--card-bg)",
                    border: "1px solid var(--border)", color: "var(--text)",
                    opacity: taskLoading ? 0.5 : 1, fontSize: "14px"
                  }}>Cancelar</button>
                  <button type="submit" disabled={taskLoading} style={{
                    flex: 1, padding: "9px", background: "var(--cinnamon)",
                    border: "none", color: "white", fontWeight: "700",
                    opacity: taskLoading ? 0.7 : 1, fontSize: "14px"
                  }}>
                    {taskLoading ? "Guardando..." : "Crear Tarea"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="main-layout">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {isMobile && (
              <button onClick={() => setShowFilters(!showFilters)} style={{
                padding: "10px 16px", background: "var(--card-bg)",
                border: "1px solid var(--border)", color: "var(--text)",
                fontSize: "14px", textAlign: "left", display: "flex",
                justifyContent: "space-between", alignItems: "center"
              }}>
                <span style={{ fontWeight: "700" }}>Filtros</span>
                <span>{showFilters ? "▲" : "▼"}</span>
              </button>
            )}

            {(!isMobile || showFilters) && (
              <div style={{
                background: "var(--card-bg)", backdropFilter: "blur(16px)",
                borderRadius: "12px", padding: "20px", border: "1px solid var(--border)",
                transition: "background 0.3s, border-color 0.3s"
              }}>
                {!isMobile && <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "16px", color: "var(--moss)" }}>Filtros</h3>}
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
            )}

            <div style={{
              background: "var(--card-bg)", backdropFilter: "blur(16px)",
              borderRadius: "12px", padding: "20px", border: "1px solid var(--border)",
              transition: "background 0.3s, border-color 0.3s"
            }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px", color: "var(--moss)" }}>
                Proxima tarea
              </h3>
              {proximaTarea ? (
                <div onClick={() => setSearch(proximaTarea.title)} style={{
                  padding: "10px 12px", background: "rgba(138, 74, 42, 0.08)",
                  borderRadius: "8px", border: "1px solid var(--border)",
                  cursor: "pointer", transition: "opacity 0.2s"
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
                      📅 {formatDate(proximaTarea.dueDate)}
                    </p>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>No tenes proximas tareas.</p>
              )}
            </div>
          </div>

          <div style={{
            background: "var(--card-bg)", backdropFilter: "blur(16px)",
            borderRadius: "12px", border: "1px solid var(--border)", overflow: "hidden",
            transition: "background 0.3s, border-color 0.3s"
          }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--moss)", marginBottom: "12px" }}>Lista de Tareas</h3>
              <input placeholder="Buscar tareas..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%" }} />
            </div>
            <div style={{ maxHeight: isMobile ? "none" : "360px", overflowY: isMobile ? "visible" : "auto" }}>
              <TaskList tasks={filteredTasks} onDelete={deleteTask} onUpdate={updateTask} onToast={showToast} />
            </div>
          </div>
        </div>

        {isMobile && (
          <button onClick={handleSendEmail} disabled={emailLoading} style={{
            width: "100%", padding: "12px", marginBottom: "16px",
            background: "rgba(158, 90, 58, 0.1)", border: "1px solid var(--rose-ash)",
            color: "var(--cinnamon)", fontSize: "14px", fontWeight: "600",
            opacity: emailLoading ? 0.7 : 1
          }}>
            {emailLoading ? "Enviando..." : "📧 Enviar resumen por email"}
          </button>
        )}
      </div>
    </div>
  )
}

export default Tasks
