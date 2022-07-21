import config from "./config";

export function ready(fn) {
    if ('loading' !== document.readyState){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

export function setCanvasSizes() {
    const width = config.tileSize * config.columns
    const height = config.tileSize * config.rows

    document.querySelectorAll('canvas').forEach(canvas => {
        canvas.setAttribute('width', width.toString())
        canvas.setAttribute('height', height.toString())
    })
}

/**
 * @param {string[]} sources
 * @returns {Promise<unknown>}
 */
export function loadImages(sources) {
    const sourcesCount = sources.length
    let loadedCount = 0
    let loadedImages = []

    return new Promise((resolve) => {
        sources.map(source => {
            let image = new Image()
            image.onload = () => {
                if (++loadedCount === sourcesCount) {
                    resolve(loadedImages)
                }
            }
            image.src = source
            loadedImages.push(image)
        })
    })
}

/**
 * Returns the size in pixels of an amount of tiles.
 * @param {number} amount
 * @returns {number}
 */
export function tilesToPixels(amount) {
    return config.tileSize * amount
}