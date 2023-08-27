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
    const text = {
      help: 'Utilisez la tabulation (ou les touches flèches) pour naviguer dans la liste des suggestions',
      placeholder: 'Rechercher dans la liste',
      noResult: 'Aucun résultat',
      results: '{x} suggestion(s) disponibles',
      deleteItem: 'Supprimer {t}',
      delete: 'Supprimer',
      selectAll: 'Sélectionner tout',
      closeButton: 'Retour',
      regexErrorText: 'Le mot clé est mal formaté',
      welcomeMessage: null,
    };
    
    this.el = el;
    this.label = document.querySelector(`label[for=${el.id}]`);
    this.id = el.id;
    this.open = false;
    this.multiple = this.el.multiple;
    this.search = '';
    this.selectedKeywords = [];
    this.suggestions = [];
    this.suggestionsGroups = [];
    this.allSuggestionsAndGroups = [];
    this.focusIndex = null;
    this.customOverlayMessageShown = false;
    this.ctrlVPressed = false;

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
      keywordsMode: false,
      url: null,
      allowNewKeyword: true,
      regexFilter: null,
      additionalDelemiters: [],
    }, passedOptions );


    if(!this._options.keywordsMode) { // Mode select classique
      this._initialiseSelect();
    } else { // Mode Mots clés avec ou sans autocomplete
      this._options.showSelected = true;
      this._initialiseInputKeywords();
    }
  }

  _initialiseSelect(){
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

  _initialiseInputKeywords(){
    this._handleFocus = this._handleFocus.bind(this);
    this._handleInput = this._handleInput.bind(this);
    this._handleKeyboard = this._handleKeyboard.bind(this);
    //this._handleOpener = this._handleOpener.bind(this);
    this._handleReset = this._handleReset.bind(this);
    this._handleAutocompleteKeywordClick = this._handleAutocompleteKeywordClick.bind(this);
    this._handleCloseButton = this._handleCloseButton.bind(this);
    this._positionCursor = this._positionCursor.bind(this);
    this._removeOption = this._removeOption.bind(this);

    this._disable();

    this.input = this._createKeywordInput();
    this.liveZone = this._createLiveZone();
    this.overlay = this._createOverlay();
    this.wrap = this._wrap();
    this.selectedList = this._createSelectedList();
    this._updateSelectedList();

    this.selectedList.addEventListener('click', this._removeOption);

    //this.button.addEventListener('click', this._handleOpener);
    this.input.addEventListener('input', this._handleInput);
    this.input.addEventListener('focus', this._positionCursor, true);
    this.list.addEventListener('click', this._handleAutocompleteKeywordClick);
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

  _createKeywordInput(){
    const button = document.createElement('input');
    button.setAttribute('type', 'text');
    if(this._options.url != null) {
      button.setAttribute('role', 'combobox');
      button.setAttribute('aria-expanded', this.open);
      button.setAttribute('aria-autocomplete', 'list');
    }
    button.className = 'form-control form-control-a11y';

    button.setAttribute('id',this.el.id+'-input');
    button.setAttribute('aria-label', this.label.innerText);
    button.setAttribute('autocomplete', 'off');
    button.setAttribute('spellcheck', 'false');
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

    if(!this._options.keywordsMode) { // Mode select classique
      container.innerHTML = `
        <p id="a11y-usage-${this.id}-js" class="sr-only">${this._options.text.help}</p>
        <label for="a11y-${this.id}-js" class="sr-only">${this._options.text.placeholder}</label>
        <input type="text" id="a11y-${this.id}-js" class="${this.el.className}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${this._options.text.placeholder}" aria-describedby="a11y-usage-${this.id}-js">
      `;
    } else {
      container.innerHTML = `
        <p id="a11y-usage-${this.id}-js" class="sr-only">${this._options.text.help}</p>
      `;
    }

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
    if(!this._options.keywordsMode) { // Mode select classique
      this.input = container.querySelector('input');
    }
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

  _fillOverlayWithText(text){
    this.suggestions                = [];
    this.suggestionsGroups          = [];
    this.allSuggestionsAndGroups    = [];
    this.customOverlayMessageShown  = true;

    this.list.innerHTML = `<p class="a11y-no-suggestion">${text}</p>`;
    this._setLiveZone(text);
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
      listBox.id = `a11y-${this.id}-listbox`;

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
      this.button.setAttribute('aria-controls', `a11y-${this.id}-listbox`);
    }

    this.allSuggestionsAndGroups  = divOptgroupAndOption;

    this._setLiveZone();
  }
  
  /**
   * Proceed Ajax results
   * @param  {String} data JSON result
   * @param  {String} value Search value
   * @return
   * @private
   */ 
  _searchParseResult(data, value, focusOnResults = false) {
    let suggestionsEtGroups = Array.prototype.map.call(data[this._options.urlResultsArray], function(result) {
      let value = result[this._options.urlValueField];
      let label = result[this._options.urlLabelField];
      if(this.selectedKeywords.includes(value)) {
        return;
      }
      
      // create the option
      const suggestion = document.createElement('div');
      suggestion.setAttribute('role', 'option');
      suggestion.setAttribute('tabindex', 0);
      suggestion.setAttribute('data-value', value);
      suggestion.setAttribute('data-label', label);
      suggestion.classList.add('a11y-suggestion');

      suggestion.innerText = label;

      return suggestion;
    }.bind(this)).filter(Boolean);
    
    // Initialise un tableau pour stocker les éléments avec le rôle "Option"
    let divOptions = [];
    // Initialise un tableau pour stocker les éléments avec le rôle "Presentation" pour la div de rôle "Group"
    let divOptgroup = [];
    // Initialise un tableau pour stocker les éléments avec les rôle "Presentation" et "Option"
    let divOptgroupAndOption = [];

    suggestionsEtGroups.forEach(function(element) {
      // Ajoute l'élément au tableau divOptions
      divOptions.push(element);
      divOptgroupAndOption.push(element);
    }.bind(this));

    this.suggestions              = divOptions;
    this.suggestionsGroups        = divOptgroup;

    if(!this.suggestions.length){
      this.list.innerHTML = `<p class="a11y-no-suggestion">${this._options.text.noResult}</p>`;
    } else {
      const listBox = document.createElement('div');
      listBox.setAttribute('role', 'listbox');
      listBox.id = `a11y-${this.id}-listbox`;
      listBox.setAttribute('aria-multiselectable', 'true');

      suggestionsEtGroups.forEach(function(suggestion){
        listBox.appendChild(suggestion);
      }.bind(this));
      
      this.list.innerHTML = '';
      this.list.appendChild(listBox);
      this.input.setAttribute('aria-controls', `a11y-${this.id}-listbox`);
    }

    this.allSuggestionsAndGroups  = divOptgroupAndOption;

    this._setLiveZone();
    if(this.suggestions.length && focusOnResults) {
      this._moveIndex(0);
    }
  }

  _fillAutocomplete(focusOnResults = false) {
    const search = this.search.toLowerCase();
    
    if(search.length > 0) {
      this.ajaxRequest = new XMLHttpRequest();
      
      var url = this._options.url + search;
      
      var that = this;
      this.ajaxRequest.onload  = function(e) {
        if(that.ajaxRequest != null && that.ajaxRequest.responseText) {
          var data = JSON.parse(that.ajaxRequest.responseText);
          that._searchParseResult(data, search, focusOnResults);
        }
      }
      this.ajaxRequest.open('GET', url, true);
      this.ajaxRequest.send();
    }

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
        && this.input !== document.activeElement
        && this.button !== document.activeElement){
        if(!this._options.preventCloseOnFocusLost) {
          this._toggleOverlay( false, document.activeElement === document.body && !this._options.keywordsMode);
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

  _handleAutocompleteKeywordClick(event){
    const option = closest.call(event.target, '[role="option"]');

    if(!option){
      return;
    }

    const optionValue = option.getAttribute('data-value');
    const optionlabel = option.getAttribute('data-label');
    this._addOption(optionlabel, optionValue);
    if(!this._options.preventCloseOnSelect) {
      this._toggleOverlay( false );
    } else {
      this._removeSuggestion(option);
    }
  }

  _handleInput(){
    // prevent event fireing on focus and blur
    if( this.search === this.input.value.trim() ){
      return;
    }

    if(this.customOverlayMessageShown){
      this._toggleOverlay(false);
    }

    this.search = this.input.value.trim();

    if(this.ctrlVPressed && this._options.keywordsMode && this._options.allowNewKeyword && this._options.additionalDelemiters.length > 0 && this.search != '') { // Mode keyword libre
      let delimiters = this._options.additionalDelemiters;
      let firstDelimiter = null;
      let errorMessage = null;
      let notUsedContent = '';
      let firstIteration = true;
      
      do {
        firstDelimiter = null;
        delimiters.forEach(element => {
          var delimiterPos = this.search.indexOf(element);
          
          if(delimiterPos >= 0 && (firstDelimiter == null || delimiterPos<firstDelimiter) ) {
            firstDelimiter = delimiterPos;
          }
        });
        let keyword = null; 
        let currentManagedString = null; 
        if(firstDelimiter > 0) {
          keyword = this.search.substring(0, firstDelimiter).trim();
          currentManagedString = this.search.substring(0, firstDelimiter + 1);
          this.search = this.search.substring(firstDelimiter + 1).trim();
        } else if(!firstIteration) {
          keyword = this.search.trim();
          currentManagedString = this.search;
          this.search = '';
        }
        if( keyword && keyword.length > 0) {
          let canAddItem = true;
          if (this._options.regexFilter) {
            // Determine whether we can update based on whether
            // our regular expression passes
            canAddItem = this._regexFilter(keyword);
          }
          if(canAddItem) {
            this._addOption(keyword);
          } else { 
            errorMessage = (errorMessage && errorMessage.length > 0 ? errorMessage + "<br />" : "") +
              (this._isType('Function', this._options.text.regexErrorText) ?
                this._options.text.regexErrorText(keyword) :
                this._options.text.regexErrorText);
            notUsedContent += currentManagedString;
          }
        }
        firstIteration = false;
      } while (firstDelimiter > 0);

      if(errorMessage != null) {
        this._toggleOverlay(true, true, errorMessage);
      }
      if(notUsedContent.length > 0) {
        this.search = notUsedContent + this.search;
      }
      
      this.input.value = this.search;
    }
    
    if(!this._options.keywordsMode) { // Mode select classique
      this._fillSuggestions();
    } else if(this._options.url != null) { // Mode kayword avec autocomplete
      if(!this.open && this.search != '') {
        this._toggleOverlay(true);
      } else if(this.search == ''){
        this._toggleOverlay(false);
      } else {
        this._fillAutocomplete();
      }
    } else if (this._options.regexFilter  && this.search != '') {
      // Determine whether we can update based on whether
      // our regular expression passes
      const canAddItem = this._regexFilter(this.search);
      if(!canAddItem) {
        const notice = this._isType('Function', this._options.text.regexErrorText) ?
          this._options.text.regexErrorText(this.search) :
          this._options.text.regexErrorText;
        this._toggleOverlay(true, true, notice);
      }
    }
  }

  _handleKeyboard(event){
    const option = closest.call(event.target, '[role="option"]');
    const group = closest.call(event.target, '[role="group"]');
    const selectAllButton = closest.call(event.target, '.a11y-select-all-suggestion[role="button"]');
    const closeButton = closest.call(event.target, '.a11y-close-button[role="button"]');
    const input = closest.call(event.target, 'input');
    const tagItem = closest.call(event.target, '.tag-item');
    this.ctrlVPressed = false;

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
      let cible = null;
      if(tagItemSupp && event.keyCode === 13){  
        this._removeOption(event);
      } else if(event.keyCode === 46){  // Suppr
        event.preventDefault();
        if(tagItemSupp) { 
          this._removeOption(event);
        } else { // Vers bouton suppr
          // Crée un nouvel événement keydown à transmettre à l'élément cible
          var nouvelEvenement = new KeyboardEvent('keydown', event);

          // Transmet l'événement à l'élément cible
          cible = tagItem.querySelector('.tag-item-supp');
          cible.dispatchEvent(nouvelEvenement);
        }
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

    if(!this._options.keywordsMode) { // Mode select classique
      if(input && event.keyCode === 13){
        event.preventDefault();
        return;
      }
    } else { // Mode Mots clés avec ou sans autocomplete
      if (input &&(event.ctrlKey || event.metaKey) && event.key === 'v') {
        // La combinaison CTRL+V a été pressée
        this.ctrlVPressed = true;
      } 
      if(input && (event.keyCode === 13 || this._options.additionalDelemiters.includes(event.key)) && this._options.allowNewKeyword){
        event.preventDefault();
        let keyword = this.input.value;
        if( keyword != '') {
          let canAddItem = true;
          if (this._options.regexFilter) {
            // Determine whether we can update based on whether
            // our regular expression passes
            canAddItem = this._regexFilter(keyword);
          }
          if(canAddItem) {
            this._addOption(keyword);
            this.input.value = "";
          } else {
            const notice = this._isType('Function', this._options.text.regexErrorText) ?
              this._options.text.regexErrorText(keyword) :
              this._options.text.regexErrorText;
            this._toggleOverlay(true, true, notice);
          }
        }

        return;
      } else if(input && this.input.value.trim() != "" && event.keyCode === 40){ // Bas
        event.preventDefault();
        if(!this.open) {
          this._toggleOverlay(true, false);
        } else {
          this._moveIndex(0);
        }
        return;
      }
      if(option && (event.keyCode === 13 || event.keyCode === 32)){
        event.preventDefault();    
        const optionValue = option.getAttribute('data-value');
        const optionlabel = option.getAttribute('data-label');
        this._addOption(optionlabel, optionValue);
        if(!this._options.preventCloseOnSelect) {
          this._toggleOverlay( false );
        } else {
          this._removeSuggestion(option);
        }
        
        return;
      }
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
    if(this.allSuggestionsAndGroups.length == 0) {
      return;
    }

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
      if(!this.open && this._options.text.welcomeMessage != null) {
        this._toggleOverlay(true, false, this._options.text.welcomeMessage);
      }
    }.bind(this))
  }
  
  _removeSuggestion(option) {
    const selectionItemsCount = this.allSuggestionsAndGroups.length - 1;
    const optionIndex = this.allSuggestionsAndGroups.indexOf(option);
    const optionIndex1 = this.suggestions.indexOf(option);
    
    if(selectionItemsCount < 1) {
      this._fillAutocomplete();
      this.input.focus();
      this._positionCursor();
      return;
    } 
    if(this.focusIndex == null || selectionItemsCount > this.focusIndex) {
      this._moveIndex(1);
    } else {
      this._moveIndex(-1);
    }

    if(optionIndex !== -1){
      this.allSuggestionsAndGroups.splice(optionIndex, 1);
      this.suggestions.splice(optionIndex1, 1);
    }
    option.remove();

  }

  _addOption(keyword, keywordValue){
    const optionValue = keywordValue || keyword;
    const existingOption =  this.el.querySelector('option[value="' + optionValue + '"]');
    if(existingOption != null) {
      existingOption.selected = true;
      this._updateSelectedList();
    } else {
      this.el.add(new Option(keyword, optionValue, true, true));
      this._updateSelectedList();
    }

    if(this.el.onchange){
      this.el.onchange();
    }
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
      const focusables = this.selectedList.querySelectorAll('[tabindex="0"]');

      focusables.forEach(function(focusable){
        focusable.setAttribute('tabindex', '-1');
      });

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
      if(!this._options.keywordsMode) { // Mode normal
        this.button.focus();
      } else { // mode autocomplete
        this.input.focus();
      }
    }
  }

  _setButtonText(text){
    this.button.firstElementChild.innerText = text;
  }

  _setLiveZone(overrideText = null){
    let text = '';
    if(overrideText != null) {
      text = overrideText;
    } else {
      const suggestions = this.suggestions.length;
  
      if(this.open){
        if(!suggestions){
          text = this._options.text.noResult;
        }
        else {
          text = this._options.text.results.replace('{x}', suggestions);
        }
      }
    }

    this.liveZone.innerText = text;
  }

  _toggleOverlay(state, focusBack, overrideText = null){
    if(this._options.keywordsMode && this._options.url == null && overrideText == null) {// Pas d'overlay
      this.open = false;
    } else if(overrideText) {
      this.open = state !== undefined ? state : true;
    } else {
      this.open = state !== undefined ? state : !this.open;

      if(!this._options.keywordsMode) { // Mode select classique
        this.button.setAttribute('aria-expanded', this.open);
      } else {
        this.input.setAttribute('aria-expanded', this.open);
      }
    }

    if(this.open){
      if(!this._options.keywordsMode) { // Mode select classique
        if(overrideText != null) {
          this._fillOverlayWithText(overrideText);
        } else {
          this._fillSuggestions();
        }
        this.button.insertAdjacentElement('afterend', this.overlay);
      } else if(this._options.url != null || overrideText) { // Mode kayword avec autocomplete
        if(overrideText != null) {
          this._fillOverlayWithText(overrideText);
        } else {
          this._fillAutocomplete(focusBack === false);
        }
        this.input.insertAdjacentElement('afterend', this.overlay);
      } 
      if(focusBack !== false) {
        this.input.focus();
      }
      this.wrap.classList.add('select-a11y-opened');
    }
    else if(this.wrap.contains(this.overlay)){
      this.wrap.removeChild(this.overlay);

      // reset the focus index
      this.focusIndex =  null;

      this.customOverlayMessageShown = false;

      // reset search values
      if(!this._options.keywordsMode) { // Mode select classique
        this.input.value = '';
        this.search = '';
      }
      this.wrap.classList.remove('select-a11y-opened');

      // reset aria-live
      this._setLiveZone();
      if(state === undefined || focusBack){
        // fix bug that will trigger a click on the button when focusing directly
        setTimeout(function(){
          if(!this._options.keywordsMode) {
            this.button.focus();
          } else {
            this.input.focus();
          }
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
    this.selectedKeywords.length = 0;
    const items = Array.prototype.map.call(this.el.options, function(option, index){
      if(!option.selected){
        return;
      }

      const text = option.label || option.value;

      this.selectedKeywords.push(option.value);

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
    if(!this._options.keywordsMode) { // Mode select classique
      wrapper.appendChild(this.button);
    } else {
      wrapper.appendChild(this.input);
    }

    return wrapper;
  }
  
  /**
   * Tests value against a regular expression
   * @param  {string} value   Value to test
   * @return {Boolean}        Whether test passed/failed
   * @private
   */
  _regexFilter(value) {
    if (!value) {
      return false;
    }

    const regex = this._options.regexFilter;
    const expression = new RegExp(regex.source, 'i');
    return expression.test(value);
  }

  /**
   * Tests the type of an object
   * @param  {String}  type Type to test object against
   * @param  {Object}  obj  Object to be tested
   * @return {Boolean}
   */
  _isType(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
  };

}

export default Select;
