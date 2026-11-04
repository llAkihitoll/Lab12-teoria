# Guion del video — Problema 1 (máx. 10 minutos)

Duración objetivo: **6–7 minutos**. Tener abiertos VS Code (`problema1/problema1.js`) y una terminal en la raíz del repositorio.

| Tiempo | Qué mostrar | Qué decir |
|---|---|---|
| 0:00–0:30 | Repositorio en VS Code | Presentación: Laboratorio 12, Teoría de la Computación. Lenguaje: JavaScript con Node.js, que permite programación funcional (funciones como valores, lambdas `x => ...`, `map`/`filter`/`reduce`). |
| 0:30–1:30 | Sección "Reductor de cálculo lambda" del código | Los términos son variables, abstracciones y aplicaciones. `step` hace **un paso β** en orden normal; `subst` aplica `M[x := N]` y evita la captura de variables. Las reducciones que se imprimen se **calculan**: no son textos fijos. |
| 1:30–2:00 | Definiciones `TRUE`, `FALSE`, `NOT` | Booleanos de Church: TRUE elige el primer argumento y FALSE el segundo. NOT = λb.b FALSE TRUE ("si b entonces FALSE, si no TRUE"). |
| 2:00–4:00 | Terminal: `node problema1/problema1.js` → **Parte A** | Recorrer `NOT TRUE` paso a paso: `[b := TRUE]` → `TRUE FALSE TRUE`; `[x := FALSE]` → `(λy.FALSE) TRUE`; `[y := TRUE]` → `FALSE` (se descarta el argumento). Mencionar `NOT FALSE`, la doble negación (6 pasos) y la definición alternativa `NOT2`, que llega a `λa.λb.b`, igual a FALSE salvo renombramiento (α). Mostrar las mismas funciones como lambdas de JS: `not(verdadero) → false`. |
| 4:00–5:30 | **Parte B.1 — Recursión** | Recursión directa con `factorial`. En cálculo lambda no hay nombres, así que se usa el combinador **Y**; mostrar `Y g → g (Y g) → g (g (…))`, que no tiene forma normal. En JS, Y desborda la pila (`RangeError`) por la evaluación estricta. El **combinador Z** retrasa la autoaplicación y calcula `factorial(5) = 120` sin usar el nombre de la función. |
| 5:30–6:30 | **Parte B.2 — Ciclos** | La misma suma (1..10 = 55) de tres formas: `for` con mutación, recursión de cola con acumulador y `reduce` con lambda. Los numerales de Church son ciclos: `tres(s => s + "*")("") = "***"`. |
| 6:30–7:00 | Terminal: `node --test` | Las pruebas automatizadas pasan. Cierre: cuándo conviene el paradigma (transformación de datos, concurrencia) y cuándo no (estado mutable intensivo, recursión profunda sin optimización de llamadas de cola). Los detalles están en el PDF de `documentacion/`. |

## Comandos

```bash
node problema1/problema1.js
node --test
```

## Después de grabar

1. Subir el video a YouTube como **No listado**.
2. Copiar el enlace y pegarlo en el README, en la sección "Video de demostración".
