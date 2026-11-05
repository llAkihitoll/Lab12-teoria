# Laboratorio 12 — Teoría de la Computación

Programación funcional y funciones lambda: reducción-β de NOT en cálculo lambda, recursión y ciclos (Problema 1), y tres programas resueltos con lambdas: ordenar diccionarios por clave, calcular la matriz transpuesta y eliminar elementos de una lista (Problemas 2–4).

## Video de demostración (Problema 1)

https://youtu.be/wAxH3vjO8PU


## Lenguaje y requisitos

- **Lenguaje:** JavaScript, ejecutado con **Node.js**. Permite programación funcional: las funciones son valores, las *arrow functions* (`x => ...`) son funciones lambda y existen funciones de orden superior (`map`, `filter`, `reduce`, `sort`).
- **Requisito:** Node.js 18 o superior ([descarga](https://nodejs.org/)). Se probó con Node.js v24.14.1.
- **No hay dependencias externas**, así que no hace falta `npm install`. Las pruebas usan el módulo `node:test`, que viene con Node.

```bash
node --version
```

## Cómo ejecutar

Todos los comandos se ejecutan desde la raíz del repositorio.

| Problema | Comando | Qué muestra |
|---|---|---|
| 1 | `node problema1/problema1.js` | Reducción-β paso a paso de `NOT TRUE`, `NOT FALSE`, `NOT (NOT TRUE)` y `NOT2 TRUE`; recursión con los combinadores Y y Z; ciclos |
| 2 | `node problema2/ordenar.js` | Ejemplo del PDF ordenado por `model`, `make` y `color` |
|   | `node problema2/ordenar.js color` | Ordena por la clave indicada |
| 3 | `node problema3/transpuesta.js` | Transpuesta del ejemplo del PDF y de matrices rectangulares, de una fila, de una columna, vacía e irregular |
|   | `node problema3/transpuesta.js "[[1,2,3],[4,5,6]]"` | Transpone la matriz indicada (en formato JSON) |
| 4 | `node problema4/eliminar.js` | Ejemplo del PDF y casos con listas vacías y elementos repetidos |
|   | `node problema4/eliminar.js "rojo,verde,azul" "verde,cafe"` | Elimina de la primera lista los elementos de la segunda (separados por comas) |
| Pruebas | `node --test` | Ejecuta todas las pruebas automatizadas (`*.test.js`) |

> `node --test` se ejecuta **sin argumentos**: Node busca los archivos `*.test.js` por su cuenta. Si se le pasa una carpeta (`node --test problema1/`), la toma como archivo y falla.

## Organización

```text
├── README.md
├── problema1/
│   ├── problema1.js            # reductor de cálculo lambda, NOT, combinadores Y/Z, ciclos
│   └── problema1.test.js
├── problema2/
│   ├── ordenar.js              # ordenar lista de diccionarios por clave
│   └── ordenar.test.js
├── problema3/
│   ├── transpuesta.js          # matriz transpuesta
│   └── transpuesta.test.js
├── problema4/
│   ├── eliminar.js             # eliminar elementos de una lista
│   └── eliminar.test.js
└── documentacion/
    └── respuestas_teoricas.pdf   # respuestas teóricas del Problema 1 (incisos sin código)
```

## Soluciones

### Problema 1 — Cálculo lambda, recursión y ciclos

Las respuestas teóricas están en [`documentacion/respuestas_teoricas.pdf`](documentacion/respuestas_teoricas.pdf):

- **A.** Reducción-β de NOT con booleanos de Church (`TRUE = λx.λy.x`, `FALSE = λx.λy.y`, `NOT = λb.b FALSE TRUE`), explicada paso a paso.
- **B.** Recursión con el combinador Y (y con Z en lenguajes estrictos), y ciclos expresados como recursión de cola, funciones de orden superior y numerales de Church.
- **C.** Cuándo conviene la programación funcional y cuándo no, con un ejemplo para cada caso.

El programa incluye un pequeño **reductor de cálculo lambda** que analiza términos como `"NOT TRUE"`, aplica reducción-β en orden normal (con sustitución que evita la captura de variables) e imprime cada paso junto con su sustitución:

```text
    NOT TRUE
 →β TRUE FALSE TRUE    [b := TRUE]
 →β (λy.FALSE) TRUE    [x := FALSE]
 →β FALSE              [y := TRUE]
```

Además, muestra las mismas ideas con lambdas de JavaScript:
- `not = b => b(falso)(verdadero)`.
- Factorial con el combinador `Z`, sin que la función se llame por su nombre.
- La suma 1..n con `for`, con recursión de cola y con `reduce`.

### Problema 2 — Ordenar diccionarios por clave

```js
const criterio = (dic) => dic[clave];
[...lista].sort((a, b) => compararValores(criterio(a), criterio(b)));
```

- La lambda `criterio` extrae el valor de la clave, como `key=lambda d: d['model']` en Python.
- La lambda comparadora ordena los números por su valor (2 < 7 < 216) y los textos alfabéticamente.
- Devuelve una lista nueva y no modifica la original. Los valores repetidos conservan su orden original, porque el ordenamiento es estable.
- Si la clave no existe, da un error que dice en cuántos diccionarios falta.

### Problema 3 — Matriz transpuesta

```js
matriz[0].map((_, j) => matriz.map((fila) => fila[j]));
```

- Para cada índice de columna `j`, la lambda interna toma el elemento `j` de cada fila y forma la nueva fila `j`. El resultado es una lista de listas nueva.
- Funciona con matrices rectangulares.
- Una matriz vacía `[]` devuelve `[]`.
- Si las filas tienen longitudes diferentes, da un error que indica qué fila no coincide.

### Problema 4 — Eliminar elementos de una lista

```js
const borrar = new Set(aBorrar);
lista.filter((elemento) => !borrar.has(elemento));
```

- La lambda de `filter` conserva un elemento solo si no está en la lista a borrar.
- Se eliminan todas las apariciones de cada elemento indicado.
- Los elementos que no existen en la lista se ignoran, como `'cafe'` en el ejemplo del PDF.
- Los elementos restantes conservan su orden.
