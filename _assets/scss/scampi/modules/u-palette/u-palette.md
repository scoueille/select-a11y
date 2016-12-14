Présentation
------------

Module utilisé pour afficher dans le styleguide les échantillons des couleurs principales du site avec leur variantes plus claires et plus foncées.

Utilisation
-----------

### Variables prises en compte :
  * $body-color
  * $headings-color
  * $primary-color
  * $info-color
  * $success-color
  * $warning-color
  * $danger-color
  * $gray-1
  * $gray-2
  * $gray-3
  * $gray-4
  * $gray-5
  * $gray-6
  * $gray-7
  * $gray-8
  * $gray-9
  * $gray-10

Pour ajouter un échantillon non prévu dans cette liste, déclarer la variable dans les settings du projet et ajoutez les règles css correspondantes sur le modèle des règles déjà présentes dans le fichier _style-u-palette.scss.

HTML à placer dans le styleguide
--------------------------------

`NomVariable` est à remplacer par le nom de la variable.

### Échantillons sans variantes

```html
<ul class="sg-color-boxes sg-simple-palette">

  <!-- pour chaque échantillon -->
  <li class="sg-color-box swatch-NomVariable">
    <div class="sg-color-swatch">
      <p class="sg-color-box-title">$NomVariable }}</p>
    </div>
  </li>

</ul>
```

### Échantillon avec variantes

```html
<ul class="sg-color-boxes sg-with_variant-palette">

  <!-- pour chaque échantillon -->
  <li class="sg-color-box swatch-NomVariable">
    <ul>
      <li class="sg-color-swatch">
        <p class="sg-color-box-title">$NomVariable</p>
        <p class="sg-color-swatch-lighten"></p>
        <p class="sg-color-swatch-darken"></p>
      </li>
    </ul>
  </li>

</ul>
```

Si vous utilisez twig
---------------------

```twig
{% macro simple(param) %}
  <ul class="sg-color-boxes sg-simple-palette">
  {% for item in param %}
    <li class="sg-color-box swatch-{{ item }}">
      <div class="sg-color-swatch">
        <p class="sg-color-box-title">${{ item }}</p>
      </div>
    </li>
  {% endfor %}
  </ul>
{% endmacro %}

{% macro with_variant(param) %}
  <ul class="sg-color-boxes sg-with_variant-palette">
  {% for item in param %}
    <li class="sg-color-box swatch-{{ item }}">
      <ul>
        <li class="sg-color-swatch">
          <p class="sg-color-box-title">${{ item }}</p>
          <p class="sg-color-swatch-lighten"></p>
          <p class="sg-color-swatch-darken"></p>
        </li>
      </ul>
    </li>
  {% endfor %}
  </ul>
{% endmacro %}

{# ----------- import de la macro ----------- #}

{% import _self as palette %}


{# ----------- établissement des groupes ----------- #}

{% set site_colors =
  [
    "body-color",
    "headings-color",
    "primary-color",
  ]
%}

{% set alert_colors =
  [
    "info-color",
    "success-color",
    "warning-color",
    "danger-color",
  ]
%}

{% set gray_colors =
  [
    "gray-1",
    "gray-2",
    "gray-3",
    "gray-4",
    "gray-5",
    "gray-6",
    "gray-7",
    "gray-8",
    "gray-9",
    "gray-10",
  ]
%}

{# ----------- construction des palettes ----------- #}

<h3 class="sg-title">Couleurs principales du site</h3>
{{ palette.with_variant(site_colors)}}

<h3 class="sg-title">Couleurs des alertes</h3>
{{ palette.with_variant(alert_colors)}}

<h3 class="sg-title">Nuances de gris</h3>
{{ palette.simple(gray_colors)}}

```

Script associé
--------------

Le script `u-palette.js` associé doit être appelé dans le pied de page, avant la fermeture du `body`.

Note : copier le script présent dans le module à l'endroit où sont rangés les autres scripts (en principe *dev/scripts/main/*).


Création de déclinaisons
------------------------

Une fois la palette crée dans le styleguide, il peut être intéressant de récupérer les valeurs plus claires et plus foncées des couleurs de base pour créer de nouvelles variables dans les settings du projet, par exemple `$primary-color-light` et `$primary-color-dark`.
