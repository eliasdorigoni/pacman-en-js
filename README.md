**Under construction!**

This is Pacman in Javascript, as vanilla as it can be without impeding development.

Last build available at [pacman-en-js.netlify.app](https://pacman-en-js.netlify.app/)

# Installation

```shell
nvm install
npm start # runs the dev server at localhost:3000
```

Run `npm run build` to export compressed assets to the `/public` directory.

# About this version
This is just a version, as close to the original as possible, that can be played in the browser.

It runs on many transparent html canvases, that are drawn 60 times per second thanks to `window.requestAnimationFrame`. There is one canvas for each group: the world, all the pellets (the yellow points), Pacman and the ghosts.

Enemy AI is not the top priority, but I'll try to make it passable at least.

# References

* [The Pac-man Dossier - Gamasutra](https://www.gamasutra.com/view/feature/3938/the_pacman_dossier.php?print=1)
* [Designing Pac-man - Slideshare](https://www.slideshare.net/grimlockt/pac-man-6561257)
* [Arcade Game: Pac-Man (1980 Namco (Midway License for US release)) - YouTube](https://www.youtube.com/watch?v=dScq4P5gn4A)
