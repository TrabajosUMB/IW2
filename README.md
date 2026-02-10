# IW2
En esta carpeta se encuentran todas las actividades de código o Programación de la Materia de Ingeniería Web II

## CV Landing Page - Ingeniero de Desarrollo

Una landing page responsive y profesional para presentar tu CV como Ingeniero de Desarrollo, construida con HTML semántico, CSS mobile-first y JavaScript nativo.

### 🚀 Características

- **HTML5 Semántico**: Estructura accesible y bien organizada
- **Diseño Mobile-First**: Optimizado para dispositivos móviles primero
- **Responsive Design**: Se adapta perfectamente a todos los tamaños de pantalla
- **Menú Hamburguesa**: Navegación intuitiva en dispositivos móviles
- **Tipografía Profesional**: Google Fonts (Inter) para una apariencia moderna
- **Animaciones Suaves**: Transiciones y micro-interacciones elegantes
- **Alto Rendimiento**: Carga rápida y optimizada
- **Accesibilidad**: Cumple con estándares WCAG

### 📁 Estructura del Proyecto

```
IW2/
├── index.html              # Archivo HTML principal
├── assets/
│   ├── css/
│   │   └── styles.css      # Estilos CSS
│   ├── js/
│   │   └── menu.js         # JavaScript del menú
│   └── images/
│       ├── profile.jpg     # Foto de perfil
│       ├── project1.jpg    # Imagen proyecto 1
│       ├── project2.jpg    # Imagen proyecto 2
│       └── project3.jpg    # Imagen proyecto 3
└── README.md               # Este archivo
```

### 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos con variables CSS y Flexbox/Grid
- **JavaScript ES6+**: Interactividad nativa
- **Google Fonts**: Tipografía Inter
- **Responsive Design**: Media queries para todos los dispositivos

### 📋 Secciones del CV

La landing page incluye las siguientes secciones:

1. **Header**: Navegación y logo
2. **Datos de Contacto**: Foto e información de contacto
3. **Descripción del Perfil**: Resumen profesional
4. **Competencias Técnicas**: Habilidades técnicas organizadas
5. **Competencias Blandas**: Habilidades interpersonales
6. **Información Académica**: Formación y certificaciones
7. **Experiencia Laboral**: Trayectoria profesional
8. **Proyectos Destacados**: Portfolio de proyectos
9. **Footer**: Enlaces y derechos reservados

### 🚀 Despliegue

#### Opción 1: GitHub Pages (Recomendado)

1. Sube el proyecto a tu repositorio GitHub
2. Ve a Settings > Pages
3. Selecciona la rama `main` y la carpeta `/root`
4. Tu sitio estará disponible en `https://tuusuario.github.io/nombre-repo`

#### Opción 2: Servidor Local

Para desarrollo local:

```bash
# Usando Python 3
python -m http.server 8000

# Usando Node.js (requiere http-server)
npx http-server

# Usando PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

### ⚙️ Personalización

#### Cambiar Información Personal

Edita el archivo `index.html`:

```html
<!-- Cambia tu nombre en el header -->
<h1>Tu Nombre</h1>

<!-- Actualiza tus datos de contacto -->
<p><strong>Email:</strong> tu.email@ejemplo.com</p>
<p><strong>Teléfono:</strong> +34 600 000 000</p>
```

#### Modificar Colores

Edita las variables CSS en `assets/css/styles.css`:

```css
:root {
    --primary-color: #2563eb;     /* Color primario */
    --secondary-color: #1e40af;   /* Color secundario */
    --text-color: #1f2937;        /* Color del texto */
    /* ... otras variables */
}
```

### 📱 Responsive Breakpoints

- **Mobile**: < 768px (diseño base)
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1199px
- **Large Desktop**: ≥ 1200px

### 🌐 Compatibilidad del Navegador

- ✅ Chrome (últimas 2 versiones)
- ✅ Firefox (últimas 2 versiones)
- ✅ Safari (últimas 2 versiones)
- ✅ Edge (últimas 2 versiones)
