import pelletPositions from './positions.json'
import config from '../config.yaml';

let context,
    availablePellets = pelletPositions,
    pelletImages = ['', 'pellet', 'power-up'],
    powerUpLocations = []


const Pellets = {
    lastTimestamp: 0,
    elapsedTime: 0, // en milisegundos
    powerUpIsVisible: true,

    preloadImages: new Promise((res) => {
        let loadedCount = 0
        pelletImages = pelletImages.map((name) => {
            if (name === '') {
                return
            }

            let img = new Image()
            img.onload = () => ++loadedCount >= 2 ? res() : 0
            if (name === 'pellet') {
                img.src = require('./frames/pellet.svg')
            }
            if (name === 'power-up') {
                img.src = require('./frames/power-up.svg')
            }
            return img
        })
    }),
    init: function() {
        return new Promise((res) => {
            context = document.getElementById('pellets').getContext('2d')
            this.preloadImages.then(() => {
                this.paintAllPellets(context)
                res()
            })
        })
        /*
        document.getElementById('characters').addEventListener('character-position', (e) => {
            let character = e.detail
            if (character.type === 'player') {
                maybeEatPellet(context, character.x, character.y)
            }
        })
        */
    },
    maybeEatPellet: function(x, y) {
        if (availablePellets[y][x] === 1 || availablePellets[y][x] === 2) {
            context.clearRect(
                x * config.tileSize,
                y * config.tileSize,
                config.tileSize,
                config.tileSize
            )
        }
    },
    paintAllPellets: function() {
        availablePellets.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (col === 0) {
                    return
                }

                context.drawImage(
                    pelletImages[col],
                    colIndex * config.tileSize,
                    rowIndex * config.tileSize
                )

                if (col === 2) {
                    powerUpLocations.push([rowIndex, colIndex])
                }
            })
        })
    },
    tick: function(timestamp) {
        this.elapsedTime += timestamp - this.lastTimestamp
        this.lastTimestamp = timestamp

        if (this.elapsedTime >= 155) {
            this.togglePowerUps(!this.powerUpIsVisible)
            this.powerUpIsVisible = !this.powerUpIsVisible
            this.elapsedTime = 0
        }
    },
    togglePowerUps: function(show) {
        if (show) {
            powerUpLocations.map(([x,y]) => {
                if (availablePellets[x][y] === 2) {
                    context.drawImage(
                        pelletImages[2],
                        y * config.tileSize,
                        x * config.tileSize
                    )
                }
            })
        } else {
            powerUpLocations.map(([x,y]) => {
                context.clearRect(
                    y * config.tileSize,
                    x * config.tileSize,
                    config.tileSize,
                    config.tileSize
                )
            })
        }
    },
}

export default Pellets
