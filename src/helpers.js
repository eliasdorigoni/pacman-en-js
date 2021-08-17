import options from './config/options.yaml'

const ready = (fn) => {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

export default ready

export function triggerEvery60FramesPerSecond(callback) {
    let start,
        frameCount = 1

    const tick = (timestamp) => {
        if (start === undefined) {
            start = timestamp;
        }
        const elapsed = timestamp - start;

        if (elapsed >= 16) {
            start = timestamp
            callback(frameCount++)
            if (frameCount === 60) {
                frameCount = 1
            }
        }

        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
}
