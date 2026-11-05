'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { eliminarElementos, noEncontrados, COLORES } = require('./eliminar');

test('ejemplo del PDF', () => {
  assert.deepEqual(
    eliminarElementos(COLORES, ['amarillo', 'cafe', 'blanco']),
    ['rojo', 'verde', 'azul', 'gris', 'negro']
  );
});

test("'cafe' no está en la lista: se ignora sin error", () => {
  assert.deepEqual(eliminarElementos(COLORES, ['cafe']), COLORES);
  assert.deepEqual(noEncontrados(COLORES, ['amarillo', 'cafe', 'blanco']), ['cafe']);
});

test('eliminación de varios elementos manteniendo el orden relativo', () => {
  assert.deepEqual(eliminarElementos(COLORES, ['negro', 'rojo', 'gris']), ['verde', 'azul', 'amarillo', 'blanco']);
});

test('lista de eliminación vacía devuelve todos los elementos', () => {
  assert.deepEqual(eliminarElementos(COLORES, []), COLORES);
});

test('lista original vacía devuelve lista vacía', () => {
  assert.deepEqual(eliminarElementos([], ['rojo']), []);
  assert.deepEqual(eliminarElementos([], []), []);
});

test('eliminar todos los elementos', () => {
  assert.deepEqual(eliminarElementos(COLORES, [...COLORES]), []);
});

test('elementos repetidos en la lista original: se eliminan todas las apariciones', () => {
  assert.deepEqual(eliminarElementos(['a', 'b', 'a', 'c', 'a'], ['a']), ['b', 'c']);
});

test('repetidos en la lista original que NO se borran se conservan', () => {
  assert.deepEqual(eliminarElementos(['x', 'y', 'x', 'z'], ['z']), ['x', 'y', 'x']);
});

test('elementos repetidos en la lista a borrar no causan problemas', () => {
  assert.deepEqual(eliminarElementos(['a', 'b', 'c'], ['b', 'b', 'b']), ['a', 'c']);
});

test('no modifica las listas originales', () => {
  const lista = [...COLORES];
  const aBorrar = ['amarillo', 'cafe'];
  const resultado = eliminarElementos(lista, aBorrar);
  assert.deepEqual(lista, COLORES);
  assert.deepEqual(aBorrar, ['amarillo', 'cafe']);
  assert.notEqual(resultado, lista);
});

test('la comparación es exacta (mayúsculas y tipos importan)', () => {
  assert.deepEqual(eliminarElementos(['Rojo', 'rojo'], ['rojo']), ['Rojo']);
  assert.deepEqual(eliminarElementos([1, '1', 2], [1]), ['1', 2]);
});

test('entradas inválidas', () => {
  assert.throws(() => eliminarElementos('rojo', ['rojo']), TypeError);
  assert.throws(() => eliminarElementos(['rojo'], 'rojo'), TypeError);
});
