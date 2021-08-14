import config from './../../config.yaml';
import walkablePath from './walkable-path.json'
import Character from './Character'

const event = new CustomEvent('character-position', { character: this })

let pacman = Object.assign({}, Character)

const preloadCharacters = (callback) => {
    pacman.loadAnimations({
        idle: [
            require('./pacman/sprites/right-small.svg'),
        ],
        up: [
            require('./pacman/sprites/up-small.svg'),
            require('./pacman/sprites/up-big.svg'),
            require('./pacman/sprites/closed.svg'),
            require('./pacman/sprites/up-big.svg'),
        ],
        right: [
            require('./pacman/sprites/right-small.svg'),
            require('./pacman/sprites/right-big.svg'),
            require('./pacman/sprites/closed.svg'),
            require('./pacman/sprites/right-big.svg'),
        ],
        down: [
            require('./pacman/sprites/down-small.svg'),
            require('./pacman/sprites/down-big.svg'),
            require('./pacman/sprites/closed.svg'),
            require('./pacman/sprites/down-big.svg'),
        ],
        left: [
            require('./pacman/sprites/left-small.svg'),
            require('./pacman/sprites/left-big.svg'),
            require('./pacman/sprites/closed.svg'),
            require('./pacman/sprites/left-big.svg'),
        ],
    }, callback)
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
    walkablePath.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col === 1) {
                ctx.fillStyle = 'rgba(0,255,0,0.35)'
                ctx.fillRect(
                    config.tileSize * colIndex,
                    config.tileSize * rowIndex,
                    config.tileSize,
                    config.tileSize
                )
            } else if (col === 2) {
                ctx.fillStyle = 'rgba(255,0,0,0.35)'
                ctx.fillRect(
                    config.tileSize * colIndex,
                    config.tileSize * rowIndex,
                    config.tileSize,
                    config.tileSize
                )
            }
        })
    })
}

export default function() {
    let canvas = document.getElementById('characters')
    let ctx = document.getElementById('characters').getContext('2d')
    preloadCharacters(() => {
        pacman.begin(canvas, ctx, 'player', 13, 17)

        setUpControls()
        // showWalkableTiles(ctx)
    })
}
