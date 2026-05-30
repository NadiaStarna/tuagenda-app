import { useState, useEffect } from "react"
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../services/firebase"
import type { Task } from "../types"

export const useTasks = (userId: string) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const q = query(collection(db, "tasks"), where("userId", "==", userId))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[]
      setTasks(taskList)
      setLoading(false)
    })

    return unsubscribe
  }, [userId])

  const addTask = async (task: Omit<Task, "id">) => {
    await addDoc(collection(db, "tasks"), task)
  }

  const updateTask = async (id: string, data: Partial<Task>) => {
    await updateDoc(doc(db, "tasks", id), data)
  }

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id))
  }

  return { tasks, loading, addTask, updateTask, deleteTask }
}
