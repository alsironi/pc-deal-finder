# PC Deal Finder

Mini app de escritorio con **Electron** para buscar ofertas de videojuegos de PC usando la API pública de [CheapShark](https://www.cheapshark.com/api/1.0).

## Características

- Ventana compacta 450×600, siempre encima (`alwaysOnTop`)
- Búsqueda por título
- Botón **Ver Chollos Top** (ordenados por ahorro)
- Tarjetas con thumbnail, precio, descuento y tienda
- **Abrir oferta** en el navegador del sistema

## Requisitos

- Node.js 18+
- npm

## Instalación y arranque

```bash
cd stack/Electron/pc-deal-finder
npm install
npm start
```

## API

- Buscar: `https://www.cheapshark.com/api/1.0/deals?title=`
- Top: `https://www.cheapshark.com/api/1.0/deals?sortBy=Savings&pageSize=10`

## Estructura

```
package.json   # Electron + scripts
main.js        # proceso principal (ventana)
index.html     # UI
renderer.js    # fetch CheapShark + cards
styles.css     # dark gamer theme
```

## Notas

Prototipo con `nodeIntegration: true` y `contextIsolation: false` para acceder a `shell.openExternal` desde el renderer.
