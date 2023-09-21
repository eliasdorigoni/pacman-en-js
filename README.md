This is web developer's first attempt at creating a game using web technologies.

For research and fun purposes I'm building a Pacman clone, as close to the first original version as possible, using mostly plain Javascript (with some help from Webpack) and documenting the process in [my blog](https://eliasdorigoni.com/categories/pacman).

## Are we there yet?
No! this is still under construction. The last build, if it works, is available at [pacman-en-js.netlify.app](https://pacman-en-js.netlify.app/)

# Installation

```shell
docker build . -t pacman/node-web-app
docker run -p 3000:3000 pacman/node-web-app
```

Execute `npm run build` to export compressed assets to the `/public` directory and serve that folder Apache, Nginx or whatever you like: it's all static files for the frontend.

# References

* [Gamasutra - The Pac-man Dossier](https://www.gamasutra.com/view/feature/3938/the_pacman_dossier.php?print=1) / ([alternative link](https://www.gamedeveloper.com/design/the-pac-man-dossier))
* [Slideshare - Designing Pac-man](https://www.slideshare.net/grimlockt/pac-man-6561257)
* [Youtube - Arcade Game: Pac-Man (1980 Namco (Midway License for US release))](https://www.youtube.com/watch?v=dScq4P5gn4A)
