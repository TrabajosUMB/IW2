# Validación de Formulario de Registro de Usuario

Proyecto web 100% Vanilla JavaScript para el taller de validación de formularios. Sin frameworks ni librerías externas.

## 📋 Descripción

Este proyecto implementa un formulario completo de registro de usuario con validaciones en tiempo real, mensajes de error dinámicos y una experiencia de usuario moderna. Todas las validaciones se realizan en el frontend sin necesidad de servidor.

## 🚀 Cómo Ejecutar

1. **Clonar o descargar** el proyecto
2. **Abrir** el archivo `index.html` en tu navegador web (doble click)
3. ¡Listo! El formulario funciona completamente offline

## 📁 Estructura del Proyecto

```
validacion_formulario/
├── index.html          # Formulario completo con estructura HTML5
├── app.js             # Toda la lógica de validación y funcionalidad
├── assets/
│   └── styles.css     # Estilos CSS para validación y UI
└── README.md          # Documentación del proyecto
```

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

### Campos Adicionales (8+ implementados)
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

## 💾 Almacenamiento Local

Opcionalmente, los datos del formulario se guardan en `localStorage` cuando el envío es exitoso, permitiendo persistencia de datos.

## 🎯 Validaciones Especiales

- **Campo condicional**: Si se selecciona "Otra" en ciudad, aparece campo "¿Cuál?"
- **Validación cruzada**: Confirmar contraseña se revalida cuando cambia la contraseña original
- **Validación de grupo**: Checkboxes de contacto requieren al menos una selección
- **Validación de edad**: Calcula automáticamente si es mayor de 18 años

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (versiones modernas)
- ✅ Responsive design para móviles y tablets
- ✅ Funciona completamente offline
- ✅ Sin dependencias externas

## 🖼️ Capturas Sugeridas

Para documentación o presentación, se recomienda capturar:

1. **Formulario completo**: Mostrando todos los campos organizados por secciones
2. **Validación en tiempo real**: Campos con errores y mensajes específicos
3. **Formulario válido**: Todos los campos en verde con botón habilitado
4. **Modal de confirmación**: Resumen de datos después del envío exitoso
5. **Versión móvil**: Diseño responsive en dispositivo pequeño

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

- **HTML5**: Semántica, tipos de input, atributos de validación
- **CSS3**: Flexbox, Grid, animaciones, variables CSS
- **JavaScript ES6+**: Arrow functions, destructuring, template literals
- **LocalStorage**: Para persistencia de datos (opcional)

## 📝 Notas del Desarrollador

- El proyecto sigue principios de **programación defensiva**
- Código **modular y reutilizable** sin duplicación
- **Accesibilidad** con etiquetas semánticas y atributos ARIA
- **Performance** optimizada con delegación de eventos
- **Mantenibilidad** con código bien estructurado y comentado

---

**¡Listo para usar!** Simplemente abre `index.html` y comienza a probar las validaciones.
