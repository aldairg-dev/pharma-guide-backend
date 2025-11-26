# Diagrama de Endpoints - PharmaGuide Backend v1.7.0

## Arquitectura General

```
PharmaGuide Backend API
├── Acceso Público (/api/access/pharma-guide)
└── Rutas Protegidas (/api/pharma-guide) [JWT + Rate Limiting]
    ├── Gestión de Usuarios (/me)
    ├── Medicamentos (/drugs)
    ├── Planes de Estudio (/study-plans)
    ├── IA Farmacológica (/me/drugs/:id/*)
    └── Configuración (/setting)
```

---

## 1. Endpoints de Acceso Público

### Base URL: `/api/access/pharma-guide`

```
POST /api/access/pharma-guide/register
POST /api/access/pharma-guide/login
```

#### Detalles:
- **Autenticación**: No requerida
- **Rate Limiting**: No aplicado
- **Descripción**: Registro y autenticación de usuarios

---

## 2. Endpoints de Usuario (JWT Protegidos)

### Base URL: `/api/pharma-guide`

### 2.1 Gestión de Cuenta Personal

```
┌─── Información Personal ───┐
│ GET    /me                 │ ← Obtener mi información
│ PUT    /me                 │ ← Actualizar mi información  
│ DELETE /me                 │ ← Eliminar mi cuenta
└────────────────────────────┘
```

### 2.2 Gestión de Medicamentos Personales

```
┌─── CRUD Medicamentos ───────┐
│ GET    /me/drugs            │ ← Mis medicamentos
│ POST   /me/drugs            │ ← Crear medicamento
│ GET    /me/drugs/:id        │ ← Medicamento específico
│ PUT    /me/drugs/:id        │ ← Actualizar medicamento
│ DELETE /me/drugs/:id        │ ← Eliminar medicamento
└─────────────────────────────┘
```

### 2.3 IA Farmacológica - Sistema de Identificación del Fármaco (v1.7.0)

```
┌─── Identificación del Fármaco (v1.7) ───────┐
│ GET /me/drugs/:id/therapeutic-class         │ ← Clase Terapéutica
│ GET /me/drugs/:id/indications              │ ← Indicaciones (NUEVO v1.7)
│ GET /me/drugs/:id/mechanism-of-actions     │ ← Mecanismo de Acción (NUEVO v1.7)
│ GET /me/drugs/:id/contraindications        │ ← Contraindicaciones
│ GET /me/drugs/:id/dosages                  │ ← Dosificación
└─────────────────────────────────────────────┘
```

### 2.4 Gestión de Planes de Estudio Personales

```
┌─── CRUD Planes de Estudio ──┐
│ GET    /me/study-plans       │ ← Mis planes
│ POST   /me/study-plans       │ ← Crear plan
│ GET    /me/study-plans/:id   │ ← Plan específico
│ PUT    /me/study-plans/:id   │ ← Actualizar plan
│ DELETE /me/study-plans/:id   │ ← Eliminar plan
└──────────────────────────────┘
```

---

## 3. Endpoints Administrativos (JWT Protegidos)

### 3.1 Gestión de Usuarios (Admin)

```
┌─── Administración Usuarios ──┐
│ GET    /users                │ ← Listar usuarios
│ GET    /users/:id            │ ← Usuario específico
│ PUT    /users/:id            │ ← Actualizar usuario
│ DELETE /users/:id            │ ← Eliminar usuario
└───────────────────────────────┘
```

### 3.2 Gestión de Medicamentos (Admin)

```
┌─── Administración Medicamentos ──┐
│ GET /drugs                       │ ← Todos los medicamentos
│ GET /users/:id/drugs             │ ← Medicamentos por usuario
└──────────────────────────────────┘
```

### 3.3 Gestión de Planes de Estudio (Admin)

```
┌─── Administración Planes ────────┐
│ GET /study-plans                 │ ← Todos los planes
│ GET /study-plans/:id             │ ← Plan específico
│ GET /user/:id/study-plan         │ ← Planes por usuario
└──────────────────────────────────┘
```

---

## 4. Configuración del Sistema

### Base URL: `/api/pharma-guide/setting`

```
┌─── CRUD Roles ─────────┐
│ GET    /roles          │ ← Listar roles
│ POST   /roles          │ ← Crear rol
│ PUT    /roles/:id      │ ← Actualizar rol
│ DELETE /roles/:id      │ ← Eliminar rol
└────────────────────────┘
```

---

## 5. Middleware y Seguridad

### Aplicado a todas las rutas `/api/pharma-guide/*`:

```
┌─── Middleware Stack ────────┐
│ 1. Rate Limiting            │ ← Límite de requests
│ 2. JWT Verification         │ ← Validación de token
│ 3. User Context Injection   │ ← Inyección de usuario
│ 4. Route Handler            │ ← Controlador específico
└─────────────────────────────┘
```

---

## 6. Roadmap de Endpoints Futuros

### 6.1 v1.8 - Información Farmacológica

```
┌─── Información Farmacológica (v1.8) ────────┐
│ GET /me/drugs/:id/pharmacokinetics          │ ← Farmacocinética
│ GET /me/drugs/:id/pharmacodynamics          │ ← Farmacodinamia
│ GET /me/drugs/:id/interactions              │ ← Interacciones
│ GET /me/drugs/:id/warnings                  │ ← Advertencias y precauciones
│ GET /me/drugs/:id/adverse-effects           │ ← Efectos adversos
└─────────────────────────────────────────────┘
```

### 6.2 v1.9 - Seguridad Clínica

```
┌─── Seguridad Clínica (v1.9) ────────────────┐
│ GET /me/drugs/:id/advanced-contraindications │ ← Contraindicaciones avanzadas
└─────────────────────────────────────────────┘
```

---

## 7. Estructura de Respuestas IA

### Formato Estándar:

```json
{
  "moduleData": {
    "content": "Información narrativa formateada...",
    "structured": {
      "campo1": "valor1",
      "campo2": ["array", "de", "valores"],
      "campo3": {
        "subcampo": "valor anidado"
      }
    }
  }
}
```

### Ejemplos por Funcionalidad:

#### Indicaciones (v1.7.0):
```json
{
  "indications": {
    "content": "INDICACIONES PRINCIPALES:\n\n1. Hipertensión arterial...",
    "structured": {
      "indicaciones_principales": ["Hipertensión arterial"],
      "indicaciones_Secundaria": ["Insuficiencia cardíaca"],
      "otras_indicaciones": ["Protección renal"]
    }
  }
}
```

#### Mecanismo de Acción (v1.7.0):
```json
{
  "mechanismOfActions": {
    "content": "CLASIFICACIÓN FARMACOLÓGICA:\nIECA...",
    "structured": {
      "clasificacion_farmacologica": "IECA",
      "diana_molecular_primaria": "ECA",
      "modo_de_accion": "Inhibición competitiva...",
      "impacto_bioquimico": "Reducción angiotensina II...",
      "efectos_terapeuticos_finales": "Reducción presión arterial..."
    }
  }
}
```

---

## 8. Códigos de Estado HTTP

### Respuestas Exitosas:
- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado exitosamente

### Errores de Cliente:
- `400 Bad Request` - Datos de entrada inválidos
- `401 Unauthorized` - Token JWT inválido o ausente
- `403 Forbidden` - Permisos insuficientes
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto con estado actual
- `422 Unprocessable Entity` - Validación de datos fallida
- `429 Too Many Requests` - Rate limit excedido

### Errores del Servidor:
- `500 Internal Server Error` - Error interno del servidor
- `502 Bad Gateway` - Error en servicios externos (IA, Redis)
- `503 Service Unavailable` - Servicio temporalmente no disponible

---

## 9. Autenticación y Autorización

### JWT Token Structure:
```json
{
  "userId": 123,
  "email": "user@example.com",
  "role": "user",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Headers Requeridos:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 10. Rate Limiting

### Configuración Actual:
- **Límite**: Configurado por middleware
- **Ventana**: Por IP y usuario
- **Aplicado a**: Todas las rutas `/api/pharma-guide/*`
- **Excluido de**: Rutas de acceso público

---

## 11. Cache y Performance

### Redis Cache (v1.7.0):
- **TTL**: 7 días para datos de IA
- **Claves**: Organizadas por `userId:drugId:functionality`
- **Degradación**: Funcional sin Redis disponible

### Funcionalidades con Cache:
- Contraindicaciones
- Clase Terapéutica  
- Dosificación
- Indicaciones (v1.7.0)
- Mecanismo de Acción (v1.7.0)

---


**PharmaGuide Backend v1.7.0 - Arquitectura de Endpoints Completa**

_Sistema de Identificación del Fármaco implementado con IA avanzada, seguridad JWT y cache Redis optimizado_
