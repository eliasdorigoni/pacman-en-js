import Character from './../Character'
import options from '../../config.yaml'

const Pacman = new Character(
    document.getElementById('pacman').getContext('2d'),
    [(14 * options.tileSize) - (options.tileSize / 2), 23 * options.tileSize],
    [44, 44]
)

Pacman.enableControls()

const animationSprites = [
    require('./sprites/closed.svg'),      // 0
    require('./sprites/up-big.svg'),      // 1
    require('./sprites/up-small.svg'),    // 2
    require('./sprites/down-big.svg'),    // 3
    require('./sprites/down-small.svg'),  // 4
    require('./sprites/left-big.svg'),    // 5
    require('./sprites/left-small.svg'),  // 6
    require('./sprites/right-big.svg'),   // 7
    require('./sprites/right-small.svg'), // 8
]

const animationKeys = {
    idle:  [0],
    up:    [0, 1, 2],
    down:  [0, 3, 4],
    left:  [0, 5, 6],
    right: [0, 7, 8],
}

Pacman.init = () => new Promise((res) => {
    Pacman.loadAnimationSprites(animationSprites, animationKeys)
        .then(() => {
            Pacman.setIdleAnimation()
            Pacman.calculateFrame()
            Pacman.paint()
            res()
        })
})

export default Pacman