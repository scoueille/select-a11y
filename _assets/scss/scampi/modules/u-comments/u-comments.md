Présentation
------------

u-comments est un module à utiliser en développement. Il permet d'afficher/masquer des « post-it » non destinés à être présents dans les sites en production.

Ils peuvent notamment servir pour les consignes à passer entre intégrateurs et développeurs.

Utilisation
-----------

Les attributs nécessaires à la dynamique afficher/masquer les post-it sont injectés par le script.

Pour que le script fonctionne correctement, le code html doit répondre à deux impératifs :

1. L'élément déclencheur doit porter l'id `sg-toggle-comments` (pour le script js) et la class `sg-toggle-comments` pour lui appliquer des styles
2. Les éléments à masquer/afficher doivent porter la class `sg-comment`.

### Script associé

Le script `u-comments.js` associé doit être appelé dans le pied de page, avant la fermeture du `body`.

Note : copier le script présent dans le module à l'endroit où sont rangés les autres scripts.

Exemple
-------

````html
<!-- bouton à placer par exemple tout en haut de la page -->
<button id="toggle-comments" class="sg-toggle-comments">commentaires</button>

[…]

<div class="sg-comment">
  <p>Les messages d'erreur doivent être cachés par défaut et affichés si nécessaire grâce au script javascript.</p>
  <p>Penser à ajouter un compteur d'erreurs sur le message général en haut de page.</p>
</div>

````

Note : le css se charge d'ajouter selon les cas les mots *Afficher les* ou *Masquer les* avant le texte du bouton.
