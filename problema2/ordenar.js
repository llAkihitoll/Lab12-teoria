'use strict';
/**
 * Laboratorio 12 — Problema 2
 * Ordenar una lista de diccionarios (objetos de JavaScript) según una clave,
 * usando funciones lambda como criterio de ordenamiento.
 *
 * Ejecución:
 *   node problema2/ordenar.js            → ejemplo del PDF ordenado por 'model', 'make' y 'color'
 *   node problema2/ordenar.js color      → ejemplo del PDF ordenado solo por la clave indicada
 */

// Compara dos valores: números por su valor y textos en orden alfabético.
const compararValores = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b, 'es');
  throw new TypeError(`No se pueden comparar los valores ${a} (${typeof a}) y ${b} (${typeof b})`);
};

/**
 * Devuelve una lista nueva ordenada de forma ascendente por `clave`.
 * La lista original no se modifica. Si dos diccionarios tienen el mismo valor,
 * conservan su orden original (Array.prototype.sort es estable).
 */
const ordenarPorClave = (lista, clave) => {
  if (!Array.isArray(lista)) throw new TypeError('Se esperaba una lista de diccionarios');

  const faltantes = lista.filter((dic) => dic === null || typeof dic !== 'object' || !(clave in dic));
  if (faltantes.length > 0) {
    throw new Error(`La clave '${clave}' no existe en ${faltantes.length} diccionario(s)`);
  }

  // Lambda que extrae el valor de la clave (como key=lambda d: d['model'] en Python)
  const criterio = (dic) => dic[clave];

  // Lambda comparadora que usa sort; [...lista] crea una copia
  return [...lista].sort((a, b) => compararValores(criterio(a), criterio(b)));
};

// Formato similar al del enunciado: {'make': 'Nokia', 'model': 216, ...}
const formatearDiccionario = (dic) =>
  `{${Object.entries(dic)
    .map(([k, v]) => `'${k}': ${typeof v === 'string' ? `'${v}'` : v}`)
    .join(', ')}}`;

const formatearLista = (lista) =>
  lista.length === 0 ? '[]' : `[\n${lista.map((d) => `    ${formatearDiccionario(d)}`).join(',\n')}\n]`;

const TELEFONOS = [
  { make: 'Nokia', model: 216, color: 'Black' },
  { make: 'Mi Max', model: 2, color: 'Gold' },
  { make: 'Samsung', model: 7, color: 'Blue' },
];

function main() {
  const claves = process.argv[2] ? [process.argv[2]] : ['model', 'make', 'color'];

  console.log('Lista original:');
  console.log(formatearLista(TELEFONOS));

  claves.forEach((clave) => {
    console.log(`\nOrdenada por key = '${clave}':`);
    try {
      console.log(formatearLista(ordenarPorClave(TELEFONOS, clave)));
    } catch (error) {
      console.log(`Error: ${error.message}`);
      process.exitCode = 1;
    }
  });
}

if (require.main === module) main();

module.exports = { ordenarPorClave, compararValores, formatearLista, TELEFONOS };
