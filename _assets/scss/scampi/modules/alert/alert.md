Présentation
-------------

Messages d'alerte courants : information, succès, alerte, danger/erreur. Les blocs d'alerte sont dotés d'une classe commune `alert` et d'une classe spécifique (ex. `alert-success`).

L'attribut `role="alert"` déclenche sa lecture immédiate au chargement de la page par les aides techniques. Pour cette raison, nous choisissons de ne pas mettre ce rôle sur les messages d'information.

Note : ce module est issu du framework Bootstrap.

Exemples d'utilisation
-------------

```` html
<div class="alert alert-success" role="alert">
  <strong>Bravo !</strong> Votre compte a été créé.
</div>
````

```` html
<div class="alert alert-info">
  <strong>Messagerie :</strong> Vous avez deux nouveaux messages.
</div>
````

```` html
<div class="alert alert-warning" role="alert">
  <strong>Attention !</strong> Votre porte-documents atteindra bientôt la limite autorisée.
</div>
````

```` html
<div class="alert alert-danger" role="alert">
  <strong>Erreur :</strong> Le formulaire présente 2 erreurs et n'a pu être validé.
</div>
````
