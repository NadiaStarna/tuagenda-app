import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../services/firebase"
import { useNavigate, Link } from "react-router-dom"
import logo from "../assets/logo.png"

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
    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) return age - 1
    return age
  }

  const handleRegister = async (e: React.FormEvent) => {
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
    if (!/[A-Z]/.test(password)) {
      setError("La contrasena debe tener al menos una mayuscula.")
      return
    }
    if (!/[0-9]/.test(password)) {
      setError("La contrasena debe tener al menos un numero.")
      return
    }
    if (!birthDate) {
      setError("Ingresa tu fecha de nacimiento.")
      return
    }
    if (validateAge(birthDate) < 16) {
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
    <div className="auth-page">
      <div className="auth-card">
        <img src={logo} alt="TuAgenda" className="auth-card__logo" />
        <h1 className="auth-card__title">Crear cuenta</h1>
        <p className="auth-card__subtitle">Registrate para comenzar a gestionar tus tareas</p>

        {error && <div className="auth-card__error">{error}</div>}

        <form className="auth-card__form" onSubmit={handleRegister}>
          <div>
            <label className="auth-card__label">EMAIL</label>
            <input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="auth-card__label">CONTRASENA</label>
            <input type="password" placeholder="Min 6 caracteres, 1 mayuscula, 1 numero" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="auth-card__label">FECHA DE NACIMIENTO</label>
            <input type="date" value={birthDate} max={maxDateStr} onChange={(e) => setBirthDate(e.target.value)} required />
            <p style={{ fontSize: "11px", color: "#6a6a6a", marginTop: "4px" }}>Debes tener al menos 16 anos.</p>
          </div>
          <button type="submit" className="auth-card__submit-btn" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-card__footer">
          Ya tenes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </div>
    </div>
  )
}

export default Register