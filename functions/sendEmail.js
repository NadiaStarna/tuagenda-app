import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" })
  }

  const { email, tasks } = req.body

  const completed = tasks.filter((t) => t.status === "completada").length
  const pending = tasks.filter((t) => t.status === "pendiente").length
  const inProgress = tasks.filter((t) => t.status === "en_progreso").length

  const htmlBody = `
    <h1>Resumen de tus tareas</h1>
    <p>Total: ${tasks.length}</p>
    <p>Completadas: ${completed}</p>
    <p>Pendientes: ${pending}</p>
    <p>En progreso: ${inProgress}</p>
  `

  const command = new SendEmailCommand({
    Source: process.env.SES_FROM_EMAIL,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "Resumen de tus tareas" },
      Body: { Html: { Data: htmlBody } },
    },
  })

  try {
    await ses.send(command)
    return res.status(200).json({ message: "Email enviado correctamente" })
  } catch (error) {
    return res.status(500).json({ error: "Error al enviar el email" })
  }
}
