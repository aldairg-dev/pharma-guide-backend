<div align="center">

# 💊 PharmaGuide Backend

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black)](https://swagger.io)

</div>

**PharmaGuide Backend** es una API REST avanzada desarrollada con Node.js, Express, TypeScript y Prisma ORM, diseñada para respaldar la aplicación móvil _PharmaGuide_. Esta plataforma educativa innovadora está dirigida a estudiantes de Química Farmacéutica, proporcionando herramientas inteligentes para optimizar su aprendizaje.

El backend gestiona usuarios, contenido educativo, planificación académica adaptativa y comunicación con herramientas de inteligencia artificial integradas y gestionables.

## 📋 Índice

- [🎯 Características Principales](#-características-principales)
- [🛠️ Tecnologías y Dependencias](#️-tecnologías-y-dependencias)
- [🏗️ Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [🗄️ Base de Datos](#️-base-de-datos)
- [🔐 Autenticación y Seguridad](#-autenticación-y-seguridad)
- [📚 Documentación API](#-documentación-api)
- [🧪 Scripts Disponibles](#-scripts-disponibles)
- [🌐 Despliegue](#-despliegue)
- [🔧 Configuración Avanzada](#-configuración-avanzada)
- [🧪 Testing](#-testing)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)
- [👥 Autores](#-autores)
- [📞 Contacto](#-contacto)

## 🎯 Características Principales

### 🌐 API REST Robusta
- **Arquitectura escalable** con Express.js y TypeScript
- **Validación de datos** con middleware personalizado
- **Manejo de errores** centralizado y consistente
- **CORS configurado** para desarrollo y producción
- **Documentación automática** con Swagger/OpenAPI 3.0

### 🔐 Sistema de Autenticación
- **JWT (JSON Web Tokens)** para autenticación segura
- **Bcrypt** para hash de contraseñas
- **Middleware de autorización** para rutas protegidas
- **Roles de usuario** (Admin, Cliente)
- **Sesiones persistentes** con tokens de larga duración

### 🧠 Gestor de Inteligencias Artificiales
- **CRUD completo** para múltiples proveedores de IA
- **Activación/desactivación** dinámica de modelos
- **Configuración de prompts** personalizados
- **Soporte para múltiples proveedores** (DeepSeek, OpenAI, etc.)
- **Versionado de modelos** y APIs

### 📚 Planificación Académica Adaptativa
- **Planes de estudio personalizados** por usuario
- **Gestión de medicamentos** con información detallada
- **Categorización por clase terapéutica** y mecanismo de acción
- **Sistema de tags** para organización avanzada

### 🗂️ Gestión de Usuarios
- **Registro y autenticación** completa
- **Perfiles de usuario** detallados
- **Gestión de roles** y permisos
- **Soft delete** para mantener integridad de datos

## 🛠️ Tecnologías y Dependencias

### Stack Principal
- **Node.js** `>= 18.x` - Runtime de JavaScript
- **Express.js** `^5.1.0` - Framework web rápido y minimalista
- **TypeScript** `^5.8.3` - Superset de JavaScript con tipos estáticos
- **Prisma ORM** `^6.8.2` - ORM moderno para TypeScript y Node.js
- **PostgreSQL** `>= 14` - Base de datos relacional avanzada

### Dependencias Principales
```json
{
  "dependencies": {
    "@prisma/client": "^6.8.2",
    "@prisma/extension-accelerate": "^1.3.0",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "date-fns": "^4.1.0",
    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "swagger-autogen": "^2.23.7",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1"
  }
}
```

### Dependencias de Desarrollo
```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^5.31.0",
    "@typescript-eslint/parser": "^5.31.0",
    "cross-env": "^7.0.3",
    "eslint": "^8.31.0",
    "nodemon": "^3.0.0",
    "prisma": "^6.6.0",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0"
  }
}
```

### Herramientas de Desarrollo
- **ESLint** - Linter para JavaScript/TypeScript
- **Prettier** - Formateador de código (implícito)
- **ts-node-dev** - Desarrollo con hot reload
- **cross-env** - Variables de entorno multiplataforma
- **Nodemon** - Monitor de archivos para desarrollo

## 🏗️ Arquitectura del Proyecto

### Arquitectura Modular
El proyecto sigue una **arquitectura modular** organizada por características funcionales:

```
src/
├── app.ts                     # Configuración principal de Express
├── index.ts                   # Punto de entrada del servidor
├── modules/                   # Módulos funcionales
│   ├── access/               # Autenticación y registro
│   │   ├── controller/       # Controladores
│   │   ├── router/           # Rutas
│   │   └── services/         # Lógica de negocio
│   ├── user/                 # Gestión de usuarios
│   ├── role/                 # Gestión de roles
│   ├── drug/                 # Gestión de medicamentos
│   ├── study-plan/           # Planes de estudio
│   ├── ia-management/        # Gestión de IA
│   └── email/                # Servicios de email
├── types/                    # Definiciones de tipos
│   └── express/              # Extensiones de Express
├── utils/                    # Utilidades
│   ├── bcrypt/               # Servicios de encriptación
│   ├── jwt/                  # Servicios JWT
│   └── helpers/              # Funciones auxiliares
└── swagger.ts               # Configuración de Swagger
```

### Patrones de Diseño
- **MVC (Model-View-Controller)** - Separación de responsabilidades
- **Repository Pattern** - Abstracción de acceso a datos
- **Service Layer** - Lógica de negocio centralizada
- **Middleware Pattern** - Interceptores de requests/responses
- **Dependency Injection** - Inyección de dependencias

### Modelo de Datos
```typescript
// Modelos principales
User         // Usuarios del sistema
Role         // Roles de usuario
Drug         // Medicamentos
StudyPlan    // Planes de estudio
ManagementIa // Gestión de IA
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** >= 18.x
- **PostgreSQL** >= 14
- **Git**
- **npm** o **yarn**

### Instalación Local
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
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env`:
   ```env
   # Base de datos
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/pharmaguide"
   
   # JWT Configuration
   JWT_SECRET="tu_jwt_secret_muy_seguro"
   JWT_EXPIRATION="86400"
   
   # Configuración del servidor
   PORT=3000
   NODE_ENV=development
   ```

4. **Configura la base de datos:**
   ```bash
   # Generar cliente Prisma
   npx prisma generate
   
   # Ejecutar migraciones
   npx prisma migrate dev --name init
   
   # Poblar datos iniciales
   npx prisma db seed
   ```

5. **Inicia el servidor:**
   ```bash
   npm run dev
   ```

## 🗄️ Base de Datos

### Esquema de Base de Datos
El proyecto utiliza **Prisma ORM** con **PostgreSQL** como base de datos principal.

#### Modelos Principales
```prisma
model User {
  id              Int         @id @default(autoincrement())
  full_name       String
  email           String      @unique
  password        String
  roleId          Int
  birth_date      DateTime    @db.Date
  country         String?
  number_identity String      @unique
  phone           String?
  sex             String
  // Relaciones
  role            Role        @relation(fields: [roleId], references: [id])
  studyPlans      StudyPlan[]
  drug            Drug[]
}

model Drug {
  id                  Int      @id @default(autoincrement())
  name_generic        String   @db.VarChar(100)
  brand_name          String   @db.VarChar(100)
  mechanism_of_action String   @db.VarChar(255)
  therapeutic_class   String?  @db.VarChar(100)
  tags                String?
  userId              Int
  // Relación
  user                User     @relation(fields: [userId], references: [id])
}

model ManagementIa {
  id                 Int      @id @default(autoincrement())
  name               String   @db.VarChar(100)
  provider           String   @db.VarChar(100)
  api_key            String
  model              String   @db.VarChar(100)
  status             Boolean  @default(false)
  prompt_description String
  url_api            String
  version            String?  @db.VarChar(50)
  
  @@unique([provider, model, version])
}
```

### Comandos Prisma Útiles
```bash
# Generar cliente
npx prisma generate

# Aplicar migraciones
npx prisma migrate dev

# Resetear base de datos
npx prisma migrate reset --force

# Abrir Prisma Studio
npx prisma studio

# Verificar estado
npx prisma migrate status
```

## 🔐 Autenticación y Seguridad

### Sistema JWT
```typescript
// Estructura del token
interface JwtPayload {
  userId: number;
  emailUser: string;
  roleId: number;
}

// Middleware de autenticación
app.use('/api/pharma-guide', jwtService.verifyTokenMiddleware);
```

### Seguridad Implementada
- **Bcrypt** para hash de contraseñas (salt rounds: 10)
- **JWT** con expiración configurable
- **CORS** habilitado para desarrollo
- **Validación de entrada** en todos los endpoints
- **Soft delete** para mantener integridad referencial
- **Rate limiting** (configuración pendiente)

### Roles de Usuario
```typescript
enum UserRole {
  ADMIN = 1,
  CLIENT = 2
}
```

## 📚 Documentación API

### Swagger/OpenAPI 3.0
La documentación completa de la API está disponible en:
- **Desarrollo**: `http://localhost:3000/api-docs`
- **Producción**: `https://api.pharmaguide.com/api-docs`

### Endpoints Principales
```typescript
// Autenticación
POST /api/access/pharma-guide/register
POST /api/access/pharma-guide/login

// Usuarios (requiere autenticación)
GET    /api/pharma-guide/users
GET    /api/pharma-guide/users/:id
PUT    /api/pharma-guide/users/:id
DELETE /api/pharma-guide/users/:id

// Medicamentos
GET    /api/pharma-guide/drug
POST   /api/pharma-guide/drug
PUT    /api/pharma-guide/drug/:id
DELETE /api/pharma-guide/drug/:id

// Planes de estudio
GET    /api/pharma-guide/study-plans
POST   /api/pharma-guide/study-plans
GET    /api/pharma-guide/study-plans/:id
PUT    /api/pharma-guide/study-plans/:id
DELETE /api/pharma-guide/study-plans/:id

// Gestión de IA
GET    /api/pharma-guide/ia-management
POST   /api/pharma-guide/ia-management
PUT    /api/pharma-guide/ia-management/:id
DELETE /api/pharma-guide/ia-management/:id

// Configuración - Roles
GET    /api/pharma-guide/setting/role
POST   /api/pharma-guide/setting/role
PUT    /api/pharma-guide/setting/role/:id
DELETE /api/pharma-guide/setting/role/:id
```

## 🧪 Scripts Disponibles

### Comandos de Desarrollo
```bash
# Desarrollo con hot reload
npm run dev

# Modo de prueba
npm run test

# Construcción para producción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint
```

### Scripts Personalizados
```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development ts-node-dev --respawn --transpile-only src/index.ts",
    "test": "cross-env NODE_ENV=test ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "cross-env NODE_ENV=production node dist/index.js",
    "prestart": "npm run build",
    "lint": "eslint 'src/**/*.ts' --fix",
    "postinstall": "prisma generate"
  }
}
```

## 🌐 Despliegue

### Variables de Entorno Requeridas
```env
# Base de datos
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT
JWT_SECRET="your-super-secret-key"
JWT_EXPIRATION="86400"

# Servidor
PORT=3000
NODE_ENV=production
HOST="api.pharmaguide.com"
```

### Despliegue en Producción
1. **Preparar la aplicación:**
   ```bash
   npm run build
   ```

2. **Configurar base de datos:**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

3. **Iniciar en producción:**
   ```bash
   npm start
   ```

## 🔧 Configuración Avanzada

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "rootDir": "./src"
  }
}
```

### ESLint Configuration
```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  }
}
```

## 🧪 Testing

### Framework de Testing
```bash
# Ejecutar tests
npm run test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Estructura de Tests
```
tests/
├── unit/          # Tests unitarios
├── integration/   # Tests de integración
├── e2e/          # Tests end-to-end
└── fixtures/     # Datos de prueba
```

## 🤝 Contribución

### Guía de Contribución
1. **Fork el repositorio**
2. **Crea una rama para tu feature:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Realiza tus cambios y commitea:**
   ```bash
   git commit -m 'feat: Add amazing feature'
   ```
4. **Push a la rama:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Abre un Pull Request**

### Estándares de Código
- **TypeScript** con tipos estrictos
- **ESLint** para linting
- **Conventional Commits** para mensajes de commit
- **Documentación** para funciones públicas
- **Tests** para nuevas funcionalidades

### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato de código
refactor: refactorización
test: añadir tests
chore: tareas de mantenimiento
```

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025 2A2G

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👥 Autores

- **2A2G** - *Desarrollo inicial* - [GitHub Profile](https://github.com/2A2G)

## 🙏 Agradecimientos

- **Prisma Team** por el excelente ORM
- **Express.js Community** por el framework robusto
- **TypeScript Team** por el lenguaje tipado
- **Estudiantes de Química Farmacéutica** por el feedback valioso

## 📞 Contacto

Para preguntas, sugerencias o reportar bugs:

- **GitHub Issues**: [Crear Issue](https://github.com/2A2G/pharma-guide-backend/issues)
- **Email**: [aldairgguer@gmail.com](mailto:aldairgguer@gmail.com)
- **GitHub Profile**: [@2A2G](https://github.com/2A2G)

---

<div align="center">
  <p><strong>© 2025 PharmaGuide Backend - Todos los derechos reservados</strong></p>
  <p>Desarrollado por <a href="https://github.com/2A2G">2A2G</a></p>
</div>
