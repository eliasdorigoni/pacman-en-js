const event = new CustomEvent('character-position', { character: this });

const Character = {
    canvas: null,
    ctx: null, // context de canvas
    type: null,
    event: null,
    x: 0, y: 0,
    animations: {
        idle: [],
        up: [],
        down: [],
        left: [],
        right: [],

        currentAnimation: [],
        nextFrame: 0,
        lastFrame: null,
    },
    movement: {
        interval: null,
        isMoving: false,
    },
    direction: {
        current: '',
        queued: '',
    },

    begin: function(canvas, ctx, type, startingX, startingY) {
        this.canvas = canvas
        this.ctx = ctx
        this.type = type
        this.x = startingX
        this.y = startingY
        this.setAnimation('idle')
        this.draw()
    },
    draw: function() {
        this.ctx.drawImage(
            this.animations.currentAnimation[this.animations.nextFrame],
            this.x * window.tileSize,
            this.y * window.tileSize
        )

        if (this.animations.nextFrame >= this.animations.lastFrame) {
            this.animations.nextFrame = 0
        } else {
            this.animations.nextFrame++
        }
    },
    undraw: function() {
        this.ctx.clearRect(
            this.x * window.tileSize,
            this.y * window.tileSize,
            window.tileSize, window.tileSize
        );
    },
    allowedMoves: function() {
        // Pasajes del medio
        if ((this.x === 0 || this.x === 20) && this.y === 13) {
            return ['left', 'right']
        }

        let walkables = []
        if (walkableTiles[this.y - 1][this.x] === 1) {
            walkables.push('up')
        }

        if (walkableTiles[this.y + 1][this.x] === 1) {
            walkables.push('down')
        }

        if (walkableTiles[this.y][this.x - 1] === 1) {
            walkables.push('left')
        }

        if (walkableTiles[this.y][this.x + 1] === 1) {
            walkables.push('right')
        }

        return walkables
    },
    canMoveTo: function(direction) {
        return this.allowedMoves().includes(direction)
    },
    moveTo: function(direction) {
        if (direction === this.direction.current) {
            return
        }

        if (!this.canMoveTo(direction)) {
            if (this.movement.isMoving) {
                this.direction.queued = direction
            }
            return
        }

        this.setAnimation(direction)
        this.direction.current = direction
        this.direction.queued = ''
        this.movement.isMoving = true

        clearInterval(this.movement.interval)
        this.movement.interval = setInterval(() => {
            this.undraw()
            if (this.direction.current === 'up') {
                this.y--
            } else if (this.direction.current === 'down') {
                this.y++
            } else if (this.direction.current === 'left') {
                this.x--
            } else if (this.direction.current === 'right') {
                this.x++
            }
            console.log('Moviendo -> ' + this.direction.current)
            this.draw()
            this.canvas.dispatchEvent(new CustomEvent('character-position', { detail: this }))

            if (this.canMoveTo(this.direction.queued)) {
                this.setAnimation(this.direction.queued)
                this.direction.current = this.direction.queued
                this.direction.queued = ''

            } else if (!this.canMoveTo(this.direction.current)) {
                this.direction.current = ''
                this.movement.isMoving = false
                clearInterval(this.movement.interval)
            }
        }, 91)
    },
    setAnimation(direction) {
        this.animations.currentAnimation = this.animations[direction]
        this.animations.lastFrame = this.animations[direction].length - 1
        this.animations.nextFrame = 0
    },
    loadAnimations(groups, callback) {
        let animationsCount = 0,
            loadedImagesCount = 0


        for (const key in groups) {
            if (Object.hasOwnProperty.call(groups, key)) {
                const element = groups[key]
                animationsCount += element.length
                this.animations[key] = element.map((src) => {
                    let img = new Image()
                    img.onload = () => {
                        if (++loadedImagesCount >= animationsCount) {
                            if (typeof callback === 'function') {
                                this.setAnimation('idle')
                                callback()
                            }
                        }
                    }
                    img.src = src
                    return img
                })
            }
        }
    },
}

let pacman = Object.assign({}, Character),
    blinky = Object.assign({}, Character),
    inky = Object.assign({}, Character),
    pinky = Object.assign({}, Character),
    clyde = Object.assign({}, Character)

// 0: no, 1: sí (jugador y cpu), 2: sí (solo cpu)
const walkableTiles = [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0 ],
    [ 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0 ],
    [ 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0 ],
    [ 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0 ],
    [ 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1 ],
    [ 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0 ],
    [ 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0 ],
    [ 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0 ],
    [ 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
];

const preloadCharacters = (callback) => {
    pacman.loadAnimations({
        idle: [
            'svg/characters/pacman/right-smaller.svg',
        ],
        up: [
            'svg/characters/pacman/up-smaller.svg',
            'svg/characters/pacman/up-small.svg',
            'svg/characters/pacman/closed.svg',
            'svg/characters/pacman/up-small.svg',
        ],
        right: [
            'svg/characters/pacman/right-smaller.svg',
            'svg/characters/pacman/right-small.svg',
            'svg/characters/pacman/closed.svg',
            'svg/characters/pacman/right-small.svg',
        ],
        down: [
            'svg/characters/pacman/down-smaller.svg',
            'svg/characters/pacman/down-small.svg',
            'svg/characters/pacman/closed.svg',
            'svg/characters/pacman/down-small.svg',
        ],
        left: [
            'svg/characters/pacman/left-smaller.svg',
            'svg/characters/pacman/left-small.svg',
            'svg/characters/pacman/closed.svg',
            'svg/characters/pacman/left-small.svg',
        ],
    }, callback)

    /*
    blinky.animations.idle[0] = new Image()
    blinky.animations.idle[0].onload = () => { if (++loadedCount >= 5) resolve() }
    blinky.animations.idle[0].src = 'svg/characters/blinky.svg'

    inky.animations.idle[0] = new Image()
    inky.animations.idle[0].onload = () => { if (++loadedCount >= 5) resolve() }
    inky.animations.idle[0].src = 'svg/characters/inky.svg'

    pinky.animations.idle[0] = new Image()
    pinky.animations.idle[0].onload = () => { if (++loadedCount >= 5) resolve() }
    pinky.animations.idle[0].src = 'svg/characters/pinky.svg'

    clyde.animations.idle[0] = new Image()
    clyde.animations.idle[0].onload = () => { if (++loadedCount >= 5) resolve() }
    clyde.animations.idle[0].src = 'svg/characters/clyde.svg'
    */
}


const setUpControls = () => {
    document.onkeydown = function(e) {
        if (e.key === 'ArrowUp')    { pacman.moveTo('up') }
        if (e.key === 'ArrowRight') { pacman.moveTo('right') }
        if (e.key === 'ArrowDown')  { pacman.moveTo('down') }
        if (e.key === 'ArrowLeft')  { pacman.moveTo('left') }
    }
}

const showWalkableTiles = (ctx) => {
    walkableTiles.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col === 1) {
                ctx.fillStyle = 'rgba(0,255,0,0.75)';
                ctx.fillRect(
                    window.tileSize * colIndex,
                    window.tileSize * rowIndex,
                    window.tileSize,
                    window.tileSize
                );
            } else if (col === 2) {
                ctx.fillStyle = 'rgba(255,0,0,0.75)';
                ctx.fillRect(
                    window.tileSize * colIndex,
                    window.tileSize * rowIndex,
                    window.tileSize,
                    window.tileSize
                );
            }
        });
    });
}

ready(() => {
    let canvas = document.getElementById('characters')
    let ctx = document.getElementById('characters').getContext('2d')
    preloadCharacters(() => {
        pacman.begin(canvas, ctx, 'player', 10, 15)

        // blinky.begin(context, 'cpu', 10, 12)
        // clyde.begin(context, 'cpu', 11, 13)
        // inky.begin(context, 'cpu', 9, 13)
        // pinky.begin(context, 'cpu', 10, 13)

        setUpControls()
        // showWalkableTiles(context)
    })

})