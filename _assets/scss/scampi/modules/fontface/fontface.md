Présentation
------------

Le module fontface facilite l'utilisation de famille de fontes personnalisées. Sa mise en œuvre un peu complexe est décrite pas à pas ci-dessous.

Mise en place
-------------

### Fichiers de fontes

1. Créer un répertoire dans le dossier du projet (par exemple *webfonts*).
2. Créer dans ce répertoire un sous-répertoire par famille (par exemple Roboto)
3. Y placer toutes les déclinaisons dans tous les formats (eot, woff, ttf).


### Settings

Dans le fichier des settings du projet : 

1. passer le setting `$enable-fontface` à `true`.
2. déclarer la "map" des fontes utilisées
3. définir le chemin vers le répertoire des webfontes
4. créer des noms de variables correspondant à chaque font-stack.
5. (facultatif) donner des noms génériques à ces font-stacks

#### Exemple

````sass

// Font-face
// =============================================

// 1. passer le setting `$enable-fontface` à `true`.

$enable-fontface: true;

// 2. déclarer la "map" des fontes utilisées

$fonts-map: (
  'sourcesanspro': ( // sera utilisé comme valeur pour la font-family de ce groupe
    (
      'font-path'   : "sourcesanspro_regular_macroman/SourceSansPro-Regular-webfont",
      'font-weight' : 400,
      'font-style'  : normal
    ) ,
    (
      'font-path'   : "sourcesanspro_semibold_macroman/SourceSansPro-Semibold",
      'font-weight' : 600,
      'font-style'  : normal
    ) ,
    (
      'font-path'   : "sourcesanspro_italic_macroman/SourceSansPro-It-webfont",
      'font-weight' : 400,
      'font-style'  : italic
    )
  ),
  'martel': ( // sera utilisé comme valeur pour la font-family de ce groupe
    (
      'font-path'    : "martel/martel-regular-webfont",
      'font-weight'  : 400,
      'font-style'   : normal
    )
  )
);

// 3. définir le chemin vers le répertoire des webfontes

$webfont-path: "../webfonts/";

// 4. créer des noms de variables correspondant à chaque font-stack.

$sourcesanspro: sourcesanspro, arial, sans-serif;
$martel: martel, georgia, serif;

// 5. (facultatif) donner des noms génériques à ces font-stacks

$sans-serif: $sourcesanspro;
$serif: $martel;

````

### Import du module

**IMPORTANT :** il est essentiel d'importer ce module au tout début de la feuille de style, juste après l'import des settings du projet.
