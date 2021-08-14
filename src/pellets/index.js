import pelletPlacement from './../config/pellet-placement.json'
import config from './../config/options.yaml';

let context, // canvas
    pelletsLeft = [],
    pelletImages = ['', 'pellet', 'power-up']

const preloadPellets = new Promise((resolve, reject) => {
    let loadedCount = 0

    pelletImages = pelletImages.map((name) => {
        if (name === '') {
            return
        }

        let img = new Image()
        img.onload = () => ++loadedCount >= 2 ? resolve() : 0
        if (name === 'pellet') {
            img.src = require('./frames/pellet.svg')
        }
        if (name === 'power-up') {
            img.src = require('./frames/power-up.svg')
        }
        return img
    })
})

const drawPellets = () => {
    let xPos, yPos
    pelletPlacement.forEach((row, rowIndex) => {
        pelletsLeft.push([])
        row.forEach((col, colIndex) => {
            if (col === 0) {
                return
            }

            yPos = rowIndex * config.tileSize
            xPos = colIndex * config.tileSize
            pelletsLeft[rowIndex].push(col)
            context.drawImage(pelletImages[col], xPos, yPos)
        })
    })
}

const maybeEatPellet = (x, y) => {
    if (pelletsLeft[y][x] === 1 || pelletsLeft[y][x] === 2) {
        context.clearRect(
            x * config.tileSize,
            y * config.tileSize,
            config.tileSize,
            config.tileSize
        )
    }
}

const init = () => {
    context = document.getElementById('pellets').getContext('2d')
    preloadPellets.then(
        () => drawPellets(context)
    )

    /*
    document.getElementById('characters').addEventListener('character-position', (e) => {
        let character = e.detail
        if (character.type === 'player') {
            maybeEatPellet(context, character.x, character.y)
        }
    })
    */
}

const Pellets = {
    init: init,
    maybeEatPellet: maybeEatPellet,
}

export default Pellets
