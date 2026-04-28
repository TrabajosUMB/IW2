# 📋 Formulario de Registro de Usuario

Taller de validación de formularios en frontend utilizando HTML5 y JavaScript Vanilla.

## 🎯 Objetivo

Aprender a implementar validaciones de formularios en el frontend, utilizando HTML5 y JavaScript Vanilla, enfocándose en la experiencia del usuario y en evitar errores antes de enviar datos al servidor.

## 📁 Estructura del Proyecto

```
html_forms/
├── sign_up.html          # Formulario HTML principal
├── assets/
│   ├── styles.css        # Estilos visuales y animaciones
│   └── validation.js     # Lógica de validación JavaScript
└── README.md            # Documentación del proyecto
```

## 🚀 Cómo Usar

1. **Clonar o descargar** los archivos del proyecto
2. **Iniciar un servidor local**:
   ```bash
   # Usando Python
   python -m http.server 8000
   
   # O usando Node.js
   npx serve .
   ```
3. **Abrir en el navegador**: `http://localhost:8000`
4. **Probar el formulario** completando todos los campos

## 📝 Campos y Validaciones

| Campo | Tipo | Validaciones Implementadas |
|-------|------|---------------------------|
| **Nombre completo** | Texto | • Obligatorio<br>• Mínimo 3 caracteres<br>• Solo letras y espacios |
| **Correo electrónico** | Email | • Obligatorio<br>• Formato de email válido<br>• Regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$` |
| **Contraseña** | Password | • Obligatoria<br>• Mínimo 8 caracteres<br>• Al menos una mayúscula<br>• Al menos un número<br>• Al menos un carácter especial |
| **Confirmar contraseña** | Password | • Obligatoria<br>• Debe coincidir exactamente con la contraseña |
| **Fecha de nacimiento** | Fecha | • Obligatoria<br>• Usuario debe tener al menos 18 años<br>• No puede ser fecha futura |
| **Celular** | Teléfono | • Obligatorio<br>• Formato colombiano (10 dígitos)<br>• Debe comenzar con 3<br>• Regex: `^[3][0-9]{9}$` |
| **Teléfono** | Teléfono | • Opcional<br>• Si se ingresa: mínimo 10 dígitos<br>• Solo caracteres numéricos |
| **Aceptación de términos** | Checkbox | • Obligatorio para enviar el formulario |

## ✅ Funcionalidades Implementadas

### 🎨 Experiencia de Usuario
- **Validación en tiempo real**: Los campos se validan mientras el usuario escribe
- **Mensajes de error dinámicos**: Aparecen/desaparecen debajo de cada campo
- **Estados visuales**: 
  - 🟢 **Verde**: Campo válido
  - 🔴 **Rojo**: Campo inválido
  - ⚪ **Neutro**: Campo vacío o sin validar
- **Animaciones suaves**: Transiciones y efectos visuales atractivos
- **Diseño responsive**: Adaptable a diferentes tamaños de pantalla

### 🔧 Características Técnicas
- **Botón de envío inteligente**: Se habilita solo cuando todos los campos obligatorios son válidos
- **Validación sin servidor**: Todo funciona en el frontend
- **Mensajes de confirmación**: Alerta de éxito cuando el formulario es válido
- **Botón de limpiar**: Reinicia todos los campos y estados
- **Debug en consola**: Muestra campos inválidos para desarrollo

### 🛡️ Seguridad y Validación
- **Expresiones regulares**: Para validaciones complejas (email, teléfono, etc.)
- **Validaciones HTML5 nativas**: `required`, `type`, `minlength`, `pattern`
- **Validaciones JavaScript personalizadas**: Lógica de negocio específica
- **Prevención de envío**: El formulario no se envía si hay errores

## 🎨 Diseño y Estilos

### Características Visuales
- **Gradiente moderno**: Fondo con degradado púrpura-azul
- **Tarjeta blanca**: Formulario centrado con sombras suaves
- **Tipografía clara**: Segoe UI para mejor legibilidad
- **Iconos implícitos**: Estados visuales sin necesidad de iconos externos
- **Animaciones**: Fade-in y slide-in para elementos del formulario

### Estados Interactivos
- **Focus**: Resaltado azul con sombra sutil
- **Hover**: Efectos en botones y elementos interactivos
- **Transiciones**: Cambios suaves de 0.3s entre estados

## 🔍 Validaciones Detalladas

### 1. Nombre Completo
```javascript
// Regex implementado
/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
```
- Acepta letras mayúsculas/minúsculas
- Incluye caracteres especiales españoles (ñ, acentos)
- Permite espacios entre nombres

### 2. Contraseña Segura
```javascript
// Requisitos múltiples
- Longitud: >= 8 caracteres
- Mayúscula: /[A-Z]/
- Número: /[0-9]/
- Especial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
```

### 3. Celular Colombiano
```javascript
// Formato específico
/^[3][0-9]{9}$/
```
- Siempre comienza con 3
- Exactamente 10 dígitos
- Solo caracteres numéricos

### 4. Verificación de Edad
```javascript
// Cálculo dinámico
const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
if (age < 18) -> Error
```

## 🧪 Testing y Validación

### Casos de Prueba Recomendados

#### ✅ Casos Válidos
- Nombre: "Juan Pérez" (3+ caracteres, solo letras)
- Email: "usuario@dominio.com" (formato válido)
- Contraseña: "Password123!" (cumple todos los requisitos)
- Fecha: "2000-01-01" (mayor de 18 años)
- Celular: "3001234567" (formato colombiano)

#### ❌ Casos Inválidos
- Nombre: "Jo" (menos de 3 caracteres)
- Email: "usuario@" (formato inválido)
- Contraseña: "password" (sin mayúscula, número o especial)
- Fecha: "2010-01-01" (menor de 18 años)
- Celular: "123456789" (no comienza con 3)

## 🛠 Tecnologías Utilizadas

- **HTML5**: Estructura semántica y validaciones nativas
- **CSS3**: Estilos modernos, animaciones y responsive design
- **JavaScript Vanilla**: Lógica de validación sin frameworks
- **Regex**: Expresiones regulares para validaciones complejas

## 📱 Compatibilidad

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Android Chrome)

## 🚀 Mejoras Futuras

- [ ] Añadir validación de fuerza de contraseña con indicador visual
- [ ] Implementar autocompletado de dirección
- [ ] Agregar validación de documento de identidad
- [ ] Incluir validación de captcha
- [ ] Añadir internacionalización (i18n)
- [ ] Implementar persistencia de datos (localStorage)

## 📞 Soporte

Para dudas o sugerencias sobre el taller:
- Revisar la consola del navegador para mensajes de debug
- Validar que todos los archivos estén en la misma carpeta
- Verificar que el servidor local esté funcionando correctamente

## 📄 Licencia

Este proyecto es para fines educativos del taller de validación de formularios.

---

**🎓 Taller completado exitosamente!**
