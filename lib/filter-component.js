define(['jquery'], function($) {
    function transform() {
        var formToTransform = $('form[data-filter-component]');
        var divToHide = formToTransform.find('select').parent();

        divToHide.hide();

        insertDiv(divToHide);
    }

    function addClassesToInputText(divToHide, divToInsert) {
        var hiddenSelectClassList = divToHide.find('select').attr('class').split(/\s+/);
        hiddenSelectClassList.forEach(function (clazz) {
            divToInsert.find('input').addClass(clazz);
        });
    }

    function addClassesToDivToInsert(divToHide, divToInsert) {
        var hiddenDivClassList = divToHide.attr('class').split(/\s+/);
        hiddenDivClassList.forEach(function (clazz) {
            divToInsert.addClass(clazz);
        });
    }

    function addOptionsToDatalist(divToHide, divToInsert) {
        var hiddenOptions = divToHide.find('select option');
        hiddenOptions.each(function (index, hiddenOption) {
            divToInsert.find('#a11y-select-option-list').append('<option value="' + hiddenOption.value + '"></option>');
        });
    }

    function insertDiv(divToHide) {
        var divToInsert = $('' +
            '<div class="row">' +
            '  <label for="a11y-select-js" class="sr-only">Chercher dans les filtres</label>' +
            '  <input type="text" id="a11y-select-js" class="js-combobox" list="a11y-select-option-list">' +
            '  <datalist id="a11y-select-option-list"></datalist>' +
            '</div>');

        addClassesToDivToInsert(divToHide, divToInsert);
        addClassesToInputText(divToHide, divToInsert);
        addOptionsToDatalist(divToHide, divToInsert);

        divToInsert.insertBefore(divToHide);
    }

    return {
        transform: transform
    }
});