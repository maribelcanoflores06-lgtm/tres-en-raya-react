# Tres en raya

Juego de tres en raya hecho con **React** y **Vite**. Tiene modo de 2 jugadores, modo contra la computadora, marcador, animaciones, confeti al ganar y sonidos.

## Cómo usarlo

Necesitas tener Node.js instalado. Desde esta carpeta:

```bash
npm install        # instala las dependencias (solo la primera vez)
npm run dev        # abre el juego en modo desarrollo (http://localhost:5173)
npm run build      # genera la versión final en la carpeta dist
npm run preview    # prueba localmente la versión de dist
npm run lint       # revisa el código en busca de errores
```

## Estructura del proyecto

```
tres-en-raya-react/
├── dist/              (se genera sola)
├── node_modules/      (se genera sola)
├── public/
├── src/
│   ├── components/
│   ├── lib/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .oxlintrc.json
├── .gitignore
└── README.md
```

## Carpetas

### `dist/`
Es el resultado de `npm run build`: la versión del juego ya compilada y optimizada, lista para publicar en un hosting. **No se edita a mano**; se regenera cada vez que haces build. Está en `.gitignore`.

### `node_modules/`
Aquí se descargan todas las librerías que usa el proyecto (React, Vite, etc.) al ejecutar `npm install`. **No se edita ni se sube a git.** Se puede borrar y recrear con `npm install`.

### `public/`
Archivos estáticos que se copian tal cual al sitio final:
- `favicon.svg`: el ícono que aparece en la pestaña del navegador.
- `icons.svg`: archivo de íconos que viene con la plantilla de Vite (el juego no lo usa actualmente).

### `src/`
Todo el código del juego. Es la carpeta que editas.

## Archivos de `src/`

| Archivo | Qué hace |
|---|---|
| `main.jsx` | Punto de entrada. Monta el componente `App` dentro del `<div id="root">` de `index.html`. |
| `App.jsx` | Componente principal. Guarda el estado del juego (tablero, turno, marcador, modo, sonido), decide quién gana o si hay empate, hace jugar a la computadora tras una pausa y muestra el confeti. |
| `App.css` | Estilos del juego: tablero, botones, marcador, animaciones (`pop`, `pulse`, `fall`) y confeti. Desactiva animaciones si el sistema pide menos movimiento. |
| `index.css` | Estilos globales: colores (modo claro y oscuro automático), fondo y fuente. |

### `src/components/`
Piezas visuales pequeñas que usa `App.jsx`:

| Archivo | Qué hace |
|---|---|
| `Board.jsx` | Dibuja el tablero de 9 casillas y marca las casillas de la línea ganadora. |
| `Cell.jsx` | Una casilla. Muestra la X o la O con animación y avisa cuando se hace clic. |
| `Scoreboard.jsx` | Marcador de victorias de X, victorias de O y empates. |
| `ModeToggle.jsx` | Botones para elegir "2 jugadores" o "Vs computadora". |

### `src/lib/`
Lógica que no es visual:

| Archivo | Qué hace |
|---|---|
| `game.js` | Reglas del juego. `LINES` son las 8 líneas ganadoras, `getWinner` detecta si alguien ganó y `cpuMove` elige la jugada de la computadora: gana si puede, si no bloquea, si no toma el centro, luego una esquina y luego cualquier casilla libre. |
| `sound.js` | Sonidos creados con la Web Audio API (sin archivos de audio): un tono al marcar (distinto para X y O), una melodía al ganar y un tono grave en empate. |

## Archivos de la raíz

| Archivo | Qué hace |
|---|---|
| `index.html` | La única página HTML. Tiene el título, el `<div id="root">` y carga `src/main.jsx`. Vite parte de aquí. |
| `package.json` | "Ficha" del proyecto: nombre, los comandos de `npm run ...` (`scripts`) y las librerías que necesita. `dependencies` son las que usa el juego (React); `devDependencies` son herramientas de desarrollo (Vite, el plugin de React, oxlint). |
| `package-lock.json` | Guarda las versiones exactas instaladas para que todos obtengan lo mismo. Lo genera npm; no se edita a mano. |
| `vite.config.js` | Configuración de Vite. Aquí solo activa el plugin de React para poder usar archivos `.jsx`. |
| `.oxlintrc.json` | Configuración del linter (oxlint), que revisa el código al ejecutar `npm run lint`. |
| `.gitignore` | Lista de archivos y carpetas que git debe ignorar (`node_modules`, `dist`, logs, archivos del editor). |
| `README.md` | Este documento. |

## Cómo se conecta todo

1. El navegador abre `index.html`, que carga `src/main.jsx`.
2. `main.jsx` muestra `App.jsx`, que guarda el estado del juego.
3. `App.jsx` pinta `ModeToggle`, `Board` (con sus `Cell`) y `Scoreboard`.
4. Al hacer clic en una casilla, `App.jsx` actualiza el tablero, usa `getWinner` de `game.js` para ver si hay ganador y reproduce un sonido de `sound.js`.
5. En modo computadora, tras la jugada de X, `App.jsx` espera un momento y pide a `cpuMove` la jugada de O.
