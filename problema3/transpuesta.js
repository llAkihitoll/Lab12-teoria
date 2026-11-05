'use strict';
/**
 * Laboratorio 12 — Problema 3
 * Calcular la matriz transpuesta X^T de una matriz X (lista de listas)
 * usando funciones lambda. El resultado también es una lista de listas.
 *
 * Ejecución:
 *   node problema3/transpuesta.js                      → ejemplos (incluye el del PDF)
 *   node problema3/transpuesta.js "[[1,2,3],[4,5,6]]"  → transpone la matriz indicada (JSON)
 */

/**
 * Devuelve una matriz nueva donde la fila j es la columna j de la original:
 * XT[j][i] = X[i][j]. No modifica la matriz original.
 *
 * Casos especiales:
 *   - matriz vacía []            → []
 *   - filas sin columnas [[], []] → []  (una matriz m×0 da una 0×m)
 *   - filas de distinta longitud  → Error, porque no es una matriz válida
 */
const transponer = (matriz) => {
  if (!Array.isArray(matriz) || !matriz.every((fila) => Array.isArray(fila))) {
    throw new TypeError('La matriz debe ser una lista de listas');
  }
  if (matriz.length === 0) return [];

  const columnas = matriz[0].length;
  const filaIrregular = matriz.findIndex((fila) => fila.length !== columnas);
  if (filaIrregular !== -1) {
    throw new Error(
      `Las filas tienen longitudes diferentes: la fila 0 tiene ${columnas} elemento(s) ` +
      `y la fila ${filaIrregular} tiene ${matriz[filaIrregular].length}`
    );
  }

  // Para cada índice de columna j, se toma el elemento j de cada fila
  return matriz[0].map((_, j) => matriz.map((fila) => fila[j]));
};

// Muestra la matriz con columnas alineadas, una fila por línea
const formatearMatriz = (matriz) => {
  if (matriz.length === 0) return '[]';
  const ancho = Math.max(...matriz.flat().map((x) => String(x).length), 1);
  return `[\n${matriz.map((fila) => `    [${fila.map((x) => String(x).padStart(ancho)).join(', ')}]`).join(',\n')}\n]`;
};

const mostrar = (nombre, matriz) => {
  console.log(`\n── ${nombre} ──`);
  console.log(`X =\n${formatearMatriz(matriz)}`);
  try {
    console.log(`X^T =\n${formatearMatriz(transponer(matriz))}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exitCode = 1;
  }
};

function main() {
  if (process.argv[2]) {
    let matriz;
    try {
      matriz = JSON.parse(process.argv[2]);
    } catch {
      console.log('Error: la matriz debe escribirse en formato JSON, por ejemplo "[[1,2],[3,4]]"');
      process.exitCode = 1;
      return;
    }
    mostrar('Matriz indicada', matriz);
    return;
  }

  mostrar('Ejemplo del PDF (3×3)', [[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  mostrar('Matriz rectangular (2×3)', [[1, 2, 3], [4, 5, 6]]);
  mostrar('Una sola fila (1×4)', [[1, 2, 3, 4]]);
  mostrar('Una sola columna (3×1)', [[1], [2], [3]]);
  mostrar('Matriz vacía', []);
  mostrar('Filas de diferente longitud', [[1, 2, 3], [4, 5]]);
  process.exitCode = 0; // el último caso falla a propósito para mostrar el error
}

if (require.main === module) main();

module.exports = { transponer, formatearMatriz };
