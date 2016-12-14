Présentation
------------

Si le site n’est pas ou peu compatible avec les anciennes versions d’Internet explorer, on insère un avertissement qui sera vu par les utilisateurs de ces versions.

La mise en forme est effectuée dans le fichier de styles.


Utilisation
-----------

Insérer ce code après l’ouverture du `<body>`:

````html
<!--[if lt IE 8]>
  <div class="browsehappy">
    <div class="container">
      <p>Savez-vous que votre navigateur est obsolète ?<p>
      <p>Pour naviguer de la manière la plus satisfaisante sur le Web, nous vous recommandons de procéder à une <a href="http://windows.microsoft.com/fr-fr/internet-explorer/download-ie">mise à jour de votre navigateur</a>.
      <br>Vous pouvez aussi <a href="http://browsehappy.com/">essayer d’autres navigateurs web populaires</a>.</p>
    </div>
  </div>
<![endif]-->
````
