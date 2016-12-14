# Scampi #

Scampi est un ensemble de composants sass/js/html accessibles et responsive développés à la DILA (Direction de l’information légale et administrative). Il vise à être utilisé en interne et par nos prestataires ou partenaires.

- - -

## Table des matières

1. [Contenu du dépôt](#contenu-du-d%C3%A9p%C3%B4t)
2. [Dépendances](#d%C3%A9pendances)
3. [Installation](#installation)
4. [Documentation](#documentation)
5. [Contributions](#contributions)
6. [Ressources tierces](#ressources-et-biblioth%C3%A8ques-tierces-parties-utilis%C3%A9es)
7. [Auteurs](#auteurs)
8. [License](#license)

- - -

## Contenu du dépôt

Répertoires de ce dépôt :

* **core/** : base sass pour tous les projets et sa documentation.
* **js/** : scripts communs à tous les projets.
* **modules/** : composants additionnels (scss, js) et leur documentation.
* **test/** : fichiers html/css/js de démonstration
* le présent README

Note 1: les modules préfixés '''u-''' sont destinés à la phase de développement et l’élaboration de styleguide.

Note 2: pour compiler la scss d’exemple du répertoire _test :

```bash
sass --watch _test
```

## Dépendances

Scampi est développé à l’aide du préprocesseur Sass. Il vous faudra donc disposer d’un outil de compilation. Le pôle internet utilise la version [gulp-sass](https://www.npmjs.com/package/gulp-sass) de nodejs mais vous pouvez utiliser tout compilateur de votre choix.

## Installation

Il existe deux méthodes pour utiliser Scampi dans un projet :

### En submodule

Si vous utilisez Git pour vos développements et souhaitez mettre à jour Scampi au fil de ses développements, ajoutez Scampi à votre projet en déclarant un submodule au sein de votre répertoire de styles. Cela permet d’être informé des mises à jour de Scampi et de les récupérer si vous le souhaitez.

### En téléchargeant Scampi

Téléchargez l’archive de Scampi et placez-la dans votre répertoire de styles. Cette méthode vous autorise à modifier ses fichiers pour votre propre usage.

Scampi est conçu pour être utilisé avec Sass. Néanmoins, si vous souhaitez télécharger la CSS et les js compilés pour les surcharger ensuite vous pouvez également télécharger [Scampi Vanilla]() *à venir avant la fin de 2016*.


## Documentation

Sauf mention précisée dans sa documentation, chaque module est utilisable sans dépendre d’aucun autre et ne nécessite que le chargement du core.

Un fichier markdown est présent dans chaque module pour documenter son but et son usage. Lire les [principes d’utilisation et de personnalisation d’un module](modules/README.md).

Démonstration et documentation complète de Scampi à venir sur un site dédié *(fin décembre 2016)*.

Le projet est versionné selon la [gestion sémantique de version](http://semver.org/lang/fr/).


## Contributions

Les contributions sont les bienvenues. La façon la plus simple est de forker ce dépôt puis de faire des pull request depuis celui-ci. Idéalement vous devriez consulter au préalable notre [guide du contributeur](https://gitlab.com/pidila/scampi/blob/master/CONTRIBUTING.md).

Si vous détectez une anomalie ou souhaitez proposer une évolution vous pouvez également [ouvrir un bug](https://gitlab.com/pidila/scampi/issues) sur le tracker de notre dépôt.

## Ressources et bibliothèques tierces parties utilisées

| nom  | version | licence | url | informations complémentaires |
| :--- | :------ | :------ | :-- | :-----
| Adobe Blank | v1.045 | SIL OPEN FONT LICENSE Version 1.1 | https://github.com/adobe-fonts/adobe-blank | 
| Debugging Sass Maps | --- | --- | https://www.sitepoint.com/debugging-sass-maps/ |
| jquery hide/show | --- | MIT | http://a11y.nicolas-hoffmann.net/hide-show/ |
| normalize.css | v3.0.3 | MIT License | github.com/necolas/normalize.css | 
| responsive-typography | --- | --- | https://github.com/liquidlight/responsive-typography | 
| Bootstrap | v4.0.0-alpha-4 | MIT License | https://github.com/twbs/bootstrap | 


## Auteurs

Pidila (Pôle internet de la DILA).

### Contact

Benoît Dequick - Hugues Moreno - Anne Cavalier. Nous écrire : prenom.nom@dila.gouv.fr

#### Liste d’échanges et d’information :

[S’abonner](https://framalistes.org/sympa/subscribe/pidila-tools).

## License

Scampi est distribué sous une double licence :[MIT](https://gitlab.com/pidila/scampi/blob/master/LICENCE-MIT.md) et [CeCILL-B](http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.html).

Vous pouvez utiliser Scampi avec l’une ou l’autre licence.

La documentation est sous licence [Creative Commons CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/fr/).



Note : cette page s’inspire de [https://github.com/edx/ux-pattern-library](https://github.com/edx/ux-pattern-library)
