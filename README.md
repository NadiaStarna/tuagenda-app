# TuAgenda - Gestor de Tareas

Aplicacion web SPA para gestion de tareas con autenticacion de usuarios, persistencia en la nube y envio de notificaciones por email. Desarrollada como proyecto integrador del Modulo 4 de MateCode.

## URL de produccion

https://gestor-tareas-m4.vercel.app

## Cuenta de prueba para correcciones

Para probar el envio de emails, usar esta cuenta verificada en AWS SES:

- Email: starnanadia.pruebas@gmail.com
- Contrasena: Starna1234

Nota: AWS SES esta en modo sandbox, por lo que solo puede enviar emails a direcciones verificadas. Esta cuenta esta verificada y permite probar el flujo completo de envio de resumen por email.

## Descripcion del proyecto

TuAgenda es una aplicacion que permite a los usuarios gestionar sus tareas diarias de forma organizada. Cada usuario tiene sus propias tareas almacenadas en la nube, puede crear, editar, eliminar y marcar tareas como completadas, filtrar por estado y prioridad, ver estadisticas en tiempo real y recibir un resumen por email.

## Stack tecnologico

| Tecnologia | Uso |
|------------|-----|
| React + TypeScript | Frontend |
| Vite | Bundler |
| Firebase Auth | Autenticacion |
| Cloud Firestore | Base de datos |
| AWS SES | Envio de emails |
| Vercel Functions | Backend serverless |
| Vitest + RTL | Testing |
| Vercel | Deploy |

## Estructura del proyecto

gestor-tareas-m4/
- src/pages/ - Login.tsx, Register.tsx, Tasks.tsx
- src/components/ - TaskCard.tsx, TaskForm.tsx, TaskList.tsx
- src/hooks/ - useAuth.ts, useTasks.ts, useTheme.ts
- src/services/ - firebase.ts
- src/routes/ - ProtectedRoute.tsx
- src/types/ - index.ts
- src/features/
- src/utils/
- api/ - sendEmail.js
- functions/ - sendEmail.js
- tests/ - setup.ts, TaskForm.test.tsx, TaskList.test.tsx, TaskCard.test.tsx
- .env.example
- .gitignore
- index.html
- package.json
- vite.config.ts
- README.md

## Instrucciones de instalacion

1. Clonar el repositorio
git clone https://github.com/NadiaStarna/ProyectoM4-NadiaStarna.git
cd gestor-tareas-m4

2. Instalar dependencias
npm install

3. Configurar variables de entorno
cp .env.example .env
Completar el .env con las credenciales de Firebase y AWS.

4. Ejecutar en desarrollo
npm run dev

5. Ejecutar tests
npx vitest run

6. Build de produccion
npm run build

## Variables de entorno

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
SES_FROM_EMAIL=

## Decisiones arquitectonicas

- Componentes organizados por capas: pages, components, hooks, services, types
- Firebase Auth con email/password y Google
- Firestore con onSnapshot para sincronizacion en tiempo real filtrada por userId
- Reglas de seguridad Firestore: cada usuario solo accede a sus propias tareas
- Vercel Functions para proteger credenciales de AWS SES
- TypeScript con tipos reutilizables definidos en src/types/index.ts
- Hooks personalizados useAuth, useTasks y useTheme para encapsular logica

## Flujo de envio de emails

1. El usuario hace clic en Enviar resumen por email
2. El frontend llama a /api/sendEmail via POST con el email del usuario y la lista de tareas
3. La Vercel Function recibe el request del lado del servidor
4. Usa AWS SES para enviar el email con el resumen de tareas
5. Las credenciales de AWS nunca se exponen al frontend

## Testing

- TaskForm.test.tsx - Renderizado y envio de datos
- TaskList.test.tsx - Listado y mensaje cuando no hay tareas
- TaskCard.test.tsx - Renderizado, badge, eliminacion y tarea completada

Resultado: 8 tests pasando
npx vitest run

## Uso de inteligencia artificial en el desarrollo

Se utilizo Claude (Anthropic) y Chat GPT como asistentes durante todo el proceso de desarrollo del proyecto.

Como se integro la IA

El proceso de trabajo con IA fue colaborativo y critico. En lugar de copiar y pegar codigo sin entender, cada bloque fue analizado, cuestionado y adaptado a las necesidades del proyecto. La IA fue usada como un par de programacion que explica, sugiere y corrige, no como un generador automatico de codigo.

Evidencia del proceso

La carpeta /docs contiene capturas de pantalla del proceso de trabajo con IA.

Prompt 1 - error de consola
![Prompt 1](./docs/prompt1.png)

Prompt 2 - Vercel Functions y AWS SES
![Prompt 2](./docs/prompt2.png)

Prompt 3 - Firebase
![Prompt 3](./docs/prompt3.png)

Prompt 4 - Vite
![Prompt 4](./docs/prompt4.png)
