Présentation
-------------

Module de pagination : division de l'affichage d'une page de résultats pour une recherche.

Il s'agit d'une pagination simple présentant les numéros des pages de résultats, avec, aux deux extrémités de cette liste, des liens permettant de naviguer vers la pages précédente ou suivante. Si le nombre de pages est supérieur à 5, on peut placer un élément intermédiaire "...".

Accessibilité
-------------

Placer des attribut aria-label :

* sur l'élément nav ("Pagination") ;
* sur le lien conduisant vers la page précédente ("page précédente") ;
* sur le lien conduisant vers la page suivante ("page suivante").

Placer un texte caché sur l'item de la page active, grâce à la classe "sr-only".

Responsive
----------

Sur petit écran, les liens conduisant vers la page précédente ou la page suivante n'affichent que le chevron, sans l'intitulé (qui est restitué par les synthèses vocales grâce au mixin sr-only).

Complément
----------

Lors de l'intégration réelle, le lien "page précédente" doit être désactivé lorsqu'on est sur la première page et le lien "page suivante" doit être désactivé lorsqu'on est sur la dernière page.


Exemple d'utilisation
-------------

```` html
<nav aria-label="page_navigation">
  <ul class="pagination">
    <li class="page-item page-item-prev">
      <a class="page-link" href="#" aria-label="page précédente">
        <span>Précédent</span>
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active"><b class="page-link">2<span class="sr-only"> page actuelle</span></b></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#">4</a></li>
    <li class="page-item"><a class="page-link" href="#">5</a></li>
    <li class="page-item page-item-next">
      <a class="page-link" href="#" aria-label="page suivante">
          <span>Suivant</span>
        </a>
    </li>
  </ul>
</nav>
````
