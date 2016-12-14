Présentation
------------

Collapse est un composant html/js/css qui permet de plier et déplier des contenus. Une option permet d'indiquer les éventuels contenus dépliés par défaut.

Si javascript n'est pas chargé dans le navigateur, tous les contenus sont affichés.

Note : ce module a été développé par [Nicolas Hoffmann](http://a11y.nicolas-hoffmann.net/hide-show/).

Utilisation
-----------

Les attributs nécessaires à la dynamique d'ouverture/fermeture et à son accessibilité sont injectés par le script.

Pour que le script fonctionne correctement, le code html doit répondre à deux impératifs :

1. L'élément déclencheur doit porter la class `expandmore` et l'élément à montrer/cacher doit porter la class `to-expand`.
2. Ces deux éléments doivent être voisins immédiats dans la source.

Les styles présents dans le module sont les styles minimaux pour le bon fonctionnement du module.

### Script associé

Pour que ce module fonctionne, le script associé doit être appelé dans le pied de page, avant la fermeture du `body`.

Note : copier le script présent dans le module à l'endroit où sont rangés les autres scripts.

Exemple
-------

````html
<!-- fermé par défaut -->
<h2 class="expandmore">Une question ?</h2>
<div class="to-expand">
  <p>Le contenu caché peut être constitué de tout élément html : paragraphes, titres, tableaux, images…</p>
</div>

<!-- ouvert par défaut -->
<h2 class="expandmore">Une autre question ?</h2>
<div class="to-expand is-opened">
  <p>Ce contenu repliable est ouvert par défaut.</p>
</div>
````
