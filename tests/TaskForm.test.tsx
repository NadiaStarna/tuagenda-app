import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import TaskForm from "../src/components/TaskForm"

describe("TaskForm", () => {
  it("renderiza el formulario correctamente", () => {
    const mockSubmit = vi.fn()
    render(<TaskForm onSubmit={mockSubmit} userId="user123" />)
    expect(screen.getByPlaceholderText("Titulo")).toBeInTheDocument()
    expect(screen.getByText("Crear Tarea")).toBeInTheDocument()
  })

  it("llama a onSubmit con los datos correctos", () => {
    const mockSubmit = vi.fn()
    render(<TaskForm onSubmit={mockSubmit} userId="user123" />)
    fireEvent.change(screen.getByPlaceholderText("Titulo"), {
      target: { value: "Nueva tarea" },
    })
    fireEvent.click(screen.getByText("Crear Tarea"))
    expect(mockSubmit).toHaveBeenCalled()
  })
})
