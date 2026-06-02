import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../services/firebase"
import { useNavigate, Link } from "react-router-dom"

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validateAge = (date: string) => {
    const birth = new Date(date)
    const today = new Date()
    const age = today.getFullYear() - birth.getFullYear()
    const month = today.getMonth() - birth.getMonth()
    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
      return age - 1
    }
    return age
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!birthDate) {
      setError("Ingresa tu fecha de nacimiento.")
      return
    }

    const age = validateAge(birthDate)
    if (age < 16) {
      setError("Debes tener al menos 16 anos para registrarte.")
      return
    }

    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate("/tasks")
    } catch {
      setError("Error al registrarse. Verifica tus datos.")
    } finally {
      setLoading(false)
    }
  }

  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() - 16)
  const maxDateStr = maxDate.toISOString().split("T")[0]

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
          }}>Crear cuenta</h1>
          <p style={{ color: "#6a6a6a", fontSize: "14px" }}>
            Registrate para comenzar a gestionar tus tareas
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

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#3a4a37", marginBottom: "6px", display: "block", letterSpacing: "0.05em" }}>
              FECHA DE NACIMIENTO
            </label>
            <input
              type="date"
              value={birthDate}
              max={maxDateStr}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
            <p style={{ fontSize: "11px", color: "#6a6a6a", marginTop: "4px" }}>
              Debes tener al menos 16 anos para registrarte.
            </p>
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
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#6a6a6a" }}>
          Ya tenes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
