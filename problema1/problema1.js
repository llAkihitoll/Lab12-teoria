'use strict';
/**
 * Laboratorio 12 — Teoría de la Computación
 * Problema 1: cálculo lambda y programación funcional en JavaScript.
 *
 *   Parte A: reducción-β de NOT con booleanos de Church. Se usa un pequeño
 *            reductor de cálculo lambda que calcula cada paso (no son textos fijos).
 *   Parte B: recursión (directa, combinadores Y/Z) y ciclos (recursión de cola,
 *            funciones de orden superior y numerales de Church).
 *
 * Ejecución:  node problema1/problema1.js
 */

// ═══════════════════════════════════════════════════════════════════════════
// Reductor de cálculo lambda
// ═══════════════════════════════════════════════════════════════════════════

// Términos: variable, abstracción (λx.M) y aplicación (M N)
const Var = (name) => ({ tag: 'var', name });
const Abs = (param, body) => ({ tag: 'abs', param, body });
const App = (fn, arg) => ({ tag: 'app', fn, arg });

// Definiciones con nombre (TRUE, FALSE, NOT, ...). Se llenan más abajo.
const DEFS = {};

/**
 * Convierte texto como "λx.λy.x" o "NOT TRUE" en un término.
 * Acepta "λ" o "\" como lambda. Los nombres que aparecen en DEFS se expanden.
 */
function parse(source, defs = DEFS) {
  const tokens = source.match(/λ|\\|\.|\(|\)|[A-Za-z_][A-Za-z0-9_']*/g) || [];
  if (tokens.join('') !== source.replace(/\s+/g, '')) {
    throw new SyntaxError(`Caracteres no válidos en: ${source}`);
  }
  let pos = 0;
  const peek = () => tokens[pos];
  const isLambda = (t) => t === 'λ' || t === '\\';
  const expect = (t) => {
    if (tokens[pos++] !== t) throw new SyntaxError(`Se esperaba "${t}" en: ${source}`);
  };

  const parseTerm = () => {
    if (isLambda(peek())) {
      pos++;
      const params = [];
      while (peek() !== '.') {
        if (peek() === undefined) throw new SyntaxError(`Falta "." en: ${source}`);
        params.push(tokens[pos++]);
      }
      expect('.');
      const body = parseTerm();
      return params.reduceRight((acc, p) => Abs(p, acc), body); // λx y.M = λx.λy.M
    }
    // Aplicación: asociativa a la izquierda (M N P = (M N) P)
    let term = parseAtom();
    while (pos < tokens.length && peek() !== ')') {
      if (isLambda(peek())) return App(term, parseTerm()); // la lambda llega hasta el final
      term = App(term, parseAtom());
    }
    return term;
  };

  const parseAtom = () => {
    const tok = tokens[pos++];
    if (tok === '(') {
      const inner = parseTerm();
      expect(')');
      return inner;
    }
    if (tok === undefined || tok === ')' || tok === '.') {
      throw new SyntaxError(`Expresión incompleta: ${source}`);
    }
    return defs[tok] ?? Var(tok);
  };

  const term = parseTerm();
  if (pos !== tokens.length) throw new SyntaxError(`Sobran símbolos en: ${source}`);
  return term;
}

const freeVars = (t) => {
  switch (t.tag) {
    case 'var': return new Set([t.name]);
    case 'abs': { const s = freeVars(t.body); s.delete(t.param); return s; }
    case 'app': return new Set([...freeVars(t.fn), ...freeVars(t.arg)]);
  }
};

const freshName = (base, used) => {
  let name = `${base}'`;
  while (used.has(name)) name += "'";
  return name;
};

/** Sustitución M[x := N] evitando la captura de variables (renombramiento α). */
function subst(t, x, n) {
  switch (t.tag) {
    case 'var':
      return t.name === x ? n : t;
    case 'app':
      return App(subst(t.fn, x, n), subst(t.arg, x, n));
    case 'abs': {
      if (t.param === x || !freeVars(t.body).has(x)) return t;
      if (freeVars(n).has(t.param)) {
        const fresh = freshName(t.param, new Set([...freeVars(n), ...freeVars(t.body)]));
        return Abs(fresh, subst(subst(t.body, t.param, Var(fresh)), x, n));
      }
      return Abs(t.param, subst(t.body, x, n));
    }
  }
}

/**
 * Un paso de reducción-β en orden normal (se reduce primero el redex
 * más externo y a la izquierda). Devuelve null si ya está en forma normal.
 */
function step(t) {
  if (t.tag === 'app' && t.fn.tag === 'abs') {
    return { term: subst(t.fn.body, t.fn.param, t.arg), param: t.fn.param, arg: t.arg };
  }
  if (t.tag === 'app') {
    const left = step(t.fn);
    if (left) return { ...left, term: App(left.term, t.arg) };
    const right = step(t.arg);
    if (right) return { ...right, term: App(t.fn, right.term) };
  }
  if (t.tag === 'abs') {
    const inner = step(t.body);
    if (inner) return { ...inner, term: Abs(t.param, inner.term) };
  }
  return null;
}

/** Reduce hasta la forma normal o hasta maxSteps pasos. */
function reduceSteps(term, maxSteps = 50) {
  const steps = [{ term }];
  let current = term;
  for (let i = 0; i < maxSteps; i++) {
    const next = step(current);
    if (!next) return { steps, normal: true };
    steps.push(next);
    current = next.term;
  }
  return { steps, normal: step(current) === null };
}

/** Igualdad salvo renombramiento de variables ligadas (α-equivalencia). */
function alphaEq(a, b, env = []) {
  if (a.tag !== b.tag) return false;
  switch (a.tag) {
    case 'var':
      for (let i = env.length - 1; i >= 0; i--) {
        const [x, y] = env[i];
        if (x === a.name || y === b.name) return x === a.name && y === b.name;
      }
      return a.name === b.name;
    case 'abs':
      return alphaEq(a.body, b.body, [...env, [a.param, b.param]]);
    case 'app':
      return alphaEq(a.fn, b.fn, env) && alphaEq(a.arg, b.arg, env);
  }
}

const nameOf = (t) => Object.keys(DEFS).find((name) => alphaEq(DEFS[name], t));

/**
 * Muestra un término. Si abbreviate es true, los subtérminos que coinciden
 * con una definición se muestran por su nombre (TRUE, FALSE, ...).
 */
function show(t, abbreviate = true, nameTop = true) {
  const name = abbreviate && nameTop && nameOf(t);
  if (name) return name;
  const isNamed = (u) => abbreviate && nameOf(u);
  switch (t.tag) {
    case 'var':
      return t.name;
    case 'abs':
      return `λ${t.param}.${show(t.body, abbreviate)}`;
    case 'app': {
      const fn = t.fn.tag === 'abs' && !isNamed(t.fn)
        ? `(${show(t.fn, abbreviate)})`
        : show(t.fn, abbreviate);
      const arg = t.arg.tag === 'var' || isNamed(t.arg)
        ? show(t.arg, abbreviate)
        : `(${show(t.arg, abbreviate)})`;
      return `${fn} ${arg}`;
    }
  }
}

const define = (name, source) => { DEFS[name] = parse(source); };

// Booleanos de Church: un booleano "elige" entre dos alternativas
define('TRUE', 'λx.λy.x');
define('FALSE', 'λx.λy.y');
// NOT: el booleano recibido elige FALSE (si era TRUE) o TRUE (si era FALSE)
define('NOT', 'λb.b FALSE TRUE');
// Definición alternativa: intercambia el orden de las dos alternativas
define('NOT2', 'λp.λa.λb.p b a');
// Combinador Y (punto fijo): Y g =β g (Y g)
define('Y', 'λf.(λx.f (x x)) (λx.f (x x))');

/** Imprime la reducción paso a paso, con la sustitución de cada paso. */
function printReduction(source, maxSteps = 50) {
  const { steps, normal } = reduceSteps(parse(source), maxSteps);
  const width = Math.max(...steps.map((s) => show(s.term).length)) + 4;

  steps.forEach((s, i) => {
    const prefix = i === 0 ? '    ' : ' →β ';
    const abbreviated = show(s.term);
    const note = s.param ? `[${s.param} := ${show(s.arg)}]` : '';
    console.log(`${prefix}${abbreviated.padEnd(width)}${note}`.trimEnd());
    const expanded = show(s.term, false);
    if (expanded !== abbreviated) console.log(`       = ${expanded}`);
  });

  if (normal) {
    console.log(`    Forma normal: ${show(steps.at(-1).term)} (${steps.length - 1} pasos β)\n`);
  } else {
    console.log(`    … se detuvo tras ${maxSteps} pasos: el término no tiene forma normal.\n`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Las mismas ideas escritas directamente con lambdas de JavaScript
// ═══════════════════════════════════════════════════════════════════════════

// Booleanos de Church como funciones currificadas
const verdadero = (x) => (y) => x;
const falso = (x) => (y) => y;
const not = (b) => b(falso)(verdadero);
const aBooleano = (b) => b(true)(false); // traduce a booleano de JS para imprimir

// ── Recursión ──

// 1. Recursión directa: la lambda se llama a sí misma por su nombre
const factorial = (n) => (n === 0 ? 1 : n * factorial(n - 1));

// 2. Recursión sin nombres: combinador Y.
//    Con evaluación estricta (como JavaScript), Y g evalúa x(x) antes de
//    llamar a g y nunca se detiene.
const Y = (f) => ((x) => f(x(x)))((x) => f(x(x)));

// 3. Combinador Z: es Y con η-expansión (v => x(x)(v)), que retrasa la
//    autoaplicación hasta que realmente se necesita.
const Z = (f) => ((x) => f((v) => x(x)(v)))((x) => f((v) => x(x)(v)));
const factorialZ = Z((self) => (n) => (n === 0 ? 1 : n * self(n - 1)));

// ── Ciclos ──

// Ciclo imperativo (contraste): usa una variable que cambia en cada vuelta
function sumaImperativa(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) total += i;
  return total;
}

// Ciclo como recursión de cola: el "estado" viaja en los parámetros
const sumaRecursiva = (n, acumulado = 0) =>
  n === 0 ? acumulado : sumaRecursiva(n - 1, acumulado + n);

// Ciclo con funciones de orden superior: no hay índice ni mutación visibles
const rango = (desde, hasta) => Array.from({ length: hasta - desde + 1 }, (_, i) => desde + i);
const sumaReduce = (n) => rango(1, n).reduce((acc, x) => acc + x, 0);

// Numerales de Church: el número n ES un ciclo (aplica f n veces sobre x)
const cero = (f) => (x) => x;
const sucesor = (n) => (f) => (x) => f(n(f)(x));
const tres = sucesor(sucesor(sucesor(cero)));
const aEntero = (n) => n((k) => k + 1)(0);

// ═══════════════════════════════════════════════════════════════════════════

function titulo(texto) {
  console.log(`\n${'═'.repeat(70)}\n ${texto}\n${'═'.repeat(70)}`);
}

function main() {
  titulo('PARTE A — Reducción-β de NOT (booleanos de Church)');
  console.log('Definiciones:');
  ['TRUE', 'FALSE', 'NOT'].forEach((name) =>
    console.log(`    ${name.padEnd(6)}= ${show(DEFS[name], true, false)}`));

  console.log('\n1) NOT TRUE');
  printReduction('NOT TRUE');
  console.log('2) NOT FALSE');
  printReduction('NOT FALSE');
  console.log('3) Doble negación: NOT (NOT TRUE)');
  printReduction('NOT (NOT TRUE)');
  console.log(`4) Definición alternativa  NOT2 = ${show(DEFS.NOT2, true, false)}`);
  printReduction('NOT2 TRUE');

  console.log('Con lambdas de JavaScript:');
  console.log(`    not(verdadero)       → ${aBooleano(not(verdadero))}`);
  console.log(`    not(falso)           → ${aBooleano(not(falso))}`);
  console.log(`    not(not(verdadero))  → ${aBooleano(not(not(verdadero)))}`);

  titulo('PARTE B.1 — Recursión');
  console.log('Recursión directa:   factorial = n => n === 0 ? 1 : n * factorial(n - 1)');
  console.log(`    factorial(5) = ${factorial(5)}`);

  console.log('\nEn cálculo lambda no hay nombres: la recursión se logra con el combinador Y.');
  console.log(`    Y = ${show(DEFS.Y, true, false)}`);
  console.log('Reducción de  Y g  (g es cualquier función):');
  printReduction('Y g', 3);
  console.log('    Es decir, Y g =β g (Y g) =β g (g (Y g)) =β …: Y "copia" g para que pueda llamarse a sí misma.');

  console.log('\nY en JavaScript (evaluación estricta):');
  try {
    Y((self) => (n) => (n === 0 ? 1 : n * self(n - 1)))(5);
  } catch (error) {
    console.log(`    Y(...)(5) → ${error.name}: ${error.message}`);
  }
  console.log('Combinador Z (Y retrasando la autoaplicación con v => x(x)(v)):');
  console.log(`    Z(self => n => n === 0 ? 1 : n * self(n - 1))(5) = ${factorialZ(5)}`);

  titulo('PARTE B.2 — Ciclos');
  console.log('Sumar 1 + 2 + … + 10 de tres formas:');
  console.log(`    for imperativo (con mutación)        → ${sumaImperativa(10)}`);
  console.log(`    recursión de cola con acumulador     → ${sumaRecursiva(10)}`);
  console.log(`    rango(1, 10).reduce((a, x) => a + x) → ${sumaReduce(10)}`);
  console.log(`    rango(1, 10)                         → [${rango(1, 10).join(', ')}]`);

  console.log('\nNumeral de Church: n = λf.λx.f(f(…f(x))) — un ciclo de n vueltas');
  console.log(`    tres(k => k + 1)(0)       → ${aEntero(tres)}`);
  console.log(`    tres(s => s + "*")("")    → "${tres((s) => s + '*')('')}"`);
  console.log(`    tres(x => x * 2)(1)       → ${tres((x) => x * 2)(1)}`);
  console.log();
}

if (require.main === module) main();

module.exports = {
  Var, Abs, App, DEFS, parse, subst, step, reduceSteps, alphaEq, show,
  verdadero, falso, not, aBooleano,
  factorial, Y, Z, factorialZ,
  sumaImperativa, sumaRecursiva, rango, sumaReduce,
  cero, sucesor, tres, aEntero,
};
