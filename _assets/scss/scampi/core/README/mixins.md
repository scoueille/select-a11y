<p class="info-file">Fichiers du répertoire /scampi/core/mixins</p>

## Texte

### hover

Anticipation de l’introduction de la directive [@media (hover:hover)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover) de CSS4 (source: [Christopher Rebert](https://github.com/twbs/mq4-hover-shim)).

Quatre mixins inclus :

- `hover`
- `hover-focus`
- `plain-hover-focus`
- `hover-focus-active`

Ils ne nous semblent pas d’un intérêt intrinsèque fabuleux mais ils sont utilisés dans plusieurs modules Bootsrap présents dans Scampi.

### lists

Trois mixins pour ajouter des variations de listes (source: [TwitterBootstrap](http://getbootstrap.com))

- `list-unstyled` : supprime le padding-left et le list-style ;
- `list-inline` : distribue les items en ligne grâce à `display: inline-block;` et ajoute des espaces entre les items pour toute une liste ;
- `list-inline-item` : idem que ci-dessus mais pour un seul item de liste.

### reset-text

Réinitialise aux réglages par défaut les styles appliqués au texte, sauf la taille des caractères (source: [TwitterBootstrap](http://getbootstrap.com))

### screen-reader

Mise à disposition de trois mixins `sr-only` pour des éléments non visibles sur la page mais lus par les aides techniques.

#### sr-only

Ce mixin est assorti d’une classe .sr-only (on peut donc utiliser soit le mixin soit la classe).

Il utilise la version la plus robuste connue à ce jour. Voir [http://www.ffoodd.fr/cache-cache-css/](http://www.ffoodd.fr/cache-cache-css/).

**Exemple d’utilisation**

```html
<!-- html -->
<a href="http://example.org" target="_blank">
  Vers un autre site <span class="new-window">(nouvelle fenêtre)</span>
</a>
```

```scss
// input scss
.new-window {
  @include sr-only();
}
```

```css
/* output css */
  .new-window {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(1px,1px,1px,1px);
  -webkit-clip-path: inset(50%);
          clip-path: inset(50%);
  border: 0;
  white-space: nowrap;
}
```

Une classe `.sr-only` comportant ce mixin est également disponible dans les utilitaires de Scampi (fichier /scampi/core/core-scampi-helpers).

#### sr-only-visible

Parfois on a besoin de surcharger cette class car finalement l’élément doit être visible dans telle ou telle circonstance (souvent liée au traitement javascript). On dispose d’un mixin de surcharge `sr-only-visible`. Note : il est préférable d’éviter de se retrouver dans ce cas.

#### sr-only-focusable

Le mixin `sr-only-focusable` permet d’introduire les règles nécessaires à ce qu’un élément focusable soit visuellement caché mais apparaisse à la tabulation.

### tab-focus

Ce mixin permet de mettre en valeur les focus de façon compatible avec les navigateurs webkit.

### text-truncate

Applique un `overflow:hidden` sur un élément et remplace le texte qui "dépasse" par des points de suspension (source: [TwitterBootstrap](http://getbootstrap.com)).

## Images

### figure

Mixin `figure` pour le traitement du groupe d’une `figure` et ses enfants `img` et `caption` (dérivé de la class figure de Twitter Bootstrap). Ce mixin est associé à trois paramètres :

- `$img-margin-bottom`, par défaut `($spacer-y / 2)`, 
- `$img-line-height`, par défaut `1.25`, 
- `$caption-text-color`, par défaut `$gray`.

### image

Mixins pour le traitement responsive ou retina des images (source: [TwitterBootstrap](http://getbootstrap.com)).

- `img-fluid` et son paramètre $display (par défaut sa valeur est `block`) : limite la taille de l’image à 100% de la largeur son conteneur si elle est renseignée ;
- `img-retina` et ses paramètres $file-1x, $file-2x, $width-1x, $height-1x et utilise ensuite ces paramètres pour servir l’image adaptée aux dpi.

## Layout

### breakpoints

Mixins permettant de << cibler >> des points de rupture de la map des breakpoints (`$grid-breakpoints`) définie dans les settings.

**Exemples :**

| Input scss | Output |
|------------|--------|
| @include media-breakpoint-up(medium) { … }| @media and (min-width: 48em) { … }|
| @include media-breakpoint-max(wide) { … } | @media and (min-width: 84em) { … }|
| @include media-breakpoint-only(small) { … }| @media and (min-width: 34em) and (max-width: 34em) { … } |
|@include media-breakpoint-between(small, large)|@media and (min-width: 34em) and (max-width: 60em) { … }|

### clearfix

Permet de « clearer les floats » (désolés pour le franglais...).

### center-block

Centrage horizontal pour un élément de type block par rapport à son conteneur.


## Skin

### border-radius

Si la variable de configuration `$enable-rounded` est à true, ce mixin permet d’ajouter des coins arrondis :

- `border-radius($radius)` : aux quatre coins ;
- `border-top-radius($radius)` : aux deux coins supérieurs ;
- `border-right-radius($radius)` : aux deux coins du côté droit ;
- `border-bottom-radius($radius)` : aux deux coins inférieurs ;
- `border-left-radius($radius)` : *devinez quoi ?*

Le paramètre de ce mixin (`$radius`) est fixé par défaut à la valeur de la variable `$border-radius` indiquée dans les settings du core (4px).

### box-shadow

En écrivant les règles de box-shadow à l’intérieur de ce mixin on s’assure qu’elles ne seront prises en compte à la compilation que si la variable de configuration `$enable-box-shadow` est à true.

**Utilisation :**

```scss
/* input SCSS */
.element {
  @include box-shadow(8px 8px 0px #aaa);
  color: red;
}
```

Si `$enable-box-shadow: true;` :

```scss
/* output css */
.element {
  box-shadow: 8px 8px 0px #aaa;
  color: red;
}
```

Si `$enable-box-shadow: false;` :

```scss
/* output css */
.element {
  color: red;
}
```

### transition

Ce mixin fonctionne de façon semblable à celui de box-shadow ci-dessus.


## Outils

### px-to-em

Convertit les valeurs de px en em, autorise les imbrications de conversion (source [Francesco Schwarz](https://gist.github.com/isellsoap/8299726)).

#### Exemples d’utilisation :

| Input scss | Output css |
| ---------- | ----------|
| sc-em(16px)  | 1em|
| sc-em(32)    | 2em|
| sc-em(10px, 1.125)  | .55556em|
| sc-em(24px, .875em) | 1.71429em|
| sc-em(12px 0 7em rgba(0, 0, 0, .7), 1.75) | .42857em 0 4em rgba(0, 0, 0, 0.7)|
| sc-em(12px) + sc-em(3em) | 3.75em|
| sc-em(23px, sc-em(53px)) | .43396em|
| sc-em(24px, 1.5 * 1.125) | .88889em|

