Présentation
------------

Permet d’afficher un menu simple (un seul niveau) à l’horizontale sur desktop et à la verticale sur mobile avec un bouton déclencheur d’ouverture/fermeture.

Si javascript n’est pas chargé dans le navigateur, sur mobile le bouton n’est pas affiché et le menu est affiché verticalement.

### Accessibilité

Des attributs aria-label sur le bouton et le menu permettront aux utilisateurs pilotant une aide technique d’être informés de la nature de ces éléments.

Utilisation
-----------

Les attributs nécessaires à la dynamique d’ouverture/fermeture et à son accessibilité sont injectés par le script.

Pour que le script fonctionne correctement, le code html doit répondre à deux impératifs :

1. L’élément déclencheur doit porter l’id `toggle-menu`, 
2. la liste constituant le menu doit porter la class `main-nav-list`.

En plus de ces attributs, on ajoutera la class `nav-item` sur chaque item de la liste.

Pour indiquer l’item actif du menu : ajouter la classe `.is-active` sur le lien concerné ainsi qu’un title reprenant son libellé plus "actif" : `title="Acceuil - actif"`


### Script associé

Pour que ce module fonctionne, le script associé doit être appelé dans le pied de page, avant la fermeture du `body`.

Note : copier le script présent dans le module à l’endroit où sont rangés les autres scripts (en principe scripts/main/).


Exemple
-------

```html
<button id="toggle-menu" class="toggle-menu" aria-label="afficher/masquer le menu">Menu</button>

<nav role="navigation" class="nav-main" id="nav-main" aria-label="menu principal">
  <div class="container">
    <ul class="nav-main-list">
      <li class="nav-item"><a class="nav-link is-active" title="Accueil - actif" href="../index.html">Accueil</a></li>
      <li class="nav-item"><a class="nav-link" href="#visu">Identité visuelle</a></li>
      <li class="nav-item"><a class="nav-link" href="#typo">Contenus</a></li>
      <li class="nav-item"><a class="nav-link" href="#buttons">Boutons et formulaires</a></li>
      <li class="nav-item"><a class="nav-link" href="#composants">Composants</a></li>
    </ul>
  </div>
 </nav>

```
