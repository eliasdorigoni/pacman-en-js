import options from './../config/options.yaml'

const World = {
    init: function() {
        const element = document.getElementById('world')
        let context = element.getContext('2d', { alpha: false })
        context.fillStyle = "black"
        context.fillRect(0, 0, element.width, element.height)

        let bg = new Image()
        bg.onload = () => {
            context.drawImage(bg, 0, 0)
        }
        bg.src = require('./background.svg')
    },
    grid: function() {
        const context = document.getElementById('grid').getContext("2d");
        context.beginPath()

        let x = 0,
            y = 0

        for (let i = 0; i < 29; i++) {
            context.strokeStyle = '#333333';
            context.moveTo(x, 0)
            context.lineTo(x, 992)
            context.stroke()
            x += options.tileSize
        }

        for (let i = 0; i < 29; i++) {
            context.strokeStyle = '#333333';
            context.moveTo(0, y)
            context.lineTo(896, y)
            context.stroke()
            y += options.tileSize
        }
    },
}

export default World