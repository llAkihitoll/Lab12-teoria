'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { ordenarPorClave, TELEFONOS } = require('./ordenar');

test("ejemplo del PDF: ordenar por 'model'", () => {
  assert.deepEqual(ordenarPorClave(TELEFONOS, 'model'), [
    { make: 'Mi Max', model: 2, color: 'Gold' },
    { make: 'Samsung', model: 7, color: 'Blue' },
    { make: 'Nokia', model: 216, color: 'Black' },
  ]);
});

test('los números se comparan por valor y no como texto (2 < 7 < 216)', () => {
  const modelos = ordenarPorClave(TELEFONOS, 'model').map((d) => d.model);
  assert.deepEqual(modelos, [2, 7, 216]);
});

test("otras claves: 'make' y 'color' (texto, orden alfabético)", () => {
  assert.deepEqual(ordenarPorClave(TELEFONOS, 'make').map((d) => d.make), ['Mi Max', 'Nokia', 'Samsung']);
  assert.deepEqual(ordenarPorClave(TELEFONOS, 'color').map((d) => d.color), ['Black', 'Blue', 'Gold']);
});

test('no modifica la lista original ni los diccionarios', () => {
  const copia = structuredClone(TELEFONOS);
  const resultado = ordenarPorClave(TELEFONOS, 'model');
  assert.deepEqual(TELEFONOS, copia);
  assert.notEqual(resultado, TELEFONOS);
  // los diccionarios conservan todos sus datos
  resultado.forEach((dic) => assert.ok(TELEFONOS.includes(dic)));
});

test('lista vacía devuelve lista vacía', () => {
  assert.deepEqual(ordenarPorClave([], 'model'), []);
});

test('lista de un elemento', () => {
  assert.deepEqual(ordenarPorClave([{ a: 1 }], 'a'), [{ a: 1 }]);
});

test('valores repetidos conservan su orden relativo (orden estable)', () => {
  const lista = [
    { nombre: 'Ana', edad: 30 },
    { nombre: 'Luis', edad: 25 },
    { nombre: 'Eva', edad: 30 },
    { nombre: 'Juan', edad: 25 },
  ];
  assert.deepEqual(ordenarPorClave(lista, 'edad').map((d) => d.nombre), ['Luis', 'Juan', 'Ana', 'Eva']);
});

test('números negativos y decimales', () => {
  const lista = [{ v: 1.5 }, { v: -3 }, { v: 0 }, { v: -3.5 }];
  assert.deepEqual(ordenarPorClave(lista, 'v').map((d) => d.v), [-3.5, -3, 0, 1.5]);
});

test('clave inexistente produce un error claro', () => {
  assert.throws(() => ordenarPorClave(TELEFONOS, 'precio'), /La clave 'precio' no existe en 3/);
  assert.throws(() => ordenarPorClave([{ a: 1 }, { b: 2 }], 'a'), /no existe en 1/);
});

test('entradas inválidas', () => {
  assert.throws(() => ordenarPorClave('no es lista', 'a'), TypeError);
  assert.throws(() => ordenarPorClave([null], 'a'), /no existe/);
  assert.throws(() => ordenarPorClave([{ a: 1 }, { a: 'x' }], 'a'), TypeError);
});
