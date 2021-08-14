import options from './../config/options.yaml';
import walkablePath from './../config/character-walkable-path.json'

class Character {
    x = 1
    y = 1

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
        voffset: 0,
        hoffset: 0,
    }
    spriteSize = 32
    spriteOffset = 0

    direction = {
        current: '',
        queued: '',
        isMoving: false,
    }

    constructor(config) {
        this.context = config.context
        this.x = config.startingX
        this.y = config.startingY
        this.spriteSize = config.spriteSize
        this.spriteOffset = Math.round((config.spriteSize - options.tileSize) / 2)

        // Calcula en qué frames cambiar la posición del personaje
        const factor = 60 / config.speed
        for (let i = 1; i <= config.speed; i++) {
            this.moveOnFrames.push(Math.round(factor * i))
        }

        this.walkablePath = config.walkablePath
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
            this.x * options.tileSize - this.spriteOffset,
            this.y * options.tileSize - this.spriteOffset
        )

        // TODO: disparar los eventos para indicar la posición actual
    }

    /**
     * Elimina la posición actual
     */
    unpaint() {
        this.context.clearRect(
            this.x * options.tileSize - this.spriteOffset,
            this.y * options.tileSize - this.spriteOffset,
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
     * Actualiza las props para pintar el siguiente cuadro. Llamar inmediatamente
     * antes de pintar.
     */
    prepareNextFrame() {
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
            this.x === options.teleport.l2r && this.y === options.teleport.row && this.direction.current === 'left'
        ) {
            this.x = options.teleport.r2l

        } else if (
            this.x === options.teleport.r2l && this.y === options.teleport.row && this.direction.current === 'right'
        ) {
            this.x = options.teleport.l2r
        } else if (this.direction.current === 'up') {
            this.y--
        } else if (this.direction.current === 'down') {
            this.y++
        } else if (this.direction.current === 'left') {
            this.x--
        } else if (this.direction.current === 'right') {
            this.x++
        }

        // TODO: emitir evento o llamar callbacks sobre el cambio de posición

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
        if (walkablePath[this.y - 1][this.x] === 1) {
            allowedMoves.push('up')
        }

        if (walkablePath[this.y + 1][this.x] === 1) {
            allowedMoves.push('down')
        }

        if (walkablePath[this.y][this.x - 1] === 1) {
            allowedMoves.push('left')
        }

        if (walkablePath[this.y][this.x + 1] === 1) {
            allowedMoves.push('right')
        }

        return allowedMoves
    }

    canMoveTo(direction) {
        return this.getAllowedMoves(this.x, this.y).includes(direction)
    }
}

export default Character