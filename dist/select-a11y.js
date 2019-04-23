var Select = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _readOnlyError(name) {
    throw new Error("\"" + name + "\" is read-only");
  }

  var text = {
    help: 'Utilisez la tabulation (ou la touche flèche du bas) pour naviguer dans la liste des suggestions',
    placeholder: 'Rechercher dans la liste',
    noResult: 'aucun résultat',
    results: '{x} suggestion(s) disponibles',
    deleteItem: 'supprimer {t}',
    delete: 'supprimer'
  };
  var matches = Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  var closest = Element.prototype.closest;

  if (!closest) {
    closest = (_readOnlyError("closest"), function (s) {
      var el = this;

      do {
        if (matches.call(el, s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);

      return null;
    });
  }

  var Select =
  /*#__PURE__*/
  function () {
    function Select(el, options) {
      _classCallCheck(this, Select);

      this.el = el;
      this.label = document.querySelector("label[for=".concat(el.id, "]"));
      this.id = el.id;
      this.open = false;
      this.multiple = this.el.multiple;
      this.search = '';
      this.suggestions = [];
      this.focusIndex = null;
      var passedOptions = Object.assign({}, options);
      var textOptions = Object.assign(text, passedOptions.text);
      delete passedOptions.text;
      this._options = Object.assign({
        text: textOptions,
        showSelected: true
      }, passedOptions);
      this._handleFocus = this._handleFocus.bind(this);
      this._handleInput = this._handleInput.bind(this);
      this._handleKeyboard = this._handleKeyboard.bind(this);
      this._handleOpener = this._handleOpener.bind(this);
      this._handleReset = this._handleReset.bind(this);
      this._handleSuggestionClick = this._handleSuggestionClick.bind(this);
      this._removeOption = this._removeOption.bind(this);

      this._disable();

      this.button = this._createButton();
      this.liveZone = this._createLiveZone();
      this.overlay = this._createOverlay();
      this.wrap = this._wrap();

      if (this.multiple && this._options.showSelected) {
        this.selectedList = this._createSelectedList();

        this._updateSelectedList();

        this.selectedList.addEventListener('click', this._removeOption);
      }

      this.button.addEventListener('click', this._handleOpener);
      this.input.addEventListener('input', this._handleInput);
      this.list.addEventListener('click', this._handleSuggestionClick);
      this.wrap.addEventListener('keydown', this._handleKeyboard);
      document.addEventListener('blur', this._handleFocus, true);
      this.el.form.addEventListener('reset', this._handleReset);
    }

    _createClass(Select, [{
      key: "_createButton",
      value: function _createButton() {
        var button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('aria-expanded', this.open);
        button.className = 'btn btn-select-a11y';
        var text = document.createElement('span');

        if (this.multiple) {
          text.innerText = this.label.innerText;
        } else {
          var selectedOption = this.el.item(this.el.selectedIndex);
          text.innerText = selectedOption.label || selectedOption.value;
        }

        button.appendChild(text);
        button.insertAdjacentHTML('beforeend', '<span class="icon-select" aria-hidden="true"></span>');
        return button;
      }
    }, {
      key: "_createLiveZone",
      value: function _createLiveZone() {
        var live = document.createElement('p');
        live.setAttribute('aria-live', 'polite');
        live.classList.add('sr-only');
        return live;
      }
    }, {
      key: "_createOverlay",
      value: function _createOverlay() {
        var container = document.createElement('div');
        container.classList.add('a11y-container');
        var suggestions = document.createElement('div');
        suggestions.classList.add('a11y-suggestions');
        suggestions.id = "a11y-".concat(this.id, "-suggestions");
        container.innerHTML = "\n      <p id=\"a11y-usage$".concat(this.id, "-js\" class=\"sr-only\">").concat(this._options.text.help, "</p>\n      <label for=\"a11y-").concat(this.id, "-js\" class=\"sr-only\">").concat(this._options.text.placeholder, "</label>\n      <input type=\"text\" id=\"a11y-").concat(this.id, "-js\" class=\"").concat(this.el.className, "\" autocomplete=\"off\" autocapitalize=\"off\" spellcheck=\"false\" placeholder=\"").concat(this._options.text.placeholder, "\" aria-describedby=\"a11y-usage").concat(this.id, "-js\">\n    ");
        container.appendChild(suggestions);
        this.list = suggestions;
        this.input = container.querySelector('input');
        return container;
      }
    }, {
      key: "_createSelectedList",
      value: function _createSelectedList() {
        var list = document.createElement('ul');
        list.className = 'list-inline list-selected';
        return list;
      }
    }, {
      key: "_disable",
      value: function _disable() {
        this.el.setAttribute('tabindex', -1);
      }
    }, {
      key: "_fillSuggestions",
      value: function _fillSuggestions() {
        var search = this.search.toLowerCase(); // loop over the

        this.suggestions = Array.prototype.map.call(this.el.options, function (option, index) {
          var text = option.label || option.value;
          var formatedText = text.toLowerCase(); // test if search text match the current option

          if (formatedText.indexOf(search) === -1) {
            return;
          } // create the option


          var suggestion = document.createElement('div');
          suggestion.setAttribute('role', 'option');
          suggestion.setAttribute('tabindex', 0);
          suggestion.setAttribute('data-index', index);
          suggestion.classList.add('a11y-suggestion'); // check if the option is selected

          var selected = Array.prototype.indexOf.call(this.el.selectedOptions, option) !== -1;

          if (selected) {
            suggestion.setAttribute('aria-selected', 'true');
          }

          suggestion.innerText = option.label || option.value;
          return suggestion;
        }.bind(this)).filter(Boolean);

        if (!this.suggestions.length) {
          this.list.innerHTML = "<p class=\"a11y-no-suggestion\">".concat(this._options.text.noResult, "</p>");
        } else {
          this.list.innerHTML = "<div role=\"listbox\"><div>";
          this.suggestions.forEach(function (suggestion) {
            this.list.firstElementChild.appendChild(suggestion);
          }.bind(this));
        }

        this._setLiveZone();
      }
    }, {
      key: "_handleOpener",
      value: function _handleOpener(event) {
        this._toggleOverlay();
      }
    }, {
      key: "_handleFocus",
      value: function _handleFocus() {
        if (!this.open) {
          return;
        }

        clearTimeout(this._focusTimeout);
        this._focusTimeout = setTimeout(function () {
          if (!this.wrap.contains(document.activeElement)) {
            this._toggleOverlay(false);
          } else if (document.activeElement === this.input) {
            // reset the focus index
            this.focusIndex = null;
          } else {
            var optionIndex = this.suggestions.indexOf(document.activeElement);

            if (optionIndex !== -1) {
              this.focusIndex = optionIndex;
            }
          }
        }.bind(this), 10);
      }
    }, {
      key: "_handleReset",
      value: function _handleReset() {
        clearTimeout(this._resetTimeout);
        this._resetTimeout = setTimeout(function () {
          this._fillSuggestions();

          if (this.multiple && this._options.showSelected) {
            this._updateSelectedList();
          }
        }.bind(this), 10);
      }
    }, {
      key: "_handleSuggestionClick",
      value: function _handleSuggestionClick(event) {
        var option = closest.call(event.target, '[role="option"]');

        if (!option) {
          return;
        }

        this._toggleSelection(parseInt(option.getAttribute('data-index'), 10));
      }
    }, {
      key: "_handleInput",
      value: function _handleInput() {
        this.search = this.input.value;

        this._fillSuggestions();
      }
    }, {
      key: "_handleKeyboard",
      value: function _handleKeyboard(event) {
        var option = closest.call(event.target, '[role="option"]');
        var input = closest.call(event.target, 'input'); // event.preventDefault();

        if (event.keyCode === 27) {
          this._toggleOverlay();

          return;
        }

        if (input && event.keyCode === 13) {
          event.preventDefault();
          return;
        }

        if (event.keyCode === 39 || event.keyCode === 40) {
          this._moveIndex(1);

          return;
        }

        if (!option) {
          return;
        }

        if (event.keyCode === 37 || event.keyCode === 38) {
          this._moveIndex(-1);

          return;
        }

        if (event.keyCode === 13 || event.keyCode === 32) {
          this._toggleSelection(parseInt(option.getAttribute('data-index'), 10));
        }
      }
    }, {
      key: "_moveIndex",
      value: function _moveIndex(step) {
        if (this.focusIndex === null) {
          this.focusIndex = 0;
        } else {
          var nextIndex = this.focusIndex + step;
          var selectionItems = this.suggestions.length - 1;

          if (nextIndex > selectionItems) {
            this.focusIndex = 0;
          } else if (nextIndex < 0) {
            this.focusIndex = selectionItems;
          } else {
            this.focusIndex = nextIndex;
          }
        }

        this.suggestions[this.focusIndex].focus();
      }
    }, {
      key: "_removeOption",
      value: function _removeOption(event) {
        var button = closest.call(event.target, 'button');

        if (!button) {
          return;
        }

        var optionIndex = parseInt(button.getAttribute('data-index'), 10);

        this._toggleSelection(optionIndex);

        if (this.selectedList.parentElement) {
          var _button = this.selectedList.querySelector('button');

          if (_button) {
            _button.focus();
          } else {
            this.button.focus();
          }
        } else {
          this.button.focus();
        }
      }
    }, {
      key: "_setButtonText",
      value: function _setButtonText(text) {
        this.button.firstElementChild.innerText = text;
      }
    }, {
      key: "_setLiveZone",
      value: function _setLiveZone() {
        var suggestions = this.suggestions.length;
        var text = '';

        if (this.open) {
          if (!suggestions) {
            text = this._options.text.noResult;
          } else {
            text = this._options.text.results.replace('{x}', suggestions);
          }
        }

        this.liveZone.innerText = text;
      }
    }, {
      key: "_toggleOverlay",
      value: function _toggleOverlay(state) {
        this.open = state !== undefined ? state : !this.open;
        this.button.setAttribute('aria-expanded', this.open);

        if (this.open) {
          this._fillSuggestions();

          this.button.insertAdjacentElement('afterend', this.overlay);
          this.input.focus();
        } else if (this.wrap.contains(this.overlay)) {
          this.wrap.removeChild(this.overlay); // reset the focus index

          this.focusIndex = null; // reset search values

          this.input.value = '';
          this.search = ''; // reset aria-live

          this._setLiveZone();

          if (state === undefined) {
            // fix bug that will trigger a click on the button when focusing directly
            setTimeout(function () {
              this.button.focus();
            }.bind(this));
          }
        }
      }
    }, {
      key: "_toggleSelection",
      value: function _toggleSelection(optionIndex) {
        var option = this.el.item(optionIndex);

        if (this.multiple) {
          this.el.item(optionIndex).selected = !this.el.item(optionIndex).selected;
        } else {
          this.el.selectedIndex = optionIndex;
        }

        this.suggestions.forEach(function (suggestion) {
          var index = parseInt(suggestion.getAttribute('data-index'), 10);

          if (this.el.item(index).selected) {
            suggestion.setAttribute('aria-selected', 'true');
          } else {
            suggestion.removeAttribute('aria-selected');
          }
        }.bind(this));

        if (!this.multiple) {
          this._setButtonText(option.label || option.value);

          this._toggleOverlay();
        } else if (this._options.showSelected) {
          this._updateSelectedList();
        }
      }
    }, {
      key: "_updateSelectedList",
      value: function _updateSelectedList() {
        var items = Array.prototype.map.call(this.el.options, function (option, index) {
          if (!option.selected) {
            return;
          }

          var text = option.label || option.value;
          return "\n        <li class=\"tag-item\">\n          <span>".concat(text, "</span>\n          <button class=\"tag-item-supp\" title=\"").concat(this._options.text.deleteItem.replace('{t}', text), "\" type=\"button\" data-index=\"").concat(index, "\">\n            <span class=\"sr-only\">").concat(this._options.text.delete, "</span>\n            <span class=\"icon-delete\" aria-hidden=\"true\"></span>\n          </button>\n        </li>");
        }.bind(this)).filter(Boolean);
        this.selectedList.innerHTML = items.join('');

        if (items.length) {
          if (!this.selectedList.parentElement) {
            this.wrap.appendChild(this.selectedList);
          }
        } else {
          this.wrap.removeChild(this.selectedList);
        }
      }
    }, {
      key: "_wrap",
      value: function _wrap() {
        var wrapper = document.createElement('div');
        wrapper.classList.add('select-a11y');
        this.el.parentElement.appendChild(wrapper);
        var tagHidden = document.createElement('div');
        tagHidden.classList.add('tag-hidden');
        tagHidden.setAttribute('aria-hidden', true);

        if (this.multiple) {
          tagHidden.appendChild(this.label);
        }

        tagHidden.appendChild(this.el);
        wrapper.appendChild(tagHidden);
        wrapper.appendChild(this.liveZone);
        wrapper.appendChild(this.button);
        return wrapper;
      }
    }]);

    return Select;
  }();

  return Select;

}());
