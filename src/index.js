import ready from './components/helpers'
import World from './world'
import Pellets from './pellets'
// import Pacman from './pacman'

ready(() => {
    World.init()
    Pellets.init()
    // Pacman()
})