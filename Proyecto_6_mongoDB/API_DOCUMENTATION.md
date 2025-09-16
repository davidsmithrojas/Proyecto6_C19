# 📚 Documentación de la API REST

## Información General

- **Base URL**: `http://localhost:5000/api/v1`
- **Versión**: 2.0.0
- **Formato de Respuesta**: JSON
- **Autenticación**: JWT Bearer Token

## Estructura de Respuestas

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Operación exitosa",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "data": { ... }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "details": { ... }
}
```

## Endpoints Detallados

### 👤 Usuarios

#### POST /users/register
Registrar un nuevo usuario.

**Request Body:**
```json
{
  "username": "usuario123",
  "email": "usuario@example.com",
  "password": "Password123!",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": "user_id",
    "username": "usuario123",
    "email": "usuario@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /users/login
Iniciar sesión.

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "usuario123",
      "email": "usuario@example.com",
      "role": "user"
    }
  }
}
```

#### GET /users/verify-user
Verificar usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario verificado",
  "data": {
    "user": {
      "id": "user_id",
      "username": "usuario123",
      "email": "usuario@example.com",
      "role": "user"
    }
  }
}
```

### 🛍️ Productos

#### GET /products
Listar productos con paginación y filtros.

**Query Parameters:**
- `page` (number): Página (default: 1)
- `limit` (number): Elementos por página (default: 10)
- `category` (string): Filtrar por categoría
- `search` (string): Búsqueda de texto
- `sortBy` (string): Campo de ordenamiento (default: createdAt)
- `sortOrder` (string): Orden (asc/desc, default: desc)

**Response:**
```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": {
    "products": [
      {
        "id": "product_id",
        "name": "Camisa Formal Blanca",
        "description": "Descripción del producto",
        "price": 45000,
        "category": "Camisas",
        "stock": 50,
        "isActive": true,
        "slug": "camisa-formal-blanca",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### POST /products
Crear producto (solo admin).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Nuevo Producto",
  "description": "Descripción del producto",
  "price": 45000,
  "category": "Camisas",
  "stock": 50,
  "tags": ["ropa", "familia"],
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "alt": "Imagen del producto",
      "isPrimary": true
    }
  ]
}
```

### 📅 Eventos

#### GET /events
Listar eventos con filtros.

**Query Parameters:**
- `page` (number): Página
- `limit` (number): Elementos por página
- `search` (string): Búsqueda de texto
- `startDate` (string): Fecha de inicio (ISO)
- `endDate` (string): Fecha de fin (ISO)

**Response:**
```json
{
  "success": true,
  "message": "Eventos obtenidos exitosamente",
  "data": {
    "events": [
      {
        "id": "event_id",
        "title": "Conferencia de Tecnología",
        "description": "Descripción del evento",
        "organizer": "Organizador",
        "location": "Ubicación",
        "startDate": "2024-02-01T10:00:00.000Z",
        "endDate": "2024-02-01T18:00:00.000Z",
        "startTime": "10:00",
        "endTime": "18:00",
        "price": 0,
        "capacity": 100,
        "tags": ["tecnología", "conferencia"],
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### POST /events
Crear evento (admin/superuser).

**Request Body:**
```json
{
  "title": "Nuevo Evento",
  "description": "Descripción del evento",
  "organizer": "Organizador",
  "location": "Ubicación del evento",
  "startDate": "2024-02-01T10:00:00.000Z",
  "endDate": "2024-02-01T18:00:00.000Z",
  "startTime": "10:00",
  "endTime": "18:00",
  "requiresRegistration": true,
  "price": 25.00,
  "capacity": 50,
  "tags": ["evento", "tecnología"]
}
```

### 🛒 Carrito

#### GET /cart
Obtener carrito del usuario.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Carrito obtenido exitosamente",
  "data": {
    "cart": {
      "id": "cart_id",
      "user": "user_id",
      "products": [
        {
          "product": {
            "id": "product_id",
            "name": "Producto",
            "price": 29.99,
            "slug": "producto"
          },
          "quantity": 2,
          "price": 29.99,
          "addedAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "total": 59.98,
      "totalItems": 2,
      "isEmpty": false
    }
  }
}
```

#### POST /cart/add
Agregar producto al carrito.

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 2
}
```

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Error de validación |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: email duplicado) |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error del servidor |

## Validaciones

### Usuario
- **username**: 3-50 caracteres, solo letras, números y guiones bajos
- **email**: Formato de email válido, único
- **password**: Mínimo 8 caracteres, debe incluir mayúscula, minúscula, número y carácter especial

### Producto
- **name**: 1-100 caracteres, único
- **description**: 1-500 caracteres
- **price**: Número positivo con máximo 2 decimales
- **category**: Debe ser una de: "Camisas", "Reserva", "Cuentos", "otro"
- **stock**: Número entero no negativo

### Evento
- **title**: 1-100 caracteres
- **description**: 1-1000 caracteres
- **startDate**: Fecha futura en formato ISO
- **endDate**: Debe ser posterior a startDate
- **startTime/endTime**: Formato HH:mm
- **price**: Número no negativo
- **capacity**: Número entero positivo o null

## Rate Limiting

- **General**: 100 requests por 15 minutos por IP
- **Autenticación**: 5 intentos de login por 15 minutos por IP
- **Escritura**: 20 operaciones de escritura por 15 minutos por IP
- **Admin**: 50 operaciones de admin por 15 minutos por IP

## Manejo de Errores

Todos los errores siguen el formato estándar:

```json
{
  "success": false,
  "message": "Descripción del error",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "details": {
    "field": "Campo específico",
    "code": "ERROR_CODE"
  }
}
```

## Ejemplos de Uso con cURL

### Registrar Usuario
```bash
curl -X POST http://localhost:5000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### Iniciar Sesión
```bash
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### Obtener Productos
```bash
curl -X GET "http://localhost:5000/api/v1/products?page=1&limit=10&category=Juego%20de%20mesa"
```

### Agregar al Carrito
```bash
curl -X POST http://localhost:5000/api/v1/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productId": "product_id_here",
    "quantity": 2
  }'
```

## Notas Importantes

1. **Autenticación**: Todas las rutas protegidas requieren el header `Authorization: Bearer <token>`
2. **Paginación**: Los endpoints de listado soportan paginación con `page` y `limit`
3. **Filtros**: Muchos endpoints soportan filtros de búsqueda y categorización
4. **Validación**: Todos los inputs son validados antes del procesamiento
5. **Rate Limiting**: Respeta los límites de rate limiting para evitar bloqueos
6. **Timestamps**: Todas las fechas están en formato ISO 8601 UTC
