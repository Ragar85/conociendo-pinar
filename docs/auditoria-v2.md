# Auditoría de base para V2

## Mapa de dependencias

- `index.html` es la portada y carga la SDK pública de Supabase para leer las publicaciones aprobadas.
- `conociendo-pinar.html` conserva el mapa Leaflet, publicaciones, galería y autenticación.
- `investigacion/` contiene los polígonos, fichas, itinerarios, protocolos, galería y dashboard; `investigacion/menu.js` inyecta su navegación actual.
- `soporte.html`, `buscador.html` y `admin/` permanecen sin cambios. El panel usa `admin/admin.js` y autenticación Supabase.
- Las imágenes de `img/` e `investigacion/img/expediciones/` son recursos locales de las nuevas tarjetas; no se añadieron recursos externos para ilustrar contenido.
- No hay configuración de GitHub Pages, migraciones SQL, esquema de base de datos ni políticas de Supabase versionadas en el repositorio. GitHub Pages sirve los HTML estáticos desde la configuración remota del repositorio.

## Seguridad Supabase

La clave expuesta es una clave `anon` pública, no una `service_role`. No se encontraron claves de servicio, contraseñas, archivos `.env` ni políticas RLS en el repositorio. Sin acceso al proyecto Supabase ni migraciones exportadas, **no es posible verificar aquí que RLS proteja las tablas, el almacenamiento o las RPC**. Por ese motivo no se modificaron llamadas de escritura, roles, tablas ni políticas.

Antes de cambiar backend o afirmar que está protegido se debe exportar/revisar en el panel de Supabase las políticas de `posts`, `gallery`, `messages`, `biodiversity_reports`, perfiles/roles, los buckets y las RPC de newsletter.

## Datos y contenido

La portada V2 no publica cifras nuevas ni testimonios. Se eliminaron los testimonios que no tenían fuente verificable. El bloque de blog muestra una carga, tarjetas con publicaciones aprobadas o un estado explícito cuando no hay publicaciones.
