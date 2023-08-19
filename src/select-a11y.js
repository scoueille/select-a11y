const text = {
  help: 'Utilisez la tabulation (ou les touches flèches) pour naviguer dans la liste des suggestions',
  placeholder: 'Rechercher dans la liste',
  noResult: 'Aucun résultat',
  results: '{x} suggestion(s) disponibles',
  deleteItem: 'Supprimer {t}',
  delete: 'Supprimer',
  selectAll: 'Sélectionner tout',
  closeButton: 'Retour',
};

const matches = Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
let closest = Element.prototype.closest;

if (!closest) {
  closest = function(s) {
    var el = this;

    do {
      if (matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

class Select{
  constructor( el, options ){
    this.el = el;
    this.label = document.querySelector(`label[for=${el.id}]`);
    this.id = el.id;
    this.open = false;
    this.multiple = this.el.multiple;
    this.search = '';
    this.suggestions = [];
    this.suggestionsGroups = [];
    this.allSuggestionsAndGroups = [];
    this.focusIndex = null;

    const passedOptions = Object.assign({}, options);
    const textOptions = Object.assign(text, passedOptions.text);
    delete passedOptions.text;

    this._options = Object.assign({
      text: textOptions,
      preventCloseOnSelect: false,
      preventCloseOnFocusLost: false,
      showSelected: true,
      selectAll: false,
      addCloseButton: false,
    }, passedOptions );

    
    this._handleFocus = this._handleFocus.bind(this);
    this._handleInput = this._handleInput.bind(this);
    this._handleKeyboard = this._handleKeyboard.bind(this);
    this._handleOpener = this._handleOpener.bind(this);
    this._handleReset = this._handleReset.bind(this);
    this._handleSuggestionClick = this._handleSuggestionClick.bind(this);
    this._handleCloseButton = this._handleCloseButton.bind(this);
    this._positionCursor = this._positionCursor.bind(this);
    this._removeOption = this._removeOption.bind(this);

    this._disable();

    this.button = this._createButton();
    this.liveZone = this._createLiveZone();
    this.overlay = this._createOverlay();
    this.wrap = this._wrap();

    if(this.multiple && this._options.showSelected){
      this.selectedList = this._createSelectedList();
      this._updateSelectedList();

      this.selectedList.addEventListener('click', this._removeOption);
    }

    this.button.addEventListener('click', this._handleOpener);
    this.input.addEventListener('input', this._handleInput);
    this.input.addEventListener('focus', this._positionCursor, true);
    this.list.addEventListener('click', this._handleSuggestionClick);
    this.wrap.addEventListener('keydown', this._handleKeyboard);
    document.addEventListener('blur', this._handleFocus, true);
    if(this.closeButton) {
      this.closeButton.addEventListener('click', this._handleCloseButton);
    }

    this.el.form.addEventListener('reset', this._handleReset);
  }

  _createButton(){
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('aria-expanded', this.open);
    button.className = 'btn btn-select-a11y';

    const text = document.createElement('span');

    if(this.multiple){
      text.innerText = this.label.innerText;
    }

    else {
      const selectedOption = this.el.item(this.el.selectedIndex);
      text.innerText = selectedOption.label || selectedOption.value;

      if(!this.label.id){
        this.label.id = `${this.el.id}-label`;
      }
      button.setAttribute('id',this.el.id+'-button');
      button.setAttribute('aria-labelledby', this.label.id+' '+button.id);
    }

    button.appendChild(text);

    button.insertAdjacentHTML('beforeend', '<span class="icon-select" aria-hidden="true"></span>');

    return button;
  }

  _createLiveZone(){
    const live = document.createElement('p');
    live.setAttribute('aria-live', 'polite');
    live.classList.add('sr-only');

    return live;
  }

  _createOverlay(){
    const container = document.createElement('div');
    container.classList.add('a11y-container');

    const suggestions = document.createElement('div');
    suggestions.classList.add('a11y-suggestions');
    suggestions.id = `a11y-${this.id}-suggestions`;

    container.innerHTML = `
      <p id="a11y-usage-${this.id}-js" class="sr-only">${this._options.text.help}</p>
      <label for="a11y-${this.id}-js" class="sr-only">${this._options.text.placeholder}</label>
      <input type="text" id="a11y-${this.id}-js" class="${this.el.className}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${this._options.text.placeholder}" aria-describedby="a11y-usage-${this.id}-js">
    `;

    container.appendChild(suggestions);

    if(this._options.addCloseButton) {
      const closeButton = document.createElement('div');
      closeButton.setAttribute('role', 'button');
      closeButton.setAttribute('tabindex', 0);
      closeButton.classList.add('a11y-close-button');
      closeButton.innerText = this._options.text.closeButton;
      container.appendChild(closeButton);
      this.closeButton = closeButton;
    }

    this.list = suggestions;
    this.input = container.querySelector('input');

    return container;
  }

  _createSelectedList() {
    const list = document.createElement('div');
    list.className = 'list-selected';
    list.role = 'grid';
    list.ariaLabel = "Eléments sélectionnés";

    return list;
  }

  _disable() {
    this.el.setAttribute('tabindex', -1);
  }

  _fillSuggestions(){
    const search = this.search.toLowerCase();

    // loop over the
    let nbValues = 0;
    let nbSelectedValues = 0;
    let optionIndex = -1;

    let suggestionsEtGroups = Array.prototype.map.call(this.el.querySelectorAll(':scope>option, :scope>optgroup'), function(optionEl, indexGroup){
      if(optionEl.nodeName.toLowerCase() == 'option') {
        const text = optionEl.label || optionEl.value;
        const formatedText = text.toLowerCase();
        nbValues++;
        optionIndex++;
        // test if search text match the current option
        if(formatedText.indexOf(search) === -1){
          return;
        }
  
        // create the option
        const suggestion = document.createElement('div');
        suggestion.setAttribute('role', 'option');
        suggestion.setAttribute('tabindex', 0);
        suggestion.setAttribute('data-index', optionIndex);
        suggestion.classList.add('a11y-suggestion');
  
        // check if the option is selected
        if(optionEl.selected){
          nbSelectedValues++;
          suggestion.setAttribute('aria-selected', 'true');
        }
  
        suggestion.innerText = optionEl.label || optionEl.value;
  
        return suggestion;
      } else {
        const text = optionEl.label;
        const formatedText = text.toLowerCase();
        // test if search text match the current option
        const groupMatchSearch = (formatedText.indexOf(search) !== -1);

        const options = optionEl.querySelectorAll('option');
        const suggestionOptions = Array.prototype.map.call(options, function(option, index){
          const text = option.label || option.value;
          const formatedText = text.toLowerCase();
          optionIndex++;
          nbValues++;
          // test if search text match the current option
          if(!groupMatchSearch && formatedText.indexOf(search) === -1){
            return;
          }
    
          // create the option
          const suggestion = document.createElement('div');
          suggestion.setAttribute('role', 'option');
          suggestion.setAttribute('tabindex', 0);
          suggestion.setAttribute('data-index', optionIndex);
          suggestion.classList.add('a11y-suggestion');
    
          // check if the option is selected
          if(option.selected){
            nbSelectedValues++;
            suggestion.setAttribute('aria-selected', 'true');
          }
    
          suggestion.innerText = option.label || option.value;
    
          return suggestion;
        }.bind(this)).filter(Boolean);
        
        if(suggestionOptions.length == 0){
          return;
        }
  
        const suggestionGroup = document.createElement('div');
        suggestionGroup.setAttribute('role', 'group');
        //suggestionGroup.setAttribute('tabindex', 0);
        suggestionGroup.setAttribute('aria-labelledby', this.id + '_group_label_' + indexGroup);
        suggestionGroup.classList.add('a11y-suggestion-group');

        const suggestionGroupLabel = document.createElement('div');
        suggestionGroupLabel.setAttribute('role', 'presentation');
        suggestionGroupLabel.setAttribute('tabindex', 0);
        suggestionGroupLabel.setAttribute('id', this.id + '_group_label_' + indexGroup);
        suggestionGroupLabel.classList.add('a11y-suggestion-group-label');
        suggestionGroupLabel.innerText = text

        suggestionGroup.appendChild(suggestionGroupLabel);
        suggestionOptions.forEach(function(suggestionOption){
          suggestionGroup.appendChild(suggestionOption);
        });

        return suggestionGroup;
      }

    }.bind(this)).filter(Boolean);

    // Initialise un tableau pour stocker les éléments avec le rôle "Option"
    let divOptions = [];
    // Initialise un tableau pour stocker les éléments avec le rôle "Presentation" pour la div de rôle "Group"
    let divOptgroup = [];
    // Initialise un tableau pour stocker les éléments avec les rôle "Presentation" et "Option"
    let divOptgroupAndOption = [];

    // Parcours de chaque élément dans la NodeList suggestionsEtGroups
    suggestionsEtGroups.forEach(function(element) {
      // Vérifie si l'élément a le rôle "Option"
      if (element.getAttribute('role') === 'option') {
        // Ajoute l'élément au tableau divOptions
        divOptions.push(element);
        divOptgroupAndOption.push(element);
      } else if (element.getAttribute('role') === 'group') {
        if(this.multiple){
          let presentationElementsInGroup = element.querySelectorAll('[role="presentation"]');
          presentationElementsInGroup.forEach(function(presentationElement) {
              divOptions.push(presentationElement);
              divOptgroupAndOption.push(presentationElement);
          });
        }
        // Si l'élément a le rôle "Group", parcours ses enfants pour récupérer les div avec le rôle "Option"
        let optionElementsInGroup = element.querySelectorAll('[role="option"]');
        optionElementsInGroup.forEach(function(optionElement) {
            divOptions.push(optionElement);
            divOptgroupAndOption.push(optionElement);
        });
        divOptgroup.push(element);
      }
    }.bind(this));

    this.suggestions              = divOptions;
    this.suggestionsGroups        = divOptgroup;

    if(!this.suggestions.length){
      this.list.innerHTML = `<p class="a11y-no-suggestion">${this._options.text.noResult}</p>`;
    }
    else {
      const listBox = document.createElement('div');
      listBox.setAttribute('role', 'listbox');

      if(this.multiple){
        listBox.setAttribute('aria-multiselectable', 'true');

        if(this._options.selectAll && nbValues > 0) {
          // create the option
          const selectAll = document.createElement('div');
          selectAll.setAttribute('role', 'button');
          selectAll.setAttribute('tabindex', 0);
          if(nbValues == nbSelectedValues) {
            selectAll.setAttribute('aria-pressed', 1);
          } else {
            selectAll.setAttribute('aria-pressed', 0);
          }
          selectAll.classList.add('a11y-suggestion');
          selectAll.classList.add('a11y-select-all-suggestion');
          selectAll.innerText = this._options.text.selectAll;
          listBox.appendChild(selectAll);
          divOptgroupAndOption.unshift(selectAll);
        }
      }

      suggestionsEtGroups.forEach(function(suggestion){
        listBox.appendChild(suggestion);
      }.bind(this));
      
      this._updateSelectedGroups();

      this.list.innerHTML = '';
      this.list.appendChild(listBox);
    }

    this.allSuggestionsAndGroups  = divOptgroupAndOption;

    this._setLiveZone();
  }
  

  _handleOpener(event){
    this._toggleOverlay();
  }

  _handleCloseButton (event){
    this._close();
  }

  _handleFocus(){
    if(!this.open){
      return;
    }

    clearTimeout(this._focusTimeout);

    this._focusTimeout = setTimeout(function(){
      if(!this.overlay.contains(document.activeElement) 
        && this.button !== document.activeElement){
        if(!this._options.preventCloseOnFocusLost) {
          this._toggleOverlay( false, document.activeElement === document.body);
        }
      }
      else if(document.activeElement === this.input){
        // reset the focus index
        this.focusIndex =  null;
      }
      else {
        const optionIndex = this.allSuggestionsAndGroups.indexOf(document.activeElement);

        if(optionIndex !== -1){
          this.focusIndex = optionIndex;
        }
      }
    }.bind(this), 10);
  }

  _handleReset(){
    clearTimeout(this._resetTimeout);

    this._resetTimeout = setTimeout(function(){
      this._fillSuggestions();
      if(this.multiple && this._options.showSelected){
        this._updateSelectedList();
      }
      else if(!this.multiple){
        const option = this.el.item(this.el.selectedIndex);
        this._setButtonText(option.label || option.value);
      }
    }.bind(this), 10);
  }

  _handleSuggestionClick(event){
    const option = closest.call(event.target, '[role="option"]');

    if(!option){
      const group = closest.call(event.target, '[role="group"]');
      if(!group){
        const option = closest.call(event.target, '[role="button"]');
        if(!option || !this.multiple || !this._options.selectAll){
          return;
        }
        this._toggleSelectAll();
        return;
      }
      this._toggleSelectionGroup(group);
      return;
    }

    const optionIndex = parseInt(option.getAttribute('data-index'), 10);
    const shouldClose = this.multiple ? false : true;

    this._toggleSelection(optionIndex, shouldClose);
  }

  _handleInput(){
    // prevent event fireing on focus and blur
    if( this.search === this.input.value ){
      return;
    }

    this.search = this.input.value;
    this._fillSuggestions();
  }

  _handleKeyboard(event){
    const option = closest.call(event.target, '[role="option"]');
    const group = closest.call(event.target, '[role="group"]');
    const selectAllButton = closest.call(event.target, '.a11y-select-all-suggestion[role="button"]');
    const closeButton = closest.call(event.target, '.a11y-close-button[role="button"]');
    const input = closest.call(event.target, 'input');
    const tagItem = closest.call(event.target, '.tag-item');

    if(selectAllButton && this.multiple && this._options.selectAll && event.keyCode === 32){
      this._toggleSelectAll();
      return;
    }
    if(closeButton) {
      if(event.keyCode === 32 || event.keyCode === 13){
        this._toggleOverlay();
      }
      return;
    }

    if(tagItem) {
      const tagItemSupp = closest.call(event.target, '.tag-item-supp');
      const curentItem = closest.call(event.target, '[tabindex="0"]');
      let isMinMax = false;
      let cible = null;
      if(tagItemSupp && event.keyCode === 13){  
        this._removeOption(event);
      } else if(event.keyCode === 39){ // Droite
        event.preventDefault();
        if(tagItemSupp) { // Vers prochain Tag
          const nextTag = tagItem.nextSibling;
          if(nextTag) {
            cible = nextTag.querySelector('[tabindex]');
          } 
        } else { // Vers bouton suppr
          cible = tagItem.querySelector('.tag-item-supp');
        }
      } else if(event.keyCode === 37){ // Gauche
        event.preventDefault();
        if(tagItemSupp) { // Vers texte du tag
          cible = tagItem.querySelector('[tabindex]');
        } else { // Vers précédent Tag, bouton suppr
          const prevTag = tagItem.previousSibling;
          if(prevTag) {
            cible = prevTag.querySelector('.tag-item-supp');
          } 
        }
      } else if(event.keyCode === 40){ // Bas
        event.preventDefault();
        const nextTag = tagItem.nextSibling;
        if(tagItemSupp && nextTag) { // Vers bouton suppression suivant
          cible = nextTag.querySelector('.tag-item-supp');
        } else if(nextTag) { // Vers texte Tag suivant
          cible = nextTag.querySelector('[tabindex]');
        }
      } else if(event.keyCode === 38){ // haut
        event.preventDefault();
        const prevTag = tagItem.previousSibling;
        if(tagItemSupp && prevTag) { // Vers bouton suppression précédent
          cible = prevTag.querySelector('.tag-item-supp');
        } else if(prevTag) { // Vers texte Tag précédent
          cible = prevTag.querySelector('[tabindex]');
        }
      } else if(event.keyCode === 36){ // Home
        event.preventDefault();
        cible = this.selectedList.querySelector('[tabindex]');
      } else if(event.keyCode === 35){ // Fin
        event.preventDefault();
        cible = this.selectedList.lastChild.querySelector('[tabindex]');
      }
      if(cible) {
        curentItem.setAttribute('tabindex', '-1');
        cible.setAttribute('tabindex', '0');
        cible.focus();
      }
      if(this.selectedList.querySelectorAll('[tabindex="0"]').length == 0) {
        this.selectedList.querySelector('[tabindex]').setAttribute('tabindex', '0');
        this.selectedList.querySelector('[tabindex]').focus();
      }
      return;
    }

    if(event.keyCode === 27){
      this._toggleOverlay();
      return;
    }

    if(input && event.keyCode === 13){
      event.preventDefault();
      return;
    }

    if(event.keyCode === 40){
      event.preventDefault();
      this._moveIndex(1);
      return
    }

    if(!option && !group && !selectAllButton){
      return;
    }

    if(event.keyCode === 39){
      event.preventDefault();
      this._moveIndex(1);
      return
    }

    if(event.keyCode === 37 || event.keyCode === 38){
      event.preventDefault();
      this._moveIndex(-1);
      return;
    }

    if(!option && !group){
      return;
    } 

    if(option && (( !this.multiple && event.keyCode === 13 ) || event.keyCode === 32)){
      event.preventDefault();
      this._toggleSelection(parseInt(option.getAttribute('data-index'), 10), this.multiple ? false : true);
    } else if(group && this.multiple && event.keyCode === 32){
      event.preventDefault();
      this._toggleSelectionGroup(group);
    }

    if(this.multiple && event.keyCode === 13 && !this._options.preventCloseOnSelect){
      this._toggleOverlay();
    }
  }

  _moveIndex(step){
    if(this.focusIndex === null){
      this.focusIndex = 0;
    }
    else {
      const nextIndex = this.focusIndex + step;
      const selectionItems = this.allSuggestionsAndGroups.length - 1;

      if(nextIndex > selectionItems){
        this.focusIndex = 0;
      }
      else if(nextIndex < 0){
        this.focusIndex = selectionItems;
      }
      else {
        this.focusIndex = nextIndex;
      }
    }

    this.allSuggestionsAndGroups[this.focusIndex].focus();
  }

  _positionCursor(){
    setTimeout(function(){
      this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
    }.bind(this))
  }

  _removeOption(event){
    const button = closest.call(event.target, '[role="button"]');

    if(!button){
      return;
    }

    const currentButtons = this.selectedList.querySelectorAll('[role="button"]');
    const buttonPreviousIndex = Array.prototype.indexOf.call(currentButtons, button) - 1;
    const optionIndex = parseInt( button.getAttribute('data-index'), 10);

    // disable the option
    this._toggleSelection(optionIndex);

    // manage the focus if there's still the selected list
    if(this.selectedList.parentElement){
      const buttons = this.selectedList.querySelectorAll('[role="button"]');

      // loock for the bouton before the one clicked
      if(buttons[buttonPreviousIndex]){
        buttons[buttonPreviousIndex].setAttribute('tabindex', '0');
        buttons[buttonPreviousIndex].focus();
      }
      // fallback to the first button in the list if there's none
      else {
        buttons[0].setAttribute('tabindex', '0');
        buttons[0].focus();
      }
    }
    else {
      this.button.focus();
    }
  }

  _setButtonText(text){
    this.button.firstElementChild.innerText = text;
  }

  _setLiveZone(){
    const suggestions = this.suggestions.length;
    let text = '';

    if(this.open){
      if(!suggestions){
        text = this._options.text.noResult;
      }
      else {
        text = this._options.text.results.replace('{x}', suggestions);
      }
    }

    this.liveZone.innerText = text;
  }

  _toggleOverlay(state, focusBack){
    this.open = state !== undefined ? state : !this.open;
    this.button.setAttribute('aria-expanded', this.open);

    if(this.open){
      this._fillSuggestions();
      this.button.insertAdjacentElement('afterend', this.overlay);
      this.input.focus();
      this.wrap.classList.add('select-a11y-opened');
    }
    else if(this.wrap.contains(this.overlay)){
      this.wrap.removeChild(this.overlay);

      // reset the focus index
      this.focusIndex =  null;

      // reset search values
      this.input.value = '';
      this.search = '';

      this.wrap.classList.remove('select-a11y-opened');

      // reset aria-live
      this._setLiveZone();
      if(state === undefined || focusBack){
        // fix bug that will trigger a click on the button when focusing directly
        setTimeout(function(){
          this.button.focus();
        }.bind(this))
      }
    }
  }

  _open() {
    this._toggleOverlay(true);
  }

  _close() {
    this._toggleOverlay(false);
  }

  _preventClose(preventClose = true) {
    this._options.preventCloseOnFocusLost = preventClose;
    this._options.preventCloseOnSelect = preventClose;
  }

  _updateSelectedGroups() {
    this.suggestionsGroups.forEach(function(groupOptions){
      if(groupOptions.querySelectorAll('[role="option"]:not([aria-selected="true"])').length == 0) {
        groupOptions.setAttribute('aria-selected', "true");
      } else {
        groupOptions.removeAttribute('aria-selected');
      }
    });
  }
  
  _toggleSelection(optionIndex, close = true){
    const option = this.el.item(optionIndex);

    if(this.multiple){
      option.selected = !option.selected;
    }
    else {
      this.el.selectedIndex = optionIndex;
    }

    this.suggestions.forEach(function(suggestion){
      const index = parseInt(suggestion.getAttribute('data-index'), 10);

      if(this.el.item(index).selected){
        suggestion.setAttribute('aria-selected', 'true');
      }
      else{
        suggestion.removeAttribute('aria-selected');
      }
    }.bind(this));

    const selectAllButton = this.list.querySelector('.a11y-select-all-suggestion');
    if(selectAllButton) selectAllButton.setAttribute('aria-pressed', 'false');
    
    this._updateSelectedGroups();

    if(!this.multiple){
      this._setButtonText(option.label || option.value);
    }
    else if(this._options.showSelected){
      this._updateSelectedList();
    }

    if(close && this.open){
      this._toggleOverlay();
    }
    if(this.el.onchange){
      this.el.onchange();
    }
  }

  _toggleSelectionGroup(groupElement){
    
    let optionElementsInGroup = groupElement.querySelectorAll('[role="option"]');
    optionElementsInGroup.forEach(function(optionElement) {
      const optionIndex = parseInt(optionElement.getAttribute('data-index'), 10);
      const option = this.el.item(optionIndex);

      if(this.multiple){
        this.el.item(optionIndex).selected = !(groupElement.getAttribute('aria-selected') == "true");
      }
      else {
        this.el.selectedIndex = optionIndex;
      }
    }.bind(this));
        
    this.suggestions.forEach(function(suggestion){
      const index = parseInt(suggestion.getAttribute('data-index'), 10);

      if(this.el.item(index).selected){
        suggestion.setAttribute('aria-selected', 'true');
      }
      else{
        suggestion.removeAttribute('aria-selected');
      }
    }.bind(this));

    this._updateSelectedGroups();

    const selectAllButton = this.list.querySelector('.a11y-select-all-suggestion');
    selectAllButton.setAttribute('aria-pressed', 'false');

    if(this._options.showSelected){
      this._updateSelectedList();
    }

    if(this.el.onchange){
      this.el.onchange();
    }
  }

  _toggleSelectAll (){
    const selectAllButton = this.list.querySelector('.a11y-select-all-suggestion');

    const buttonSelected = (selectAllButton.getAttribute('aria-pressed') == 'true');

    const nbValues = selectAllButton.querySelectorAll('[role="option"]').length;
    const nbSelectedValues = selectAllButton.querySelectorAll('[role="option"][aria-selected="true"]').length;
    
    if(nbSelectedValues == nbValues && buttonSelected) {
      // On déselectionne tout
      Array.prototype.map.call(this.el.options, function(option, index){
        this.el.item(index).selected = false;
      }.bind(this));
      
      this.suggestions.forEach(function(suggestion){
        suggestion.removeAttribute('aria-selected');
      });

      selectAllButton.setAttribute('aria-pressed', 'false');
    } else {
      // On sélectionne tout
      Array.prototype.map.call(this.el.options, function(option, index){
        this.el.item(index).selected = true;
      }.bind(this));

      this.suggestions.forEach(function(suggestion){
        suggestion.setAttribute('aria-selected', 'true');
      });
  
      selectAllButton.setAttribute('aria-pressed', 'true');
    }

    this._updateSelectedGroups();

    if(this._options.showSelected){
      this._updateSelectedList();
    }
    if(this.el.onchange){
      this.el.onchange(); 
    }
  }

  _clearSelection(){
    const selectAllButton = this.list.querySelector('.a11y-select-all-suggestion');

    // On déselectionne tout
    Array.prototype.map.call(this.el.options, function(option, index){
      this.el.item(index).selected = false;
    }.bind(this));
    
    this.suggestions.forEach(function(suggestion){
      suggestion.removeAttribute('aria-selected');
    }.bind(this));

    selectAllButton.setAttribute('aria-pressed', 'false');
    
    this._updateSelectedGroups();

    if(this._options.showSelected){
      this._updateSelectedList();
    }
    this.el.onchange();
  }

  _updateSelectedList(){
    const items = Array.prototype.map.call(this.el.options, function(option, index){
      if(!option.selected){
        return;
      }

      const text = option.label || option.value;
      
      const tagItem = document.createElement('div');
      tagItem.classList.add('tag-item');
      tagItem.role = 'row';

      tagItem.insertAdjacentHTML('beforeend', '<span role="gridcell"><span tabindex="-1" id="tag-item-' + index + '">' + text + '</span></span>');
      tagItem.insertAdjacentHTML('beforeend', '<span role="gridcell"><span class="tag-item-supp" tabindex="-1" title="' + this._options.text.deleteItem.replace('{t}', text) + '" id="tag-item-remove-' + index + '" role="button" data-index="' + index + '" aria-label="' + this._options.text.delete + '" aria-labelledby="tag-item-remove-' + index + ' tag-item-' + index + '"><span class="icon-delete" aria-hidden="true"></span></span></span>');

      return tagItem;
    }.bind(this)).filter(Boolean);

    this.selectedList.innerHTML = '';
    items.forEach(function(item){
      this.selectedList.appendChild(item);
    }.bind(this));

    if(items.length){
      if(!this.selectedList.parentElement){
        this.wrap.appendChild(this.selectedList);
      }
      this.selectedList.querySelector("[tabindex='-1']").setAttribute('tabindex', '0');
    }
    else if(this.selectedList.parentElement){
      this.wrap.removeChild(this.selectedList);
    }
  }

  _wrap(){
    const wrapper = document.createElement('div');
    wrapper.classList.add('select-a11y');
    this.el.parentElement.appendChild(wrapper);

    const tagHidden = document.createElement('div');
    tagHidden.classList.add('tag-hidden');
    tagHidden.setAttribute('aria-hidden', true);

    if(this.multiple){
      tagHidden.appendChild(this.label);
    }
    tagHidden.appendChild(this.el);

    wrapper.appendChild(tagHidden);
    wrapper.appendChild(this.liveZone);
    wrapper.appendChild(this.button);

    return wrapper;
  }
}

export default Select;
