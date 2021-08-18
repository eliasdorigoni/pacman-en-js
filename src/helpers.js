import options from './config/options.yaml'

const ready = (fn) => {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

export default ready