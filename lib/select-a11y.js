define(['jquery'], function ($) {
    function transform() {
        var $selectsToTransform = $('select[data-select-a11y]');

        $selectsToTransform.each(function (index, selectToTransform) {
            transform($(selectToTransform));
        });

        function transform($selectToTransform) {
            var $selectContainer = hideSelectToTransform();
            var $wrappedContainer = createWrappedContainer();
            var $a11ySelectContainer = insertA11ySelect();
            var $revealButton = insertRevealButton();
            insertScreenReaderDescription();
            insertListSelection();
            handleEvents();


            function hideSelectToTransform() {
                var $selectContainer = $selectToTransform.parent();
                $selectContainer.addClass('tag-hidden');
                $selectContainer.attr('aria-hidden', 'true');
                $selectContainer.find('select').attr('tabindex', '-1');
                return $selectContainer;
            }

            function createWrappedContainer() {
                $selectContainer.wrap('<div class="select-a11y"></div>');
                return $selectContainer.parent();
            }

            function insertA11ySelect() {
                var selectId = $selectToTransform.attr('id');
                var placeholder = $selectToTransform.data('placeholder');
                var helpUsage = 'Utilisez la tabulation (ou la touche flèche du bas) pour naviguer dans la liste des suggestions';
                var $container = $('' +
                    '<div class="a11y-container">' +
                    '  <p id="a11y-usage' + selectId + '-js" class="sr-only">' + helpUsage + '</p>' +
                    '  <label for="a11y-' + selectId + '-js" class="sr-only">' + placeholder + '</label>' +
                    '  <input type="text" id="a11y-' + selectId + '-js" autocomplete="off" autocapitalize="off" spellcheck="false" ' +
                    '         placeholder="' + placeholder + '" aria-describedby="a11y-usage' + selectId + '-js">' +
                    '  <div id="a11y-' + selectId + '-suggestions" class="a11y-suggestions">' +
                    '    <div role="listbox">' +
                    '    </div>' +
                    '  </div>' +
                    '</div>');
                var $input = $container.find('#a11y-' + selectId + '-js');

                addClassesTo($container, $selectContainer.attr('class'));
                addClassesTo($input, $selectToTransform.attr('class'));

                $container.insertBefore($selectContainer);

                return $container;


                function addClassesTo($element, classes) {
                    var classList = classes.split(/\s+/);
                    classList.forEach(function (cssClass) {
                        $element.addClass(cssClass);
                    });
                }
            }

            function insertRevealButton() {
                var $label = $selectContainer.find('label');
                var $revealButton = $('<button type="button" class="btn btn-select-a11y" aria-expanded="false">' + $label.text() + '</button>');

                $revealButton.insertBefore($a11ySelectContainer);

                $a11ySelectContainer.addClass('tag-hidden');

                return $revealButton;
            }

            function insertScreenReaderDescription() {
                var $screenReaderDescription = $('' +
                    '<div aria-live="polite" class="sr-only">' +
                    '  <p></p>' +
                    '</div>');

                $screenReaderDescription.insertBefore($revealButton);

                return $screenReaderDescription;
            }

            function insertListSelection() {
                var ulToInsert = $('<ul class="list-inline list-selected"></ul>');
                ulToInsert.insertAfter($selectContainer);
                return ulToInsert;
            }

            function handleEvents() {
                var $listSelection = $a11ySelectContainer.next().next();
                var $screenReaderDescription = $a11ySelectContainer.prev().prev().find('p');
                var selectId = $selectToTransform.attr('id');
                var $suggestions = $('#a11y-' + selectId + '-suggestions div');
                var $input = $a11ySelectContainer.find('#a11y-' + selectId + '-js');

                $('body').on('click', function (event) {
                    var $target = $(event.target);
                    if (!$target.is($input) && !$target.is($suggestions.parent()) && !$target.is($suggestions) && !$target.is('button.btn.btn-select-a11y')) {
                        abortInput();
                    }
                });

                $revealButton.on('click', function () {
                    $wrappedContainer.addClass('is-open');
                    $a11ySelectContainer.removeClass('tag-hidden');
                    $a11ySelectContainer.find(':text').focus();
                    $revealButton.attr('aria-expanded', 'true');
                    fillSuggestions();
                });

                $input.on('input', fillSuggestions)
                    .on('keydown', onKeydownInInput);

                $suggestions.on('keydown', '.a11y-suggestion', onEventInSuggestions);
                $suggestions.on('click', '.a11y-suggestion', onEventInSuggestions);

                function fillSuggestions() {
                    var filteredItems = $selectToTransform.find('option').filter(function (index, option) {
                        return option.value.toLowerCase().indexOf($input.val().toLowerCase()) > -1;
                    });

                    $suggestions.empty();
                    filteredItems.each(function (index, hiddenOption) {
                        var $suggestion = $('<div ' +
                            '  data-id=' + hiddenOption.index +
                            '  class="a11y-suggestion"' +
                            '  tabindex="-1"' +
                            '  role="option">' +
                            hiddenOption.value + '</div>');
                        $suggestions.append($suggestion);
                    });
                    $screenReaderDescription.text(filteredItems.length + ' suggestions disponibles');
                }

                function abortInput(event) {
                    $suggestions.empty();
                    $a11ySelectContainer.addClass('tag-hidden');
                    $revealButton.attr('aria-expanded', 'false');
                    $wrappedContainer.removeClass('is-open');
                    $input.val('');
                    if (event) {
                        $revealButton.focus();
                        event.preventDefault();
                    }
                }

                function onKeydownInInput(event) {
                    var $suggestionsList = $suggestions.find('.a11y-suggestion');
                    var nonShiftTab = (!event.shiftKey && event.keyCode === 9);
                    var shiftTab = (event.shiftKey && event.keyCode === 9);
                    var downArrow = event.keyCode === 40;
                    var esc = event.keyCode === 27;

                    if ((nonShiftTab || downArrow) && $suggestionsList.length > 0) {
                        $suggestionsList.first().focus();
                        event.preventDefault();
                    }
                    if (nonShiftTab && $suggestionsList.length === 0) {
                        abortInput();
                    }
                    if (esc || shiftTab) {
                        abortInput(event);
                    }
                }

                function onEventInSuggestions(event) {
                    var $firstSuggestion = $suggestions.find('.a11y-suggestion').first();
                    var $lastSuggestion = $suggestions.find('.a11y-suggestion').last();
                    var $currentSuggestion = $(event.currentTarget);
                    var $previousSuggestion = $currentSuggestion.prev();
                    var $nextSuggestion = $currentSuggestion.next();

                    onTab();
                    onDownArrow();
                    onUpArrow();
                    onShiftTab();
                    onEsc();
                    onClickOrEnterOrSpace();

                    function onTab() {
                        if (!event.shiftKey && event.keyCode === 9) {
                            if ($nextSuggestion.length > 0) {
                                $nextSuggestion.focus();
                                event.preventDefault();
                            } else {
                                abortInput();
                            }
                        }
                    }

                    function onDownArrow() {
                        if (event.keyCode === 40) {
                            focusOn_Or($nextSuggestion, $firstSuggestion);
                            event.preventDefault();
                        }
                    }

                    function onUpArrow() {
                        if (event.keyCode === 38) {
                            focusOn_Or($previousSuggestion, $lastSuggestion);
                            event.preventDefault();
                        }
                    }

                    function onShiftTab() {
                        if (event.shiftKey && event.keyCode === 9) {
                            focusOn_Or($previousSuggestion, $input);
                            event.preventDefault();
                        }
                    }

                    function onEsc() {
                        if (event.keyCode === 27) {
                            abortInput(event);
                        }
                    }

                    function onClickOrEnterOrSpace() {
                        if (event.type === 'click' || event.keyCode === 13 || event.keyCode === 32) {
                            var alreadySelected = $('#' + selectId + '-' + $currentSuggestion.data('id')).length > 0;
                            if (!alreadySelected) {
                                appendListItem($currentSuggestion);
                                selectInHiddenSelect($currentSuggestion.text());
                                $screenReaderDescription.text($currentSuggestion.text() + ' sélectionné');
                            }
                            abortInput(event);
                        }
                    }

                    function focusOn_Or($target, $defaultTarget) {
                        if ($target.length > 0) {
                            $target.focus();
                        } else {
                            $defaultTarget.focus();
                        }
                    }

                }

                function appendListItem($currentSuggestion) {
                    var $listItem = $('' +
                        '<li>' +
                        '  <span id="' + selectId + '-' + $currentSuggestion.data('id') + '" class="tag-item" data-value="' + $currentSuggestion.text() + '">' + $currentSuggestion.text() +
                        '    <button class="tag-item-supp" title="supprimer ' + $currentSuggestion.text() + '" type="button">' +
                        '      <span class="sr-only">supprimer</span>' +
                        '      <span class="icon-delete" aria-hidden="true"></span>' +
                        '    </button>' +
                        '  </span>' +
                        '</li>');

                    $listSelection.append($listItem);

                    $listItem.find('button').on('click', onClick);

                    function onClick(event) {
                        var $deleteButton = $(event.currentTarget);
                        var listItem = $deleteButton.parent().parent();

                        unselectInHiddenSelect($deleteButton);

                        var $previousListItem = listItem.prev();
                        if ($previousListItem.length > 0) {
                            $previousListItem.find('button').focus();
                        } else {
                            $revealButton.focus();
                        }

                        listItem.remove();
                    }

                    function unselectInHiddenSelect($deleteButton) {
                        var optionsSelected = $selectToTransform.val() || [];
                        var selectedValue = $deleteButton.parent().data("value");
                        var indexOfSelectedOption = optionsSelected.indexOf(selectedValue);
                        optionsSelected.splice(indexOfSelectedOption, 1);
                        $selectToTransform.val(optionsSelected);
                    }
                }

                function selectInHiddenSelect($selectedValue) {
                    var optionsSelected = $selectToTransform.val() || [];
                    optionsSelected.push($selectedValue);
                    $selectToTransform.val(optionsSelected);
                }
            }
        }

    }

    return {
        transform: transform
    }
});
