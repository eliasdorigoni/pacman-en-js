# Fuentes

* https://www.slideshare.net/grimlockt/pac-man-6561257


## World.json

Cada mosaico (tile) del mundo es un array de 2 números. El primero indica el
estilo del bloque a usar:
    0 -> vacío
    1 -> wall
    2 -> wall-end
    3 -> corner
    4 -> ghost-exit
    5 -> ghost-exit-joint
    6 -> t-intersection

El segundo indica la variante del bloque (la rotación).