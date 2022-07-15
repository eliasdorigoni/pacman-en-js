import tiles from './world/tile-map.json'
import config from './../config.yaml';

let worldTiles = []

const preloadWorldTiles = new Promise((resolve, reject) => {
    const groupedTiles = [
        [],
        ['wall-0', 'wall-180'],
        ['wall-end-0', 'wall-end-90', 'wall-end-180', 'wall-end-270'],
        ['corner-0', 'corner-90', 'corner-180', 'corner-270'],
        ['ghost-exit-0'],
        ['ghost-exit-joint-0', 'ghost-exit-joint-180'],
        ['t-intersection-0', 't-intersection-90', 't-intersection-180', 't-intersection-270'],
    ]

    const expectedTilesToLoad = groupedTiles.reduce((prev, current) => {
        return prev + current.length
    }, 0)

    let img,
        imgRow,
        loadedTiles = 0

    for (let group in groupedTiles) {
        imgRow = []

        for (let tile in groupedTiles[group]) {
            img = new Image()
            img.onload = () => {
                if (++loadedTiles >= expectedTilesToLoad) {
                    resolve()
                }
            }
            img.src = require(`./world/${groupedTiles[group][tile]}.svg`)
            imgRow.push(img)
        }

        worldTiles.push(imgRow)
    }
})

const drawWorld = (ctx) => {
    let xPos, yPos, style, variant

    tiles.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            yPos = rowIndex * config.tileSize
            xPos = colIndex * config.tileSize
            if (col[0] !== 0) {
                style = col[0]
                variant = col[1]
                ctx.drawImage(worldTiles[style][variant], xPos, yPos)
            }
        })
    })
}

export default function() {
    let canvas = document.getElementById('world')
    let context = canvas.getContext('2d')
    context.fillStyle = "black"
    context.fillRect(0, 0, canvas.width, canvas.height)
    preloadWorldTiles.then(() => drawWorld(context))
}