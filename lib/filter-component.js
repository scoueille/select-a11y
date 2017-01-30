define(['jquery'], function ($) {
    function transform() {
        var selectToTransform = $('select[data-filter-component]');

        var selector = insertA11ySelectorBefore(selectToTransform);
        var filterButton = insertFilterButtonBefore(selector, selectToTransform.parent().find('label'));
        insertA11yScreenReaderDescriptionBefore(filterButton);
        insertListSelectionAfter(selectToTransform.parent());
        handleInput(selector, selectToTransform);

        return selector;


        function insertA11ySelectorBefore(selectToTransform) {
            var selectParent = selectToTransform.parent();
            var selectId = selectToTransform.attr('id');
            var a11ySelector = $('' +
                '<div class="row">' +
                '  <label for="a11y-' + selectId + '-js" class="sr-only">Chercher dans les filtres</label>' +
                '  <input type="text" id="a11y-' + selectId + '-js" class="js-combobox" list="a11y-' + selectId + '-list" autocomplete="off">' +
                '  <datalist id="a11y-' + selectId + '-list"></datalist>' +
                '</div>');

            addClassesTo(a11ySelector, selectParent.attr('class'));
            addClassesTo(a11ySelector.find('input'), selectToTransform.attr('class'));
            addOptionsToDatalist(a11ySelector.find('#a11y-' + selectId + '-list'), selectToTransform.find('option'));

            a11ySelector.insertBefore(selectParent);

            selectParent.hide();

            return a11ySelector;


            function addClassesTo(element, classes) {
                var classList = classes.split(/\s+/);
                classList.forEach(function (clazz) {
                    element.addClass(clazz);
                });
            }

            function addOptionsToDatalist(element, hiddenOptions) {
                hiddenOptions.each(function (index, hiddenOption) {
                    element.append('' +
                        '<option ' +
                        '  value="' + hiddenOption.value + '"' +
                        '  data-id=' + hiddenOption.index +
                        '></option>');
                });
            }

        }

        function insertFilterButtonBefore(element, label) {
            var filterButton = $('<button type="button" class="btn" aria-expanded="true">' + label.text() + '</button>');

            filterButton.insertBefore(element);

            filterButton.on('click', function () {
                element.show();
            });

            element.hide();

            return filterButton;
        }

        function insertA11yScreenReaderDescriptionBefore(element) {
            var srDescription = $('' +
                '<div aria-live="polite" class="sr-only">' +
                '  <p></p>' +
                '</div>');

            srDescription.insertBefore(element);

            return srDescription;
        }

        function insertListSelectionAfter(element) {
            var ulToInsert = $('<ul class="list-inline"></ul>');
            ulToInsert.insertAfter(element);
            return ulToInsert;
        }

        function handleInput(a11ySelector, hiddenSelect) {
            var listSelection = a11ySelector.next().next();
            var selectId = hiddenSelect.attr('id');
            a11ySelector.find('#a11y-' + selectId + '-js').on('input', onInput);

            function onInput() {
                var opt = $(this).parent().find('option[value="' + $(this).val() + '"]');
                var alreadySelected = $('#selected-item-' + opt.data('id')).length > 0;

                if (opt.length === 1 && !alreadySelected) {
                    appendListItem(opt);
                    selectInHiddenSelect(opt.val());
                    $(this).val('');
                }
            }

            function appendListItem(opt) {
                var listItem = $('' +
                    '<li>' +
                    '  <span id="selected-item-' + opt.data('id') + '" class="tag-item" data-value="' + opt.val() + '">' + opt.val() +
                    '    <button class="tag-item-supp" title="supprimer la selection" aria-labelledby="selected-item-' + opt.data('id') + '" type="button">' +
                    '      <span class="sr-only">supprimer</span>' +
                    '    </button>' +
                    '  </span>' +
                    '</li>');

                listSelection.append(listItem);

                listSelection.find('#selected-item-' + opt.data('id') + ' button').on('click', onClick);

                function onClick() {
                    var listItem = $(this).parent().parent();

                    unselectInHiddenSelect($(this));

                    listItem.remove();
                }

                function unselectInHiddenSelect(button) {
                    var optionsSelected = hiddenSelect.val() || [];
                    var selectedValue = button.parent().data("value");
                    var indexOfSelectedOption = optionsSelected.indexOf(selectedValue);
                    optionsSelected.splice(indexOfSelectedOption, 1);
                    hiddenSelect.val(optionsSelected);
                }
            }

            function selectInHiddenSelect(selectedValue) {
                var optionsSelected = hiddenSelect.val() || [];
                optionsSelected.push(selectedValue);
                hiddenSelect.val(optionsSelected);
            }
        }

    }

    return {
        transform: transform
    }
});