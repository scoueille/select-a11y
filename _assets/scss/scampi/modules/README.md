Cette page présente la méthodologie de travail pour utiliser un module et la liste des modules disponibles avec une brève présentation de chacun d'entre eux.

Le répertoire de chaque module contient un fichier qui le présente et donne des exemples d'utilisation et le code html minimal nécessaire.


Comment utiliser un module ?
----------------------------

Deux voies vous sont offertes (nous recommandons la seconde).

### Modification directe

Importez le module et opérez directement dans celui-ci les modifications ou adaptations que vous souhaitez y effectuer.

Attention, cette méthode est la plus simple à mettre en œuvre mais ne permettra pas de bénéficier de mises à jour ou enrichissements éventuels des modules.

### Personnalisations distinctes

(L'ordre de cette liste est important.)

1. Créez un fichier _mon-module.scss dans le répertoire de votre projet.
2. Commencez par définir les éventuelles nouvelles variables ou valeurs de variables (sans les faire suivre de `!default`).
3. Importez le module originel de Scampi
4. Ajoutez ensuite vos éventuels propres mixins.
5. Ajoutez enfin vos propres règles de style.

#### Exemple

````scss
// personnalisation du module de blockquote
// fichier styles/mon-projet/mes-modules/_blockquote.scss

// module blockquote

// variables projet
$blockquote-border-color: $primary-color;

// import scampi
@import "../../scampi/modules/blockquote/blockquote";

// mixins projet

// styles projet
.blockquote {
  @include blockquote($font-size: 1em, $font-style: italic);

  padding-bottom: 0;
  padding-top: 0;

  p {
    margin-bottom: .5em;
  }

  .blockquote-footer {
    font-style: normal;
  }
}

````


Modules disponibles
-------------------

| nom | Description |
| :-- | :---------- |
| adobe-blank | À ajouter en complément du module fonticon pour cacher des alternatives aux icônes si elles sont utilisées en fonte d'icônes. |
| alert | Messages d'alertes (information, succès, warning, danger/erreur).|
| blockquote | Blocs de citation. |
| breadcrumb | Fil d'ariane |
| browsehappy | Affichage et styles d'un bloc recommandant la mise à jour des versions obsolètes d'Internet Explorer. |
| buttons | Boutons et groupes de boutons. |
| fontface | Gestion des webfonts. |
| fonticon | Règles pour la mise en œuvre de fonte d'icônes ; à utiliser en parallèle avec le module adobe-blank pour l'accessibilité. |
| forms | Formulaires. |
| grid | Choix et mise en œuvre d'un système de grilles. |
| nh-collapse | Affichage/Masquage de blocs de contenu. |
| rwd-utils | Fonctions, mixins et styles utilitaires pour le responsive. |
| skip-links | Liens d'évitement, aussi appelés liens d'accès rapides. |
| tables | Tableaux (dont responsive). |
| u-comments | Afficher/maquer des "post-it" de commentaires pendant la phase de développement. |
| u-debug | Divers utilitaires de debug : points de rupture, maps, rythme horizontal. |
| u-palette | Création automatique d'une palette des couleurs principales d'un site en fonction des valeurs renseignées dans les settings du projet. |
