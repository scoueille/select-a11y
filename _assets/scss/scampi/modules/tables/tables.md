@todo


Présentation
------------

Le module table de Scampi est une copie quasi conforme de son homologue de Bootstrap, les principales différences sont que les variables et mixins sont définis dans le module et que des mixins sont utilisés pour générer les styles.

Nous ajoutons aussi des styles de base pour l’élément `caption`.

Les classes disponibles sont `.table`, `.table-sm`, `.table-bordered`, `.table-striped`, `.table-hover`, `.table-responsive`, `.table-row-variant`, `.table-inverse`.


Utilisation
-----------



Exemple
-------

```` html
<table class="table">
  <caption>Liste d’utilisateur</caption>
  <thead>
    <tr>
      <th>#</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Username</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
````

```` html
<table class="table table-inverse">

[...]

</table>
````

```` html
<table class="table">
  <thead class="thead-inverse">
    <tr>
      <th>#</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Username</th>
    </tr>
  </thead>

  [...]

</table>
````

```` html
<table class="table table-striped">

  [...]

</table>
````


```` html
<table class="table table-striped table-inverse">

  [...]

</table>
````

```` html
<table class="table table-bordered">

  [...]

</table>
````



```` html
<table class="table table-bordered table-inverse">

  [...]

</table>
````



```` html
<table class="table table-hover">

  [...]

</table>
````


```` html
<table class="table table-hover table-inverse">

  [...]

</table>
````

```` html
<table class="table table-sm">

  [...]

</table>
````


```` html
<table class="table table-sm table-inverse">

  [...]

</table>
````

```` html
<!-- On rows -->
<tr class="table-active">...</tr>
<tr class="table-success">...</tr>
<tr class="table-warning">...</tr>
<tr class="table-danger">...</tr>
<tr class="table-info">...</tr>

<!-- On cells (`td` or `th`) -->
<tr>
  <td class="table-active">...</td>
  <td class="table-success">...</td>
  <td class="table-warning">...</td>
  <td class="table-danger">...</td>
  <td class="table-info">...</td>
</tr>
````


```` html
<div class="table-responsive">
  <table class="table">
    ...
  </table>
</div>
````



