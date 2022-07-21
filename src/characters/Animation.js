import Direction from "../enums/Direction";
import Size from "./Size"

/**
 * A character's animation has a number of frames,
 * that are grouped into sequences,
 * that can be found
 */
export default class Animation {
    /**
     * Loaded animation frames.
     *
     * @type {HTMLImageElement[]}
     */
    frames = []

    /**
     * Sequences of frames grouped by direction.
     *
     * @type {Object<Direction, number[]>}
     */
    sequences = {}

    /**
     * @type {Direction}
     */
    currentSequence = undefined

    /**
     * @type {number[]}
     */
    currentSequenceAvailableIndexes = undefined

    /**
     * Index in sequences property
     * @type {number}
     */
    currentSequenceIndex = undefined

    /**
     * Display duration of any single frame, in milliseconds
     * @type {number}
     */
    frameDuration = undefined

    /**
     * Returns the current frame and queues the next one
     * @returns {HTMLImageElement}
     */
    get currentFrame() {
        const index = this.sequences[this.currentSequence][this.currentSequenceIndex]
        return this.frames[index]
    }

    /**
     * Loads all animation frames.
     *
     * @param {string[]} frames
     * @returns {Promise<unknown>}
     */
    loadFrames(frames) {
        let count = frames.length,
            loadedCount = 0

        return new Promise((resolve) => {
            frames.map(frame => {
                let image = new Image()
                image.onload = () => {
                    if (++loadedCount >= count) {
                        resolve()
                    }
                }
                image.src = frame
                this.frames.push(image)
            })
        })
    }

    /**
     * Sets an animation sequence for a specific direction.
     *
     * @param {Direction} state
     * @param {number[]} keys
     */
    defineSequence(state, keys) {
        this.sequences[state] = keys
    }

    prepareNextFrame() {
        // TODO: a frame shouldn't change on EVERY paint. Check the timestamp and other variables.
        if (this.currentSequenceAvailableIndexes.includes(this.currentSequenceIndex + 1)) {
            this.currentSequenceIndex += 1
        } else {
            this.currentSequenceIndex = 0
        }
    }

    /**
     * Updates the current animation.
     *
     * @param {Direction} key
     */
    updateAnimation(key) {
        this.currentSequence = key
        this.currentSequenceIndex = 0
        this.currentSequenceAvailableIndexes = [...Array(this.sequences[key].length - 1).keys()]
    }
}