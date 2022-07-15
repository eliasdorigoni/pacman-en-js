import options from '../config.yaml';
import walkablePath from './walkable-path.json'

class Character {
    context = undefined
    walkablePath = walkablePath

    position = {
        tile: [1, 1], // x, y
        precise: [1.0, 1.0], // x, y
        fixedPrecise: [1.0, 1.0], // igual a precise pero ajustado por offset
        changed: true,
    }
    speed = 11.0 // Velocidad base (tiles por segundo transcurrido)
    distancePerMs = 1.0 // Distancia recorrida (en píxeles) por milisegundo transcurrido.
    lastTimestamp = 0.0
    elapsedTime = 0.0

    direction = {
        current: '',
        isMoving: false,
    }

    sprites = [] // Archivos del personaje
    spriteSize = [32, 32] // Tamaño en píxeles, ancho / alto
    spriteOffset = [0, 0] // Si el sprite tiene más de 32px hay que centrarlo.
    animations = {
        keys: {
            idle:  [],
            up:    [],
            down:  [],
            left:  [],
            right: [],
        },
        current: {
            index: 0,
            sprites: [],
        }
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {array} startingPosition Posición precisa (X / Y)
     * @param {array} spriteSize Tamaño en píxeles (ancho / alto)
     */
    constructor(context, startingPosition, spriteSize) {
        this.context = context
        this.position.tile = startingPosition
        this.spriteSize = spriteSize
        this.spriteOffset = spriteSize.map(size => Math.round((size - options.tileSize) / 2))

        this.calculateSpeed()
        this.setPosition(startingPosition[0], startingPosition[1])
    }

    /**
     * Calcula la velocidad del personaje y las distancias
     */
    calculateSpeed() {
        this.distancePerMs = (this.speed / 1000) * options.tileSize
    }

    /**
     * Define la posición precisa y la del tile
     *
     * @param {float} preciseX
     * @param {float} preciseY
     */
    setPosition(preciseX, preciseY) {
        this.position.precise = [preciseX, preciseY]
        this.position.fixedPrecise = [
            preciseX - this.spriteOffset[0],
            preciseY - this.spriteOffset[1],
        ]
        this.position.tile = this.position.precise.map(pos => Math.floor(pos / options.tileSize))
    }

    /**
     * Carga todos los frames del Character en this.sprites
     *
     * @param {array} sprites Lista de imagenes en SVG
     * @param keys
     * @returns Promise
     */
    loadAnimationSprites(sprites, keys) {
        let expectedFrameCount = sprites.length,
            loadedFramesCount = 0

        this.animations.keys = keys

        return new Promise((res) => {
            sprites.map(frame => {
                let image = new Image()
                image.onload = () => {
                    if (++loadedFramesCount >= expectedFrameCount) {
                        res()
                    }
                }
                image.src = frame
                this.sprites.push(image)
            })
        })
    }

    /**
     * Dibuja el personaje de acuerdo a las propiedades actuales
     */
    paint() {
        this.context.drawImage(
            this.animations.current.sprites[this.animations.current.index],
            this.position.fixedPrecise[0],
            this.position.fixedPrecise[1]
        )
        // TODO: disparar evento para indicar la posición actual
    }

    /**
     * Elimina la posición actual
     */
    unpaint() {
        this.context.clearRect(
            ((this.position.x * options.tileSize) - this.spriteOffset) + this.animations.xOffset,
            ((this.position.y * options.tileSize) - this.spriteOffset) + this.animations.yOffset,
            this.spriteSize,
            this.spriteSize
        )
    }

    /**
     * Activa el control mediante las flechas para este personaje
     */
    enableControls() {
        document.onkeydown = (e) => {
            switch (e.key.toLowerCase()) {
                case 'arrowup':
                case 'w':
                    this.changeDirection('up')
                    break
                case 'arrowright':
                case 'd':
                    this.changeDirection('right')
                    break
                case 'arrowdown':
                case 's':
                    this.changeDirection('down')
                    break
                case 'arrowleft':
                case 'a':
                    this.changeDirection('left')
                    break
            }
        }
    }

    /**
     * @param {int} timestamp Cuadro tickeado (60 por segundo)
     */
    tick(timestamp) {
        if (!this.direction.isMoving) {
            // TODO: hacer algo?
            return
        }

        if (!this.canMoveTo(this.direction.current)) {
            this.direction.current = ''
            this.direction.isMoving = false
        }

        // TODO: calcular teleport
        /*
        if (
            this.position.x === options.teleport.l2r && this.position.y === options.teleport.row && this.direction.current === 'left'
        ) {
            this.position.x = options.teleport.r2l

        } else if (
            this.position.x === options.teleport.r2l && this.position.y === options.teleport.row && this.direction.current === 'right'
        ) {
            this.position.x = options.teleport.l2r
        } else if (this.direction.current === 'up') {
            this.position.y--
        } else if (this.direction.current === 'down') {
            this.position.y++
        } else if (this.direction.current === 'left') {
            this.position.x--
        } else if (this.direction.current === 'right') {
            this.position.x++
        }
        */

        this.unpaint()
        this.calculateFrame()
        this.paint()
    }

    /**
     * Actualiza las props para pintar el siguiente cuadro.
     */
     calculateFrame() {
        if (!this.position.changed) {
            return
        }

        // Avanza la animación
        if ((this.animations.current.sprites.length - 1) === this.animations.current.key) {
            this.animations.current.key = 0
        } else {
            this.animations.current.key += 1
        }
    }

    /**
     * Cambia la dirección del personaje.
     *
     * @param {string} newDirection 'up', 'down', 'left', 'right'
     */
    changeDirection(newDirection) {
        if (!this.canMoveTo(newDirection)) {
            return
        }

        this.direction.current = newDirection
        this.direction.isMoving = true

        this.animations.current.index = 0
        this.animations.current.sprites = this.animations.keys[newDirection].map(key => this.sprites[key])
    }

    /**
     * Retorna los movimientos válidos para la posición recibida
     *
     * @param {int} x Posición horizontal
     * @param {int} y Posición vertical
     * @returns {array} Array de direcciones posibles 'up', 'down', 'left', 'right'
     */
    getAllowedMoves(x, y) {
        if (y === options.teleport.row && (x === options.teleport.l2r || x === options.teleport.r2l)) {
            return ['left', 'right']
        }

        let allowedMoves = []

        if (this.walkablePath[this.position.tile[1] - 1][this.position.tile[0]] === 1) {
            allowedMoves.push('up')
        }

        if (this.walkablePath[this.position.tile[1] + 1][this.position.tile[0]] === 1) {
            allowedMoves.push('down')
        }

        if (this.walkablePath[this.position.tile[1]][this.position.tile[0] - 1] === 1) {
            allowedMoves.push('left')
        }

        if (this.walkablePath[this.position.tile[1]][this.position.tile[0] + 1] === 1) {
            allowedMoves.push('right')
        }

        return allowedMoves
    }

    canMoveTo(direction) {
        return this.getAllowedMoves(this.position.x, this.position.y).includes(direction)
    }

    toggleWalkableTiles = (isVisible) => {
        walkablePath.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (col !== 1) {
                    return
                }
                if (isVisible) {
                    context.fillStyle = 'rgba(0,255,0,0.35)'
                    context.fillRect(
                        options.tileSize * colIndex,
                        options.tileSize * rowIndex,
                        options.tileSize,
                        options.tileSize
                    )
                } else {
                    this.context.clearRect(
                        options.tileSize * colIndex,
                        options.tileSize * rowIndex,
                        options.tileSize,
                        options.tileSize
                    )
                }
            })
        })
    }

    setIdleAnimation() {
        this.direction.current = 'idle'
        this.direction.isMoving = false

        this.animations.current.index = 0
        this.animations.current.sprites = this.animations.keys.idle.map(key => this.sprites[key])
    }
}

export default Character