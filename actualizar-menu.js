// actualizar-menu.js
// Ejecutar con: node actualizar-menu.js

const fs = require('fs');
const path = require('path');

const investigacionDir = path.join(__dirname, 'investigacion');
const archivos = fs.readdirSync(investigacionDir)
  .filter(f => f.endsWith('.html'));

archivos.forEach(archivo => {
  const ruta = path.join(investigacionDir, archivo);
  let contenido = fs.readFileSync(ruta, 'utf8');
  
  // 1. Reemplazar <nav class="main-nav"...>...</nav> con contenedor vacío
  contenido = contenido.replace(
    /<nav class="main-nav"[^>]*>[\s\S]*?<\/nav>/g,
    '<nav class="main-nav" id="mainNav"></nav>'
  );
  
  // 2. Añadir script de menu.js antes de </body> si no existe
  if (!contenido.includes('menu.js')) {
    contenido = contenido.replace(
      '</body>',
      '  <script src="menu.js" defer></script>\n</body>'
    );
  }
  
  fs.writeFileSync(ruta, contenido);
  console.log(`✅ Actualizado: ${archivo}`);
});

console.log('\n🎉 Todos los archivos actualizados correctamente.');