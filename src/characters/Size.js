export default class Size {
    /**
     * @type {number}
     */
    width = undefined

    /**
     * @type {number}
     */
    height = undefined

    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        this.width = width
        this.height = height
    }
}