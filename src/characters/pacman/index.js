import Character from './../Character'
import { triggerEvery60FramesPerSecond } from './../../helpers'

const Pacman = () => {
    const char = new Character({
        context: document.getElementById('pacman').getContext('2d'),
        x: 14,
        y: 23,
        speed: 11,
        spriteSize: 44,
        enableControls: true,
    })

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
        idle: [8],
        up: [0, 1, 2],
        down: [0, 3, 4],
        left: [0, 5, 6],
        right: [0, 7, 8],
    }

    char.loadAnimationSprites(animationSprites, animationKeys)
        .then(() => {
            triggerEvery60FramesPerSecond(frame => char.tick(frame))
        })
}

export default Pacman