<p class="info-file">Fichiers du répertoire /scampi/core/basics/</p>

## normalize

Normalize.css est un projet open-source de Nicolas Gallagher. Son propos est ainsi décrit par son auteur :

> Normalize.css is a small CSS file that provides better cross-browser 
> consistency in the default styling of HTML elements. 
> It’s a modern, HTML5-ready, alternative to the traditional CSS reset.
>
> Nicolas Gallagher, <cite>[About Normalize.css](http://nicolasgallagher.com/about-normalize-css/)</cite>.


Le [dépôt](http://necolas.github.com/normalize.css/) originel est assorti d’une [documentation](https://github.com/necolas/normalize.css/wiki) très complète (en anglais). On retrouve l’essentiel de cette documentation dans les commentaires présents dans le fichier.

Dans Scampi, **normalize.scss** est repris tel quel et mis à jour au fil des différentes versions.

## normalize-plus

En plus des règles définies par normalize, nous avons ajouté d’autres règles servant à corriger des bugs de navigateurs ainsi que l’adoption par défaut du reset de format de boîte [recommandé](https://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/) par Chris Coyier et Jonathan Neal. Ces règles ont différentes origines et sont créditées en commentaires dans le fichier.

## generic

Les règles par défaut concernant les tags html sont fixées dans **generic.scss**. Deux remarques importantes le concernant :

- generic.css utilise des variables définies dans le fichier scampi/core/core-scampi-settings.scss ; il faut donc les importer avant ce fichier (voir le fichier modèle scampi/_test/scampi.scss).
- Utiliser des tags html non appropriés dans le seul but d’obtenir telle ou telle présentation (typiquement, utiliser une balise de niveau hx correspondant à la présentation souhaitée et non à sa place hiérarchique) est une *mauvaise pratique*, notamment sur le plan de l’accessibilité mais également pour le référencement. Plusieurs sélecteurs html sont donc associés à des classes correspondantes afin d’obtenir le résultat souhaité de façon convenable. Ainsi par exemple, pour présenter un titre de niveau 3 comme un titre de niveau 5 on écrira :

```html
<h3 class="h5">Titre h3 comme un h5</h3>
```
