import { useState } from "react"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "../services/firebase"
import { useNavigate, Link } from "react-router-dom"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/tasks")
        } catch {
            setError("Email o contraseña incorrectos")
        }
    }

    const handleGoogle = async () => {
        try {
            await signInWithPopup(auth, new GoogleAuthProvider())
            navigate("/tasks")
        } catch {
            setError("Error al iniciar sesión con Google")
        }
    }

    return (
        <div className="auth-container">
            <h1>Iniciar Sesión</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Ingresar</button>
            </form>
            <button onClick={handleGoogle}>Continuar con Google</button>
            <p>¿No tenés cuenta? <Link to="/register">Registrate</Link></p>
        </div>
    )
}

export default Login