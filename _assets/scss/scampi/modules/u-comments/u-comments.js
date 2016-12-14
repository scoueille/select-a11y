/* sg-comments.js
    Affiche/Masque tous les éléments portant la class="sg-comments"

    Le bouton déclencheur doit être posé dans la source :

    <button id="sg-toggle-comments" class="btn sg-toggle-comments is-closed" arial-label="afficher/masquer les commentaires">commentaires</button>

    (le texte afficher/masquer est introduit via css)
*/
$(document).ready(function(){

    $('#sg-toggle-comments').click(function(e) {
      e.preventDefault();
      $('.sg-comment').toggleClass('is-visible');
      $(this).toggleClass('is-closed');
    });

});
