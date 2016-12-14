Présentation
-------------

Les blocs de citation sont composés de la citation elle-même et de la source de la citation.

L’ajout de la class `blockquote` (ou `blockquote-reverse` pour un alignement à droite) sur l'ensemble du blockquote et de la class `blockquote-footer` sur la mention de la source applique automatiquement les styles par défaut du mixin blockquote.

Si l'on souhaite appliquer cette présentation à tous les blocs de citation du site, il n'est pas nécessaire d'ajouter une class, on peut simplement inclure le mixin sur le tag par défaut :

```` scss
blockquote {
  @include blockquote;
}
````

Pour personnaliser la présentation, on peut modifier les paramètres du mixin.

Note : ce module est basé sur celui du framework Bootstrap.

Exemple d'utilisation
-------------

```` html
<blockquote class="blockquote">
  <p>Mettre le Web et ses services à la disposition de tous les individus, quels que soient leur matériel ou logiciel, leur infrastructure réseau, leur langue maternelle, leur culture, leur localisation géographique, ou leurs aptitudes physiques ou mentales.</p>
  <footer class="blockquote-footer">Tim Berners-Lee, inventeur du Web.</footer>
</blockquote>
````
