# 🚀 Validación de Formulario de Registro con Base de Datos

Proyecto web completo que combina un formulario de registro 100% Vanilla JavaScript con un backend Node.js y base de datos SQLite. Incluye validaciones en tiempo real, persistencia de datos y una experiencia de usuario moderna.

## 📋 Descripción

Este proyecto implementa un formulario completo de registro de usuario con validaciones en tiempo real, mensajes de error dinámicos, conexión con base de datos y modo offline. Funciona tanto con servidor como sin él, guardando los datos localmente cuando el backend no está disponible.

## 🏗️ Arquitectura del Proyecto

```
validacion_formulario/
├── index.html              # Formulario completo con estructura HTML5
├── app.js                 # Lógica del frontend + conexión con la API
├── assets/
│   └── styles.css         # Estilos CSS responsive y modernos
├── backend/               # Servidor Node.js + API REST
│   ├── server.js          # Servidor Express con SQLite
│   ├── package.json       # Dependencias del backend
│   ├── database/
│   │   └── init.js       # Script de inicialización de BD
│   └── README.md         # Documentación del backend
└── README.md             # Esta documentación
```

## 🚀 Cómo Ejecutar

### 📋 Requisitos Previos

1. **Node.js** (versión 14 o superior)
   - Descargar desde: https://nodejs.org/
   - Verificar instalación: `node --version`

2. **Navegador web moderno**
   - Chrome, Firefox, Safari, Edge

### 🏃‍♂️ Pasos para Ejecutar

#### 1. Configurar el Backend

```bash
# Entrar a la carpeta del backend
cd backend

# Instalar dependencias
npm install

# Inicializar la base de datos
npm run init-db

# Iniciar el servidor
npm run dev
```

El servidor backend estará corriendo en: `http://localhost:3000`

#### 2. Abrir el Frontend

**Opción A - Desde el explorador de archivos:**
- Navega a la carpeta `validacion_formulario`
- Haz doble clic en `index.html`

**Opción B - Desde VS Code:**
- Abre la carpeta `validacion_formulario` en VS Code
- Haz clic derecho en `index.html`
- Selecciona "Open with Live Server" (si tienes la extensión)

#### 3. Verificar Funcionamiento

1. **Backend:** Abre `http://localhost:3000/api/health` en tu navegador
   - Deberías ver: `{"status":"OK","timestamp":"...","uptime":...}`

2. **Frontend:** Abre `index.html`
   - Deberías ver el formulario completo
   - En la consola del navegador deberías ver: `✅ Servidor backend disponible`

## ✅ Campos y Validaciones Implementadas

### Campos Base del Taller
- **Nombre completo**: Requerido, mínimo 3 caracteres
- **Correo electrónico**: Requerido, formato válido con regex
- **Contraseña**: Requerido, mínimo 8, 1 mayúscula, 1 número, 1 carácter especial
- **Confirmar contraseña**: Debe coincidir con la contraseña
- **Fecha de nacimiento**: Requerido, mayor de 18 años
- **Celular (Colombia)**: Requerido, formato colombiano (3xxxxxxxx)
- **Teléfono**: Opcional, mínimo 10 dígitos si se ingresa
- **Términos y condiciones**: Requerido

### Campos Adicionales (10+ implementados)
- **Tipo de documento**: Select (CC, TI, CE, Pasaporte) - Requerido
- **Número de documento**: Solo dígitos, 6-12 caracteres - Requerido
- **Género**: Radio buttons (M, F, O) - Requerido
- **Ciudad**: Select con opción "Otra" que muestra campo condicional - Requerido
- **Dirección**: Texto, mínimo 8 caracteres - Requerido
- **Usuario**: Username, 5-15 caracteres, alfanumérico con . y _ - Requerido
- **Pregunta de seguridad**: Select + respuesta, mínimo 3 caracteres - Requerido
- **Biografía**: Textarea opcional, mínimo 20 caracteres si se llena
- **Preferencias de contacto**: Checkboxes, al menos 1 requerido
- **Código postal**: Opcional, 6 dígitos si se ingresa

## 🔧 Validaciones con Regex

El proyecto incluye un objeto `patterns` con las siguientes expresiones regulares:

```javascript
const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    cellphoneColombia: /^3[0-9]{9}$/,
    phone: /^\d{10,}$/,
    document: /^\d{6,12}$/,
    username: /^[a-zA-Z0-9._]{5,15}$/,
    postalCode: /^\d{6}$/
};
```

## 🎨 Características de UX/UI

- **Validación en tiempo real**: Se ejecuta en `input`, `change` y `blur`
- **Estados visuales**: Campos marcados con `.is-valid` (verde) y `.is-invalid` (rojo)
- **Mensajes de error**: Dinámicos y específicos debajo de cada campo
- **Botón de envío**: Se habilita/deshabilita automáticamente
- **Modal de confirmación**: Muestra resumen de datos sin recargar página
- **Responsive**: Adaptable a dispositivos móviles
- **Animaciones**: Efectos suaves y transiciones
- **Indicador de estado**: Muestra si el servidor está disponible

## 🏗️ Arquitectura JavaScript

### Funciones Reutilizables
- `setValid(field)`: Marca campo como válido
- `setInvalid(field, message)`: Marca campo como inválido con mensaje
- `validateField(field)`: Valida un campo específico
- `validateForm()`: Valida todo el formulario
- `updateSubmitState()`: Actualiza estado del botón

### Sistema de Validadores
Cada campo tiene su propia función de validación en el objeto `validators`, manteniendo el código DRY y modular.

### Manejo de Estado
El objeto `formState` mantiene el estado de validación de todos los campos para optimizar el rendimiento.

### Funciones de API
- `apiRequest(endpoint, options)`: Realiza peticiones HTTP al backend
- `saveUserToDatabase(userData)`: Guarda usuarios en la base de datos
- `checkServerHealth()`: Verifica disponibilidad del servidor

## 📊 Flujo de Datos

1. **Usuario llena el formulario** → Validación en tiempo real
2. **Usuario hace clic en "Enviar"** → Datos se validan
3. **Petición al backend** → Datos se guardan en SQLite
4. **Respuesta del backend** → Confirmación al usuario
5. **Respaldo en localStorage** → Por si el servidor falla

## 🗄️ Base de Datos

### Esquema SQLite
- **Tabla `users`**: Almacena todos los datos del formulario
- **Tabla `audit_logs`**: Registra todas las operaciones para auditoría
- **Índices**: Optimizados para email, username, documento y celular

### Características de Seguridad
- **Encriptación de contraseñas** con bcrypt
- **Validación de datos** con Joi en el backend
- **Rate limiting** para prevenir ataques
- **CORS configurado** para comunicación segura
- **Helmet** para seguridad HTTP
- **Logs de auditoría** para todas las operaciones

## 🛠️ Comandos Útiles

### Backend
```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo (con nodemon)
npm run init-db    # Reinicializar la base de datos
```

### Verificar Base de Datos
La base de datos SQLite se guarda en: `backend/database/users.db`

Puedes verla con:
- **VS Code**: Extensión "SQLite Viewer"
- **CLI**: `sqlite3 backend/database/users.db`

## 🔍 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Verificar estado del servidor |
| GET | `/api/users` | Obtener todos los usuarios (paginado) |
| POST | `/api/users` | Crear nuevo usuario |
| GET | `/api/users/:id` | Obtener usuario por ID |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |
| GET | `/api/stats` | Estadísticas de la BD |

## 🧪 Probar la API

### Crear usuario con curl:
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

### Ver usuarios:
```bash
curl http://localhost:3000/api/users
```

## 🎯 Validaciones Especiales

- **Campo condicional**: Si se selecciona "Otra" en ciudad, aparece campo "¿Cuál?"
- **Validación cruzada**: Confirmar contraseña se revalida cuando cambia la contraseña original
- **Validación de grupo**: Checkboxes de contacto requieren al menos una selección
- **Validación de edad**: Calcula automáticamente si es mayor de 18 años
- **Validación de unicidad**: Email, username, documento y celular deben ser únicos

## 📱 Modo Offline

Si el servidor backend no está disponible:
- El formulario funciona normalmente
- Los datos se guardan en localStorage
- Se mostrará una notificación amarilla
- Los datos se sincronizarán cuando el servidor vuelva a estar disponible

## 🔧 Solución de Problemas

### Problema: "El servidor no está disponible"
**Causa:** El backend no está corriendo
**Solución:**
```bash
cd backend
npm run dev
```

### Problema: "Error: EADDRINUSE"
**Causa:** El puerto 3000 ya está en uso
**Solución:**
- Cierra otros procesos usando el puerto 3000
- O cambia el puerto en el backend

### Problema: "Cannot find module"
**Causa:** Dependencias no instaladas
**Solución:**
```bash
cd backend
npm install
```

### Problema: CORS errors
**Causa:** El frontend y backend están en dominios diferentes
**Solución:** El backend ya está configurado con CORS

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (versiones modernas)
- ✅ Responsive design para móviles y tablets
- ✅ Funciona completamente offline (con localStorage)
- ✅ Node.js 14+ para el backend
- ✅ SQLite para la base de datos

## 🖼️ Capturas Sugeridas

Para documentación o presentación, se recomienda capturar:

1. **Formulario completo**: Mostrando todos los campos organizados por secciones
2. **Validación en tiempo real**: Campos con errores y mensajes específicos
3. **Formulario válido**: Todos los campos en verde con botón habilitado
4. **Modal de confirmación**: Resumen de datos después del envío exitoso
5. **Versión móvil**: Diseño responsive en dispositivo pequeño
6. **Base de datos**: Vista de los datos guardados en SQLite
7. **API endpoints**: Respuestas JSON de la API

## 🔍 Ejemplos de Validación

### Correo electrónico
- ✅ `usuario@dominio.com`
- ❌ `usuario@` (falta dominio)
- ❌ `@dominio.com` (falta usuario)

### Contraseña
- ✅ `MiClave123@`
- ❌ `miclave123` (falta mayúscula y carácter especial)
- ❌ `MICLAVE123` (falta minúscula y carácter especial)

### Celular colombiano
- ✅ `3123456789`
- ❌ `2123456789` (no empieza con 3)
- ❌ `312345678` (solo 9 dígitos)

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Semántica, tipos de input, atributos de validación
- **CSS3**: Flexbox, Grid, animaciones, variables CSS
- **JavaScript ES6+**: Arrow functions, destructuring, template literals
- **Fetch API**: Para comunicación con el backend
- **LocalStorage**: Para persistencia de datos offline

### Backend
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web para API REST
- **SQLite**: Base de datos ligera y file-based
- **bcrypt**: Encriptación de contraseñas
- **Joi**: Validación de datos
- **Helmet**: Seguridad HTTP
- **CORS**: Comunicación entre dominios
- **Rate Limiting**: Protección contra ataques

## 🎯 Pruebas Recomendadas

1. **Validación frontend:** Intenta enviar el formulario con errores
2. **Conexión backend:** Envía un formulario válido
3. **Modo offline:** Detén el servidor e intenta enviar
4. **Base de datos:** Verifica que los datos se guarden en SQLite
5. **API endpoints:** Prueba los endpoints con curl o Postman
6. **Unicidad:** Intenta registrar el mismo email o username
7. **Seguridad:** Verifica que las contraseñas se encripten

## 📝 Notas del Desarrollador

- El proyecto sigue principios de **programación defensiva**
- Código **modular y reutilizable** sin duplicación
- **Accesibilidad** con etiquetas semánticas y atributos ARIA
- **Performance** optimizada con delegación de eventos
- **Mantenibilidad** con código bien estructurado y comentado
- **Seguridad** con validaciones frontend y backend
- **Resiliencia** con modo offline y respaldo automático

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Revisa la terminal del backend
3. Verifica que el servidor esté corriendo
4. Revisa que la base de datos exista
5. Consulta la documentación del backend en `backend/README.md`

---

**¡Listo para usar!** Ahora tienes un formulario completo con base de datos funcional que trabaja tanto online como offline.
