let worldTiles = []
let availablePellets = []

const preloadDot = new Promise((resolve, reject) => {
    let loadedCount = 0

    dotImg = new Image();
    dotImg.onload = () => {
        if (++loadedCount >= 2) {
            resolve()
        }
    }
    dotImg.src = 'svg/dot.svg'

    powerUpImg = new Image();
    powerUpImg.onload = () => {
        if (++loadedCount >= 2) {
            resolve()
        }
    }
    powerUpImg.src = 'svg/power-up.svg'
})

const drawPellets = (ctx) => {
    let xPos, yPos
    fetch('/data/pellets.json')
        .then(response => response.json())
        .then(pellets => {
            pellets.forEach((row, rowIndex) => {
                availablePellets = []
                row.forEach((col, colIndex) => {
                    yPos = rowIndex * window.tileSize
                    xPos = colIndex * window.tileSize
                    if (col === 1) {

                        ctx.drawImage(dotImg, xPos, yPos)
                    } else if (col === 2) {
                        ctx.drawImage(powerUpImg, xPos, yPos)
                    }
                });
            });
        })
}

const maybeEatPellet = (ctx, x, y) => {

}

const preloadWorldTiles = new Promise((resolve, reject) => {
    const groupedTiles = [
        [],
        ['wall-0', 'wall-180'],
        ['wall-end-0', 'wall-end-90', 'wall-end-180', 'wall-end-270'],
        ['corner-0', 'corner-90', 'corner-180', 'corner-270'],
        ['ghost-exit-0'],
        ['ghost-exit-joint-0', 'ghost-exit-joint-180'],
        ['t-intersection-0', 't-intersection-90', 't-intersection-180', 't-intersection-270'],
    ]

    let img,
        imgRow,
        loadedTiles = 0

    for (group in groupedTiles) {
        imgRow = []

        for (tile in groupedTiles[group]) {
            img = new Image();
            img.onload = () => {
                if (++loadedTiles >= 17) {
                    resolve()
                }
            }
            img.src = 'svg/world/' + groupedTiles[group][tile] + '.svg'
            imgRow.push(img)
        }

        worldTiles.push(imgRow)
    }
})

const drawWorld = (ctx) => {
    let xPos, yPos, style, variant

    fetch('/data/world.json')
        .then(response => response.json())
        .then(world => {
            world.forEach((row, rowIndex) => {
                row.forEach((col, colIndex) => {

                    yPos = rowIndex * window.tileSize
                    xPos = colIndex * window.tileSize

                    if (col[0] !== 0) {
                        style = col[0]
                        variant = col[1]
                        ctx.drawImage(worldTiles[style][variant], xPos, yPos)
                    }
                });
            });
        })
}

ready(() => {
    let canvas = document.getElementById('world')
    let context = canvas.getContext('2d')
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    preloadWorldTiles.then(() => drawWorld(context))
    preloadDot.then(() => drawPellets(context))

    document.getElementById('characters').addEventListener('character-position', (e) => {
        let character = e.detail
        if (character.type === 'player') {
            maybeEatPellet(context, character.x, character.y)
        }
    })
})