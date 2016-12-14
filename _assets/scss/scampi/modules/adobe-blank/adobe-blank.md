<p class="info-file">Répertoire scampi/modules/adobe-blank</p>

Présentation
-------------

Une fonte qui n’affiche rien mais sera restituée par les aides techniques de lecture d’écran. On l’utilise pour offrir une alternative textuelle aux icônes utilisées via une fonticone.

Pour mettre en œuvre ce module vous devez passer le setting `$enable-adobe-blank` à `true`.

Note : ce module vise à être utilisé conjointement au module [fonticon](../fonticon/fonticon.md).

Exemple d’utilisation
---------------------

```` html
<p>
  <span class="blank">Texte alternatif</span>
  <span class="icon icon-exemple" aria-hidden="true">Exemple d’icône</span>
</p>

````
