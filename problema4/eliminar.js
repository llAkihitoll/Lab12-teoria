'use strict';
/**
 * Laboratorio 12 — Problema 4
 * Eliminar de una lista los elementos indicados en otra lista, usando
 * funciones lambda. Devuelve los elementos restantes en su orden original.
 *
 * Ejecución:
 *   node problema4/eliminar.js                                  → ejemplos (incluye el del PDF)
 *   node problema4/eliminar.js '["a","b","c"]' '["b","x"]'      → listas indicadas (JSON)
 */

/**
 * Devuelve una lista nueva sin los elementos de `aBorrar`.
 *   - Se eliminan TODAS las apariciones de cada elemento indicado.
 *   - Los elementos de `aBorrar` que no están en `lista` se ignoran.
 *   - El orden relativo de los elementos restantes se mantiene.
 */
const eliminarElementos = (lista, aBorrar) => {
  if (!Array.isArray(lista) || !Array.isArray(aBorrar)) {
    throw new TypeError('La lista original y la lista de elementos a borrar deben ser listas');
  }
  const borrar = new Set(aBorrar); // búsqueda rápida de cada elemento

  // Lambda de filtrado: se conserva el elemento si NO está en la lista a borrar
  return lista.filter((elemento) => !borrar.has(elemento));
};

// Elementos solicitados que no existían en la lista (solo para informar)
const noEncontrados = (lista, aBorrar) => aBorrar.filter((elemento) => !lista.includes(elemento));

const formatearLista = (lista) =>
  `[${lista.map((x) => (typeof x === 'string' ? `'${x}'` : String(x))).join(', ')}]`;

const mostrar = (nombre, lista, aBorrar) => {
  const resultado = eliminarElementos(lista, aBorrar); // valida antes de imprimir
  console.log(`\n── ${nombre} ──`);
  console.log(`Lista inicial:      ${formatearLista(lista)}`);
  console.log(`Elementos a borrar: ${formatearLista(aBorrar)}`);
  console.log(`Resultado:          ${formatearLista(resultado)}`);
  const ignorados = noEncontrados(lista, aBorrar);
  if (ignorados.length > 0) console.log(`(ignorados por no estar en la lista: ${formatearLista(ignorados)})`);
};

const COLORES = ['rojo', 'verde', 'azul', 'amarillo', 'gris', 'blanco', 'negro'];

function main() {
  if (process.argv[2] !== undefined) {
    try {
      const lista = JSON.parse(process.argv[2]);
      const aBorrar = JSON.parse(process.argv[3] ?? '[]');
      mostrar('Listas indicadas', lista, aBorrar);
    } catch (error) {
      console.log(`Error: ${error instanceof SyntaxError ? 'las listas deben escribirse en formato JSON' : error.message}`);
      process.exitCode = 1;
    }
    return;
  }

  mostrar('Ejemplo del PDF', COLORES, ['amarillo', 'cafe', 'blanco']);
  mostrar('Lista de eliminación vacía', COLORES, []);
  mostrar('Lista original vacía', [], ['rojo']);
  mostrar('Elementos repetidos (se eliminan todas las apariciones)', ['a', 'b', 'a', 'c', 'a'], ['a']);
}

if (require.main === module) main();

module.exports = { eliminarElementos, noEncontrados, COLORES };
