/**
 * Handles the callback from window.requestAnimationFrame()
 */
export default class Ticker {
    /**
     * @private
     * @type {DOMHighResTimeStamp}
     */
    lastTimestamp = 0

    /**
     * @private
     * @type {DOMHighResTimeStamp}
     */
    elapsedTime = 0

    /**
     * @public
     * @type {array}
     */
    onTick = []

    /**
     *
     * @param onTickCallback
     * @param {function[]} onTickCallback
     */
    constructor(onTickCallback) {
        this.onTick = onTickCallback
    }

    /**
     * @public
     */
    resetElapsedTime() {
        this.elapsedTime = 0
    }

    /**
     * Handles requestAnimationFrame callback.
     * Calls 'onTick' that should be implemented in the class extending this one.
     *
     * @public
     * @param {DOMHighResTimeStamp} timestamp
     */
    tick(timestamp) {
        this.elapsedTime += timestamp - this.lastTimestamp
        this.lastTimestamp = timestamp
        this.onTick.map(callback => {
            callback(this.elapsedTime)
        })
    }
}