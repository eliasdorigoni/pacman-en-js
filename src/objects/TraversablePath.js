import Direction from "../enums/Direction";
import config from "../config";

const { tileSize } = config

const map = `
............................
.@@@@@@@@@@@@..@@@@@@@@@@@@.
.@....@.....@..@.....@....@.
.@....@.....@..@.....@....@.
.@....@.....@..@.....@....@.
.@@@@@@@@@@@@@@@@@@@@@@@@@@.
.@....@..@........@..@....@.
.@....@..@........@..@....@.
.@@@@@@..@@@@..@@@@..@@@@@@.
......@.....@..@.....@......
......@.....@..@.....@......
......@..@@@@@@@@@@..@......
......@..@........@..@......
......@..@........@..@......
@@@@@@@@@@........@@@@@@@@@@
......@..@........@..@......
......@..@........@..@......
......@..@@@@@@@@@@..@......
......@..@........@..@......
......@..@........@..@......
.@@@@@@@@@@@@..@@@@@@@@@@@@.
.@....@.....@..@.....@....@.
.@....@.....@..@.....@....@.
.@@@..@@@@@@@@@@@@@@@@..@@@.
...@..@..@........@..@..@...
...@..@..@........@..@..@...
.@@@@@@..@@@@..@@@@..@@@@@@.
.@..........@..@..........@.
.@..........@..@..........@.
.@@@@@@@@@@@@@@@@@@@@@@@@@@.
............................
`.split('\n')
    .filter(line => line.length > 0)
    .map(line => {
        let parsedLine = []
        for (let char = 0; char < line.length; char++) {
            parsedLine.push(line[char] === '@')
        }
        return parsedLine
    })

const TraversablePath = {
    /**
     * @private
     * @param {Position} startingPosition
     * @param {Direction} intendedDirection
     */
    distanceToWall: function(startingPosition, intendedDirection) {
        let loop = {
            from: undefined,
            to: undefined,
            increment: undefined,
            nextPosition: undefined,
            shouldLoop: undefined,
        }
        switch (intendedDirection) {
            case Direction.up:
                loop.from = startingPosition.tileX
                loop.to = 0
                loop.increment = -1
                loop.nextPosition = (x, y, i) => {return {x: x, y: y + i}}
                loop.shouldLoop = function(iterator) { return iterator > this.to }
                break
            case Direction.down:
                loop.from = startingPosition.tileX
                loop.to = config.rows - 1
                loop.increment = 1
                loop.nextPosition = (x, y, i) => {return {x: x, y: y + i}}
                loop.shouldLoop = function(iterator) { return iterator < this.to }
                break
            case Direction.left:
                loop.from = startingPosition.tileY
                loop.to = 0
                loop.increment = -1
                loop.nextPosition = (x, y, i) => {return {x: x + i, y: y}}
                loop.shouldLoop = function(iterator) { return iterator > this.to }
                break
            case Direction.right:
                loop.from = startingPosition.tileY
                loop.to = config.columns - 1
                loop.increment = 1
                loop.nextPosition = (x, y, i) => {return {x: x + i, y: y}}
                loop.shouldLoop = function(iterator) { return iterator < this.to }
                break
        }

        let x, y
        for (let i = loop.from; loop.shouldLoop(i); i += loop.increment) {
            let result = loop.nextPosition(startingPosition.tileX, startingPosition.tileY, i)
            x = result.x
            y = result.y

            if (map[y][x] === false) {
                break // not traversable
            }
        }

        if ([Direction.left, Direction.right].includes(intendedDirection)) {
            return Math.abs(startingPosition.tileX - (tileSize * x))
        } else {
            return Math.abs(startingPosition.tileY - (tileSize * y))
        }
    },

    /**
     * Returns the amount of pixels that can be traveled in the intended
     * direction, starting at the given position.
     *
     * @param {Position} startingPosition
     * @param {Direction} intendedDirection Direction to move to
     * @param {number} intendedDistance Distance to travel in pixels. Will return less than this value if there is not enough space.
     * @returns {number} Amount of pixels that can be traveled.
     */
    distanceTo: function(startingPosition, intendedDirection, intendedDistance) {
        const allowedDistance = this.distanceToWall(startingPosition, intendedDirection)

        if (allowedDistance === 0) {
            return 0
        }

        if (allowedDistance > intendedDistance) {
            return intendedDistance
        }

        return allowedDistance - intendedDistance
    },
}

export default TraversablePath