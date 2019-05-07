# Select-a11y

[Version de cette page en français](readme.md)


**select-a11y** transforms selects (multiple or not) into suggestions list with search input. It is compliant with [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/intro/wcag) and [General Accessibility Framework for Administrations](https://disic.github.io/rgaa_referentiel_en/introduction-RGAA.html) (Référentiel général d'accessibilité pour les administrations - RGAA).

To see the demo, download or clone this repository, then open the file /demo/index.html.

**select-a11y** is part of the DILA’s accessible and responsive UI components library [Scampi (fr)](https://gitlab.com/pidila/scampi). It was primarily developed and is currently used in production on service-public.fr, official website of the french administration. See filter boxes on [this page (fr)](https://www.service-public.fr/demarches-silence-vaut-accord/recherche).

## References

- https://select2.github.io/examples.html
- https://a11y.nicolas-hoffmann.net/autocomplet-list/

## Use

All you need is ~~love~~ the files in the dist/ directory. Add the script in the bottom of your page, just before the body end tag and the css or scss in your style files.

To be transformed by select-a11y.js, the fastest way is to add the ```data-select-a11y``` attribute on the `select` and add the following JavaScript code in one of your file:

```js
var selects = document.querySelectorAll('select[data-select-a11y]');

Array.prototype.forEach.call(selects, function(select){
  new Select(select);
});
```

### Code sample

```html

<div class="form-group">
  <label for="select-element">What do you want to do today?</label>
  <select class="form-control" id="select-element" multiple data-select-a11y data-placeholder="Search in list">
      <option>Sleeping</option>
      <option>Climbing trees</option>
      <option>Knitting</option>
      <option selected>Dancing with unicorns</option>
      <option>Dreaming</option>
  </select>
</div>
```

The default texts used for accessibility can be changed. When creating a new select a11y, you can pass an object containing the `text` property as a second parameter:

```js
new Select(HTMLSelectElement, {
  text:{
    help: 'Utilisez la tabulation (ou la touche flèche du bas) pour naviguer dans la liste des suggestions',
    placeholder: 'Rechercher dans la liste',
    noResult: 'Aucun résultat',
    results: '{x} suggestion(s) disponibles',
    deleteItem: 'Supprimer {t}',
    delete: 'Supprimer'
  }
});
```

The texts in the example are the default texts used in the script.

## Contribute

This project is under Test Driven Development with tape.

Requisite: Node.js, npm, npm gulp globally installed.

After cloning this repository, install dependencies:

```bash
$ npm install
```

and run tests:

```bash
$ npm test
```

### Build the demo

Final files for the demo pages are located in the **public** folder. In **demo/scss** you'll find the scss file that will compile into css in the **public** folder.

The following command will start a webserver and will listen to the changes of the **scss** file to recompile it:

```bash
$ gulp watch:dev
```

### Build the dist directory

```$ gulp build```

### What can I do to help?

- close issues
- testing and report issues
- suggest enhancement
- translate documentation in english
- enhance documentation in english or in french
- say thank you if you use it :)

## Authors

Developpers and reviewers: Alain Batifol, Nicolas Bovorasmy, Anne Cavalier, Laurent Dutheil, Aurélien Lévy, Hugues Moreno - For the DILA, Direction de l'information légale et administrative.

## License

MIT and [CeCILL-B](http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.html). Feel free to use it with one or the other.
