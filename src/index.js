import ready from './helpers'
import World from './world'
import Pellets from './pellets'
import Pacman from './characters/pacman'
import config from './config.yaml'


function setCanvasSizes() {
    const { rows, columns, tileSize } = config
    const width = tileSize * columns,
        height = tileSize * rows

    document.querySelectorAll('canvas').forEach(canvas => {
        canvas.setAttribute('width', width)
        canvas.setAttribute('height', height)

    })
}

function mainLoop(timestamp) {
    window.requestAnimationFrame(mainLoop)
    Pellets.tick(timestamp)
    // Pacman.tick()
}

ready(() => {
    setCanvasSizes()

    Promise.all([
        World.init(),
        World.grid(),
        Pellets.init(),
        Pacman.init(),
    ]).then(() => {
        console.log('Todo cargado')
        window.requestAnimationFrame(mainLoop)
    })
})