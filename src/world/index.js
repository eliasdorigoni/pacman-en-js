import tilePlacement from './../config/world-tiles.json'
import options from './../config/options.yaml';

let loadedTiles = []

/**
 * Precarga los tiles.
 */
const preloadTiles = new Promise((resolve, reject) => {
    // Cada fila es un estilo y cada valor es una variante de ese estilo.
    const groupedTiles = [
        [],
        ['wall-0', 'wall-180'],
        ['wall-end-0', 'wall-end-90', 'wall-end-180', 'wall-end-270'],
        ['corner-0', 'corner-90', 'corner-180', 'corner-270'],
        ['ghost-exit-0'],
        ['ghost-exit-joint-0', 'ghost-exit-joint-180'],
        ['t-intersection-0', 't-intersection-90', 't-intersection-180', 't-intersection-270'],
    ]
    const expectedTileCount = groupedTiles.reduce((prev, current) => {
        return prev + current.length
    }, 0)

    let img,
        imgRow,
        loadedTileCount = 0

    for (let group in groupedTiles) {
        imgRow = []
        for (let tile in groupedTiles[group]) {
            img = new Image()
            img.onload = () => {
                if (++loadedTileCount >= expectedTileCount) {
                    resolve()
                }
            }
            img.src = require(`./tiles/${groupedTiles[group][tile]}.svg`)
            imgRow.push(img)
        }
        loadedTiles.push(imgRow)
    }
})

/**
 * @param {CanvasRenderingContext2D} ctx
 */
const drawTiles = (ctx) => {
    let xPos, yPos, style, variant
    tilePlacement.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col[0] === 0) {
                return // cero es espacio vacío.
            }
            xPos = colIndex * options.tileSize
            yPos = rowIndex * options.tileSize
            style = col[0]
            variant = col[1]
            ctx.drawImage(loadedTiles[style][variant], xPos, yPos)
        })
    })
}

const World = {
    init: () => {
        const element = document.getElementById('world')
        let context = element.getContext('2d', { alpha: false })
        context.fillStyle = "black"
        context.fillRect(0, 0, element.width, element.height)
        preloadTiles.then(() =>
            drawTiles(context)
        )
    }
}

export default World