import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import TaskList from "../src/components/TaskList"
import type { Task } from "../src/types"

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Tarea de prueba",
    description: "Descripcion de prueba",
    status: "pendiente",
    priority: "media",
    category: "personal",
    dueDate: "2026-12-31",
    userId: "user123",
    createdAt: new Date().toISOString(),
  },
]

describe("TaskList", () => {
  it("muestra mensaje cuando no hay tareas", () => {
    render(<TaskList tasks={[]} onDelete={vi.fn()} onUpdate={vi.fn()} />)
    expect(screen.getByText("No tenes tareas todavia.")).toBeInTheDocument()
  })

  it("muestra las tareas correctamente", () => {
    render(<TaskList tasks={mockTasks} onDelete={vi.fn()} onUpdate={vi.fn()} />)
    expect(screen.getByText("Tarea de prueba")).toBeInTheDocument()
  })
})
