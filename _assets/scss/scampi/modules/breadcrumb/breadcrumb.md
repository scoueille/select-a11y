Présentation
------------

Le breadcrumb (ou fil d’ariane) est un critère RGAA niveau AAA obligatoire au regard de la Charte Pidila.

On l’affiche au-dessus du contenu principal. Idéalement on le place en premier élément du main ; ainsi lorsque l’utilisateur utilisera le lien d’accès rapide vers le contenu cet élément sera lu en premier.

Les styles sont portés par la class `breadcrumb`.

### Accessibilité

Un attributs aria-label sur l’élément permet aux utilisateurs pilotant une aide technique d’être informés de la nature de cet élément.

Les éléments graphiques symbolisant l’arborescence (>, /, ->, etc.) sont insérés soit directement dans la source dans des spans dotés de l’attribut `aria-hidden="true"`, soit placés en css grâce aux pseudo-éléments.

Ce module adopte cette seconde option. Vous pouvez changer le caractère de séparation dans les styles du module avec la variariable `$breadcrumb-sign`. Sa valeur par defaut est ">"




Utilisation
-----------

````html
<nav class="breadcrumb" role="navigation" aria-label="Vous êtes ici :">
  <a href="/">Accueil</a>
  <a href="/blabla">Rubrique</a>
  <a href="/blabla/blibli">Sous-rubrique</a>
  <strong>Page active</strong>
</nav>
````
