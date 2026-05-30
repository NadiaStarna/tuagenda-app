export interface Task {
    id: string
    title: string
    description: string
    status: "pendiente" | "en_progreso" | "completada" | "archivada"
    priority: "baja" | "media" | "alta"
    category: "trabajo" | "personal" | "salud" | "estudio" | "hogar" | "otro"
    dueDate: string
    userId: string
    createdAt: string
}

export interface User {
    uid: string
    email: string
    displayName: string
}