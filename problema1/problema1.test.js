'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const p = require('./problema1');

const normalForm = (src) => {
  const { steps, normal } = p.reduceSteps(p.parse(src));
  assert.ok(normal, `${src} debería tener forma normal`);
  return { term: steps.at(-1).term, betaSteps: steps.length - 1 };
};

test('NOT TRUE se reduce a FALSE en 3 pasos β', () => {
  const { term, betaSteps } = normalForm('NOT TRUE');
  assert.ok(p.alphaEq(term, p.DEFS.FALSE));
  assert.equal(betaSteps, 3);
});

test('NOT FALSE se reduce a TRUE', () => {
  assert.ok(p.alphaEq(normalForm('NOT FALSE').term, p.DEFS.TRUE));
});

test('doble negación: NOT (NOT TRUE) = TRUE y NOT (NOT FALSE) = FALSE', () => {
  assert.ok(p.alphaEq(normalForm('NOT (NOT TRUE)').term, p.DEFS.TRUE));
  assert.ok(p.alphaEq(normalForm('NOT (NOT FALSE)').term, p.DEFS.FALSE));
});

test('la definición alternativa NOT2 da los mismos resultados (salvo α)', () => {
  assert.ok(p.alphaEq(normalForm('NOT2 TRUE').term, p.DEFS.FALSE));
  assert.ok(p.alphaEq(normalForm('NOT2 FALSE').term, p.DEFS.TRUE));
});

test('el primer paso de NOT TRUE sustituye b := TRUE', () => {
  const [, first] = p.reduceSteps(p.parse('NOT TRUE')).steps;
  assert.equal(first.param, 'b');
  assert.equal(p.show(first.term), 'TRUE FALSE TRUE');
});

test('Y g no tiene forma normal y se despliega como g (g (...))', () => {
  const { steps, normal } = p.reduceSteps(p.parse('Y g'), 10);
  assert.equal(normal, false);
  assert.match(p.show(steps[2].term), /^g \(/);
});

test('la sustitución evita la captura de variables', () => {
  // (λx.λy.x) y  →β  λy'.y   (y NO debe quedar ligada)
  const { term } = normalForm('(λx.λy.x) y');
  assert.equal(term.tag, 'abs');
  assert.notEqual(term.param, 'y');
  assert.deepEqual(term.body, p.Var('y'));
});

test('alphaEq distingue renombramientos válidos de términos distintos', () => {
  assert.ok(p.alphaEq(p.parse('λa.λb.a'), p.parse('λx.λy.x')));
  assert.ok(!p.alphaEq(p.parse('λa.λb.a'), p.parse('λx.λy.y')));
});

test('el parser rechaza expresiones mal formadas', () => {
  assert.throws(() => p.parse('λx x'), SyntaxError);
  assert.throws(() => p.parse('(λx.x'), SyntaxError);
  assert.throws(() => p.parse('x + y'), SyntaxError);
});

test('booleanos de Church con lambdas de JavaScript', () => {
  assert.equal(p.aBooleano(p.not(p.verdadero)), false);
  assert.equal(p.aBooleano(p.not(p.falso)), true);
  assert.equal(p.aBooleano(p.not(p.not(p.verdadero))), true);
});

test('recursión: factorial directo, con Z, y Y desborda la pila', () => {
  assert.equal(p.factorial(0), 1);
  assert.equal(p.factorial(5), 120);
  assert.equal(p.factorialZ(5), 120);
  assert.equal(p.factorialZ(10), p.factorial(10));
  assert.throws(() => p.Y((self) => (n) => (n === 0 ? 1 : n * self(n - 1)))(5), RangeError);
});

test('ciclos: las tres formas de sumar coinciden', () => {
  for (const n of [0, 1, 10, 100]) {
    const esperado = (n * (n + 1)) / 2;
    assert.equal(p.sumaImperativa(n), esperado);
    assert.equal(p.sumaRecursiva(n), esperado);
    assert.equal(p.sumaReduce(n), esperado);
  }
  assert.deepEqual(p.rango(1, 5), [1, 2, 3, 4, 5]);
});

test('numerales de Church como ciclos', () => {
  assert.equal(p.aEntero(p.cero), 0);
  assert.equal(p.aEntero(p.tres), 3);
  assert.equal(p.tres((s) => s + '*')(''), '***');
});
