<div align="center">

#  PharmaGuide Backend

[![Version](https://img.shields.io/badge/version-1.6.0-blue?style=flat-square)](./documentation/versions/v1.6.0.md)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black)](https://swagger.io)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)

###  Plataforma Educativa Inteligente para Química Farmacéutica

</div>

**PharmaGuide Backend v1.5.0** es una API REST avanzada con **inteligencia artificial integrada** y **sistema de cache optimizado**, diseñada para estudiantes de Química Farmacéutica. Proporciona información automatizada sobre medicamentos mediante IA y herramientas inteligentes de aprendizaje.

>  **Nuevas funcionalidades v1.5.0**: Sistema de IA con Gemini AI, Cache Redis optimizado, Contraindicaciones y Clase Terapéutica automatizadas  
>  **[Ver todas las novedades →](./documentation/versions/v1.5.0.md)**

##  Documentación Completa

> **📖 [Centro de Documentación](./documentation/README.md)** - Documentación completa organizada por categorías

###  Enlaces Rápidos
- **[ Arquitectura del Sistema](./documentation/architecture/system-architecture.md)** - Diseño modular y patrones
- **[ Sistema de IA](./documentation/features/artificial-intelligence.md)** - Gemini AI, contraindicaciones y clase terapéutica
- **[ Cache Redis](./documentation/features/redis-cache.md)** - Sistema de cache optimizado
- **[ Versión 1.5.0](./documentation/versions/v1.5.0.md)** - Nuevas funcionalidades y mejoras
- **[ API Reference](./documentation/api/)** - Endpoints y ejemplos de uso

##  Índice Rápido

- [ Características Principales](#-características-principales)
- [ Stack Tecnológico](#️-stack-tecnológico)
- [ Inicio Rápido](#-inicio-rápido)
- [ Configuración](#-configuración)
- [ API y Swagger](#-api-y-swagger)
- [🧪 Scripts Disponibles](#-scripts-disponibles)
- [🤝 Contribución](#-contribución)

##  Características Principales

###  **Inteligencia Artificial Avanzada**  *Nuevo en v1.5.0*
- **🤖 Gemini AI Integration**: Información médica automatizada y confiable
- ** Contraindicaciones**: Obtención automática de contraindicaciones de medicamentos
- ** Clase Terapéutica**: Clasificación automática de medicamentos por uso terapéutico
- ** Arquitectura Modular**: Sistema escalable preparado para nuevas funcionalidades
- **[📖 Ver documentación completa →](./documentation/features/artificial-intelligence.md)**

###  **Sistema de Cache Redis**  *Nuevo en v1.5.0*
- ** Cache Específico**: Consultas optimizadas por funcionalidad
- ** 70% más rápido**: Rendimiento mejorado significativamente
- **💾 Uso eficiente**: Reduce uso de memoria en 60%
- ** Graceful degradation**: Funciona sin Redis disponible
- **[📖 Ver documentación completa →](./documentation/features/redis-cache.md)**

###  **API REST Robusta**
- ** Arquitectura escalable** con Express.js y TypeScript
- ** Validación completa** con middleware personalizado
- ** Documentación automática** con Swagger/OpenAPI 3.0
- ** Seguridad avanzada** con JWT y rate limiting

### 🎓 **Plataforma Educativa**
- ** Planes de estudio adaptativos** por usuario
- ** Gestión completa de medicamentos** con información detallada
- **👥 Sistema de usuarios y roles** con permisos granulares
- ** Seguimiento de progreso** académico personalizado

##  Stack Tecnológico

###  **Core Technologies**
- **Node.js** `>= 18.x` - Runtime de JavaScript
- **Express.js** `^5.1.0` - Framework web rápido y minimalista  
- **TypeScript** `^5.8.3` - Tipado estático y desarrollo moderno
- **Prisma ORM** `^6.8.2` - ORM moderno para TypeScript y Node.js
- **PostgreSQL** `>= 14` - Base de datos relacional robusta

###  **Inteligencia Artificial**
- **Google Gemini AI** `^0.21.0` - Procesamiento de información médica
- **Gemini 2.0 Flash** - Modelo optimizado para contenido farmacéutico

###  **Performance & Cache**
- **Redis** - Cache distribuido y optimización de consultas
- **ioredis** - Cliente Redis avanzado para Node.js

###  **Seguridad & Autenticación**
- **JWT** `^9.0.2` - Autenticación basada en tokens
- **bcrypt** `^5.1.1` - Hash seguro de contraseñas
- **Rate Limiting** - Protección contra abuso de API

>  **[Ver stack completo y configuración →](./documentation/setup/development-setup.md)**
```

##  Inicio Rápido

###  Instalación en 3 Pasos

```bash
# 1. Clonar e instalar
git clone https://github.com/aldairg-dev/pharma-guide-backend.git
cd pharma-guide-backend && npm install

# 2. Configurar base de datos  
cp .env.example .env  # Editar con tus credenciales
npx prisma migrate dev

# 3. Iniciar servidor
npm run dev
```

** ¡Listo! API ejecutándose en http://localhost:8080**

###  Prerrequisitos
- **Node.js** >= 18.x  
- **PostgreSQL** >= 14 (o usar Docker)
- **Redis** (opcional, para cache - se puede omitir inicialmente)

##  Configuración

### 🔑 Variables de Entorno Esenciales
```env
# Base de Datos
DATABASE_URL="postgresql://user:pass@localhost:5432/pharmaguide"

# JWT
JWT_SECRET="tu_jwt_secret_super_seguro"
JWT_EXPIRATION="86400"

# IA (Opcional - para funcionalidades de IA)
GEMINI_API_KEY="tu_api_key_de_gemini"

# Redis (Opcional - para cache optimizado)
REDIS_HOST="localhost"
REDIS_PORT="6379"
   
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

##  API y Swagger

### 🔗 Documentación Interactiva
- **Desarrollo**: http://localhost:8080/api-docs
- **Swagger JSON**: http://localhost:8080/swagger.json

###  Nuevos Endpoints de IA v1.5.0
```typescript
//  Inteligencia Artificial
GET /api/drugs/:id/contraindications     // Contraindicaciones con IA
GET /api/drugs/:id/therapeutic-class     // Clase terapéutica con IA

//  Endpoints Tradicionales  
POST /api/access/pharma-guide/register   // Registro
POST /api/access/pharma-guide/login      // Login
GET  /api/pharma-guide/users             // Usuarios (Auth)
GET  /api/pharma-guide/drug              // Medicamentos
GET  /api/pharma-guide/study-plans       // Planes de estudio
```

> 📖 **Referencia completa de API**: [Ver documentación de endpoints →](./documentation/api/)

## 🧪 Scripts Disponibles

```bash
#  Desarrollo
npm run dev          # Servidor con hot reload
npm run build        # Compilar TypeScript
npm start           # Producción

# 🗄️ Base de Datos  
npx prisma generate  # Generar cliente
npx prisma studio   # Interfaz visual
npx prisma migrate dev # Aplicar migraciones

#  Utilidades
npm run lint        # Linter ESLint
npm run test        # Ejecutar tests
```

## 🤝 Contribución

###  Guía Rápida
1. Fork el repositorio
2. Crea tu rama: `git checkout -b feature/nueva-funcionalidad`
3. Commitea: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

###  Estándares
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, etc.
- **TypeScript** con tipos estrictos
- **Tests** para nuevas funcionalidades
- **Documentación** actualizada

>  **Guía completa**: [Ver guía de contribución →](./documentation/setup/contributing.md)

---

##  Versión Actual

###  **v1.5.0** - Sistema de IA y Redis Cache
-  **Inteligencia Artificial** con Gemini AI  
-  **Cache Redis** optimizado por funcionalidades
-  **Contraindicaciones** y **Clase Terapéutica** automatizadas
-  **Arquitectura modular** escalable

>  **Ver changelog completo**: [Historial de versiones →](./documentation/versions/CHANGELOG.md)

---

## 📞 Soporte

- 🐛 **Issues**: [GitHub Issues](https://github.com/aldairg-dev/pharma-guide-backend/issues)
- 📧 **Email**: aldairgguer@gmail.com  
- 👨‍ **Desarrollador**: [@aldairg-dev](https://github.com/aldairg-dev)

---

<div align="center">

** PharmaGuide Backend v1.5.0**  
*Plataforma educativa inteligente para Química Farmacéutica*

[![Documentación](https://img.shields.io/badge/_Documentación-Completa-blue?style=for-the-badge)](./documentation/)
[![API Reference](https://img.shields.io/badge/🔗_API-Swagger-green?style=for-the-badge)](http://localhost:8080/api-docs)

</div>
