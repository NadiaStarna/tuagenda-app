import { useAuth } from "../hooks/useAuth"
import { useTasks } from "../hooks/useTasks"
import { signOut } from "firebase/auth"
import { auth } from "../services/firebase"
import { useNavigate } from "react-router-dom"
import TaskForm from "../components/TaskForm"
import TaskList from "../components/TaskList"

const Tasks = () => {
  const { user } = useAuth()
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks(user?.uid || "")
  const navigate = useNavigate()

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

  if (loading) return <p>Cargando...</p>

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Panel de Tareas
        </h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleSendEmail} style={{ padding: "8px 16px", background: "white", border: "1px solid #111111", fontWeight: "600" }}>
            Enviar resumen por email
          </button>
          <button onClick={handleLogout} style={{ padding: "8px 16px", background: "#111111", color: "white", border: "none", fontWeight: "600" }}>
            Cerrar sesion
          </button>
        </div>
      </div>
      <TaskForm onSubmit={addTask} userId={user?.uid || ""} />
      <TaskList tasks={tasks} onDelete={deleteTask} onUpdate={updateTask} />
    </div>
  )
}

export default Tasks
