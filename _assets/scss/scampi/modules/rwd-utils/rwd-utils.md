Présentation
------------

Utilitaires pour le responsive. Le setting d’activation est à true par défaut (`$enable-rwd: true !default;`).

Ils permettent de faire varier la largeur maximale des conteneurs et la taille des caractères en fonction du media query d’après des *map* définies dans les settings du projet.


Utilisation
-----------

Définir les maps si celles par défaut ne conviennent pas au projet (voir scampi/core/core-settings).

Exemple
-------

1. Créer un fichier _rwd-utils.scss dans le répertoire projet/modules avec le contenu suivant :

```sass
// Typo rwd
// ==========================================================

// variables projet
$projet-typo-size-map: (
    body: (
        base: (
            font-size: .875em
        ),
        small: (
            font-size: 1em
        )
    ),
    footer: (
        wide: (
            font-size: (1 / 1.125) * 1em
        )
    )
);

$typo-size-map : $projet-typo-size-map;


// largeurs blocs rwd
// ---------------------
$projet-max-block-width-map: (
    container: (
        base: (
            max-width: 100%
        ),
        large: (
            max-width: 70em
        ),
    )
);

$max-block-width-map : $projet-max-block-width-map;

// import scampi
@import "../../scampi/modules/rwd-utils/rwd-utils";

```

2. Ajouter en fin de ce fichier les règles liées à appliquer pour le projet, par exemple :

```scss
body {
  @include rwd-typo-size(body);
}

.footer {
  @include rwd-typo-size(footer);
}

.container {
  @include rwd-block-width(container);
}
```
