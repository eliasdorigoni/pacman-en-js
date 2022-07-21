import config from "../config";
import Position from "./Position";
import Direction from "../enums/Direction";
import TraversablePath from "../objects/TraversablePath";

const { tileSize } = config

export default class Movement {

    /**
     * Character's current position
     * @type {Position}
     */
    position = undefined

    /*
     * @type {boolean}
     */
    positionChanged = false


    /**
     * Character's base speed, defined in tiles per second elapsed.
     * Some events can temporarily affect this value.
     * @private
     * @type {number}
     */
    baseSpeed = 11.0

    /**
     * Distance that can be traveled in pixels per millisecond elapsed.
     * @private
     * @type {number}
     */
    distancePerMs = undefined

    /**
     * @type {Direction}
     */
    currentDirection = undefined

    /**
     * @type {boolean}
     */
    isMoving = false

    /**
     * @type {function[]}
     */
    onDirectionChange = []

    get speed() {
        return this.baseSpeed
    }

    set speed(value) {
        this.baseSpeed = value
        this.distancePerMs = (this.speed / 1000) * tileSize
    }

    /**
     * Switches the character direction, if allowed by the world.
     *
     * @param {Direction} newDirection
     */
    changeDirection(newDirection) {
        console.log('direction changed', newDirection)
        if (newDirection === this.currentDirection) {
            return
        }

        this.currentDirection = newDirection
        this.isMoving = true

        this.onDirectionChange.map(callback => callback(newDirection))
    }

    /**
     * Allows the user to control the character with WASD or arrow keys
     */
    enableControls() {
        document.onkeydown = (event) => {
            switch (event.key.toLowerCase()) {
                case 'arrowup':
                case 'w':
                    this.changeDirection(Direction.up)
                    break
                case 'arrowright':
                case 'd':
                    this.changeDirection(Direction.right)
                    break
                case 'arrowdown':
                case 's':
                    this.changeDirection(Direction.down)
                    break
                case 'arrowleft':
                case 'a':
                    this.changeDirection(Direction.left)
                    break
            }
        }
    }

    /**
     * @param {DOMHighResTimeStamp} elapsedTime
     */
    tick(elapsedTime) {
        /*if (!this.isMoving) {
            // Does not perform calculations for better performance
            return
        }*/

        const distanceToMove = TraversablePath.distanceTo(
            this.position,
            this.currentDirection,
            this.distancePerMs * elapsedTime
        )

        if (distanceToMove === 0) {
            // Hit a wall.
            this.isMoving = false
            this.currentDirection = Direction.idle
            console.log('cannot move')
            return
        }

        // TODO: calculate teleport

        this.positionChanged = true
        switch (this.currentDirection) {
            case Direction.up:
                this.position.y -= distanceToMove
                break
            case Direction.down:
                this.position.y += distanceToMove
                break
            case Direction.left:
                this.position.x -= distanceToMove
                break
            case Direction.right:
                this.position.x += distanceToMove
                break
            default:
                this.positionChanged = false
        }
    }
}