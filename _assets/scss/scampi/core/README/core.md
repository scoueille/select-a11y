<p class="info-file">Fichiers du répertoire /scampi/core/</p>

## Contenu du core

Fichiers importés dans le core :

```scss

// start
@import "../scampi/core/core-scampi-settings";
@import "../scampi/core/core-scampi-mixins";

// core
@import "../scampi/core/core-scampi-basics";

// end
@import "../scampi/core/core-scampi-helpers";

```

- **settings.scss** : configurations et variables utilisées dans les fichiers du core ou communes à plusieurs modules.
- **mixins** : mixins transverses utilisés dans le core ou communs à plusieurs modules.
- **basics** : `normalize.scss`, `normalize-plus` et `generic.scss` pour poser un socle harmonisé entre tous les navigateurs et styler par défaut les tags html.
- **helpers** : ensemble de classes à importer à la fin de la liste de tous les imports.

Ces fichiers sont détaillés et commentés dans les pages [basics](../basics.html), [helpers](../helpers.html), [mixins](..//mixins.html) et [settings](../settings.html). 


## Core ou base ?

Nous avons choisi de proposer Scampi sous forme de composants « autoportés ». Chacun d’eux peut être utilisé de façon autonome et chaque répertoire de module contient les sources Sass, les éventuels scripts et la documentation qui lui sont propres. C’est pourquoi le `core` est réduit à l’indispensable pour initier tout projet. 

Cependant, la plupart des projets réclameront des règles de base plus riches pour les éléments html et la présence de modules additionnels courants. 

Nous avons constitué la liste de cette *base* dans le fichier scampi/_test/scampi-base.scss.
