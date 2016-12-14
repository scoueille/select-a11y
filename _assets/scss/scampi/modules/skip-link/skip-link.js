/*!
Skip-link
Show skip-link on focus
*/

$(document).ready(function(){
  // affichage et masquage des liens d'évitement
  $('.skip-link a').on('focus', function () {
    $(this).parents('.container').addClass('skip-link-focus');
  }).on('blur', function () {
    $(this).parents('.container').removeClass('skip-link-focus');
  });
});
