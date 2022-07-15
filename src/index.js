import ready from './components/helpers'
import World from './components/world'
import Pellets from './components/pellets'
import Characters from './components/characters'
import config from './config.yaml'

const createElements = () => {
    let wrapper = document.createElement('div'),
    worldCanvas = document.createElement('canvas'),
    charactersCanvas = document.createElement('canvas'),
    pelletsCanvas = document.createElement('canvas')

    const canvasDimensions = `height:calc(22px*${config.rows});width:calc(22px*${config.columns});`
    const canvasPosition = 'position:absolute;top:0;left:0;'

    const size = {
        height: config.rows * config.tileSize,
        width: config.columns * config.tileSize,
    }

    worldCanvas.id = 'world'
    worldCanvas.width = size.width
    worldCanvas.height = size.height
    worldCanvas.style = canvasDimensions

    pelletsCanvas.id = 'pellets'
    pelletsCanvas.width = size.width
    pelletsCanvas.height = size.height
    pelletsCanvas.style = canvasDimensions + canvasPosition + 'z-index:2;'

    charactersCanvas.id = 'characters'
    charactersCanvas.width = size.width
    charactersCanvas.height = size.height
    charactersCanvas.style = canvasDimensions + canvasPosition + 'z-index:3;'

    wrapper.style = 'position:relative'
    wrapper.appendChild(charactersCanvas)
    wrapper.appendChild(pelletsCanvas)
    wrapper.appendChild(worldCanvas)
    document.querySelector('body').appendChild(wrapper)

}


ready(() => {
    createElements()
    World()
    Pellets()
    Characters()
})