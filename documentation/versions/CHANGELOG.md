# 📋 Changelog - PharmaGuide Backend

Todas las mejoras, correcciones y cambios importantes del proyecto están documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.5.0] - 2024-11-18

### 🆕 Agregado
- **Sistema de Inteligencia Artificial completo**
  - Integración con Gemini AI para procesamiento de medicamentos
  - Arquitectura modular basada en DrugModel para reutilización de código
  - Utilidades centralizadas (GeminiAIUtils) para comunicación con IA
  - Funcionalidad de contraindicaciones automatizadas
  - Funcionalidad de clasificación terapéutica automatizada

- **Sistema de Cache Redis optimizado**
  - Métodos específicos por funcionalidad (getDrugContraindications, getDrugTherapeuticClass)
  - Cache selectivo que evita descargar registros completos
  - TTL inteligente de 1 hora para datos de IA
  - Graceful degradation cuando Redis no está disponible

- **Nuevos endpoints de API**
  - `GET /api/drugs/:id/contraindications` - Obtener contraindicaciones
  - `GET /api/drugs/:id/therapeutic-class` - Obtener clase terapéutica

- **Arquitectura desacoplada**
  - Clase base DrugModel para herencia y reutilización
  - Modelos específicos: ContraindicationsModel, TherapeuticClassModel
  - Interfaces TypeScript para tipado fuerte
  - Patrón Template Method para consistencia

### 🔧 Cambiado
- Refactorización completa del servicio de IA para eliminar duplicación
- Optimización de controladores para usar cache específico
- Mejora en el manejo de errores de IA con respuestas más descriptivas
- Actualización de la documentación con estructura modular

### ⚡ Mejorado
- Rendimiento de consultas de cache mejorado en ~70%
- Reducción de uso de memoria Redis en ~60%
- Tiempo de respuesta de endpoints de IA reducido significativamente
- Escalabilidad del sistema para agregar nuevas funcionalidades de IA

### 🛠️ Técnico
- Nuevas dependencias: `@google/generative-ai`, `redis`
- Nuevas variables de entorno: `GEMINI_API_KEY`, `REDIS_*`
- Tests unitarios para nuevos módulos
- Documentación técnica en `/documentation`

---

## [1.4.0] - 2024-10-15

### 🆕 Agregado
- Sistema de gestión de planes de estudio
- CRUD completo para medicamentos
- Middleware de rate limiting
- Validación avanzada de datos de entrada

### 🔧 Cambiado
- Actualización de Prisma ORM a v6.8.2
- Mejora en el sistema de roles y permisos
- Optimización de consultas a base de datos

### 🐛 Corregido
- Problema con tokens JWT en ambientes de producción
- Validación de email duplicada en registro
- Manejo de errores en endpoints de usuario

---

## [1.3.0] - 2024-09-20

### 🆕 Agregado
- Sistema de autenticación completo con JWT
- Middleware de autorización por roles
- Encriptación de contraseñas con bcrypt
- Documentación automática con Swagger

### 🔧 Cambiado
- Migración a TypeScript completa
- Restructuración modular del proyecto
- Actualización de todas las dependencias

### ⚡ Mejorado
- Validación de tipos en tiempo de compilación
- Manejo centralizado de errores
- Configuración de CORS para múltiples entornos

---

## [1.2.0] - 2024-08-10

### 🆕 Agregado
- Integración con PostgreSQL usando Prisma ORM
- Migraciones automáticas de base de datos
- Seed data para desarrollo
- Sistema de logging estructurado

### 🔧 Cambiado
- Migración desde SQLite a PostgreSQL
- Actualización de esquema de base de datos
- Mejora en la configuración de desarrollo

---

## [1.1.0] - 2024-07-05

### 🆕 Agregado
- API REST básica con Express.js
- Estructura modular inicial
- Configuración de entornos de desarrollo
- Scripts de construcción y despliegue

### 🔧 Cambiado
- Configuración inicial del proyecto
- Setup de TypeScript y ESLint
- Configuración de hot reload para desarrollo

---

## [1.0.0] - 2024-06-23

### 🆕 Agregado
- Configuración inicial del proyecto
- Estructura básica de carpetas
- Configuración de dependencias principales
- Documentación inicial

---

## 🏷️ Tipos de Cambios

- `🆕 Agregado` para nuevas funcionalidades
- `🔧 Cambiado` para cambios en funcionalidades existentes
- `🗑️ Eliminado` para funcionalidades removidas
- `🐛 Corregido` para corrección de bugs
- `🛡️ Seguridad` para vulnerabilidades corregidas
- `⚡ Mejorado` para mejoras de rendimiento
- `🛠️ Técnico` para cambios técnicos internos
- `📚 Documentación` para cambios solo de documentación

---

## 📋 Notas de Versioning

Este proyecto usa [Semantic Versioning](https://semver.org/):
- **MAJOR.MINOR.PATCH** (ejemplo: 1.5.0)
- **MAJOR**: Cambios incompatibles en la API
- **MINOR**: Nuevas funcionalidades compatibles hacia atrás
- **PATCH**: Correcciones de bugs compatibles hacia atrás

### Etiquetas de Pre-release
- **alpha**: Versión muy temprana, inestable
- **beta**: Versión de prueba, relativamente estable  
- **rc** (release candidate): Versión candidata para release

Ejemplo: `1.5.0-beta.1`, `1.5.0-rc.2`