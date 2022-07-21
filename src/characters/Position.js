import config from "../config";
import Size from "./Size";

const { tileSize } = config

/**
 * Handles a character position in the X and Y axis.
 *
 * There are 3 pairs of values:
 * - "x" and "y" as base values,
 * - "tileX" and "tileY" as position in a grid,
 * - "fixedX" and "fixedY" as corrected position for display.
 *
 * Tile values represent the position on a grid. E.g.: on a 5x5 grid where each
 * tile is 100px wide, a character at {x:320 y:140} will be at the tile {x:3 y:1}
 * because 320 / 100px is 3 rounded down and 140 / 100px is 1 also rounded down.
 *
 * Fixed values are the same as the base values but corrected to appear
 * centered when displayed in a canvas.
 *
 */
export default class Position {
    /**
     * @private
     * @type {number}
     */
    x = 0

    /**
     * @private
     * @type {number}
     */
    y = 0

    /**
     * @private
     * @type {number}
     */
    xPosOffset = 0

    /**
     * @private
     * @type {number}
     */
    yPosOffset = 0

    /**
     * @type {Size}
     */
    size = undefined

    get tileX() {
        return Math.floor(this.x / tileSize)
    }

    get tileY() {
        return Math.floor(this.y / tileSize)
    }

    get fixedX() {
        return this.x - this.xPosOffset
    }

    get fixedY() {
        return this.y - this.yPosOffset
    }

    /**
     * Position in the X and Y axis
     *
     * @param {number} x
     * @param {number} y
     * @param {Size} [size] Default: tileSize value
     */
    constructor(x, y, size) {
        if (!size) {
            size = new Size(tileSize, tileSize)
        }
        this.x = x
        this.y = y
        this.size = size
        this.xPosOffset = (size.width - tileSize) / 2
        this.yPosOffset = (size.height - tileSize) / 2
    }

    /**
     * Callback for position X and Y
     *
     * @callback xyCallback
     * @param {number} x
     */

    /**
     * Callback for position Y
     *
     * @callback yCallback
     * @param {number} y
     */

    /**
     * @param {Position} position
     * @param {xyCallback} [cbxy] Callback for X. Applies also to Y if only 1 callback is provided.
     * @param {yCallback} [cby] Callback for Y only.
     */
    update(position, cbxy, cby) {
        if (cby !== undefined) {
            this.y = cby(position.y)
        } else if (cbxy !== undefined) {
            this.y = cbxy(position.y)
        } else {
            this.y = position.y
        }

        if (cbxy !== undefined) {
            this.x = cbxy(position.x)
        } else {
            this.x = position.x
        }
    }

    /**
     * @returns {Position}
     */
    clone() {
        return new Position(this.x, this.y, this.size)
    }
}