<p class="info-file">Fichiers du répertoire /scampi/js/</p>

## Description des fichiers

### libs

Ces fichiers sont à importer tels quels.

- **jquery.min.js** (optionnel selon votre projet) : plusieurs de nos modules s’appuient sur jquery. Si vous utilisez une autre bibliothèque javascript pensez à adapter les scripts des modules.
- **modernizr.js** ajoute des classes sur `<body>` qui permettront d’appliquer des règles en fonction des *features* supportées.

### main

Ces fichiers sont à compiler et à importer en un seul fichier.

- **anchor-focus.js** règle un bug webkit où le focus sur les liens ancrés n’est pas effectif. 
- et tous les éventuels scripts associés à des modules.

## Ordre des imports

**modernizr.js** doit être importé dans le head.

Les autres scripts sont importés à la fin du fichier html, juste avant la fermeture du body. Nous recommandons de les compiler afin de n'en importer qu'un.

<div class="focus">
  <p>En savoir plus sur <a href="{{ baseURL }}developpement/integration/tag-html.html">le contenu du head et l'ordre d’appel des scripts</a>.</p>
</div>
