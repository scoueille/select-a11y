<p class="info-file">Fichier du répertoire /scampi/core/helpers/</p>

Mise à disposition de classes utilitaires pour les layouts ou le texte.

## layout-utils

`.clearfix` : classe incluant le mixin `clearfix` et servant à poser sur un conteneur pour que les éléments suivants se placent après. ([Plus d'info](http://learnlayout.com/clearfix.html).)

`.center-block` : classe incluant le mixin `center-block` et servant à centrer horizontalement un élément de type bloc par rapport à son parent. Pour que ça fonctionne il faut que l'élément parent ait une valeur de largeur déclarée.

`.container` : centre un block dans son conteneur, lui ajoute un padding à gauche et à droite.

`.main-container` : classe à placer en surplus de container ci-dessus et servant à dégager un espace au-dessus du bloc principal de contenu.

## text-classes

Les classes 

- `.list-unstyled`, `.list-inline`, `.list-inline-item`,
- `.text-truncate`,
- `.sr-only`, `.sr-only-focusable` et
- `.img-fluid`,
incluent les mixins du même nom.

La class `.lead` pré-style un contenu de type << chapo >> en utilisant les variables `$lead-font-size` et `$lead-font-style`.

Les classes

- `.text-nowrap`, 
- `.text-muted` et 
- `.initialism` 
enrichissent la présentation du texte respectivement en interdisant la coupure entre les mots, en utilisant une couleur de texte plus pâle, en affichant le texte en petites capitales.
