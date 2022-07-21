import PelletsMap from "./PelletsMap";
import config from '../config';
import PelletType from "../enums/PelletType";
import Ticker from "../characters/Ticker";

const { tileSize } = config

class Pellets {
    /**
     * @private
     * @type {CanvasRenderingContext2D}
     */
    context = undefined

    /**
     * @type {HTMLImageElement}
     */
    pelletImage = undefined

    /**
     * @type {HTMLImageElement}
     */
    powerUpImage = undefined

    /**
     * @type {[number[]]}
     */
    powerUpLocations = []

    /**
     * Pellets to eat
     * @type {[number[]]}
     */
    availablePellets = []

    /**
     * @type {boolean}
     */
    powerUpBlinkIsOn = true

    /**
     * @type {Ticker}
     */
    ticker = new Ticker([
        this.onTick.bind(this)
    ])

    /**
     * @returns {Promise<unknown>}
     */
    load() {
        return new Promise((resolve) => {
            this.context = document.getElementById('pellets').getContext('2d')
            this.preloadImages().then(() => {
                this.parseMap()
                resolve()
            })
        })
        /*
        document.getElementById('characters').addEventListener('character-position', (e) => {
            let character = e.detail
            if (character.type === 'player') {
                maybeEatPellet(context, character.x, character.y)
            }
        })
        */
    }

    /**
     * Parses the pellet map
     * @private
     */
    parseMap() {
        this.availablePellets = []
        PelletsMap.forEach((row, rowIndex) => {
            this.availablePellets.push([])
            row.forEach((type, colIndex) => {
                this.availablePellets[rowIndex].push(type)
                if (PelletType.powerUp === type) {
                    this.powerUpLocations.push([rowIndex, colIndex])
                }

                if (PelletType.none === type) {
                    return
                }
                this.paint(type, colIndex * tileSize, rowIndex * tileSize)
            })
        })
    }

    /**
     * @returns {Promise<unknown>}
     * @private
     */
    preloadImages() {
        return new Promise((resolve) => {
            let loadedCount = 0

            this.pelletImage = new Image()
            this.pelletImage.onload = () => ++loadedCount >= 2 ? resolve() : 0
            this.pelletImage.src = require('../animations/pellet.svg')

            this.powerUpImage = new Image()
            this.powerUpImage.onload = () => ++loadedCount >= 2 ? resolve() : 0
            this.powerUpImage.src = require('../animations/power-up.svg')
        })
    }

    /**
     * @param x
     * @param y
     */
    maybeEatPellet(x, y) {
        if ([PelletType.normal, PelletType.powerUp].includes(this.availablePellets[y][x])) {
            this.context.clearRect(x * tileSize, y * tileSize, tileSize, tileSize)
        }
    }

    /**
     * @param {PelletType} type
     * @param {number} x
     * @param {number} y
     */
    paint(type, x, y) {
        this.context.drawImage(
            type === PelletType.powerUp ? this.powerUpImage : this.pelletImage, x, y
        )
   }

   /**
     * @param {DOMHighResTimeStamp} elapsedTime
    * @protected
     */
    onTick(elapsedTime) {
        if (elapsedTime >= 155) {
            this.blinkPowerUps()
            this.ticker.resetElapsedTime()
        }
    }

    blinkPowerUps() {
        if (!this.powerUpBlinkIsOn) {
            this.powerUpLocations.map(([x,y]) => {
                if (this.availablePellets[x][y] === 2) {
                    this.context.drawImage(
                        this.powerUpImage,
                        y * tileSize,
                        x * tileSize
                    )
                }
            })
        } else {
            this.powerUpLocations.map(([x,y]) => {
                this.context.clearRect(
                    y * tileSize,
                    x * tileSize,
                    tileSize,
                    tileSize
                )
            })
        }

        this.powerUpBlinkIsOn = !this.powerUpBlinkIsOn
    }
}

export default Pellets
