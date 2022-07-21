import Character from '../characters/Character'
import Size from "../characters/Size";
import Position from "../characters/Position";
import Direction from "../enums/Direction";
import {tilesToPixels} from "../helpers";

class Pacman extends Character {
    size = new Size(44, 44)

    load() {
        this.context = document.getElementById('pacman').getContext('2d')
        this.movement.position = new Position(
            tilesToPixels(14) - tilesToPixels(0.5),
            tilesToPixels(23),
            this.size
        )
        this.movement.speed = 11.0
        this.movement.enableControls()

        const frames = [
            require('../animations/pacman/closed.svg'),      // 0
            require('../animations/pacman/up-big.svg'),      // 1
            require('../animations/pacman/up-small.svg'),    // 2
            require('../animations/pacman/down-big.svg'),    // 3
            require('../animations/pacman/down-small.svg'),  // 4
            require('../animations/pacman/left-big.svg'),    // 5
            require('../animations/pacman/left-small.svg'),  // 6
            require('../animations/pacman/right-big.svg'),   // 7
            require('../animations/pacman/right-small.svg'), // 8
        ]

        this.animation.defineSequence(Direction.idle, [0])
        this.animation.defineSequence(Direction.up, [0, 1, 2])
        this.animation.defineSequence(Direction.down, [0, 3, 4])
        this.animation.defineSequence(Direction.left, [0, 5, 6])
        this.animation.defineSequence(Direction.right, [0, 7, 8])
        this.animation.frameDuration = 100

        return this.animation.loadFrames(frames)
            .then(() => {
                this.animation.updateAnimation(Direction.idle)
                this.paint()
            })
            .then(() => {
                this.movement.changeDirection(Direction.left)
            })
    }
}

export default Pacman