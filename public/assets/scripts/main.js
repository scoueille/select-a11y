var selects = document.querySelectorAll('select[data-select-a11y]');

var selectA11ys = Array.prototype.map.call(selects, function(select){
  return new Select(select);
});

var selects1 = document.querySelectorAll('select[data-select-a11y-open]');
var selectA11ys1 = Array.prototype.map.call(selects1, function(select){
  return new Select(select, {
    selectAll: true,
    addCloseButton: true,
    preventClose: true,
    text: {
      selectAll: "Tout sites confondus"
    }
  });
});



// Exemple d'instanciation avec le paramètre "text" des libellés d'aide du composant
/*
var selects = document.querySelectorAll('select[data-select-a11y]');

var selectA11ys = Array.prototype.map.call(selects, function(select){
  new Select(select, {
    text:{
      help: 'Utilisez la tabulation (ou la touche flèche du bas) pour naviguer dans la liste des suggestions',
      placeholder: 'Rechercher dans la liste',
      noResult: 'Aucun résultat',
      results: '{x} suggestion(s) disponibles',
      deleteItem: 'Supprimer {t}',
      delete: 'Supprimer'
   }
  })
});
*/