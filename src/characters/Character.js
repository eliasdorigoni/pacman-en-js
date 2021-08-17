import options from './../config/options.yaml';
import walkablePath from './walkable-path.json'

class Character {
    position = {
        x: 1,
        y: 1,
    }

    frame = 1 // cuadro de la pantalla, 60 por segundo (FPS)
    moveOnFrames = []
    transitionOnFrames = []

    sprites = [] // diseños del personaje
    animations = {
        sprites: {
            idle: [],
            up: [],
            down: [],
            left: [],
            right: [],
        },
        paint: true,
        currentName: 'idle',
        currentKey: 0, // 0, 1, 2, 3 ...

        /*
        Número entre -3 y 4 (inclusive).
        Pacman puede cambiar de dirección en cualquier offset pero los fantasmas sólo en 0.
        */
        xOffset: 0,
        yOffset: 0,
    }
    spriteSize = 32

    direction = {
        current: '',
        queued: '',
        isMoving: false,
    }

    constructor(config) {
        this.context = config.context
        this.walkablePath = walkablePath

        if (typeof config.x === 'number') {
            this.position.x = config.x
        }

        if (typeof config.y === 'number') {
            this.position.y = config.y
        }

        if (typeof config.xOffset === 'number') {
            this.animations.xOffset = config.xOffset
        }

        if (typeof config.yOffset === 'number') {
            this.animations.yOffset = config.yOffset
        }

        if (typeof config.spriteSize === 'number') {
            // El sprite es más grande que el tile, y hay que centrarlo
            this.spriteSize = config.spriteSize
            this.spriteOffset = Math.round((config.spriteSize - options.tileSize) / 2)
        }

        if (config.enableControls) {
            this.enableArrowControls()
        }

        // Calcula en qué frames cambia la posición del personaje cuando se está moviendo
        const factor = 60 / config.speed
        for (let i = 1; i <= config.speed; i++) {
            this.moveOnFrames.push(Math.round(factor * i))
        }
        console.log(this.moveOnFrames)
    }

    /**
     * Carga todos los frames del Character en this.sprites
     *
     * @param {array} sprites Lista de imagenes en SVG
     * @returns Promise
     */
    loadAnimationSprites(sprites, keys) {
        let expectedFrameCount = sprites.length,
            loadedFrameCount = 0

        this.animations.sprites = keys

        return new Promise((resolve, reject) => {
            sprites.map(frame => {
                let image = new Image()
                image.onload = () => {
                    if (++loadedFrameCount >= expectedFrameCount) {
                        resolve()
                    }
                }
                image.src = frame
                this.sprites.push(image)
            })
        })
    }

    /**
     * Retorna el sprite actual
     * @returns Image
     */
    getCurrentSprite() {
        const key = this.animations.sprites[this.animations.currentName][this.animations.currentKey]
        return this.sprites[key]
    }

    /**
     * Dibuja el personaje de acuerdo a las propiedades actuales
     */
    paint() {
        this.context.drawImage(
            this.getCurrentSprite(),
            ((this.position.x * options.tileSize) - this.spriteOffset) + this.animations.xOffset,
            ((this.position.y * options.tileSize) - this.spriteOffset) + this.animations.yOffset
        )

        // TODO: disparar los eventos para indicar la posición actual
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
    enableArrowControls() {
        document.onkeydown = (e) => {
            if (['ArrowUp', 'W', 'w'].includes(e.key)) {
                this.changeDirection('up');
            }

            if (['ArrowRight', 'D', 'd'].includes(e.key)) {
                this.changeDirection('right');
            }

            if (['ArrowDown', 'S', 's'].includes(e.key)) {
                this.changeDirection('down');
            }

            if (['ArrowLeft', 'A', 'a'].includes(e.key)) {
                this.changeDirection('left');
            }
        }
    }

    /**
     * @param {integer} frame Cuadro tickeado (60 por segundo)
     */
    tick(frame) {
        this.prepareNextFrame()
        this.paint()
    }


    /**
     * Actualiza las props para pintar el siguiente cuadro. Llamar inmediatamente
     * antes de pintar.
     */
    prepareNextFrame(onPositionChange) {
        this.frame = this.frame < 60 ? this.frame + 1 : 1

        if (!this.direction.isMoving) {
            return
        }

        this.unpaint()

        const shouldMove = this.moveOnFrames.includes(this.frame)

        if (this.canMoveTo(this.direction.queued)) {
            this.animations.currentName = this.direction.queued
            this.animations.currentKey = 0
            this.direction.current = this.direction.queued
            this.direction.queued = ''

        } else if (!this.canMoveTo(this.direction.current)) {
            this.direction.current = ''
            this.direction.isMoving = false
        }

        if (!shouldMove) {
            return
        }

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

        // TODO: agregar callback

        const currentFrameKeys = this.animations.sprites[this.animations.currentName]
        if (this.animations.currentKey < currentFrameKeys.length - 1) {
            this.animations.currentKey++
        } else {
            this.animations.currentKey = 0
        }
    }

    /**
     * Cambia la dirección del personaje y lo pone en movimiento.
     *
     * @param {string} direction 'up', 'down', 'left', 'right'
     */
    changeDirection(direction) {
        if (!this.canMoveTo(direction)) {
            if (this.direction.isMoving) {
                this.direction.queued = direction
            }
            return
        }

        this.direction.queued = ''
        this.direction.current = direction
        this.direction.isMoving = true

        this.animations.currentName = direction
        this.animations.currentKey = 0
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
        if (walkablePath[this.position.y - 1][this.position.x] === 1) {
            allowedMoves.push('up')
        }

        if (walkablePath[this.position.y + 1][this.position.x] === 1) {
            allowedMoves.push('down')
        }

        if (walkablePath[this.position.y][this.position.x - 1] === 1) {
            allowedMoves.push('left')
        }

        if (walkablePath[this.position.y][this.position.x + 1] === 1) {
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
                if (col === 1) {
                    if (isVisible) {
                        context.fillStyle = 'rgba(0,255,0,0.35)'
                        context.fillRect(
                            config.tileSize * colIndex,
                            config.tileSize * rowIndex,
                            config.tileSize,
                            config.tileSize
                        )
                    } else {
                        this.context.clearRect(
                            config.tileSize * colIndex,
                            config.tileSize * rowIndex,
                            options.tileSize,
                            options.tileSize
                        )
                    }
                }
            })
        })
    }
}

export default Character