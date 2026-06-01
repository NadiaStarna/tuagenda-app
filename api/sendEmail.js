import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo no permitido" })
  }

  const { email, tasks } = req.body

  if (!email || !tasks) {
    return res.status(400).json({ error: "Faltan datos" })
  }

  const completed = tasks.filter((t) => t.status === "completada").length
  const pending = tasks.filter((t) => t.status === "pendiente").length
  const inProgress = tasks.filter((t) => t.status === "en_progreso").length

  const htmlBody = `
    <h2>Resumen de tus tareas en TuAgenda</h2>
    <p><strong>Total:</strong> ${tasks.length}</p>
    <p><strong>Completadas:</strong> ${completed}</p>
    <p><strong>Pendientes:</strong> ${pending}</p>
    <p><strong>En progreso:</strong> ${inProgress}</p>
    <hr/>
    <p>Segui organizando tu dia con TuAgenda!</p>
  `

  const command = new SendEmailCommand({
    Source: process.env.SES_FROM_EMAIL,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "Tu resumen de tareas - TuAgenda" },
      Body: { Html: { Data: htmlBody } },
    },
  })

  try {
    await ses.send(command)
    return res.status(200).json({ message: "Email enviado correctamente" })
  } catch (error) {
    console.error("SES Error:", error)
    return res.status(500).json({ error: String(error) })
  }
}
