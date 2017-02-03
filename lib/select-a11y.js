define(['jquery'], function ($) {
    function transform() {
        var $selectsToTransform = $('select[data-select-a11y]');

        $selectsToTransform.each(function (index, selectToTransform) {
            transform($(selectToTransform));
        });

        function transform($selectToTransform) {
            var $selectParent = $selectToTransform.parent();
            $selectParent.addClass('tag-hidden');
            var $a11ySelector = insertA11ySelectorBefore($selectParent);
            var $filterButton = insertFilterButtonBeforeA11ySelector($selectParent.find('label'));
            insertA11yScreenReaderDescriptionBefore($filterButton);
            insertListSelectionAfter($selectParent);
            handleInput($a11ySelector, $selectToTransform);


            function insertA11ySelectorBefore($selectParent) {
                var selectId = $selectToTransform.attr('id');
                var $label = $selectParent.find('label');
                var $a11ySelector = $('' +
                    '<div class="row">' +
                    '  <label for="a11y-' + selectId + '-js" class="sr-only">' + $label.text() + '</label>' +
                    '  <input type="text" id="a11y-' + selectId + '-js" class="js-combobox" list="a11y-' + selectId + '-list" autocomplete="off">' +
                    '  <datalist id="a11y-' + selectId + '-list"></datalist>' +
                    '</div>');
                var $input = $a11ySelector.find('#a11y-' + selectId + '-js');

                addClassesTo($a11ySelector, $selectParent.attr('class'));
                addClassesTo($input, $selectToTransform.attr('class'));
                addOptionsToDatalist($a11ySelector.find('#a11y-' + selectId + '-list'), $selectToTransform.find('option'));

                $a11ySelector.insertBefore($selectParent);

                return $a11ySelector;


                function addClassesTo($element, classes) {
                    var classList = classes.split(/\s+/);
                    classList.forEach(function (cssClass) {
                        $element.addClass(cssClass);
                    });
                }

                function addOptionsToDatalist($element, $hiddenOptions) {
                    $hiddenOptions.each(function (index, hiddenOption) {
                        $element.append('' +
                            '<option ' +
                            '  value="' + hiddenOption.value + '"' +
                            '  data-id=' + hiddenOption.index +
                            '></option>');
                    });
                }
            }

            function insertFilterButtonBeforeA11ySelector($label) {
                var $filterButton = $('<button type="button" class="btn" aria-expanded="false">' + $label.text() + '</button>');

                $filterButton.insertBefore($a11ySelector);

                $filterButton.on('click', function () {
                    $a11ySelector.removeClass('tag-hidden');
                    $a11ySelector.find(':text').focus();
                    $filterButton.attr('aria-expanded', 'true');
                });

                $a11ySelector.addClass('tag-hidden');

                return $filterButton;
            }

            function insertA11yScreenReaderDescriptionBefore($element) {
                var $screenReaderDescription = $('' +
                    '<div aria-live="polite" class="sr-only">' +
                    '  <p></p>' +
                    '</div>');

                $screenReaderDescription.insertBefore($element);

                return $screenReaderDescription;
            }

            function insertListSelectionAfter($element) {
                var ulToInsert = $('<ul class="list-inline"></ul>');
                ulToInsert.insertAfter($element);
                return ulToInsert;
            }

            function handleInput($a11ySelector, $hiddenSelect) {
                var $listSelection = $a11ySelector.next().next();
                var $screenReaderDescription = $a11ySelector.prev().prev().find('p');
                var selectId = $hiddenSelect.attr('id');
                $a11ySelector.find('#a11y-' + selectId + '-js').on('input', onInput);

                function onInput(event) {
                    var $input = $(event.currentTarget);
                    var inputValue = $input.val();
                    var opt = $input.parent().find('option[value="' + inputValue + '"]');
                    var alreadySelected = $('#' + selectId + '-' + opt.data('id')).length > 0;

                    if (opt.length === 1 && !alreadySelected) {
                        appendListItem(opt);
                        selectInHiddenSelect(opt.val());
                        $input.val('');
                        $screenReaderDescription.text(opt.val() + ' sélectionné');
                    } else {
                        var filteredItems = $input.parent().find('option').filter(function (index, option) {
                            return option.value.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
                        });
                        $screenReaderDescription.text(filteredItems.length + ' suggestions disponibles');
                    }
                }

                function appendListItem($option) {
                    var $listItem = $('' +
                        '<li>' +
                        '  <span id="' + selectId + '-' + $option.data('id') + '" class="tag-item" data-value="' + $option.val() + '">' + $option.val() +
                        '    <button class="tag-item-supp" title="supprimer ' + $option.val() + '" type="button">' +
                        '      <span class="sr-only">supprimer</span>' +
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
                            $a11ySelector.find('#a11y-' + selectId + '-js').focus();
                        }

                        listItem.remove();
                    }

                    function unselectInHiddenSelect($deleteButton) {
                        var optionsSelected = $hiddenSelect.val() || [];
                        var selectedValue = $deleteButton.parent().data("value");
                        var indexOfSelectedOption = optionsSelected.indexOf(selectedValue);
                        optionsSelected.splice(indexOfSelectedOption, 1);
                        $hiddenSelect.val(optionsSelected);
                    }
                }

                function selectInHiddenSelect($selectedValue) {
                    var optionsSelected = $hiddenSelect.val() || [];
                    optionsSelected.push($selectedValue);
                    $hiddenSelect.val(optionsSelected);
                }
            }
        }

    }

    return {
        transform: transform
    }
});