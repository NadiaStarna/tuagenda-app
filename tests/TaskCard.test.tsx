import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import TaskCard from "../src/components/TaskCard"
import type { Task } from "../src/types"

const mockTask: Task = {
  id: "1",
  title: "Tarea de prueba",
  description: "Descripcion de prueba",
  status: "pendiente",
  priority: "alta",
  category: "personal",
  dueDate: "2026-12-31",
  userId: "user123",
  createdAt: new Date().toISOString(),
}

describe("TaskCard", () => {
  it("renderiza el titulo de la tarea", () => {
    render(<TaskCard task={mockTask} onDelete={vi.fn()} onUpdate={vi.fn()} onToast={vi.fn()} />)
    expect(screen.getByText("Tarea de prueba")).toBeInTheDocument()
  })

  it("muestra el badge de prioridad alta", () => {
    render(<TaskCard task={mockTask} onDelete={vi.fn()} onUpdate={vi.fn()} onToast={vi.fn()} />)
    expect(screen.getByText("Alta")).toBeInTheDocument()
  })

  it("llama a onDelete cuando se elimina la tarea", () => {
    const mockDelete = vi.fn()
    render(<TaskCard task={mockTask} onDelete={mockDelete} onUpdate={vi.fn()} onToast={vi.fn()} />)
    fireEvent.click(screen.getByText("···"))
    fireEvent.click(screen.getByText("Eliminar"))
    expect(mockDelete).toHaveBeenCalledWith("1")
  })

  it("muestra tarea tachada cuando esta completada", () => {
    const completedTask = { ...mockTask, status: "completada" as Task["status"] }
    render(<TaskCard task={completedTask} onDelete={vi.fn()} onUpdate={vi.fn()} onToast={vi.fn()} />)
    const title = screen.getByText("Tarea de prueba")
    expect(title.style.textDecoration).toBe("line-through")
  })
})
