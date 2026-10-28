export const money = value => `S/ ${value.toFixed(2)}`;
export const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function cleanCart(raw, products) {
  if (!Array.isArray(raw)) return [];
  const result = [];
  for (const item of raw) {
    const product = products.find(p => p.id === item?.id && p.disponible);
    if (!product || !product.colores.includes(item.color) || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
    const existing = result.find(row => row.id === item.id && row.color === item.color);
    if (existing) existing.quantity = Math.min(99, existing.quantity + item.quantity);
    else result.push({ id: item.id, color: item.color, quantity: Math.min(99, item.quantity) });
  }
  return result;
}
export const total = (cart, products) => cart.reduce((sum, row) => sum + products.find(p => p.id === row.id).precio * row.quantity, 0);
export function orderMessage(cart, products) {
  return ['¡Hola, STLN3D! Quisiera hacer este pedido:', '', ...cart.map(row => {
    const product = products.find(p => p.id === row.id);
    return `• ${row.quantity} × ${product.nombre} | Color: ${row.color} | ${money(product.precio * row.quantity)}`;
  }), '', `Subtotal: ${money(total(cart, products))}`, '¿Me confirman disponibilidad, envío y forma de pago?'].join('\n');
}
