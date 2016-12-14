# Guidelines pour les contributeurs 

Bienvenue !
-----------

Nous sommes heureux que vous lisiez cette page car nous avons besoin de volontaires pour nous aider à améliorer les outils d'intégration que nous mettons à disposition.

Les présentes guidelines s'appliquent à nos deux dépôts :
  * [Scampi](https://gitlab.com/pidila/scampi) ;
  * [Scampi-Twig starter-kit](https://gitlab.com/pidila/scampi-twig).

Scampi-Twig starter-kit utilise Scampi en submodule.

Rapporter un bug ou proposer une amélioration
------------------------------------------

  * [pour Scampi](https://gitlab.com/pidila/scampi/issues) ;
  * [pour Scampi-Twig starter-kit](https://gitlab.com/pidila/scampi-twig/issues).

Contact
-------

  * [s'inscrire à la mailing list](https://framalistes.org/sympa/subscribe/pidila-tools) ;
  * ou écrire à l'un des auteurs (voir en fin du README à la racine des dépôts).

Développements
--------------

### Tests

Nous n'avons pour le moment pas mis en place de procédure de tests (nous sommes preneurs si vous avez envie d'en proposer :-))

### Documentation

Pour créer un nouveau module ou ajouter des fonctionnalités à un module existant, on commence par rédiger sa documentation dans un fichier markdown qui sera placé dans le module concerné.

De façon générale, toute proposition d'ajout ou de modification au dépôt doit être accompagnée d'explications pour les utilisateurs, au minimum en commentaires au sein d'un fichier.

### Compatibilité

Un module doit fonctionner sans autre dépendance que le core, prendre en compte l'accessibilité et être compatible avec les terminaux mobiles (notamment le touch).

Un module doit comporter les éventuelles règles pour un affichage adapté à toutes les tailles d'écran à partir de 320px.

Merge request
-------------

Pour contribuer au code, forker le dépôt d'origine et travailler sur une branche. Si elle correspond à un ticket ouvert, nommer la branche en la préfixant par le numéro du ticket (ex. #14-module-calendrier).

Pour rédiger ou modifier du code, suivre les conventions de code du chapitre ci-après.

Lorsque la modification ou l'ajout est prêt, effectuer un “merge request” (terminologie de gitlab.com équivalente. Voici deux tutoriels en anglais qui pourront vous guider si vous n'en avez jamais fait : [How to rebase a pull request](https://github.com/edx/edx-platform/wiki/How-to-Rebase-a-Pull-Request) et [Pull Request Tutorial](https://yangsu.github.io/pull-request-tutorial/). Si vous en connaissez un en français, dites-le nous, nous l'ajouterons à ces liens.

Rédiger clairement les messages de commit en une ligne pour les petits changements, en plusieurs si nécessaire (en ce cas la première ligne résume les changements apportés).

Conventions d'écriture du code
------------------------------

* indentation à quatre espaces pour les fichiers javascript
* indentation à deux espaces pour tous les autres fichiers
* js :
  ** les scripts js peuvent soit être compatibles avec jquery 2.2.0 soit écrits en js pur ;
  ** ne pas hésiter à commenter ;
* scss :
  ** ouverture d'accolade après le sélecteur (laisser une espace entre le sélecteur et l'accolade) ;
  ** point-virgule après chaque déclaration, même la dernière ;
  ** fermeture d'accolade alignée verticalement avec le sélecteur concerné ;
  ** saut de ligne : entre deux blocs de déclaration, avant une déclaration imbriquée, avant une directive ;
  ** chaque ligne de commentaire doit être précédée d'une double barre oblique, ne pas utiliser la syntaxe `/* … */`.
* doc des modules : prendre exemple sur les modules existants. Au minimum ils doivent comporter une explication de ce que fait le module et le code html minimum requis. On y ajoute éventuellement des explications concernant l'accessibilité, la mise en oeuvre d'un éventuel script associé, etc.

Licence
-------

Les contributions au code se font soit en GPL, soit en MIT, soit avec la licence CeCILL-C. Leurs auteurs sont crédités dans la documentation du module.

Pour finir
----------

Ne vous inquiétez pas outre mesure de tous ces conseils, nous sommes là pour vous aider si besoin !

