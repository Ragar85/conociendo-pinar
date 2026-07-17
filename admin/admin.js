// ===========================
// ADMIN.JS - Funciones compartidas (versión con mejor debugging)
// ===========================

const SUPABASE_URL = 'https://mixfzeuzhooujqzaexpp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1peGZ6ZXV6aG9vdWpxemFleHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODk2NjYsImV4cCI6MjA5NzM2NTY2Nn0.re-BvpmaB3vMXIBwbOY_88PE0q9Hw1L9xsyL6JurvaI';

let supabaseClient = null;
let currentUser = null;
let userRole = null;

// ===========================
// DEBUG: Verificar entorno
// ===========================
console.log('🔧 Admin Panel iniciado');
console.log('📍 URL:', window.location.href);
console.log('🌐 Online:', navigator.onLine);

// ===========================
// INICIALIZAR SUPABASE CON MEJOR MANEJO DE ERRORES
// ===========================
async function initSupabase() {
  console.log('🔄 Inicializando Supabase...');
  
  // Verificar si el SDK ya está cargado
  if (typeof window.supabase !== 'undefined') {
    console.log('✅ Supabase SDK ya cargado');
    if (!supabaseClient) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('✅ Cliente Supabase creado');
    }
    return supabaseClient;
  }
  
  // Cargar el SDK dinámicamente
  console.log('📥 Cargando Supabase SDK...');
  
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="supabase"]');
    
    if (existingScript) {
      console.log('⏳ Script de Supabase ya existe, esperando carga...');
      const checkInterval = setInterval(() => {
        if (typeof window.supabase !== 'undefined') {
          clearInterval(checkInterval);
          supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          console.log('✅ Cliente Supabase creado (después de espera)');
          resolve(supabaseClient);
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Timeout cargando Supabase SDK'));
      }, 10000);
    } else {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      
      s.onload = () => {
        console.log('✅ Supabase SDK cargado correctamente');
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Cliente Supabase creado');
        resolve(supabaseClient);
      };
      
      s.onerror = (error) => {
        console.error('❌ Error cargando Supabase SDK:', error);
        reject(new Error('No se pudo cargar Supabase SDK. Verifica tu conexión a internet.'));
      };
      
      document.head.appendChild(s);
    }
  });
}

// ===========================
// VERIFICAR AUTENTICACIÓN + ROL ADMIN
// ===========================
async function checkAdminAuth() {
  console.log('🔐 Verificando autenticación...');
  
  try {
    await initSupabase();
    
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error obteniendo sesión:', sessionError);
      window.location.href = 'index.html';
      return false;
    }
    
    if (!session) {
      console.log('⚠️ No hay sesión activa');
      window.location.href = 'index.html';
      return false;
    }
    
    currentUser = session.user;
    console.log('✅ Usuario autenticado:', currentUser.email);
    
    // Verificar rol admin
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', currentUser.id)
      .single();
    
    if (roleError) {
      console.error('❌ Error verificando rol:', roleError);
      alert('❌ Error verificando permisos: ' + roleError.message);
      await supabaseClient.auth.signOut();
      window.location.href = 'index.html';
      return false;
    }
    
    if (!roleData || roleData.role !== 'admin') {
      console.log('⚠️ Usuario no es admin');
      alert('❌ No tienes permisos de administrador');
      await supabaseClient.auth.signOut();
      window.location.href = 'index.html';
      return false;
    }
    
    userRole = roleData.role;
    console.log('✅ Rol verificado:', userRole);
    updateUserInfo();
    return true;
    
  } catch (error) {
    console.error('❌ Error en checkAdminAuth:', error);
    alert('❌ Error de conexión: ' + error.message);
    window.location.href = 'index.html';
    return false;
  }
}

// ===========================
// ACTUALIZAR INFO DE USUARIO EN HEADER
// ===========================
function updateUserInfo() {
  const nameEl = document.querySelector('.admin-user-name');
  const avatarEl = document.querySelector('.admin-user-avatar');
  
  if (!nameEl || !avatarEl || !currentUser) {
    console.log('⚠️ No se encontraron elementos de usuario');
    return;
  }
  
  const email = currentUser.email;
  const displayName = email.split('@')[0];
  nameEl.textContent = displayName;
  
  const hash = md5(email.trim().toLowerCase());
  const img = new Image();
  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=404&s=80`;
  
  img.onload = () => {
    avatarEl.innerHTML = `<img src="${gravatarUrl}" alt="Avatar">`;
  };
  img.onerror = () => {
    avatarEl.textContent = displayName.substring(0, 2).toUpperCase();
  };
  img.src = gravatarUrl;
}

// ===========================
// LOGOUT
// ===========================
async function logout() {
  if (!confirm('¿Cerrar sesión?')) return;
  
  try {
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    window.location.href = 'index.html';
  }
}

// ===========================
// MARCAR ENLACE ACTIVO EN SIDEBAR
// ===========================
function setActiveLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });
}

// ===========================
// MENÚ MÓVIL
// ===========================
function setupMobileMenu() {
  const btn = document.querySelector('.btn-mobile-menu');
  const sidebar = document.querySelector('.admin-sidebar');
  
  if (btn && sidebar) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });
    
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !btn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
}

// ===========================
// CARGAR CONTADORES DEL SIDEBAR
// ===========================
async function loadSidebarCounts() {
  if (!supabaseClient) {
    console.log('⚠️ Supabase no inicializado');
    return { reports: 0, posts: 0, gallery: 0, messages: 0 };
  }
  
  try {
    console.log('📊 Cargando contadores...');
    
    const [reports, posts, gallery, messages] = await Promise.allSettled([
      supabaseClient.from('biodiversity_reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseClient.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseClient.from('gallery').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseClient.from('messages').select('id', { count: 'exact', head: true }).eq('is_read', false)
    ]);
    
    const counts = {
      reports: reports.status === 'fulfilled' ? (reports.value.count || 0) : 0,
      posts: posts.status === 'fulfilled' ? (posts.value.count || 0) : 0,
      gallery: gallery.status === 'fulfilled' ? (gallery.value.count || 0) : 0,
      messages: messages.status === 'fulfilled' ? (messages.value.count || 0) : 0
    };
    
    console.log('✅ Contadores cargados:', counts);
    
    updateBadge('reports', counts.reports);
    updateBadge('posts', counts.posts);
    updateBadge('gallery', counts.gallery);
    updateBadge('messages', counts.messages);
    
    return counts;
    
  } catch (error) {
    console.error('❌ Error cargando contadores:', error);
    return { reports: 0, posts: 0, gallery: 0, messages: 0 };
  }
}

function updateBadge(type, count) {
  const badge = document.querySelector(`[data-badge="${type}"]`);
  if (badge) {
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }
}

// ===========================
// UTILIDADES
// ===========================
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { 
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'hace unos segundos';
  if (seconds < 3600) return `hace ${Math.floor(seconds/60)} min`;
  if (seconds < 86400) return `hace ${Math.floor(seconds/3600)} h`;
  if (seconds < 604800) return `hace ${Math.floor(seconds/86400)} d`;
  return formatDate(dateStr);
}

function showAlert(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
  
  const content = document.querySelector('.admin-content');
  if (content) {
    content.insertBefore(alert, content.firstChild);
    setTimeout(() => alert.remove(), 4000);
  }
}

// ===========================
// MD5 (para Gravatar)
// ===========================
function md5(string) {
  function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
  }
  function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function add32(a, b) { var lsw = (a & 0xFFFF) + (b & 0xFFFF); var msw = (a >> 16) + (b >> 16) + (lsw >> 16); return (msw << 16) | (lsw & 0xFFFF); }
  function str2binl(str) { var n = str.length; var bin = Array((n + 7) >> 2); for (var i = 0; i < n; i++) { bin[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8); } return bin; }
  function binl2hex(binarray) { var hex_tab = "0123456789abcdef"; var str = ""; for (var i = 0; i < binarray.length * 4; i++) { str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF); } return str; }
  var x = str2binl(string); var a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (var i = 0; i < x.length; i += 16) { var olda = a, oldb = b, oldc = c, oldd = d; md5cycle([a, b, c, d], x.slice(i, i + 16)); a = add32(a, olda); b = add32(b, oldb); c = add32(c, oldc); d = add32(d, oldd); }
  return binl2hex([a, b, c, d]);
}

// ===========================
// INICIALIZACIÓN GLOBAL
// ===========================
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 DOM cargado');
  setActiveLink();
  setupMobileMenu();
  
  const isLoginPage = window.location.pathname.endsWith('index.html') || 
                      window.location.pathname.endsWith('/admin/') ||
                      window.location.pathname.endsWith('/admin');
  
  if (!isLoginPage) {
    const isAdmin = await checkAdminAuth();
    if (isAdmin) {
      await loadSidebarCounts();
    }
  }
});

// Exportar funciones globales
window.initSupabase = initSupabase;
window.logout = logout;
window.loadSidebarCounts = loadSidebarCounts;
window.updateUserInfo = updateUserInfo;
window.timeAgo = timeAgo;
window.showAlert = showAlert;