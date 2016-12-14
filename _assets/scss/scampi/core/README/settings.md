<p class="info-file">Fichier /scampi/core/core-scampi-settings</p>

Les settings du core comportent des options de configuration et les variables nécessaires au core ou communes à plusieurs modules.

<div class="alert alert-warning">
  **Important !** La modification de la valeur de ces options ou variables doit s’effectuer dans les settings du projet.
</div>


## Options de configuration

Par défaut les différentes options sont désactivées.

```scss
$enable-old-ie            : false !default;
$enable-fontface          : false !default;
$enable-rounded            : true !default;
$enable-shadows            : false !default;
$enable-transitions        : false !default;
$enable-hover-media-query  : false !default;
$cursor-disabled           : not-allowed !default;
```

## Variables

Les variables sont réparties en quatre sections :

### Couleurs

- niveaux de gris et couleurs principales
- body
- liens et états actifs
- interactions (alertes, boutons…)
- code


### Bordures et coins arrondis

Ces variables déterminent les valeurs par défaut de l’épaisseur des bordures et des coins arrondis lorsque ceux-ci sont activés via le paramètre de configuration ``$enable-rounded``.

### Texte

#### Font-stacks

```scss
$font-family-sans-serif : Arial, sans-serif !default;
$font-family-serif      : Georgia, "Times New Roman", Times, serif !default;
$font-family-monospace  : Menlo, Monaco, Consolas, "Courier New", monospace !default;
```

On peut plus simplement utiliser leurs alias :

```scss
$sans-serif: $font-family-sans-serif !default;
$serif: $font-family-serif !default;
$monospace: $font-family-monospace !default;
```

#### Fondamentaux typographiques

Quelques variables posent les fondamentaux typographiques du core.

- base : font-family, font-size et line-height du body.
- headings : font-family, font-size et margins.
- listes : margin.
- chapo : font-size et font-weight.


<div class="alert alert-warning" markdown="block">
  **Note** : Nous recommandons la démarche d’[opt-in typographie](https://css-tricks.com/opt-in-typography/) (voir aussi [Should you have defaults styles for table?](https://css-tricks.com/should-you-have-defaults-styles-for-table/)). C’est pourquoi il y a peu de styles très élaborés directement appliqués par défaut pour la typographie ou les tableaux. On utilisera plutôt les modules ou les mixins dans le contexte choisi.
</div>



### Layout

#### Breakpoints

Deux maps déterminent les seuils principaux des media-queries et les largeurs maximales des blocks de class ```container``` au-delà de ces points de rupture.


| nom    | seuil   | largeur max du container |
|:-------|:-------:|:------------------------:|
| zero   | 0       | 100%                     |
| tiny   | 20em    | 100%                     |
| small  | 34em    | 100%                     |
| medium | 48em    | 44em                     |
| large  | 60em    | 56em                     |
| wide   | 80em    | 74em                     |


### Spacers

Des variables permettent de standardiser les pas de grille utilisables notamment pour les margins et les paddings. Par défaut, ```$spacer``` (espacement standard), ```$spacer-x``` (horizontal) et ```$spacer-y``` (vertical) valent 1em. 

On peut leur associer des opérateurs comme la division ou la multiplication (ex. ```padding-bottom: $spacer / 2;```) en veillant à faire suivre et précéder ces opérateurs d’une espace. 
