const World = {
    init: () => {
        const element = document.getElementById('world')
        let context = element.getContext('2d', { alpha: false })
        context.fillStyle = "black"
        context.fillRect(0, 0, element.width, element.height)

        let bg = new Image()
        bg.onload = () => {
            context.drawImage(bg, 0, 0)
        }
        bg.src = require('./background.svg')
    }
}

export default World