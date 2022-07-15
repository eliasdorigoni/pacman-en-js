import pelletsMap from './pellets/map.json'
import config from './../config.yaml';

let availablePellets = [],
    pelletImg = new Image(),
    powerUpImg = new Image()

const preloadPellets = new Promise((resolve, reject) => {
    let loadedCount = 0

    pelletImg.onload = () => {
        if (++loadedCount >= 2) {
            resolve()
        }
    }
    pelletImg.src = require('./pellets/pellet.svg')

    powerUpImg.onload = () => {
        if (++loadedCount >= 2) {
            resolve()
        }
    }
    powerUpImg.src = require('./pellets/power-up.svg')
})

const drawPellets = (ctx) => {
    let xPos, yPos
    pelletsMap.forEach((row, rowIndex) => {
        availablePellets.push([])
        row.forEach((col, colIndex) => {
            yPos = rowIndex * config.tileSize
            xPos = colIndex * config.tileSize
            availablePellets[rowIndex].push(col)
            if (col === 1) {
                ctx.drawImage(pelletImg, xPos, yPos)
            } else if (col === 2) {
                ctx.drawImage(powerUpImg, xPos, yPos)
            }
        })
    })
}

const maybeEatPellet = (ctx, x, y) => {
    if (availablePellets[y][x] === 1 || availablePellets[y][x] === 2) {
        ctx.clearRect(
            x * config.tileSize,
            y * config.tileSize,
            config.tileSize, config.tileSize
        )
    }
}

export default function() {
    let canvas = document.getElementById('pellets')
    let context = canvas.getContext('2d')

    preloadPellets.then(() => drawPellets(context))

    document.getElementById('characters').addEventListener('character-position', (e) => {
        let character = e.detail
        if (character.type === 'player') {
            maybeEatPellet(context, character.x, character.y)
        }
    })
}
