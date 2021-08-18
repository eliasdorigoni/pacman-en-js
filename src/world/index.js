import options from './../config/options.yaml'

const World = {
    init: () => new Promise((res, rej) => {
        const element = document.getElementById('world')
        const context = element.getContext('2d', { alpha: false })
        const bg = new Image()

        context.fillStyle = "black"
        context.fillRect(0, 0, element.width, element.height)
        bg.onload = () => {
            context.drawImage(bg, 0, 0)
            res()
        }
        bg.src = require('./background.svg')
    }),
    grid: () => new Promise((res, rej) => {
        const context = document.getElementById('grid').getContext("2d");
        context.beginPath()

        let x = 0,
            y = 0

        for (let i = 0; i < (options.columns + 2); i++) {
            context.strokeStyle = '#333333';
            context.moveTo(x, 0)
            context.lineTo(x, 992)
            context.stroke()
            x += options.tileSize
        }

        for (let i = 0; i < (options.rows + 2); i++) {
            context.strokeStyle = '#333333';
            context.moveTo(0, y)
            context.lineTo(896, y)
            context.stroke()
            y += options.tileSize
        }

        res()
    }),
}

export default World