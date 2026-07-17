const fs = require('fs');
const path = require('path');

console.log('🔍 Buscando archivos HTML...\n');

// Buscar en raíz y en investigacion/
const dirs = [__dirname, path.join(__dirname, 'investigacion')];
let archivos = [];

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
    files.forEach(f => archivos.push(path.join(dir, f)));
  }
});

console.log(`✅ Encontrados ${archivos.length} archivos HTML:\n`);

let actualizados = 0;
let omitidos = 0;

archivos.forEach(ruta => {
  const archivo = path.basename(ruta);
  let contenido = fs.readFileSync(ruta, 'utf8');
  const original = contenido;

  // Saltar si ya tiene el enlace admin
  if (contenido.includes('admin/index.html')) {
    console.log(`📄 ${archivo}: ⏭ Ya tiene enlace admin`);
    omitidos++;
    return;
  }

  // Patrón 1: Footer con "Términos</a></p>"
  if (contenido.includes('Términos</a></p>')) {
    contenido = contenido.replace(
      /Términos<\/a><\/p>/g,
      'Términos</a> | <a href="admin/index.html" style="opacity:0.4;font-size:0.75rem;">Admin</a></p>'
    );
  }
  // Patrón 2: Footer con data-i18n="footer-terms"
  else if (contenido.includes('footer-terms">Términos</a></p>')) {
    contenido = contenido.replace(
      /footer-terms">Términos<\/a><\/p>/g,
      'footer-terms">Términos</a> | <a href="admin/index.html" style="opacity:0.4;font-size:0.75rem;">Admin</a></p>'
    );
  }
  // Patrón 3: Footer con "Terms</a></p>" (inglés)
  else if (contenido.includes('Terms</a></p>')) {
    contenido = contenido.replace(
      /Terms<\/a><\/p>/g,
      'Terms</a> | <a href="admin/index.html" style="opacity:0.4;font-size:0.75rem;">Admin</a></p>'
    );
  }
  // Patrón 4: footer-bottom genérico
  else if (contenido.includes('footer-bottom')) {
    contenido = contenido.replace(
      /(<div class="footer-bottom">[\s\S]*?)(<\/div>)/,
      '$1<p style="margin-top:8px;"><a href="admin/index.html" style="opacity:0.4;font-size:0.75rem;">Admin</a></p>$2'
    );
  }

  if (contenido !== original) {
    fs.writeFileSync(ruta, contenido);
    console.log(`📄 ${archivo}: ✅ Enlace admin añadido`);
    actualizados++;
  } else {
    console.log(`📄 ${archivo}: ⚠ No se encontró patrón de footer`);
    omitidos++;
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`📊 RESUMEN:`);
console.log(`   ✅ Actualizados: ${actualizados}`);
console.log(`   ⏭ Omitidos: ${omitidos}`);
console.log(`   📄 Total: ${archivos.length}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (actualizados > 0) {
  console.log('\n🎉 ¡Listo! Recarga las páginas en el navegador.');
} else {
  console.log('\n⚠ No se hicieron cambios. Verifica el formato del footer manualmente.');
}