# Backend - Formulario de Registro de Usuario

Backend Node.js con Express y SQLite para el formulario de validación.

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de instalación

1. **Instalar dependencias:**
```bash
cd backend
npm install
```

2. **Inicializar la base de datos:**
```bash
npm run init-db
```

3. **Iniciar el servidor:**
```bash
# Para desarrollo
npm run dev

# Para producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📁 Estructura del Backend

```
backend/
├── package.json          # Dependencias y scripts
├── server.js            # Servidor Express principal
├── database/
│   ├── init.js          # Script de inicialización de DB
│   └── users.db         # Base de datos SQLite (se crea automáticamente)
├── .env.example         # Variables de entorno ejemplo
└── README.md            # Esta documentación
```

## 🔧 Endpoints de la API

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Obtener todos los usuarios (paginado) |
| GET | `/api/users/:id` | Obtener usuario por ID |
| POST | `/api/users` | Crear nuevo usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

### Estadísticas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/stats` | Estadísticas de la base de datos |
| GET | `/api/health` | Health check del servidor |

## 📊 Ejemplos de Uso

### Crear usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Juan Pérez",
    "email": "juan@example.com",
    "password": "MiClave123@",
    "birthDate": "1990-01-01",
    "cellphone": "3123456789",
    "documentType": "CC",
    "documentNumber": "123456789",
    "gender": "M",
    "city": "Bogotá",
    "address": "Calle 123 #45-67",
    "username": "juanperez",
    "securityQuestion": "pet",
    "securityAnswer": "firulais",
    "contactPrefs": ["email", "whatsapp"],
    "termsAccepted": true
  }'
```

### Obtener usuarios (paginado)
```bash
curl "http://localhost:3000/api/users?page=1&limit=10"
```

### Obtener usuario por ID
```bash
curl http://localhost:3000/api/users/1
```

### Obtener estadísticas
```bash
curl http://localhost:3000/api/stats
```

## 🛡️ Características de Seguridad

- **Encriptación de contraseñas** con bcrypt
- **Validación de datos** con Joi
- **Rate limiting** para prevenir ataques
- **CORS configurado**
- **Helmet** para seguridad HTTP
- **Logs de auditoría** para todas las operaciones

## 📋 Esquema de la Base de Datos

### Tabla `users`
- `id` - Primary key (auto-increment)
- `fullName` - Nombre completo (TEXT, NOT NULL)
- `email` - Email único (TEXT, UNIQUE, NOT NULL)
- `password` - Contraseña encriptada (TEXT, NOT NULL)
- `birthDate` - Fecha de nacimiento (TEXT, NOT NULL)
- `cellphone` - Celular único (TEXT, UNIQUE, NOT NULL)
- `phone` - Teléfono opcional (TEXT)
- `documentType` - Tipo de documento (TEXT, NOT NULL)
- `documentNumber` - Número de documento único (TEXT, UNIQUE, NOT NULL)
- `gender` - Género (TEXT, NOT NULL)
- `city` - Ciudad (TEXT, NOT NULL)
- `otherCity` - Otra ciudad (TEXT)
- `address` - Dirección (TEXT, NOT NULL)
- `postalCode` - Código postal (TEXT)
- `username` - Username único (TEXT, UNIQUE, NOT NULL)
- `securityQuestion` - Pregunta de seguridad (TEXT, NOT NULL)
- `securityAnswer` - Respuesta de seguridad (TEXT, NOT NULL)
- `biography` - Biografía (TEXT)
- `contactPrefs` - Preferencias de contacto (TEXT, JSON)
- `termsAccepted` - Términos aceptados (INTEGER)
- `createdAt` - Fecha de creación (DATETIME)
- `updatedAt` - Fecha de actualización (DATETIME)

### Tabla `audit_logs`
- `id` - Primary key (auto-increment)
- `userId` - ID del usuario (FOREIGN KEY)
- `action` - Acción realizada (TEXT)
- `details` - Detalles en JSON (TEXT)
- `ipAddress` - Dirección IP (TEXT)
- `userAgent` - User agent (TEXT)
- `timestamp` - Timestamp (DATETIME)

## 🔍 Validaciones

### Validaciones del backend
- **Email**: Formato válido y único
- **Contraseña**: Mínimo 8 caracteres, 1 mayúscula, 1 número, 1 carácter especial
- **Celular**: Formato colombiano (3xxxxxxxx)
- **Documento**: 6-12 dígitos y único
- **Username**: 5-15 caracteres, alfanumérico con . y _ y único
- **Campos requeridos**: Todos los campos obligatorios deben estar presentes

### Códigos de error
- `200` - OK
- `201` - Creado
- `400` - Bad Request (datos inválidos)
- `404` - Not Found (usuario no encontrado)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

## 🚀 Despliegue

### Para producción
1. Configurar variables de entorno en `.env`
2. Usar `npm start` en lugar de `npm run dev`
3. Configurar un process manager como PM2
4. Configurar un reverse proxy (nginx/apache)

### Variables de entorno
Copiar `.env.example` a `.env` y configurar:
```bash
cp .env.example .env
```

## 📝 Logs

El servidor registra:
- Solicitudes HTTP con timestamp
- Errores de base de datos
- Operaciones de auditoría
- Errores de validación

## 🔧 Desarrollo

### Scripts disponibles
- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor con nodemon
- `npm run init-db` - Inicializar base de datos

### Extensiones recomendadas para VS Code
- SQLite Viewer
- REST Client
- Thunder Client

## 🐛 Troubleshooting

### Problemas comunes
1. **Error: EADDRINUSE** - El puerto 3000 está en uso
   - Cambiar el puerto en `.env` o cerrar el proceso

2. **Error: Cannot find module** - Dependencias no instaladas
   - Ejecutar `npm install`

3. **Error: SQLITE_CANTOPEN** - Problemas con la base de datos
   - Ejecutar `npm run init-db`

4. **CORS errors** - Problemas de origen cruzado
   - Verificar configuración de CORS en el frontend

## 📞 Soporte

Para problemas o preguntas:
1. Revisar los logs del servidor
2. Verificar la documentación de la API
3. Revisar los ejemplos de uso
4. Contactar al desarrollador
