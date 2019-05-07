# Select-a11y

[English version of this page](readme-en.md)

**select-a11y** est un script javascript associé à des css qui transforme un select (multiple ou non) en liste de suggestions avec champ de recherche à l'intérieur de cette liste. Il est conforme aux [Web Content Accessibility Guidelines (WCAG) (en)](https://www.w3.org/WAI/intro/wcag) et au [Référentiel général d'accessibilité pour les administrations (RGAA)](https://references.modernisation.gouv.fr/rgaa-accessibilite/).

Pour voir la démo, télécharger ou cloner ce dépôt et ouvrir le fichier public/index.html.

**select-a11y** fait partie de [Scampi](https://gitlab.com/pidila/scampi), la bibliothèque de composants accessibles développée par le Pôle intégration html de la Direction de l'information légale et administrative (DILA). Il a été initialement développé pour le site service-public.fr, le site officiel de l'administration française. On peut le voir en action les filtres de recherche de [cette page](https://www.service-public.fr/demarches-silence-vaut-accord/recherche).

## Références

- https://select2.github.io/examples.html
- https://a11y.nicolas-hoffmann.net/autocomplet-list/

## Utilisation

Les fichiers nécessaires à la mise en œuvre sont ceux du répertoire dist/. Ajoutez le script en pied de page, juste avant le tag de fermeture du body et les css ou scss dans vos fichiers de style.

Pour être pris en compte et transformé par le script select-a11y.js le plus simple est d'ajouter l'attribut ```data-select-a11y``` et le code JavaScript suivant :

```js
var selects = document.querySelectorAll('select[data-select-a11y]');

Array.prototype.forEach.call(selects, function(select){
  new Select(select);
});
```

### Exemple de code

```html

<div class="form-group">
  <label for="select-element">Que voulez-vous faire aujourd'hui ?</label>
  <select class="form-control" id="select-element" multiple data-select-a11y data-placeholder="Chercher dans la liste">
      <option>Dormir</option>
      <option>Grimper aux arbres</option>
      <option>Tricoter</option>
      <option selected>Danser avec les licornes</option>
      <option>Rêver</option>
  </select>
</div>
```

Il est possible de changer les textes utilisés dans le script pour les textes accessibles. Lors de la création du select a11y il suffit de passer un objet contenant une propriété `text` en second paramètre :

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

Les textes ci-dessus sont les textes utilisés par défaut.


## Contribute

Ce projet est développé en Test Driven Development avec tape.

Prérequis : nodejs, npm et gulp installé en global.

Après avoir cloné ce dépôt, installer les dépendances :

```bash
$ npm install
```

puis lancer les tests :

```bash
$ npm run test
```

### Modifier la démo

Toutes les ressources nécessaires à la démo se trouvent dans le répertoire **public**, le fichier scss pour la page de demo se trouve dans **demo/scss**.

La commande suivante permet de lancer un serveur local qui écoute les modifications de **scss** pour recomplier la css à la volée

```bash
$ gulp watch:dev
```

### Constuire le répertoire de distribution

```
$ gulp build
```

### Comment puis-je aider ?

- fermer des tickets
- tester et signaler des bugs
- proposer des améliorations
- traduire ou relire la doc en anglais
- améliorer la documentation (en anglais ou en français)

## Auteurs

Développement et revue : Alain Batifol, Nicolas Bovorasmy, Anne Cavalier, Laurent Dutheil, Aurélien Lévy, Hugues Moreno - Pour la DILA, Direction de l'information légale et administrative.

## License

**select-a11y** est distribué sous une double licence MIT et [CeCILL-B](http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.html). select-a11y peut être réutilisé avec l'une ou l'autre licence.

