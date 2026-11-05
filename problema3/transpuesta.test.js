'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { transponer } = require('./transpuesta');

test('ejemplo del PDF: matriz cuadrada 3×3', () => {
  assert.deepEqual(transponer([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
});

test('cada elemento queda en su posición: XT[j][i] === X[i][j]', () => {
  const X = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
  const XT = transponer(X);
  X.forEach((fila, i) => fila.forEach((valor, j) => assert.equal(XT[j][i], valor)));
});

test('matriz rectangular 2×3 → 3×2', () => {
  assert.deepEqual(transponer([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]]);
});

test('matriz rectangular 3×2 → 2×3', () => {
  assert.deepEqual(transponer([[1, 2], [3, 4], [5, 6]]), [[1, 3, 5], [2, 4, 6]]);
});

test('una sola fila → una sola columna', () => {
  assert.deepEqual(transponer([[1, 2, 3]]), [[1], [2], [3]]);
});

test('una sola columna → una sola fila', () => {
  assert.deepEqual(transponer([[1], [2], [3]]), [[1, 2, 3]]);
});

test('matriz 1×1', () => {
  assert.deepEqual(transponer([[42]]), [[42]]);
});

test('matriz vacía y filas sin columnas', () => {
  assert.deepEqual(transponer([]), []);
  assert.deepEqual(transponer([[], []]), []);
});

test('transponer dos veces devuelve la matriz original', () => {
  const X = [[1, 2, 3], [4, 5, 6]];
  assert.deepEqual(transponer(transponer(X)), X);
});

test('el resultado es una lista de listas nueva y la original no cambia', () => {
  const X = [[1, 2], [3, 4]];
  const XT = transponer(X);
  assert.deepEqual(X, [[1, 2], [3, 4]]);
  assert.ok(Array.isArray(XT) && XT.every(Array.isArray));
  assert.notEqual(XT, X);
});

test('funciona con elementos que no son números', () => {
  assert.deepEqual(transponer([['a', 'b'], ['c', 'd']]), [['a', 'c'], ['b', 'd']]);
});

test('filas de diferentes longitudes producen un error explicativo', () => {
  assert.throws(() => transponer([[1, 2, 3], [4, 5]]), /la fila 0 tiene 3 elemento\(s\) y la fila 1 tiene 2/);
  assert.throws(() => transponer([[1], [2, 3], [4]]), /fila 1 tiene 2/);
});

test('entradas que no son lista de listas', () => {
  assert.throws(() => transponer('matriz'), TypeError);
  assert.throws(() => transponer([1, 2, 3]), TypeError);
  assert.throws(() => transponer([[1], 2]), TypeError);
});
