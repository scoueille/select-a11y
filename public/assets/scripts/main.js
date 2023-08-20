var selects = document.querySelectorAll('select[data-select-a11y]');

var selectA11ys = Array.prototype.map.call(selects, function(select){
  return new Select(select);
});

var selects1 = document.querySelectorAll('select[data-select-a11y-open]');
var selectA11ys1 = Array.prototype.map.call(selects1, function(select){
  return new Select(select, {
    selectAll: true,
    addCloseButton: true,
    text: {
      selectAll: "Tout sites confondus"
    }
  });
});


var selects2 = document.querySelectorAll('select[data-keyword-a11y]');
var selectA11ys2 = Array.prototype.map.call(selects2, function(select){
  return new Select(select, {
    keywordsMode: true
  });
});

var selects3 = document.querySelectorAll('select[data-autocomplete-a11y]');
var selectA11ys3 = Array.prototype.map.call(selects3, function(select){
  return new Select(select, {
    keywordsMode: true,
    url: 'https://swapi.py4e.com/api/people/?search=',
    urlResultsArray: 'results',
    urlValueField: 'name',
    urlLabelField: 'name',
    allowNewKeyword: false,
    preventCloseOnSelect: true
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