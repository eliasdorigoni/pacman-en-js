import options from '../config'

class World {
    element = document.getElementById('world')

    /**
     * Loads the world graphics in a canvas
     * @returns {Promise<unknown>}
     */
    load() {
        return new Promise((res) => {
            const context = this.element.getContext('2d', { alpha: false })
            context.fillStyle = "black"
            context.fillRect(0, 0, this.element.width, this.element.height)

            const bg = new Image()
            bg.onload = () => {
                context.drawImage(bg, 0, 0)
                res()
            }
            bg.src = require('../animations/world-background.svg')
        })
    }

    /**
     * For development purposes.
     * Allows to see clearly every tile in the world.
     * @returns {Promise<unknown>}
     */
    loadGridOverlay() {
        return new Promise((resolve) => {
            const context = document.getElementById('grid').getContext("2d");
            context.beginPath()
            context.strokeStyle = '#333333'
            context.lineWidth = 1

            for (let start = 0; start < options.rows * options.tileSize; start += options.tileSize) {
                context.moveTo(0, start)
                context.lineTo(this.element.width, start)
                context.stroke()

                context.moveTo(start, 0)
                context.lineTo(start, this.element.height)
                context.stroke()
            }

            resolve()
        })
    }
}

export default World