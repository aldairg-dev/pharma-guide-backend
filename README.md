# 💊 PharmaGuide Backend

**PharmaGuide** es una API REST avanzada desarrollada con Node.js, Express, TypeScript y Prisma ORM, diseñada para respaldar la aplicación móvil _PharmaGuide_. Esta plataforma educativa innovadora está dirigida a estudiantes de Química Farmacéutica, proporcionando herramientas inteligentes para optimizar su aprendizaje.

El backend gestiona usuarios, contenido educativo, planificación académica adaptativa y comunicación con herramientas de inteligencia artificial especializadas.

---

## 🚀 Características Destacadas

- 🌐 **API REST** robusta, escalable y eficiente.
- 🔐 **Autenticación segura** mediante JWT.
- 🧠 **Integración con IA** (DeepSeek API) para consultas contextuales avanzadas.
- 📚 **Planificación académica adaptativa** para optimizar el tiempo de estudio.
- 🗂 **Gestión documental** con soporte OCR (en desarrollo).
- 🔔 **Notificaciones push** a través de Firebase Cloud Messaging.
- 🛡️ Cumplimiento de estándares de calidad **ISO/IEC 25010**.

---

## 🛠️ Tecnologías Clave

| Componente     | Tecnología               |
| -------------- | ------------------------ |
| Backend        | Node.js + Express        |
| Lenguaje       | TypeScript               |
| ORM            | Prisma                   |
| Base de Datos  | PostgreSQL               |
| Notificaciones | Firebase Cloud Messaging |
| IA             | CRUD for IA          |
| Desarrollo     | ts-node-dev + nodemon    |

---

## ⚙️ Scripts

| Comando         | Descripción                                               |
| --------------- | --------------------------------------------------------- |
| `npm run dev`   | Inicia el servidor en modo desarrollo con hot reload.     |
| `npm run build` | Compila el código TypeScript a JavaScript.                |
| `npm start`     | Ejecuta la versión compilada desde el directorio `dist/`. |

---

## 🧪 Requisitos Previos

- **Node.js** >= 18.x
- **PostgreSQL** >= 14
- **Prisma CLI** (`npx prisma`)
- Cuenta activa en [Supabase](https://supabase.com/)
- API Key de [DeepSeek](https://deepseek.com/)

---

## 🧭 Guía de Inicio

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/2A2G/pharma-guide-backend.git
   cd pharma-guide-backend
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**  
   Crea un archivo `.env` con el siguiente contenido:

   ```env
   DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/pharmaguide
   DEEPSEEK_API_KEY=tu_api_key
   ```

4. **Ejecuta las migraciones de Prisma:**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Inicia el servidor en modo desarrollo:**

   ```bash
   npm run dev
   ```

---

## 📌 Objetivos del Proyecto

| Objetivo                     | Indicador de Éxito                  |
| ---------------------------- | ----------------------------------- |
| Gestión eficiente del tiempo | Reducción del 35% en planificación. |

---

## 📫 Contacto

¿Tienes preguntas, sugerencias o deseas contribuir?  
No dudes en escribirnos:

📧 **Correo:** [aldairgguer@gmail.com](mailto:aldairgguer@gmail.com)  
🐙 **GitHub:** [2A2G](https://github.com/2A2G)

---

## 📜 Licencia

Este proyecto está licenciado bajo la licencia **MIT**.  
© 2025 [2A2G](https://github.com/2A2G). Todos los derechos reservados.
