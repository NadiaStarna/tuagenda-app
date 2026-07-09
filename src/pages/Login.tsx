import { useState } from "react"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "../services/firebase"
import { useNavigate, Link } from "react-router-dom"
import logo from "../assets/logo.png"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.includes("@") || !email.includes(".")) {
      setError("Ingresa un email valido.")
      return
    }
    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.")
      return
    }
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/tasks")
    } catch {
      setError("Email o contrasena incorrectos.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
      navigate("/tasks")
    } catch {
      setError("Error al iniciar sesion con Google.")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={logo} alt="TuAgenda" className="auth-card__logo" />
        <h1 className="auth-card__title">Bienvenido a TuAgenda</h1>
        <p className="auth-card__subtitle">Ingresa a tu cuenta para continuar</p>

        {error && <div className="auth-card__error">{error}</div>}

        <button className="auth-card__google-btn" onClick={handleGoogle}>
          <img src="https://www.google.com/favicon.ico" width="18" alt="Google" />
          Continuar con Google
        </button>

        <div className="auth-card__divider">
          <div className="auth-card__divider-line" />
          <span className="auth-card__divider-text">o continuar con email</span>
          <div className="auth-card__divider-line" />
        </div>

        <form className="auth-card__form" onSubmit={handleLogin}>
          <div>
            <label className="auth-card__label">EMAIL</label>
            <input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="auth-card__label">CONTRASENA</label>
            <input type="password" placeholder="Tu contrasena" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-card__submit-btn" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="auth-card__footer">
          No tenes cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  )
}

export default Login