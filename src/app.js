import { ready, setCanvasSizes } from './helpers'
import World from './objects/World'
import Pellets from './objects/Pellets'
import Pacman from './objects/Pacman'

ready(() => {
    setCanvasSizes()

    const world = new World()
    const pellets = new Pellets()
    const pacman = new Pacman()

    Promise.all([
        world.load(),
        world.loadGridOverlay(),
        pellets.load(),
        pacman.load(),
    ]).then(() => {
        window.requestAnimationFrame(mainLoop)
    })

    let manualTicks = 40

    /**
     * @param {DOMHighResTimeStamp} timestamp
     */
    function mainLoop(timestamp) {
        let animationFrame
        if (--manualTicks > 0) {
            animationFrame = window.requestAnimationFrame(mainLoop)
        }

        try {
            // pellets.ticker.tick(timestamp)
            pacman.ticker.tick(timestamp)
        } catch (e) {
            window.cancelAnimationFrame(animationFrame)
            throw e
        }

    }
})