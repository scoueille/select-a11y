define(['jquery'], function ($) {
    function transform() {
        var formToTransform = $('form[data-filter-component]');

        var hiddenDiv = hideExistingSelect();
        var a11ySelector = insertA11ySelectorBefore(hiddenDiv);
        insertA11yScreenReaderDescriptionBefore(a11ySelector);
        var listSelection = insertListSelectionAfter(hiddenDiv);

        handleInput();

        return formToTransform;


        function hideExistingSelect() {
            var divToHide = formToTransform.find('select').parent();
            divToHide.hide();
            return divToHide;
        }

        function insertA11ySelectorBefore(hiddenDiv) {
            var a11ySelector = $('' +
                '<div class="row">' +
                '  <label for="a11y-select-js" class="sr-only">Chercher dans les filtres</label>' +
                '  <input type="text" id="a11y-select-js" class="js-combobox" list="a11y-select-option-list">' +
                '  <datalist id="a11y-select-option-list"></datalist>' +
                '</div>');

            addClassesToDivToInsert(a11ySelector, hiddenDiv);
            addClassesToInputText(a11ySelector, hiddenDiv);
            addOptionsToDatalist(a11ySelector, hiddenDiv);

            a11ySelector.insertBefore(hiddenDiv);

            return a11ySelector;


            function addClassesToInputText(a11ySelector, divToHide) {
                var hiddenSelectClassList = divToHide.find('select').attr('class').split(/\s+/);
                hiddenSelectClassList.forEach(function (clazz) {
                    a11ySelector.find('input').addClass(clazz);
                });
            }

            function addClassesToDivToInsert(a11ySelector, divToHide) {
                var hiddenDivClassList = divToHide.attr('class').split(/\s+/);
                hiddenDivClassList.forEach(function (clazz) {
                    a11ySelector.addClass(clazz);
                });
            }

            function addOptionsToDatalist(a11ySelector, divToHide) {
                var hiddenOptions = divToHide.find('select option');
                hiddenOptions.each(function (index, hiddenOption) {
                    a11ySelector.find('#a11y-select-option-list').append('' +
                        '<option ' +
                        '  value="' + hiddenOption.value + '"' +
                        '  data-id=' + hiddenOption.index +
                        '></option>');
                });
            }
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

        function handleInput() {
            a11ySelector.find('#a11y-select-js').on('input', onInput);

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
                    var hiddenSelect = hiddenDiv.find('select');
                    var optionsSelected = hiddenSelect.val() || [];
                    var selectedValue = button.parent().data("value");
                    var indexOfSelectedOption = optionsSelected.indexOf(selectedValue);
                    optionsSelected.splice(indexOfSelectedOption, 1);
                    hiddenSelect.val(optionsSelected);
                }
            }

            function selectInHiddenSelect(selectedValue) {
                var hiddenSelect = hiddenDiv.find('select');
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