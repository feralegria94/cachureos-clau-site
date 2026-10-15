/* ═══════════════════════════════════════
   PRECIOS DINÁMICOS (dashboard Claudia)
   Fuente: Supabase REST (tabla cachureos_precios)
   Fallback: api/precios.json (deploy sin red / modo lectura)
   Si falla todo, se usan los precios hardcodeados de PRODUCTS.
   La contraseña del cliente nunca se usa aquí: lectura pública con anon key.
═══════════════════════════════════════ */
const SUPABASE_URL = 'https://qtjcgbcqdhaubmdhqgxe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0amNnYmNxZGhhdWJtZGhxZ3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTM4NjgsImV4cCI6MjA2NzY4OTg2OH0.KcBYp7KTE4k-KM1KHUjUMl5olwbxYG6hU62b1iyAD3A';

async function loadPricesFromAPI() {
  const urls = [
    SUPABASE_URL + '/rest/v1/cachureos_precios?select=id,nombre,categoria,precio,old_price,descripcion,imagen&order=sort_order',
    'api/precios.json'
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url, {
        headers: url.startsWith(SUPABASE_URL)
          ? { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Accept': 'application/json' }
          : { 'Accept': 'application/json' }
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      let data = await r.json();
      // Normaliza a { productos: [...] } (Supabase devuelve array directo, fallback devuelve objeto)
      const productos = Array.isArray(data) ? data : (data.productos || []);
      const map = {};
      productos.forEach(p => {
        const key = String(p.id);
        map[key] = {
          id: key,
          nombre: p.nombre || p.name,
          categoria: p.categoria || p.cat,
          precio: p.precio ?? p.price,
          oldPrice: p.old_price ?? p.oldPrice,
          desc: p.descripcion ?? p.desc,
          imagen: p.imagen || p.image || '',
        };
      });
      let applied = 0;
      PRODUCTS.forEach(p => {
        const ext = map[String(p.id)];
        if (ext && typeof ext.precio === 'number' && ext.precio >= 0) {
          p.price = ext.precio;
          if (ext.oldPrice) p.oldPrice = ext.oldPrice;
          if (ext.nombre) p.name = ext.nombre;
          if (ext.categoria) p.cat = ext.categoria;
          if (ext.desc) p.desc = ext.desc;
          if (ext.imagen) p.image = ext.imagen;
          applied++;
        }
      });
      console.log('[precios-clau] Aplicados ' + applied + ' precios desde ' + url);
      return true;
    } catch (e) {
      console.warn('[precios-clau] Fuente no disponible:', url, e.message);
    }
  }
  console.warn('[precios-clau] Sin fuente de precios externa, usando valores del catálogo base.');
  return false;
}

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
const PRODUCTS = [
  // --- VAJILLA (15 productos) ---
  { id:1,  name:'Plato Hondo Royal Albert',      cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=400', price:18500, oldPrice:24000, desc:'Porcelana fina inglesa con bordes dorados.' },
  { id:2,  name:'Set de Platos Churchill Blue',   cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400', price:22000, oldPrice:28000, desc:'Diseño clásico Blue Willow, fabricado en Inglaterra.' },
  { id:3,  name:'Bowl de Cerámica Mason Cash',    cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=400', price:15000, oldPrice:19000, desc:'Clásico bowl de mezcla inglés, resistente y elegante.' },
  { id:4,  name:'Plato de Pan Wedgewood',         cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=400', price:12900, oldPrice:16000, desc:'Porcelana de lujo con diseño minimalista.' },
  { id:5,  name:'Set de Vajilla Corelle (USA)',   cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1603199506016-19b4efb56586?auto=format&fit=crop&q=80&w=400', price:45000, oldPrice:55000, desc:'Vidrio Vitrelle ultra resistente, hecho en USA.' },
  { id:6,  name:'Bandeja para Horno Pyrex',       cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=80&w=400', price:14500, oldPrice:18000, desc:'Vidrio templado americano de alta calidad.' },
  { id:7,  name:'Plato Base Portmeirion',         cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400', price:19900, oldPrice:25000, desc:'Diseño Botanic Garden, un clásico británico.' },
  { id:8,  name:'Set de Bowls Anchor Hocking',    cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=400', price:16800, oldPrice:21000, desc:'Vidrio prensado americano, duradero y versátil.' },
  { id:9,  name:'Plato de Postre Spode',          cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400', price:13500, oldPrice:17000, desc:'Diseño italiano azul, fabricado en Inglaterra.' },
  { id:10, name:'Sopera de Loza Vintage',         cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=80&w=400', price:28000, oldPrice:35000, desc:'Pieza única de colección inglesa.' },
  { id:11, name:'Set de Cubiertos Oneida',        cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1558434088-91811899211b?auto=format&fit=crop&q=80&w=400', price:32000, oldPrice:40000, desc:'Acero inoxidable de alta gama, diseño americano.' },
  { id:12, name:'Plato Cuadrado Mikasa',          cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=400', price:15900, oldPrice:20000, desc:'Diseño contemporáneo, porcelana de alta calidad.' },
  { id:13, name:'Ensaladera de Gres Denby',       cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=400', price:24500, oldPrice:30000, desc:'Hecho a mano en Inglaterra, ultra resistente.' },
  { id:14, name:'Set de Mini Cocottes Lodge',     cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=400', price:35000, oldPrice:42000, desc:'Hierro fundido americano para porciones individuales.' },
  { id:15, name:'Plato Decorativo Johnson Bros', cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400', price:11500, oldPrice:15000, desc:'Escenas campestres inglesas en loza fina.' },

  // --- CRISTALERÍA (15 productos) ---
  { id:16, name:'Copa de Vino Waterford',         cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1516919549054-e08258825f8b?auto=format&fit=crop&q=80&w=400', price:25000, oldPrice:32000, desc:'Cristal de plomo cortado a mano, lujo irlandés.' },
  { id:17, name:'Vaso Highball Libbey (USA)',     cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1574932322306-0567f70335e2?auto=format&fit=crop&q=80&w=400', price:6500,  oldPrice:9000,  desc:'Cristalería americana clásica para coctelería.' },
  { id:18, name:'Decantador de Cristal Dartington', cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400', price:38000, oldPrice:48000, desc:'Soplado a mano en el Reino Unido.' },
  { id:19, name:'Juego de Vasos Ball Mason',      cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1571216523910-394982635487?auto=format&fit=crop&q=80&w=400', price:12000, oldPrice:16000, desc:'Los originales frascos americanos para bebidas.' },
  { id:20, name:'Copa de Champagne Riedel',       cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1516919549054-e08258825f8b?auto=format&fit=crop&q=80&w=400', price:19900, oldPrice:26000, desc:'Diseño funcional para la mejor experiencia.' },
  { id:21, name:'Vaso On The Rocks Corning',      cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1574932322306-0567f70335e2?auto=format&fit=crop&q=80&w=400', price:8500,  oldPrice:11000, desc:'Resistencia y estilo americano.' },
  { id:22, name:'Jarros Cerveceros Estilo Pub',    cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400', price:9500,  oldPrice:13000, desc:'Vidrio grueso, clásico de los pubs ingleses.' },
  { id:23, name:'Copa de Martini Cambridge',      cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1574932322306-0567f70335e2?auto=format&fit=crop&q=80&w=400', price:14500, oldPrice:19000, desc:'Cristalería americana vintage de gran elegancia.' },
  { id:24, name:'Licorera de Cristal Real Brierley', cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400', price:45000, oldPrice:58000, desc:'Cristal real británico de alta gama.' },
  { id:25, name:'Set de Vasos Juice Federal Glass', cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1571216523910-394982635487?auto=format&fit=crop&q=80&w=400', price:15000, oldPrice:20000, desc:'Vidrio americano retro con diseños florales.' },
  { id:26, name:'Copa de Cognac Edinburgh Crystal', cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1516919549054-e08258825f8b?auto=format&fit=crop&q=80&w=400', price:28000, oldPrice:36000, desc:'Corte diamante, tradición escocesa.' },
  { id:27, name:'Vaso de Agua Tervis (USA)',      cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1574932322306-0567f70335e2?auto=format&fit=crop&q=80&w=400', price:12500, oldPrice:16000, desc:'Aislado, irrompible y con garantía de por vida.' },
  { id:28, name:'Bowl de Cristal Stuart',         cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400', price:32000, oldPrice:40000, desc:'Cristal inglés antiguo de gran brillo.' },
  { id:29, name:'Juego de Shot Glasses Hazel-Atlas', cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1571216523910-394982635487?auto=format&fit=crop&q=80&w=400', price:11000, oldPrice:15000, desc:'Coleccionables americanos de los años 50.' },
  { id:30, name:'Copa Balón para Gin Tanqueray',  cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1516919549054-e08258825f8b?auto=format&fit=crop&q=80&w=400', price:13500, oldPrice:18000, desc:'Diseño oficial para disfrutar tu gin tonic.' },

  // --- TÉ & CAFÉ (15 productos) ---
  { id:31, name:'Tetera de Porcelana Sadler',     cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1594631252845-29fc4586c56f?auto=format&fit=crop&q=80&w=400', price:24000, oldPrice:32000, desc:'Tetera inglesa clásica con motivos florales.' },
  { id:32, name:'Set de Tazas de Té Paragon',     cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400', price:18900, oldPrice:25000, desc:'Porcelana fina con sello real británico.' },
  { id:33, name:'Prensa Francesa Bodum (USA Edit)', cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1544190153-060ad6fe0473?auto=format&fit=crop&q=80&w=400', price:22000, oldPrice:29000, desc:'El mejor café con diseño internacional.' },
  { id:34, name:'Azucarero & Cremero Aynsley',    cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400', price:15500, oldPrice:20000, desc:'Set de té inglés en porcelana de hueso.' },
  { id:35, name:'Mug de Cerámica Fiesta (USA)',   cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1517256011506-8fe930d7401d?auto=format&fit=crop&q=80&w=400', price:9900,  oldPrice:13000, desc:'Colores vibrantes, un icono americano.' },
  { id:36, name:'Infusor de Té de Plata Sterling', cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1594631252845-29fc4586c56f?auto=format&fit=crop&q=80&w=400', price:28000, oldPrice:38000, desc:'Elegancia victoriana para tu ritual del té.' },
  { id:37, name:'Cafetera Percoladora Vintage',   cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1544190153-060ad6fe0473?auto=format&fit=crop&q=80&w=400', price:35000, oldPrice:45000, desc:'Estilo americano mid-century para tu cocina.' },
  { id:38, name:'Taza de Té Royal Doulton',       cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400', price:14500, oldPrice:19000, desc:'Diseño sofisticado, tradición desde 1815.' },
  { id:39, name:'Set de Té para Uno (Teapot/Cup)', cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1594631252845-29fc4586c56f?auto=format&fit=crop&q=80&w=400', price:19900, oldPrice:26000, desc:'Práctico y elegante diseño británico.' },
  { id:40, name:'Caja de Té de Madera Twinings',  cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1517256011506-8fe930d7401d?auto=format&fit=crop&q=80&w=400', price:12500, oldPrice:17000, desc:'Organizador de madera con terminación premium.' },
  { id:41, name:'Molinillo de Café Manual Zassenhaus', cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1544190153-060ad6fe0473?auto=format&fit=crop&q=80&w=400', price:42000, oldPrice:55000, desc:'Precisión alemana para café americano.' },
  { id:42, name:'Taza Jumbo de Sopa/Café',        cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1517256011506-8fe930d7401d?auto=format&fit=crop&q=80&w=400', price:8500,  oldPrice:11000, desc:'Estilo diner americano, gran capacidad.' },
  { id:43, name:'Platillo para Bolsitas de Té',   cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1594631252845-29fc4586c56f?auto=format&fit=crop&q=80&w=400', price:4500,  oldPrice:6000,  desc:'En forma de tetera, loza inglesa.' },
  { id:44, name:'Set de Cucharitas de Té Souvenir', cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400', price:11500, oldPrice:15000, desc:'Bañadas en plata, con escudos británicos.' },
  { id:45, name:'Calentador de Tetera de Lana',   cat:'Loza y Menaje', image:'https://images.unsplash.com/photo-1594631252845-29fc4586c56f?auto=format&fit=crop&q=80&w=400', price:12000, oldPrice:16000, desc:'Hecho a mano, mantiene el té caliente con estilo.' },

  // --- DECORACIÓN (15 productos) ---
  { id:46, name:'Florero de Cristal Fenton',      cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1513519247352-4d766cf02224?auto=format&fit=crop&q=80&w=400', price:32000, oldPrice:42000, desc:'Vidrio artístico americano, hecho a mano.' },
  { id:47, name:'Candelabro de Bronce Antiguo',   cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=400', price:28000, oldPrice:38000, desc:'Estilo georgiano, importado de Inglaterra.' },
  { id:48, name:'Reloj de Mesa Seth Thomas',      cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1513519247352-4d766cf02224?auto=format&fit=crop&q=80&w=400', price:45000, oldPrice:60000, desc:'Maquinaria americana de precisión vintage.' },
  { id:49, name:'Bandeja de Plata Sheffield',     cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=400', price:55000, oldPrice:75000, desc:'Baño de plata inglés de alta calidad.' },
  { id:50, name:'Figura de Porcelana Beswick',    cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1513519247352-4d766cf02224?auto=format&fit=crop&q=80&w=400', price:24000, oldPrice:32000, desc:'Animales de colección, hechos en Inglaterra.' },
  { id:51, name:'Espejo con Marco Dorado Oval',   cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=400', price:38000, oldPrice:50000, desc:'Estilo victoriano, ideal para el hall.' },
  { id:52, name:'Pisapapeles de Cristal Caithness', cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1513519247352-4d766cf02224?auto=format&fit=crop&q=80&w=400', price:19900, oldPrice:26000, desc:'Arte en vidrio soplado de Escocia.' },
  { id:53, name:'Caja de Música Reuge (USA Edit)', cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=400', price:48000, oldPrice:65000, desc:'Melodías clásicas en caja de madera noble.' },
  { id:54, name:'Plato de Pared Ironstone',       cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1513519247352-4d766cf02224?auto=format&fit=crop&q=80&w=400', price:12500, oldPrice:17000, desc:'Para colgar, escenas de la vieja Inglaterra.' },
  { id:55, name:'Lámpara de Aceite de Vidrio',    cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=400', price:22000, oldPrice:30000, desc:'Estilo americano colonial, funcional.' },
  { id:56, name:'Campana de Mesa de Cristal',     cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1513519247352-4d766cf02224?auto=format&fit=crop&q=80&w=400', price:9500,  oldPrice:13000, desc:'Sonido claro, cristal tallado inglés.' },
  { id:57, name:'Canasta de Picnic de Mimbre',    cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=400', price:35000, oldPrice:48000, desc:'Estilo tradicional para el campo inglés.' },
  { id:58, name:'Libro Decorativo Vintage (USA)', cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1513519247352-4d766cf02224?auto=format&fit=crop&q=80&w=400', price:8500,  oldPrice:12000, desc:'Encuadernación en cuero, ideal para biblioteca.' },
  { id:59, name:'Sujetalibros de Hierro Forjado', cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=400', price:18000, oldPrice:24000, desc:'Diseño robusto y elegante.' },
  { id:60, name:'Marco de Fotos de Peltre',       cat:'Cachureos Europeos', image:'https://images.unsplash.com/photo-1513519247352-4d766cf02224?auto=format&fit=crop&q=80&w=400', price:14500, oldPrice:19000, desc:'Estilo artesanal inglés duradero.' },

  // --- ÁLBUM VARIOS (productos semilla; Claudia agrega más desde el panel) ---
  { id:61, name:'Mantel Americano Bordado',        cat:'Varios', image:'https://images.unsplash.com/photo-1603199506016-19b4efb56586?auto=format&fit=crop&q=80&w=400', price:18900, oldPrice:24000, desc:'Textil vintage con bordados a mano, estilo americano.' },
  { id:62, name:'Juego de Reposteros de Lino',     cat:'Varios', image:'https://images.unsplash.com/photo-1517256011506-8fe930d7401d?auto=format&fit=crop&q=80&w=400', price:12500, oldPrice:16000, desc:'Lino clásico para la cocina, seleccionado con cariño.' },
  { id:63, name:'Tetera Decorativa de Porcelana',  cat:'Varios', image:'https://images.unsplash.com/photo-1594631252845-29fc4586c56f?auto=format&fit=crop&q=80&w=400', price:15900, oldPrice:21000, desc:'Pieza de exhibición para tu vitrina.' },
  { id:64, name:'Caja Vintage con Tapa',           cat:'Varios', image:'https://images.unsplash.com/photo-1513519247352-4d766cf02224?auto=format&fit=crop&q=80&w=400', price:9900,  oldPrice:13500, desc:'Para guardar y decorar a la vez.' },
  { id:65, name:'Set de Platos Decorativos',       cat:'Varios', image:'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400', price:24000, oldPrice:30000, desc:'Para colgar o decorar la mesa, piezas únicas.' },
  { id:66, name:'Adorno de Estante Antiguo',       cat:'Varios', image:'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=400', price:13500, oldPrice:17000, desc:'Detalle elegante para rincones especiales.' },
];

let cart = JSON.parse(localStorage.getItem('cachureos-clau-cart') || '[]');
let currentCategory = 'Todos';
let modalProduct = null;
let modalQty = 1;
let wished = new Set();

/* ═══════════════════════════════════════
   RENDER PRODUCTS
═══════════════════════════════════════ */
function formatPrice(n) {
  return '$' + n.toLocaleString('es-CL');
}

function renderProducts(list, gridId = 'productsGrid') {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  if (!list.length) {
    grid.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:3rem;">No se encontraron productos.</p>';
setTimeout(() => updateCarouselProgress(gridId), 50);
    return;
  }
  list.forEach((p, i) => {
    const disc = p.oldPrice ? Math.round((1 - p.price/p.oldPrice)*100) : 0;
    const badgeHtml = p.badge === 'new'  ? '<span class="product-badge badge-new">Nuevo</span>' :
                      p.badge === 'sale' ? `<span class="product-badge badge-sale">-${disc}%</span>` : '';
    const oldPriceHtml = p.oldPrice ? `<span class="product-price-old">${formatPrice(p.oldPrice)}</span>` : '';
    const saveHtml = disc ? `<span class="product-price-save">-${disc}%</span>` : '';
    const isWished = wished.has(p.id);
    grid.innerHTML += `
      <div class="product-card" style="animation:fadeUp .5s ease ${i*0.05}s both" onclick="openModal(${p.id})">
        <div class="product-img-wrap">
          ${badgeHtml}
          <div class="product-img" style="background: url('${catImage(p.cat)}') center/cover no-repeat"></div>
          <div class="product-actions">
            <button class="btn-cart" onclick="event.stopPropagation(); addToCart(${p.id})">🛍️ Agregar</button>
            <button class="btn-wish ${isWished?'wished':''}" id="wish-${p.id}" onclick="event.stopPropagation(); toggleWish(${p.id})">
              ${isWished ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
        <div class="product-info">
          <p class="product-cat">${p.cat}</p>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-price-row">
            <span class="product-price">${formatPrice(p.price)}</span>
            ${oldPriceHtml}
            ${saveHtml}
          </div>
        </div>
      </div>`;
  });
  setTimeout(() => updateCarouselProgress(gridId), 50);
}

function catColor(cat) {
  const map = { 
    'Cachureos Europeos':'#EDE3F7', 
    'Loza y Menaje':'#F7EFDC',
    'Varios':'#EFE7F7'
  };
  return map[cat] || '#f0ede8';
}

function catImage(cat) {
  const map = {
    'Cachureos Europeos':'assets/img/tea_coffee.png',
    'Loza y Menaje':'assets/img/vajilla.png',
    'Varios':'assets/img/tea_coffee.png'
  };
  return map[cat] || 'assets/img/hero.png';
}

const CATS = ['Cachureos Europeos', 'Loza y Menaje', 'Varios'];
const CAT_GRID = {
  'Cachureos Europeos': 'productsGrid-ce',
  'Loza y Menaje': 'productsGrid-lym',
  'Varios': 'productsGrid-varios'
};

function getCategoryList(cat) {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  let list = PRODUCTS.filter(p => p.cat === cat);
  if (q) {
    list = list.filter(p => (p.name || '').toLowerCase().includes(q) || (p.cat || '').toLowerCase().includes(q));
  }
  const val = document.getElementById('sortSelect')?.value;
  if (val === 'price-asc')  list.sort((a,b) => a.price - b.price);
  if (val === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (val === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));
  return list;
}

function renderAll() {
  CATS.forEach(cat => {
    renderProducts(getCategoryList(cat), CAT_GRID[cat]);
  });
}

function filterByCategory(cat) {
  // Desde las tarjetas de categoría → scroll al carrusel correspondiente
  const gridId = CAT_GRID[cat];
  const block = gridId ? document.getElementById(gridId)?.closest('.carousel-block') : null;
  (block || document.getElementById('catalogo')).scrollIntoView({ behavior: 'smooth' });
}

function sortProducts() {
  renderAll();
}

function searchProducts() {
  renderAll();
}

/* ─── PROGRESO DEL CARRUSEL (móvil) ─── */
function carouselBarId(gridId) {
  return 'carouselProgressBar-' + gridId.replace('productsGrid-', '');
}
function updateCarouselProgress(gridId = 'productsGrid-ce', barId = null) {
  const grid = document.getElementById(gridId);
  const bar = document.getElementById(barId || carouselBarId(gridId));
  if (!grid || !bar) return;
  const max = grid.scrollWidth - grid.clientWidth;
  const pct = max > 0 ? (grid.scrollLeft / max) * 100 : 0;
  bar.style.width = pct + '%';
}
function updateAllProgress() {
  CATS.forEach(cat => updateCarouselProgress(CAT_GRID[cat]));
}

/* ═══════════════════════════════════════
   CART
═══════════════════════════════════════ */
function saveCart() {
  localStorage.setItem('cachureos-clau-cart', JSON.stringify(cart));
}

function addToCart(id, qty = 1) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ ...p, qty });
  saveCart();
  updateCartUI();
  bump();
  showToast(`✅ ${p.name} agregado`);
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCartUI(); }
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.textContent = total;
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (!itemsEl) return;

  if (!cart.length) {
    itemsEl.innerHTML = `<div class="cart-empty">
      <div class="cart-empty-icon">🛒</div>
      <h4>Tu carrito está vacío</h4>
      <p>Explora el catálogo y agrega los productos que más te gusten.</p>
    </div>`;
    if (footerEl) footerEl.style.display = 'none';
    return;
  }
  if (footerEl) footerEl.style.display = 'block';
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl) totalEl.textContent = formatPrice(subtotal);

  itemsEl.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-img" style="background: url('${catImage(i.cat)}') center/cover no-repeat"></div>
      <div class="cart-item-body">
        <p class="cart-item-name">${i.name}</p>
        <p class="cart-item-cat">${i.cat}</p>
        <div class="cart-item-row">
          <div class="qty-ctrl">
            <button class="qty-btn" onclick="changeQty(${i.id},-1)">−</button>
            <span class="qty-num">${i.qty}</span>
            <button class="qty-btn" onclick="changeQty(${i.id},1)">+</button>
          </div>
          <span class="cart-item-price">${formatPrice(i.price * i.qty)}</span>
          <button class="cart-item-del" onclick="removeFromCart(${i.id})" title="Eliminar">🗑️</button>
        </div>
      </div>
    </div>`).join('');
}

function bump() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
}

function openCart()  { 
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.add('open'); 
  if (overlay) overlay.classList.add('open'); 
  document.body.style.overflow='hidden'; 
}
function closeCart() { 
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.remove('open'); 
  if (overlay) overlay.classList.remove('open'); 
  document.body.style.overflow=''; 
}

function checkout() {
  if (!cart.length) return;
  const lines = cart.map(i => `• ${i.qty}x ${i.name} – ${formatPrice(i.price * i.qty)}`).join('\n');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const subject = encodeURIComponent('Pedido Claudia Ventas');
  const body = encodeURIComponent(
    `Hola Claudia Ventas! Quiero hacer el siguiente pedido:\n\n${lines}\n\nTotal: ${formatPrice(total)}\n\nAdjunto el comprobante de la transferencia bancaria en cuanto lo coordine.`
  );
  window.open(`mailto:paredes.claudia2008@gmail.com?subject=${subject}&body=${body}`, '_self');
  showToast('📧 Envía tu pedido por correo (solo pago por transferencia)');
}

/* ═══════════════════════════════════════
   MODAL
═══════════════════════════════════════ */
function openModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  modalProduct = p;
  modalQty = 1;
  document.getElementById('modalImg').textContent = '';
  document.getElementById('modalImg').style.background = `url('${catImage(p.cat)}') center/cover no-repeat`;
  document.getElementById('modalCat').textContent = p.cat;
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalPrice').textContent = formatPrice(p.price) + (p.oldPrice ? ` · Antes ${formatPrice(p.oldPrice)}` : '');
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalQtyNum').textContent = 1;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModalDirect();
}
function closeModalDirect() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}
function changeModalQty(d) {
  modalQty = Math.max(1, modalQty + d);
  document.getElementById('modalQtyNum').textContent = modalQty;
}
function addFromModal() {
  if (!modalProduct) return;
  addToCart(modalProduct.id, modalQty);
  closeModalDirect();
}

/* ═══════════════════════════════════════
   WISHLIST
═══════════════════════════════════════ */
function toggleWish(id) {
  if (wished.has(id)) { wished.delete(id); showToast('💔 Quitado de favoritos'); }
  else                { wished.add(id);    showToast('❤️ Guardado en favoritos'); }
  const btn = document.getElementById(`wish-${id}`);
  if (btn) {
    btn.classList.toggle('wished');
    btn.textContent = wished.has(id) ? '❤️' : '🤍';
  }
}

/* ═══════════════════════════════════════
   TOAST
═══════════════════════════════════════ */
function showToast(msg) {
  const c = document.getElementById('toastContainer');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 2700);
}

/* ═══════════════════════════════════════
   MOBILE MENU (simple)
═══════════════════════════════════════ */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileMenuOverlay');
  if (menu && overlay) {
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      menu.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      menu.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
}

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  await loadPricesFromAPI();
  // Páginas sin catálogo (envios.html) no tienen estos elementos → guards
  if (document.getElementById('productsGrid-ce')) {
    renderAll();
    const si = document.getElementById('searchInput');
    if (si) si.addEventListener('input', searchProducts);
    CATS.forEach(cat => {
      const grid = document.getElementById(CAT_GRID[cat]);
      if (grid) {
        grid.addEventListener('scroll', () => updateCarouselProgress(CAT_GRID[cat]));
        grid.addEventListener('touchmove', () => updateCarouselProgress(CAT_GRID[cat]));
      }
    });
    window.addEventListener('resize', updateAllProgress);
    setTimeout(updateAllProgress, 100);
    setTimeout(updateAllProgress, 400);
  }
  if (document.getElementById('cartSidebar')) updateCartUI();
});
