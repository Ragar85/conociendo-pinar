# Conociendo Pinar

Sitio web informativo sobre la provincia de Pinar del Río, Cuba. Este proyecto presenta información detallada sobre biodiversidad, investigación científica, turismo ecológico y aspectos culturales de la región.

## 📁 Estructura del Proyecto

```
/workspace
├── index.html                      # Página principal
├── conociendo-pinar.html           # Información general sobre Pinar del Río
├── buscador.html                   # Funcionalidad de búsqueda
├── soporte.html                    # Página de soporte técnico
├── privacidad.html                 # Política de privacidad
├── terminos.html                   # Términos y condiciones
├── cancelar-suscripcion.html       # Cancelación de suscripción
├── actualizar-footer.js            # Script para actualizar el footer
├── actualizar-menu.js              # Script para actualizar el menú
├── admin/                          # Panel de administración
│   ├── index.html                  # Dashboard admin
│   ├── admin.css                   # Estilos del admin
│   ├── admin.js                    # Lógica del admin
│   ├── galeria.html                # Gestión de galería
│   ├── mensajes.html               # Gestión de mensajes
│   ├── posts.html                  # Gestión de posts
│   └── reportes.html               # Reportes y estadísticas
├── investigacion/                  # Sección de investigación científica
│   ├── index.html                  # Portal de investigación
│   ├── dashboard-biodiversidad.html
│   ├── datos-socioeconomicos.html
│   ├── descargas.html
│   ├── especies-emblematicas.html
│   ├── fauna-detallada.html
│   ├── galeria-expediciones.html
│   ├── guanahacabibes.html
│   ├── itinerarios.html
│   ├── km9-mantua.html
│   ├── paleontologia-guasasa.html
│   ├── protocolos.html
│   ├── san-andres.html
│   ├── sierra-guasasa.html
│   ├── sobre-el-gippc.html
│   └── menu.js
└── img/                            # Recursos de imágenes
```

## 🚀 Características Principales

- **Diseño Responsivo**: Adaptable a dispositivos móviles y escritorio
- **Temática Ecológica**: Paleta de colores inspirada en la naturaleza (verdes, tonos tierra)
- **Panel de Administración**: Gestión de contenido, mensajes y reportes
- **Sección de Investigación**: Información detallada sobre proyectos científicos
- **Búsqueda Integrada**: Funcionalidad para encontrar contenido rápidamente
- **Animaciones**: Efectos de revelado (reveal) para una experiencia visual dinámica

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos y animaciones
- **JavaScript** - Interactividad y lógica del cliente
- **Google Fonts** - Tipografía Inter
- **Font Awesome** - Iconografía
- **Supabase** - Backend como servicio (integración mediante CDN)

## 📄 Páginas Principales

### Root
- `index.html` - Página de inicio con navegación y contenido destacado
- `conociendo-pinar.html` - Información turística y cultural de Pinar del Río
- `buscador.html` - Herramienta de búsqueda en todo el sitio
- `soporte.html` - Centro de ayuda y contacto
- `privacidad.html` - Política de privacidad del sitio
- `terminos.html` - Términos y condiciones de uso

### Administración (`/admin/`)
- Dashboard para gestión de contenido
- Galería de imágenes
- Sistema de mensajería
- Gestión de posts
- Reportes y análisis

### Investigación (`/investigacion/`)
- Portal científico del GIPPC (Grupo de Investigación de Pinar del Río)
- Dashboards de biodiversidad
- Datos socioeconómicos
- Especies emblemáticas
- Protocolos de investigación
- Guías de expediciones

## 🎨 Variables CSS Principales

El proyecto utiliza un sistema de diseño consistente con las siguientes variables:

```css
--primary-dark: #0e2c22
--primary: #1e4a3b
--primary-light: #2d6b54
--secondary: #f4c542
--surface: #ffffff
--text-primary: #1a3c2b
```

## 📦 Instalación y Uso

1. Clonar el repositorio
2. Abrir `index.html` en un navegador web moderno
3. Para el panel de administración, navegar a `/admin/index.html`

**Nota**: Algunas funcionalidades pueden requerir configuración de Supabase (API keys, endpoints).

## 🔐 Configuración de Supabase

Para habilitar las funcionalidades backend, configure las credenciales de Supabase en los archivos JavaScript correspondientes:

```javascript
const supabase = window.supabase.createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
```

## 📝 Licencia

Este proyecto es parte del initiative "Conociendo Pinar" para promover el conocimiento sobre la provincia de Pinar del Río.

## 👥 Contribución

Para contribuciones, por favor contacte al equipo de desarrollo del proyecto.

## 🌐 Demo

Abra `index.html` en su navegador para ver el sitio en funcionamiento.

---

**Conociendo Pinar** - Explorando la riqueza natural y cultural de Pinar del Río, Cuba 🇨🇺
