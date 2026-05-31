import { useState } from "react"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "../services/firebase"
import { useNavigate, Link } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/tasks")
    } catch {
      setError("Email o contrasena incorrectos")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
      navigate("/tasks")
    } catch {
      setError("Error al iniciar sesion con Google")
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(12px)",
        borderRadius: "20px",
        padding: "48px 40px",
        width: "100%",
        maxWidth: "420px",
        border: "1px solid rgba(212, 200, 192, 0.6)",
        boxShadow: "0 20px 60px rgba(58, 74, 55, 0.12)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>📋</div>
          <h1 style={{
            fontSize: "26px",
            fontWeight: "800",
            color: "#3a4a37",
            marginBottom: "8px"
          }}>Bienvenido a TuAgenda</h1>
          <p style={{ color: "#6a6a6a", fontSize: "14px" }}>
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(184, 137, 126, 0.15)",
            border: "1px solid rgba(184, 137, 126, 0.4)",
            borderRadius: "10px",
            padding: "12px",
            marginBottom: "16px",
            fontSize: "14px",
            color: "#8a4a2a"
          }}>{error}</div>
        )}

        <button onClick={handleGoogle} style={{
          width: "100%",
          padding: "11px",
          background: "rgba(255,255,255,0.9)",
          border: "1px solid #d4c8c0",
          color: "#2c2c2c",
          fontSize: "14px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
        }}>
          <img src="https://www.google.com/favicon.ico" width="18" alt="Google" />
          Continuar con Google
        </button>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px"
        }}>
          <div style={{ flex: 1, height: "1px", background: "#d4c8c0" }} />
          <span style={{ color: "#6a6a6a", fontSize: "13px" }}>o continuar con email</span>
          <div style={{ flex: 1, height: "1px", background: "#d4c8c0" }} />
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#3a4a37", marginBottom: "6px", display: "block", letterSpacing: "0.05em" }}>
              EMAIL
            </label>
            <input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#3a4a37", marginBottom: "6px", display: "block", letterSpacing: "0.05em" }}>
              CONTRASENA
            </label>
            <input type="password" placeholder="Tu contrasena" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} style={{
            marginTop: "8px",
            padding: "13px",
            background: "linear-gradient(135deg, #b8897e, #8a4a2a)",
            border: "none",
            color: "white",
            fontSize: "15px",
            fontWeight: "700",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 4px 15px rgba(138, 74, 42, 0.3)"
          }}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#6a6a6a" }}>
          No tenes cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
