import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanCart, orderMessage, total, normalize } from '../js/cart.js';
const products = [{ id: 'geo', nombre: 'Maceta Geo', precio: 35, disponible: true, colores: ['Arena', 'Negro'] }, { id: 'no', disponible: false }];
test('recupera carrito, descarta productos y cantidades inválidas y fusiona colores repetidos', () => {
  assert.deepEqual(cleanCart([{ id: 'geo', color: 'Arena', quantity: 2 }, { id: 'geo', color: 'Arena', quantity: 3 }, { id: 'geo', color: 'Azul', quantity: 1 }, { id: 'no', quantity: 2 }, null, { id: 'geo', color: 'Negro', quantity: -1 }], products), [{ id: 'geo', color: 'Arena', quantity: 5 }]);
  assert.deepEqual(cleanCart({}, products), []);
});
test('mensaje incluye cantidades, colores y subtotal correcto al codificarse para WhatsApp', () => {
  const cart = [{ id: 'geo', color: 'Arena', quantity: 2 }, { id: 'geo', color: 'Negro', quantity: 1 }];
  assert.equal(total(cart, products), 105);
  const message = decodeURIComponent(encodeURIComponent(orderMessage(cart, products)));
  assert.match(message, /2 × Maceta Geo \| Color: Arena \| S\/ 70.00/);
  assert.match(message, /Subtotal: S\/ 105.00/);
});
test('búsqueda ignora acentos y mayúsculas', () => assert.equal(normalize('ÓRBITA'), 'orbita'));
