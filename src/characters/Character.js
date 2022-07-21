import config from '../config';
import Position from "./Position";
import Size from "./Size";
import Direction from "../enums/Direction";
import Animation from "./Animation"
import Movement from "./Movement";
import Ticker from "./Ticker";
import TraversablePath from "../objects/TraversablePath";

/**
 * @abstract
 */
export default class Character {
    /**
     * Character's HTML element context
     * @type {CanvasRenderingContext2D}
     */
    context = undefined

    /**
     * @type {Size}
     */
    size = undefined

    /**
     * @type {Animation}
     */
    animation = new Animation()

    /**
     * @type {Movement}
     */
    movement = new Movement()

    /**
     * @type {Ticker}
     */
    ticker = new Ticker([
        this.onTick.bind(this),
    ])

    constructor() {
        this.movement.onDirectionChange = [
            (newDirection) => this.animation.updateAnimation(newDirection)
        ]
    }

    paint() {
        this.context.drawImage(
            this.animation.currentFrame,
            this.movement.position.fixedX,
            this.movement.position.fixedY
        )
        // TODO: disparar evento para indicar la posición actual
    }

    /**
     * Deletes the current position
     */
    unpaint() {
        this.context.clearRect(
            this.movement.position.fixedX,
            this.movement.position.fixedY,
            this.size.width,
            this.size.height
        )
    }

    onTick(elapsedTime) {
        const oldPosition = this.movement.position.clone()
        this.unpaint()
        this.animation.prepareNextFrame()
        this.movement.tick(elapsedTime)
        this.paint()
        this.ticker.resetElapsedTime()

        console.log('Pacman position')
        console.log(oldPosition, this.movement.position)
    }
}