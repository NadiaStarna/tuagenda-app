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

    if (loading) return <p>Cargando...</p>

    return (
        <div>
            <h1>Mis Tareas</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
            <TaskForm onSubmit={addTask} userId={user?.uid || ""} />
            <TaskList tasks={tasks} onDelete={deleteTask} onUpdate={updateTask} />
        </div>
    )
}

export default Tasks