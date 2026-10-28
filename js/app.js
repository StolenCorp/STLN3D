import { money, normalize, cleanCart, total, orderMessage } from './cart.js';
const $ = selector => document.querySelector(selector);
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const STORAGE = 'stln3d-cart-v1';
let products = [], cart = [], category = 'Todos', config = {}, toastTimer;
$('#year').textContent = new Date().getFullYear();
function notify(message) {
  $('#toast').textContent = message;
  $('#toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').hidden = true, 3000);
}
function save() {
  try { localStorage.setItem(STORAGE, JSON.stringify(cart)); }
  catch { notify('Tu carrito se conservará mientras esta página esté abierta.'); }
  renderCart();
}
function renderProducts() {
  const query = normalize($('#search').value.trim());
  const shown = products.filter(p => (category === 'Todos' || p.categoria === category) && normalize(p.nombre).includes(query));
  $('#result-count').textContent = `${shown.length} ${shown.length === 1 ? 'pieza' : 'piezas'}`;
  $('#products').innerHTML = shown.length ? shown.map(p => `<article class="product-card"><button class="product-image" data-detail="${escape(p.id)}" aria-label="Ver ${escape(p.nombre)}"><img src="${escape(p.imagenes[0])}" alt="Ilustración de ${escape(p.nombre)}" width="400" height="400" loading="lazy">${p.destacado ? '<span class="badge">FAVORITO DE LA CASA</span>' : ''}</button><div class="product-meta"><h3><button data-detail="${escape(p.id)}">${escape(p.nombre)}</button></h3><p>${money(p.precio)}</p></div><p class="product-category">${escape(p.categoria)} · Impresión 3D</p><div class="card-bottom"><select aria-label="Color de ${escape(p.nombre)}" id="color-${escape(p.id)}">${p.colores.map(color => `<option>${escape(color)}</option>`).join('')}</select><button class="add-button" data-add="${escape(p.id)}" ${p.disponible ? '' : 'disabled'}>${p.disponible ? 'Agregar +' : 'No disponible'}</button></div></article>`).join('') : '<div class="empty-state"><p>No encontramos piezas con esa búsqueda.</p><button id="reset-filters">Ver toda la colección</button></div>';
}
function renderCategories() {
  $('#categories').innerHTML = ['Todos', ...new Set(products.map(p => p.categoria))].map(name => `<button data-category="${escape(name)}" aria-pressed="${category === name}">${escape(name)}</button>`).join('');
}
function renderCart() {
  $('#cart-count').textContent = cart.reduce((sum, row) => sum + row.quantity, 0);
  $('#cart-total').textContent = money(total(cart, products));
  $('#checkout').disabled = !cart.length || !/^51\d{9}$/.test(config.whatsapp || '');
  $('#checkout-note').textContent = !/^51\d{9}$/.test(config.whatsapp || '') ? 'Tienda en preparación. Los pedidos estarán disponibles pronto.' : '';
  $('#cart-items').innerHTML = cart.length ? cart.map((row, index) => {
    const p = products.find(p => p.id === row.id);
    return `<article class="cart-line"><img src="${escape(p.imagenes[0])}" alt="${escape(p.nombre)}" width="75" height="75"><div><div class="line-heading"><h3>${escape(p.nombre)}</h3><button class="remove" data-remove="${index}" aria-label="Quitar ${escape(p.nombre)}">Quitar</button></div><select data-color="${index}" aria-label="Color de ${escape(p.nombre)}">${p.colores.map(color => `<option ${row.color === color ? 'selected' : ''}>${escape(color)}</option>`).join('')}</select><div class="quantity-row"><div class="quantity"><button data-quantity="${index}" data-delta="-1" aria-label="Reducir cantidad de ${escape(p.nombre)}">−</button><span>${row.quantity}</span><button data-quantity="${index}" data-delta="1" ${row.quantity >= 99 ? 'disabled' : ''} aria-label="Aumentar cantidad de ${escape(p.nombre)}">+</button></div><strong>${money(p.precio * row.quantity)}</strong></div></div></article>`;
  }).join('') : '<div class="empty-state">Tu carrito está esperando tus primeras piezas.</div>';
}
function add(id, color) {
  const p = products.find(p => p.id === id);
  if (!p?.disponible || !p.colores.includes(color)) return;
  const existing = cart.find(row => row.id === id && row.color === color);
  if (existing?.quantity >= 99) return notify('Máximo 99 unidades por color.');
  if (existing) existing.quantity++;
  else cart.push({ id, color, quantity: 1 });
  save();
  notify(`${p.nombre} agregado al carrito`);
}
function detail(id) {
  const p = products.find(p => p.id === id);
  $('#product-detail').innerHTML = `<div class="detail-layout"><div class="detail-gallery"><img id="gallery-main" src="${escape(p.imagenes[0])}" alt="${escape(p.nombre)}"><div class="thumbnails">${p.imagenes.map((src, index) => `<button data-image="${escape(src)}" aria-label="Ver imagen ${index + 1}"><img src="${escape(src)}" alt="Vista ${index + 1}" width="55" height="55"></button>`).join('')}</div></div><div class="detail-copy"><p class="eyebrow">${escape(p.categoria)} · STLN3D</p><h2 id="detail-title">${escape(p.nombre)}</h2><p class="detail-price">${money(p.precio)}</p><p>${escape(p.descripcion)}</p><label for="detail-color">Elige tu color</label><select id="detail-color">${p.colores.map(color => `<option>${escape(color)}</option>`).join('')}</select><button class="button button-dark" data-detail-add="${escape(p.id)}" ${p.disponible ? '' : 'disabled'}>${p.disponible ? 'Agregar al carrito +' : 'No disponible'}</button><p>Imagen ilustrativa. Confirma los detalles del producto al hacer tu pedido.</p></div></div>`;
  $('#product-dialog').showModal();
}
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.close) document.getElementById(button.dataset.close).close();
  if (button.id === 'open-cart') $('#cart-dialog').showModal();
  if (button.dataset.category) { category = button.dataset.category; renderCategories(); renderProducts(); }
  if (button.id === 'reset-filters') { category = 'Todos'; $('#search').value = ''; renderCategories(); renderProducts(); }
  if (button.dataset.detail) detail(button.dataset.detail);
  if (button.dataset.add) add(button.dataset.add, document.getElementById(`color-${button.dataset.add}`).value);
  if (button.dataset.detailAdd) add(button.dataset.detailAdd, $('#detail-color').value);
  if (button.dataset.image) $('#gallery-main').src = button.dataset.image;
  if (button.dataset.remove !== undefined) { cart.splice(Number(button.dataset.remove), 1); save(); }
  if (button.dataset.quantity !== undefined) {
    const index = Number(button.dataset.quantity);
    cart[index].quantity += Number(button.dataset.delta);
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    save();
  }
  if (button.id === 'checkout' && cart.length && /^51\d{9}$/.test(config.whatsapp || '')) window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(orderMessage(cart, products))}`, '_blank', 'noopener,noreferrer');
});
document.addEventListener('change', event => {
  if (event.target.dataset.color !== undefined) {
    cart[Number(event.target.dataset.color)].color = event.target.value;
    cart = cleanCart(cart, products);
    save();
  }
});
$('#search').addEventListener('input', renderProducts);
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
}));
async function init() {
  try {
    const response = await fetch('productos.json');
    if (!response.ok) throw new Error('Catálogo no disponible');
    products = await response.json();
    if (!Array.isArray(products) || products.some(p => !/^[a-z0-9-]+$/.test(p.id) || typeof p.nombre !== 'string' || typeof p.categoria !== 'string' || !Number.isFinite(p.precio) || p.precio < 0 || !Array.isArray(p.imagenes) || !p.imagenes.length || p.imagenes.some(src => !/^img\/[a-zA-Z0-9_.-]+$/.test(src)) || !Array.isArray(p.colores) || !p.colores.length || p.colores.some(c => typeof c !== 'string'))) throw new Error('Formato inválido');
    products.sort((a, b) => Number(b.destacado) - Number(a.destacado));
    try { const response = await fetch('config.json'); if (response.ok) config = await response.json(); } catch { /* El catálogo funciona sin configuración de venta. */ }
    try { cart = cleanCart(JSON.parse(localStorage.getItem(STORAGE) || '[]'), products); } catch { cart = []; }
    renderCategories(); renderProducts(); renderCart();
  } catch {
    $('#products').innerHTML = '<div class="empty-state"><p>No pudimos cargar la colección. Intenta recargar la página.</p></div>';
    $('#checkout').disabled = true;
  }
}
init();
