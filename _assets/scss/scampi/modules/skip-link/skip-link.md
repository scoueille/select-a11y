Présentation
------------

Permet d'afficher un groupe de liens d'accès rapides aux éléments menu, contenu, recherche.

Ces liens sont nécessaires à l'accessibilité d'un site, ils permettent aux utilisateurs naviguant au clavier ou avec une aide technique de naviguer plus vite vers les zones importantes de la page.

Un script javascript permet, s'il est activé, de ne faire apparaître ces liens que lorsqu'ils prennent le focus lors de la tabulation.

Utilisation
-----------

Placer le code html en début de page, de préférence juste après l'ouverture du `body`.

Les styles présents dans le module sont les styles minimaux pour le bon fonctionnement du module.

### Script associé

Pour un affichage uniquement à la tabulation, appeler le script associé dans le pied de page, avant la fermeture du `body` et activer le setting en passant la valeur de `skip-link-js` à `true` dans le fichier _skip-link.scss.

Pour que ce script fonctionne correctement, le bloc de liens doit porter la class `skip-link`.

Note : copier le script présent dans le module à l'endroit où sont rangés les autres scripts.

Exemple
-------

````html
<div class="skip-link">
  <div id="top">
    <ul>
      <li><a href="#main">Aller au contenu</a></li>
      <li><a href="#nav-main">Aller à la navigation</a></li>
      <li><a href="#search">Aller à la recherche</a></li>
    </ul>
  </div>
</div>
````
