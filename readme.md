# Select-a11y

[English version](readme-en.md)

## Présentation

**select-a11y** est un composant JavaScript/CSS qui transforme un `<select>` simple ou multiple en composant accessible avec bouton d'ouverture, champ de recherche, liste de suggestions et, pour les sélections multiples, liste des éléments sélectionnés.

Le composant conserve le `<select>` original dans le DOM pour que les formulaires continuent à soumettre les mêmes valeurs. Il ajoute une interface visible plus ergonomique et pilotable au clavier.

Fonctionnalités principales :

- select simple et select multiple ;
- filtrage des options via un champ de recherche ;
- groupes d'options (`optgroup`) ;
- liste des éléments sélectionnés avec boutons de suppression ;
- option "sélectionner tout" ;
- mode mots clés libres ;
- mode autocomplete distant ;
- gestion du `required` sur le composant visible ;
- synchronisation de l'état serveur `.is-invalid` ;
- rendu des textes par API DOM (`textContent`, `setAttribute`) pour éviter d'interpréter du HTML injecté.

**select-a11y** fait partie de [Scampi](https://gitlab.com/pidila/scampi), la bibliothèque de composants accessibles développée par le Pôle intégration html de la Direction de l'information légale et administrative (DILA).

## Démo

Trois options :

- consulter la [démo en ligne](http://pidila.gitlab.io/select-a11y/) ;
- ouvrir directement [public/index.html](public/index.html) dans un navigateur ;
- lancer la démo locale avec `npm install` puis `npx gulp dev`.

Le serveur local Gulp sert le dossier `public/` sur le port `8080`.

## Installation

Après avoir cloné le dépôt :

```bash
npm install
```

Pour compiler les fichiers distribués dans `public/assets/` :

```bash
npx gulp build
```

Pour lancer la démo avec recompilation automatique :

```bash
npx gulp dev
```

## Mise en oeuvre

Les sources sont dans `src/`.

Les fichiers générés utiles à l'intégration sont dans :

- `public/assets/scripts/select-a11y.min.js`
- `public/assets/css/select-a11y.css`

Le plus simple est d'ajouter un attribut sur les `<select>` à transformer, puis d'instancier le composant après le chargement du script.

```html
<div class="form-group">
  <label for="select-option">Is your website...</label>
  <select class="form-control" id="select-option" data-select-a11y>
    <option>Perceivable</option>
    <option>Operable</option>
    <option>Understandable</option>
    <option>Robust</option>
  </select>
</div>

<div class="form-group">
  <label for="select-element">Que voulez-vous faire aujourd'hui ?</label>
  <select class="form-control" id="select-element" multiple data-select-a11y>
    <option>Dormir</option>
    <option>Grimper aux arbres</option>
    <option>Tricoter</option>
    <option selected>Faire du vélo</option>
    <option>Rêver</option>
  </select>
</div>
```

```js
var selects = document.querySelectorAll('select[data-select-a11y]');

var selectA11ys = Array.prototype.map.call(selects, function(select){
  return new Select(select);
});
```

## Options

Les options se passent en second paramètre du constructeur.

```js
new Select(select, {
  text: {
    help: 'Utilisez la tabulation (ou les touches flèches) pour naviguer dans la liste des suggestions',
    placeholder: 'Rechercher dans la liste',
    noResult: 'Aucun résultat',
    results: '{x} suggestion(s) disponibles',
    deleteItem: 'Supprimer {t}',
    delete: 'Supprimer',
    selectAll: 'Sélectionner tout',
    closeButton: 'Retour',
    regexErrorText: 'Le mot clé est mal formaté',
    welcomeMessage: null
  },
  preventCloseOnSelect: false,
  preventCloseOnFocusLost: false,
  showSelected: true,
  selectAll: false,
  addCloseButton: false,
  keywordsMode: false,
  url: null,
  showSelectedAutocompleteResults: false,
  allowNewKeyword: true,
  regexFilter: null,
  additionalDelimiters: [],
  keywordInputTemplateFunction: null,
  wrapTemplateFunction: null
});
```

Options principales :

- `text` : libellés et messages utilisés par le composant.
- `preventCloseOnSelect` : garde la liste ouverte après sélection.
- `preventCloseOnFocusLost` : garde la liste ouverte à la perte de focus.
- `showSelected` : affiche la liste des éléments sélectionnés.
- `selectAll` : ajoute une action "sélectionner tout" pour les selects multiples.
- `addCloseButton` : ajoute un bouton de fermeture dans la liste.
- `keywordsMode` : active le mode mots clés.
- `url` : URL ou fonction d'URL pour l'autocomplete.
- `urlResultsArray`, `urlValueField`, `urlLabelField` : champs utilisés pour parser les résultats d'autocomplete.
- `showSelectedAutocompleteResults` : conserve les résultats déjà sélectionnés dans la liste d'autocomplete pour permettre leur désélection.
- `allowNewKeyword` : autorise l'ajout libre de mots clés.
- `regexFilter` : filtre de validation pour les mots clés libres.
- `additionalDelimiters` : caractères qui découpent plusieurs mots clés collés, par exemple `,` ou `;`.
- `keywordInputTemplateFunction` : permet de personnaliser l'input visible du mode mots clés.
- `wrapTemplateFunction` : permet de personnaliser le conteneur généré.

L'ancien nom `additionalDelemiters` reste accepté pour compatibilité, mais `additionalDelimiters` doit être préféré.

## Mode mots clés

Le mode mots clés transforme un `<select multiple>` en champ de saisie qui alimente les options sélectionnées.

```js
new Select(select, {
  keywordsMode: true,
  allowNewKeyword: true,
  additionalDelimiters: [',', ';']
});
```

Si un mot clé est en cours de saisie au moment du submit, il est ajouté avant la soumission. Si `regexFilter` est défini et que le mot clé ne passe pas le filtre, le submit est bloqué, le message d'erreur est affiché et le focus reste sur le champ.

Exemple avec validation d'e-mail :

```js
new Select(select, {
  keywordsMode: true,
  allowNewKeyword: true,
  regexFilter: /^.+@.+\..+$/,
  additionalDelimiters: [',', ';'],
  text: {
    regexErrorText: function(value) {
      return 'L’adresse e-mail "' + String(value) + '" est invalide ou mal formatée';
    }
  }
});
```

## Autocomplete

En mode autocomplete, `url` peut être une chaîne ou une fonction.

```js
new Select(select, {
  keywordsMode: true,
  url: function(search) {
    return '/api/search?q=' + encodeURIComponent(search);
  },
  urlResultsArray: 'results',
  urlValueField: 'id',
  urlLabelField: 'label',
  allowNewKeyword: false,
  preventCloseOnSelect: true
});
```

La réponse attendue doit contenir un tableau dans le champ défini par `urlResultsArray`.

```json
{
  "results": [
    { "id": "1", "label": "Résultat 1" }
  ]
}
```

## Validation

Si le `<select>` source porte `required`, le composant retire cet attribut du select masqué pour éviter que la validation native bloque le submit sur un champ non visible.

Le required est reporté sur le champ visible avec :

- `aria-required="true"` ;
- `aria-invalid="true"` après un submit échoué ;
- la classe `.select-a11y-invalid` sur le conteneur.

Si le `<select>` source porte la classe `.is-invalid`, par exemple après un retour serveur, le composant visible reçoit aussi `aria-invalid="true"` et `.select-a11y-invalid`. Cette synchronisation suit les ajouts et retraits de `.is-invalid`.

## API

Les méthodes publiques disponibles sur l'instance :

- `clearSelection()` : désélectionne toutes les options.
- `setValue(value)` : remplace la sélection courante par une valeur ou un tableau de valeurs.
- `addOption(keyword, keywordValue)` : ajoute et sélectionne une option.
- `disable()` : désactive le composant.
- `enable()` : réactive le composant.

## Sécurité du rendu

Les contenus issus des options, des messages et des textes de configuration sont rendus avec les API DOM (`createElement`, `textContent`, `setAttribute`). Ils ne sont pas injectés avec `innerHTML`.

Cela évite qu'un libellé contenant du HTML soit interprété comme du balisage actif. Ce comportement est couvert par les tests.

## Tests

Les tests utilisent Tape et Puppeteer.

```bash
npm test
```

La suite ouvre Chromium en mode headless et vérifie le DOM généré, les interactions clavier/souris, le comportement de validation et la non-interprétation des contenus HTML-like.

Pour obtenir la sortie TAP brute :

```bash
node tests/index.js
```

## Structure du dépôt

- `src/` : sources JavaScript et SCSS.
- `public/` : démo et fichiers générés.
- `public/assets/scripts/select-a11y.min.js` : bundle distribué.
- `public/assets/css/select-a11y.css` : CSS compilé.
- `tests/` : tests Tape/Puppeteer.

Note importante : ne pas modifier directement les fichiers générés dans `public/assets/scripts/` ou `public/assets/css/`. Modifier les sources dans `src/`, puis lancer `npx gulp build`.

## Qualité

Avant de proposer une modification :

```bash
npx gulp build
npm test
```

## Auteurs

Développement et revue : Alain Batifol, Thomas Beduneau, Nicolas Bovorasmy, Anne Cavalier, Benoît Dequick, Laurent Dutheil, Lucile Houdinet, Aurélien Lévy, Hugues Moreno, Damien Petton - Pour la DILA, Direction de l'information légale et administrative.

## Licence

**select-a11y** est distribué sous une double licence MIT et [CeCILL-B](http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.html). select-a11y peut être réutilisé avec l'une ou l'autre licence.
