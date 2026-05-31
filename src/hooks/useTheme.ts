import { useState, useEffect } from "react"

export const useTheme = () => {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("theme") as "dark" | "light") || "light"
  })

  useEffect(() => {
    document.body.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return { theme, toggleTheme }
}
