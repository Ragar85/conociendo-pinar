// ===========================
// MENU.JS - Sistema de Navegación con Dropdowns
// Versión 2.0 - Auto-inyección de estilos
// ===========================

const menuConfig = [
  {
    text: 'Inicio',
    href: '../index.html',
    activePaths: ['/index.html', '/']
  },
  {
    text: 'Investigación',
    dropdown: [
      { text: '🗺️ Polígonos de Estudio', href: 'index.html', activePaths: ['/investigacion/index.html'] },
      { text: '🐾 Especies Emblemáticas', href: 'especies-emblematicas.html', activePaths: ['/investigacion/especies-emblematicas.html'] },
      { text: '🦜 Fauna Detallada', href: 'fauna-detallada.html', activePaths: ['/investigacion/fauna-detallada.html'] },
      { text: '🦴 Paleontología', href: 'paleontologia-guasasa.html', activePaths: ['/investigacion/paleontologia-guasasa.html'] },
      { text: '📊 Socioeconómico', href: 'datos-socioeconomicos.html', activePaths: ['/investigacion/datos-socioeconomicos.html'] },
      { text: '📈 Dashboard Biodiversidad', href: 'dashboard-biodiversidad.html', activePaths: ['/investigacion/dashboard-biodiversidad.html'] }
    ]
  },
  {
    text: 'Prácticas',
    dropdown: [
      { text: '🧭 Itinerarios Didácticos', href: 'itinerarios.html', activePaths: ['/investigacion/itinerarios.html'] },
      { text: '🔬 Protocolos de Campo', href: 'protocolos.html', activePaths: ['/investigacion/protocolos.html'] },
      { text: '📸 Galería Expediciones', href: 'galeria-expediciones.html', activePaths: ['/investigacion/galeria-expediciones.html'] }
    ]
  },
  {
    text: 'Guía',
    href: '../conociendo-pinar.html',
    activePaths: ['/conociendo-pinar.html']
  },
  {
    text: 'Soporte',
    href: '../soporte.html',
    activePaths: ['/soporte.html']
  }
];

// ===========================
// CSS INYECTADO AUTOMÁTICAMENTE
// ===========================
const menuCSS = `
/* Dropdown Desktop */
.nav-item-dropdown { position: relative; }
.nav-item-dropdown > .nav-link { cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
.nav-item-dropdown > .nav-link::after { 
  content: '▾'; 
  font-size: 0.7rem; 
  margin-left: 4px;
  transition: transform 0.3s ease;
}
.nav-item-dropdown:hover > .nav-link::after { transform: rotate(180deg); }

.dropdown-content {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  min-width: 260px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(30,74,59,0.15);
  padding: 8px 0;
  z-index: 1000;
  animation: dropdownFade 0.2s ease;
}
@keyframes dropdownFade {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.nav-item-dropdown:hover .dropdown-content { display: block; }
.dropdown-content a {
  display: block;
  padding: 10px 20px;
  color: #1a3c2b;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}
.dropdown-content a:hover {
  background: #f4f8f0;
  color: #1e4a3b;
  padding-left: 24px;
  border-left-color: #f4c542;
}
.dropdown-content a.active {
  background: #eef5e8;
  color: #1e4a3b;
  font-weight: 600;
  border-left-color: #f4c542;
}

/* Mobile: submenús indentados */
@media (max-width: 968px) {
  .nav-item-dropdown { position: static; }
  .nav-item-dropdown > .nav-link {
    width: 100%;
    text-align: left;
    padding: 14px 24px;
    border-radius: 8px;
    justify-content: space-between;
  }
  .nav-item-dropdown > .nav-link::after {
    content: '▾';
    font-size: 0.8rem;
    margin-left: 0;
  }
  .dropdown-content {
    position: static;
    box-shadow: none;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
    padding: 4px 0;
    margin-top: 4px;
    animation: none;
    display: none;
  }
  .nav-item-dropdown.open .dropdown-content { display: block; }
  .dropdown-content a {
    color: rgba(255,255,255,0.85);
    padding: 10px 24px 10px 40px;
    border-left: none;
  }
  .dropdown-content a:hover {
    background: rgba(255,255,255,0.08);
    color: white;
    padding-left: 44px;
    border-left: none;
  }
  .dropdown-content a.active {
    background: rgba(244,197,66,0.15);
    color: #f4c542;
    border-left: none;
  }
}
`;

// ===========================
// INYECTAR CSS EN EL HEAD
// ===========================
function injectCSS() {
  if (document.getElementById('menu-dynamic-css')) return;
  const style = document.createElement('style');
  style.id = 'menu-dynamic-css';
  style.textContent = menuCSS;
  document.head.appendChild(style);
}

// ===========================
// DETECTAR ENLACE ACTIVO
// ===========================
function isActive(item, currentPath) {
  if (item.activePaths) {
    return item.activePaths.some(p => currentPath.endsWith(p));
  }
  return false;
}

// ===========================
// GENERAR MENÚ
// ===========================
function generateMenu() {
  const currentPath = window.location.pathname;
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  // Limpiar (excepto el buscador móvil si existe)
  const mobileSearch = nav.querySelector('.mobile-search-form');
  nav.innerHTML = '';
  if (mobileSearch) nav.appendChild(mobileSearch);

  menuConfig.forEach(item => {
    if (item.dropdown) {
      // Item con dropdown
      const wrapper = document.createElement('div');
      wrapper.className = 'nav-item-dropdown';
      
      const anyActive = item.dropdown.some(sub => isActive(sub, currentPath));
      
      const toggle = document.createElement('a');
      toggle.href = '#';
      toggle.className = 'nav-link' + (anyActive ? ' active' : '');
      toggle.innerHTML = `<span>${item.text}</span>`;
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        // En móvil: toggle del submenú
        if (window.innerWidth <= 968) {
          wrapper.classList.toggle('open');
        }
      });
      
      const dropdown = document.createElement('div');
      dropdown.className = 'dropdown-content';
      
      item.dropdown.forEach(sub => {
        const a = document.createElement('a');
        a.href = sub.href;
        a.textContent = sub.text;
        if (isActive(sub, currentPath)) a.classList.add('active');
        dropdown.appendChild(a);
      });
      
      wrapper.appendChild(toggle);
      wrapper.appendChild(dropdown);
      nav.appendChild(wrapper);
    } else {
      // Item simple
      const a = document.createElement('a');
      a.href = item.href;
      a.className = 'nav-link';
      a.textContent = item.text;
      if (isActive(item, currentPath)) a.classList.add('active');
      nav.appendChild(a);
    }
  });
}

// ===========================
// INICIALIZACIÓN
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  injectCSS();
  generateMenu();
});