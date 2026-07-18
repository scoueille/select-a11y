# Select-a11y

[Version française](readme.md)

## Overview

**select-a11y** is a JavaScript/CSS component that turns a single or multiple `<select>` into an accessible component with an opener button, a search input, a suggestions list and, for multiple selects, a selected-items list.

The original `<select>` stays in the DOM so forms keep submitting the same values. The component adds a visible interface that is easier to use and keyboard-friendly.

Main features:

- single and multiple selects;
- option filtering with a search input;
- option groups (`optgroup`);
- selected-items list with remove buttons;
- select-all action;
- free keyword mode;
- remote autocomplete mode;
- `required` handling on the visible component;
- server-side `.is-invalid` state synchronization;
- DOM-based rendering (`textContent`, `setAttribute`) so injected HTML-like content is not interpreted.

**select-a11y** is part of [Scampi](https://gitlab.com/pidila/scampi), DILA's accessible UI component library.

## Demo

Three options:

- view the [online demo](http://pidila.gitlab.io/select-a11y/);
- open [public/index.html](public/index.html) directly in a browser;
- run the local demo with `npm install` then `npx gulp dev`.

The local Gulp server serves `public/` on port `8080`.

## Installation

After cloning the repository:

```bash
npm install
```

To build the distributed files in `public/assets/`:

```bash
npx gulp build
```

To run the demo with automatic rebuilds:

```bash
npx gulp dev
```

## Usage

Source files are in `src/`.

Generated integration files are in:

- `public/assets/scripts/select-a11y.min.js`
- `public/assets/css/select-a11y.css`

The simplest setup is to add an attribute to the `<select>` elements you want to enhance, then instantiate the component after loading the script.

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
  <label for="select-element">What do you want to do today?</label>
  <select class="form-control" id="select-element" multiple data-select-a11y>
    <option>Sleeping</option>
    <option>Climbing trees</option>
    <option>Knitting</option>
    <option selected>Riding bikes</option>
    <option>Dreaming</option>
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

Options are passed as the second constructor argument.

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

Main options:

- `text`: component labels and messages.
- `preventCloseOnSelect`: keeps the list open after selection.
- `preventCloseOnFocusLost`: keeps the list open when focus leaves the component.
- `showSelected`: displays selected items.
- `selectAll`: adds a select-all action for multiple selects.
- `addCloseButton`: adds a close button inside the list.
- `keywordsMode`: enables keyword mode.
- `url`: URL or URL factory for autocomplete.
- `urlResultsArray`, `urlValueField`, `urlLabelField`: fields used to parse autocomplete results.
- `showSelectedAutocompleteResults`: keeps already selected autocomplete results visible so they can be unselected.
- `allowNewKeyword`: allows free keyword creation.
- `regexFilter`: validation pattern for free keywords.
- `additionalDelimiters`: characters that split pasted keywords, such as `,` or `;`.
- `keywordInputTemplateFunction`: customizes the visible keyword input.
- `wrapTemplateFunction`: customizes the generated wrapper.

The old misspelled option name `additionalDelemiters` is still accepted for compatibility, but `additionalDelimiters` should be preferred.

## Keyword Mode

Keyword mode turns a `<select multiple>` into an input that feeds selected options.

```js
new Select(select, {
  keywordsMode: true,
  allowNewKeyword: true,
  additionalDelimiters: [',', ';']
});
```

If a keyword is still being typed when the form is submitted, it is added before submit. If `regexFilter` is set and the keyword does not match it, submit is blocked, the error message is shown and focus stays on the input.

Email validation example:

```js
new Select(select, {
  keywordsMode: true,
  allowNewKeyword: true,
  regexFilter: /^.+@.+\..+$/,
  additionalDelimiters: [',', ';'],
  text: {
    regexErrorText: function(value) {
      return 'The email address "' + String(value) + '" is invalid or malformed';
    }
  }
});
```

## Autocomplete

In autocomplete mode, `url` can be either a string or a function.

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

The expected response must contain an array in the field defined by `urlResultsArray`.

```json
{
  "results": [
    { "id": "1", "label": "Result 1" }
  ]
}
```

## Validation

If the source `<select>` has `required`, the component removes that attribute from the hidden select so native validation does not block submit on a non-visible field.

The required state is moved to the visible control with:

- `aria-required="true"`;
- `aria-invalid="true"` after a failed submit;
- `.select-a11y-invalid` on the wrapper.

If the source `<select>` has the `.is-invalid` class, for example after a server-side validation response, the visible component also receives `aria-invalid="true"` and `.select-a11y-invalid`. This synchronization follows later additions and removals of `.is-invalid`.

## API

Public instance methods:

- `clearSelection()`: clears selected options.
- `setValue(value)`: replaces the current selection with one value or an array of values.
- `addOption(keyword, keywordValue)`: adds and selects an option.
- `disable()`: disables the component.
- `enable()`: enables the component.

## Rendering Safety

Content from options, messages and configuration texts is rendered with DOM APIs (`createElement`, `textContent`, `setAttribute`). It is not injected with `innerHTML`.

This prevents labels containing HTML-like content from being interpreted as active markup. This behavior is covered by tests.

## Tests

Tests use Tape and Puppeteer.

```bash
npm test
```

The suite opens headless Chromium and checks generated DOM, keyboard/mouse interactions, validation behavior and non-interpretation of HTML-like content.

To get raw TAP output:

```bash
node tests/index.js
```

## Repository Structure

- `src/`: JavaScript and SCSS sources.
- `public/`: demo and generated files.
- `public/assets/scripts/select-a11y.min.js`: distributed bundle.
- `public/assets/css/select-a11y.css`: compiled CSS.
- `tests/`: Tape/Puppeteer tests.

Important note: do not directly edit generated files in `public/assets/scripts/` or `public/assets/css/`. Edit sources in `src/`, then run `npx gulp build`.

## Quality

Before proposing a change:

```bash
npx gulp build
npm test
```

## Authors

Developers and reviewers: Alain Batifol, Thomas Beduneau, Nicolas Bovorasmy, Anne Cavalier, Benoît Dequick, Laurent Dutheil, Lucile Houdinet, Aurélien Lévy, Hugues Moreno, Damien Petton - For the DILA, Direction de l'information légale et administrative.

## License

MIT and [CeCILL-B](http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.html). Feel free to use one or the other.
