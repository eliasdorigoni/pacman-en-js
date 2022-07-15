// Está hardcodeado en los SVG el tamaño 40 pixeles.
window.tileSize = 40

function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}