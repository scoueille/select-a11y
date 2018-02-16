# Select-a11y

[English version of this page](readme-en.md)

**select-a11y** est un script javascript associé à des css qui transforme un select multiple en liste de suggestions avec champ de recherche à l'intérieur de cette liste. Il est conforme aux [Web Content Accessibility Guidelines (WCAG) (en)](https://www.w3.org/WAI/intro/wcag) et au [Référentiel général d'accessibilité pour les administrations (RGAA)](https://references.modernisation.gouv.fr/rgaa-accessibilite/).

Pour voir la démo, télécharger ou cloner ce dépôt et ouvrir le fichier demo/index.html.

**select-a11y** fait partie de [Scampi](https://gitlab.com/pidila/scampi), la bibliothèque de composants accessibles développée par le Pôle intégration html de la Direction de l'information légale et administrative (DILA). Il a été initialement développé pour le site service-public.fr, le site officiel de l'administration française. On peut le voir en action les filtres de recherche de [cette page](https://www.service-public.fr/demarches-silence-vaut-accord/recherche).

## Prérequis

jquery 3.1.1 ou supérieure.

## Références

- https://select2.github.io/examples.html
- https://a11y.nicolas-hoffmann.net/autocomplet-list/

## Utilisation 

Les fichiers nécessaires à la mise en œuvre sont ceux du répertoire dist/. Ajoutez le script en pied de page, juste avant le tag de fermeture du body (ainsi que jquery s'il n'est pas déjà prévu) et les css ou scss dans vos fichiers de style.

Pour être pris en compte et transformé par le script select-a11y.js le tag select multiple :

- doit contenir l'attribut ```data-select-a11y``` ;
- doit contenir l'attribut ```data-placeholder="Texte du placeholder"``` ;
- doit contenir un attribut ```class``` avec une valeur quelconque ;
- une ou plusieurs options peuvent contenir l'attribut ```selected``` si souhaité.

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

## Contribute

Ce projet est développé en Test Driven Development avec jasmine.

Prérequis : nodejs, npm et gulp installé en global.

Après avoir cloné ce dépôt, installer les dépendances :

```
$ npm install
```

puis lancer les tests avec Chrome :

```
$ gulp
```

**Important :** Si nécessaire modifier la tâche Gulp associée, ligne 53 de Gulpfile.js pour indiquer la [bonne syntaxe](https://www.npmjs.com/package/opn#user-content-app) correspondant au navigateur pour votre plate-forme. Par défaut celle-ci est adaptée à Windows. 

### Modifier la démo

Toutes les ressources nécessaires à la démo se trouvent dans le répertoire **demo**.

Au premier usage, on installe la dépendance Scampi dans les fichiers de style de la démo et on récupère la dernière version du script et du partial scss de select-a11y :

```
$ npm prepare:demo
```

Ensuite la commande de build de démo pourra être lancée à chaque fois que nécessaire.

```
$ gulp build:demo
```

### Constuire le répertoire de distribution

```
$ gulp build:dist
```

### Comment puis-je aider ?

- fermer des tickets
- tester et signaler des bugs
- proposer des améliorations
- traduire ou relire la doc en anglais
- améliorer la documentation (en anglais ou en français)
- faire de select-a11y.js un plugin jquery 
- faire de select-a11y un script sans dépendance à jquery

## Auteurs

Développement et revue : Alain Batifol, Nicolas Bovorasmy, Anne Cavalier, Laurent Dutheil, Aurélien Lévy, Hugues Moreno - Pour la DILA, Direction de l'information légale et administrative.

## License

**select-a11y** est distribué sous une double licence MIT et [CeCILL-B](http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.html). select-a11y peut être réutilisé avec l'une ou l'autre licence.

