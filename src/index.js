import ready from './helpers'
import World from './world'
import Pellets from './pellets'
import Pacman from './characters/pacman'

function main(timestamp) {
    window.requestAnimationFrame(main)

    // World.tick()
    Pellets.tick(timestamp)
    // Pacman.tick()
}

ready(() => {

    Promise.all([
        World.init(),
        World.grid(),
        Pellets.init(),
        // Pacman(),
    ]).then(() => {
        console.log('Todo cargado')
        window.requestAnimationFrame(main)
    })

})