# Select-a11y

[Version de cette page en français](readme.md)


**select-a11y** transforms multi select into suggestions list with search input. It is compliant with [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/intro/wcag) and [General Accessibility Framework for Administrations](https://disic.github.io/rgaa_referentiel_en/introduction-RGAA.html) (Référentiel général d'accessibilité pour les administrations - RGAA).

To see the demo, download or clone this repository, then open the file /demo/select-a11y.html.

**select-a11y** is part of the DILA’s accessible and responsive UI components library [Scampi (fr)](https://gitlab.com/pidila/scampi). It was primarily developed and is currently used in production on service-public.fr, official website of the french administration. See filter boxes on [this page (fr)](https://www.service-public.fr/demarches-silence-vaut-accord/recherche).

## Prerequisite

jquery 3.1.1 or higher.

## References

- https://select2.github.io/examples.html
- https://a11y.nicolas-hoffmann.net/autocomplet-list/

## Use 

All you need is ~~love~~ the files in the dist/ directory. Add the script in the bottom of your page, just before the body end tag (and jquery if it's not here already) and the css or scss in your style files.

To be transformed by select-a11y.js, the multi select tag:

- must contain the attribute data-select-a11y;
- must contain an attribute data-placeholder="Text of the placeholder";
- must contain a class attribute with any value;
- may contain one or more option with selected attribute

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

## Contribute

This project is under Test Driven Development with jasmine.

Requisite: Node.js, npm, npm gulp globally installed.

After cloning this repository, install dependencies:

```$ npm install```

and run tests in Chrome:

```$ gulp```

**Important :** it may be required to modify the Gulpfile.js, line 53 to call Chrome with the [correct syntax](https://www.npmjs.com/package/opn#user-content-app) for your Operating System. 

### Build the demo

At first time, the Scampi library must be copied in public/styles/scss :

```$ gulp copy:scampi```

Then you just have to launch build as often as necessary:

```$ gulp build:public```

### Build the dist directory

```$ gulp build:dist```

### What can I do to help?

- close issues
- testing and report issues
- suggest enhancement
- translate documentation in english
- enhance documentation in english or in french
- make select-a11y.js as a jquery plugin 
- make select-a11y as a vanillia script
- say thank you if you use it :)

## Authors 

Developpers and reviewers: Alain Batifol, Nicolas Bovorasmy, Anne Cavalier, Laurent Dutheil, Aurélien Lévy, Hugues Moreno - For the DILA, Direction de l'information légale et administrative.

## License

MIT and [CeCILL-B](http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.html). Feel free to use it with one or the other.
