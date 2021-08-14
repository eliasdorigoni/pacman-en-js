import Character from './../components/Character'
import WalkablePath from './../config/character-walkable-path.json'

const Pacman = () => {
    const char = new Character({
        context: document.getElementById('pacman').getContext('2d'),
        startingX: 1,
        startingY: 1,
        speed: 11,
        walkablePath: WalkablePath,
    })

    char.enableArrowControls()

    let start
    const maybePaintCharacter = (timestamp) => {
        if (start === undefined) {
            start = timestamp;
        }

        const elapsed = timestamp - start;
        if (elapsed >= 16) {
            start = timestamp
            char.prepareNextFrame()
            char.paint()
        }

        window.requestAnimationFrame(maybePaintCharacter);
    }

    const animationSprites = [
        require('./sprites/closed.svg'), // 0
        require('./sprites/up-big.svg'), // 1
        require('./sprites/up-small.svg'), // 2
        require('./sprites/down-big.svg'), // 3
        require('./sprites/down-small.svg'), // 4
        require('./sprites/left-big.svg'), // 5
        require('./sprites/left-small.svg'), // 6
        require('./sprites/right-big.svg'), // 7
        require('./sprites/right-small.svg'), // 8
    ]

    const animationKeys = {
        idle: [8],
        up: [0, 1, 2],
        down: [0, 3, 4],
        left: [0, 5, 6],
        right: [0, 7, 8],
    }

    char.loadAnimationSprites(animationSprites, animationKeys)
        .then(() => {
            window.requestAnimationFrame(maybePaintCharacter);
        })

}

export default Pacman