/* global describe, expect, it, beforeEach */
define(['../lib/select-a11y'], function (filterComponent) {
    describe("An accessybility select", function () {
        var fixture;

        beforeEach(function () {
            fixture = setFixtures('' +
                '<form action="">' +
                '  <div class="form-group">' +
                '    <label for="select-option">Sélectionner une option</label>' +
                '    <select class="form-control" id="select-option" multiple data-select-a11y>' +
                '        <option>Option 1</option>' +
                '        <option>Option 2</option>' +
                '        <option>Option 3</option>' +
                '        <option>Option 4</option>' +
                '        <option>Option 5</option>' +
                '    </select>' +
                '  </div>' +
                '  <div class="form-group">' +
                '    <label for="select-element">Sélectionner un élément</label>' +
                '    <select class="form-control" id="select-element" multiple data-select-a11y>' +
                '        <option>Element 1</option>' +
                '        <option>Element 2</option>' +
                '        <option>Element 3</option>' +
                '    </select>' +
                '  </div>' +
                '  <div class="form-group">' +
                '    <label for="select-i-must-not-transform">Ajouter un filtre pas transformé</label>' +
                '    <select class="form-control" id="select-i-must-not-transform" multiple>' +
                '        <option>Option 1</option>' +
                '        <option>Option 2</option>' +
                '    </select>' +
                '  </div>' +
                '  <p>' +
                '    <button class="btn btn-primary" type="submit">Filtrer</button>' +
                '  </p>' +
                '</form>'
            );
        });

        describe("before transformation", function () {
            var selectsToTransform;

            beforeEach(function () {
                selectsToTransform = fixture.find('select[data-select-a11y]');
            });

            function executeTests(index) {
                var selectToTransform;

                beforeEach(function () {
                    selectToTransform = $(selectsToTransform[index]);
                });

                describe("for select[" + index + "]", function () {
                    var ids = ['select-option', 'select-element'];

                    it("should have a data-select-a11y", function () {
                        expect(selectToTransform).toExist();
                    });

                    it("should have a div as parent", function () {
                        expect(selectToTransform.parent()).toBeMatchedBy('div');
                    });

                    it("should have an id", function () {
                        expect(selectToTransform).toHaveId(ids[index]);
                    });

                    it("should have a label", function () {
                        var label = selectToTransform.parent().find('label');
                        expect(label).toHaveAttr('for', ids[index]);
                    });
                });

            }

            for (var index = 0; index < 2; index++) {
                executeTests(index);
            }
        });

        describe("after transformation", function () {
            var transformedSelects;

            beforeEach(function () {
                filterComponent.transform();
                transformedSelects = fixture.find('select[data-select-a11y]');
            });

            function executeTests(index) {
                var hiddenSelectId;
                var a11yDiv;
                var hiddenDiv;

                beforeEach(function () {
                    var transformedSelect = $(transformedSelects[index]);
                    hiddenSelectId = transformedSelect.attr('id');
                    hiddenDiv = transformedSelect.parent();
                    a11yDiv = hiddenDiv.prev();
                });

                describe("for select[" + index + "]", function () {

                    it("should hide the a11y selector", function () {
                        expect(a11yDiv).toBeHidden();
                    });

                    it("should NOT hide the select I must not transform", function () {
                        var divIMustNotTransform = fixture.find('#select-i-must-not-transform');
                        expect(divIMustNotTransform).not.toBeHidden();
                    });

                    describe("a new button permit to add a filter", function () {
                        var filterButton;
                        var labels = ["Sélectionner une option", "Sélectionner un élément"];

                        beforeEach(function () {
                            filterButton = a11yDiv.prev();
                        });

                        it("should be before the a11y selector", function () {
                            expect(filterButton).toExist();
                            expect(filterButton).toBeMatchedBy('button');
                            expect(filterButton).toHaveClass('btn');
                            expect(filterButton).toHaveAttr('aria-expanded', 'true');
                        });

                        it("should have the same text than the label of the hidden select", function () {
                            expect(filterButton).toHaveText(labels[index]);
                        });

                        describe("on click on the button", function () {
                            beforeEach(function () {
                                filterButton.click();
                            });

                            it("should show the a11y selector", function () {
                                expect(a11yDiv).not.toBeHidden();
                            });

                            it("should hide the inner div of the transformed form", function () {
                                expect(hiddenDiv).toBeHidden();
                            });

                            it("should change the focus to the input", function () {
                                var input = a11yDiv.find(':text');
                                expect(input).toBeFocused();
                            });

                            describe("a new div contains the a11y selector", function () {

                                it("should add the div before the hidden div", function () {
                                    expect(a11yDiv).toExist();
                                    expect(a11yDiv).not.toBeHidden();
                                    expect(a11yDiv).toBeMatchedBy('div');
                                });

                                it("should have a class row", function () {
                                    expect(a11yDiv).toHaveClass('row');
                                });

                                it("should have the classes of the hidden div", function () {
                                    var classList = hiddenDiv.attr('class').split(/\s+/);

                                    classList.forEach(function (clazz) {
                                        expect(a11yDiv).toHaveClass(clazz);
                                    });
                                });

                                describe("the a11y input handles a datalist element", function () {
                                    var input;

                                    beforeEach(function () {
                                        input = a11yDiv.find(':text');
                                    });

                                    it("should have an input text", function () {
                                        expect(input).toExist();
                                    });

                                    it("should have an id build with transformed select id", function () {
                                        expect(input).toHaveId('a11y-' + hiddenSelectId + '-js');
                                    });

                                    it("should have a class js-combobox", function () {
                                        expect(input).toHaveClass('js-combobox');
                                    });

                                    it("should the classes of the hidden select", function () {
                                        var hiddenSelect = hiddenDiv.find('select');
                                        var classList = hiddenSelect.attr('class').split(/\s+/);

                                        classList.forEach(function (clazz) {
                                            expect(input).toHaveClass(clazz);
                                        });
                                    });

                                    it("should have an attribut 'list'", function () {
                                        expect(input).toHaveAttr('list', 'a11y-' + hiddenSelectId + '-list');
                                    });

                                    it("should have an attribut 'autocomplete' to off", function () {
                                        expect(input).toHaveAttr('autocomplete', 'off');
                                    });

                                    it("should have a label for sr only with the same text than the label of the hidden select", function () {
                                        var label = a11yDiv.find('label');
                                        expect(label).toExist();
                                        expect(label).toHaveClass('sr-only');
                                        expect(label).toHaveAttr('for', 'a11y-' + hiddenSelectId + '-js');
                                        expect(label).toHaveText(labels[index]);
                                    });

                                    it("should hide the parent on focus out", function () {
                                        input.trigger('focusout');
                                        expect(a11yDiv).toBeHidden();
                                    });

                                    describe("The datalist is filled with the hidden select options", function () {
                                        var datalist;

                                        beforeEach(function () {
                                            datalist = a11yDiv.find('datalist');
                                        });

                                        it("should have a datalist", function () {
                                            expect(datalist).toExist();
                                        });

                                        it("should have an id", function () {
                                            expect(datalist).toHaveId('a11y-' + hiddenSelectId + '-list');
                                        });

                                        describe("should be filled with the existing hidden select options", function () {
                                            var datalistOptions;
                                            var hiddenSelectOptions;

                                            beforeEach(function () {
                                                datalistOptions = datalist.find('option');
                                                hiddenSelectOptions = hiddenDiv.find('select option');
                                            });

                                            it("should have the same length", function () {
                                                expect(datalistOptions).toHaveLength(hiddenSelectOptions.length);
                                            });

                                            it("should contains the same values", function () {
                                                var hiddenOptionValues = hiddenSelectOptions.map(function () {
                                                    return $(this).val();
                                                });

                                                datalistOptions.each(function (index, datalistOption) {
                                                    expect(hiddenOptionValues).toContain(datalistOption.value);
                                                });
                                            });

                                            it("should have data-id with the index of the hidden select option", function () {
                                                datalistOptions.each(function (index, datalistOption) {
                                                    expect(datalistOption).toHaveData('id', index);
                                                });
                                            });

                                        });
                                    });

                                    describe("on selection of an item in a11y selector", function () {
                                        var testInputValues = ['Option 2', 'Element 2'];

                                        beforeEach(function () {
                                            a11yDiv.find('#a11y-' + hiddenSelectId + '-js').val(testInputValues[index]).trigger('input');
                                        });

                                        it("should empty the input after selection", function () {
                                            expect(input).toHaveValue('');
                                        });
                                    });
                                });
                            });

                            describe("a new div contains the descrition for a11y screen reader", function () {
                                var srDiv;

                                beforeEach(function () {
                                    srDiv = a11yDiv.prev().prev();
                                });

                                it("should add the div before the a11y enhanced selector div", function () {
                                    expect(srDiv).toExist();
                                    expect(srDiv).toBeMatchedBy('div');
                                });

                                it("should have a class sr-only", function () {
                                    expect(srDiv).toHaveClass('sr-only');
                                });

                                it("should contain a paragraph", function () {
                                    expect(srDiv.find('p')).toExist();
                                });

                                it("should have an attribut 'aria-live'", function () {
                                    expect(srDiv).toHaveAttr('aria-live', 'polite');
                                });

                                describe("on input in a11y selector", function () {
                                    var listItem;
                                    var description;
                                    var testInputValues = ['Option', 'Element'];
                                    var testInputListSize = [5, 3];

                                    beforeEach(function () {
                                        var ulSelection = hiddenDiv.next();

                                        a11yDiv.find('#a11y-' + hiddenSelectId + '-js').val(testInputValues[index]).trigger('input');
                                        listItem = ulSelection.find('li');
                                        description = srDiv.find('p');
                                    });

                                    it("should NOT add a list item in the selected items list", function () {
                                        expect(listItem.length).toEqual(0);
                                    });

                                    it("should update the a11y screen reader with the number of filtered items", function () {
                                        expect(description).toHaveText(testInputListSize[index] + ' éléments dans la liste');
                                    });
                                });

                                describe("on selection of an item in a11y selector", function () {
                                    var description;
                                    var testInputValues = ['Option 2', 'Element 2'];

                                    beforeEach(function () {

                                        a11yDiv.find('#a11y-' + hiddenSelectId + '-js').val(testInputValues[index]).trigger('input');
                                        description = srDiv.find('p');
                                    });

                                    it("should update the a11y screen reader with the selected item", function () {
                                        expect(description).toHaveText(testInputValues[index] + ' sélectionné');
                                    });
                                });

                            });

                            describe("a list contains the selected items", function () {
                                var ulSelection;

                                beforeEach(function () {
                                    ulSelection = hiddenDiv.next();
                                });

                                it("should add the ul after the hidden div", function () {
                                    expect(ulSelection).toExist();
                                    expect(ulSelection).toBeMatchedBy('ul');
                                });

                                it("should have a class list-inline", function () {
                                    expect(ulSelection).toHaveClass('list-inline');
                                });

                                describe("on selection of an item in a11y selector", function () {
                                    var listItem;
                                    var testFirstInputValues = ['Option 2', 'Element 2'];
                                    var testSecondInputValues = ['Option 3', 'Element 3'];

                                    beforeEach(function () {
                                        a11yDiv.find('#a11y-' + hiddenSelectId + '-js').val(testFirstInputValues[index]).trigger('input');
                                        listItem = ulSelection.find('li');
                                    });

                                    it("should add a list item in the selected items list", function () {
                                        expect(listItem.length).toEqual(1);
                                        expect(listItem).toContainText(testFirstInputValues[index]);
                                    });

                                    describe("the added list item", function () {
                                        it("should have a span which references the hidden selected option", function () {
                                            var span = listItem.find('span');
                                            expect(span).toExist();
                                            expect(span).toHaveId(hiddenSelectId + '-1');
                                            expect(span).toHaveClass('tag-item');
                                            expect(span).toHaveData('value', testFirstInputValues[index]);
                                        });

                                        it("should have a button to permit the deletion", function () {
                                            var button = listItem.find('span button');
                                            expect(button).toExist();
                                            expect(button).toHaveClass('tag-item-supp');
                                            expect(button).toHaveAttr('title', 'supprimer la selection');
                                            expect(button).toHaveAttr('aria-labelledby', hiddenSelectId + '-1');
                                            expect(button).toHaveAttr('type', 'button');
                                        });

                                        it("should have a span in the button for the screen reader", function () {
                                            var innerSpan = listItem.find('span button span');
                                            expect(innerSpan).toExist();
                                            expect(innerSpan).toHaveClass('sr-only');
                                            expect(innerSpan).toHaveText('supprimer');
                                        });
                                    });

                                    describe("when the selected element is already selected", function () {
                                        beforeEach(function () {
                                            a11yDiv.find('#a11y-select-js').val(testFirstInputValues[index]).trigger('input');
                                            listItem = ulSelection.find('li');
                                        });

                                        it("should not add the item to the list", function () {
                                            expect(listItem.length).toEqual(1);
                                            expect(listItem).toContainText(testFirstInputValues[index]);
                                        });

                                    });

                                    describe("on the hidden select", function () {
                                        var hiddenSelect;

                                        beforeEach(function () {
                                            hiddenSelect = hiddenDiv.find('select');
                                        });

                                        it("should select the option in the hidden select", function () {
                                            var selectedOptions = hiddenSelect.find('option:selected');
                                            expect(selectedOptions).toHaveLength(1);
                                            expect(selectedOptions[0]).toHaveText(testFirstInputValues[index]);
                                        });

                                        describe("with several selections", function () {

                                            beforeEach(function () {
                                                a11yDiv.find('#a11y-' + hiddenSelectId + '-js').val(testSecondInputValues[index]).trigger('input');
                                            });

                                            it("should select the multiple options in the hidden select", function () {
                                                var selectedOptions = hiddenSelect.find('option:selected');
                                                expect(selectedOptions).toHaveLength(2);
                                                expect(selectedOptions[0]).toHaveText(testFirstInputValues[index]);
                                                expect(selectedOptions[1]).toHaveText(testSecondInputValues[index]);
                                            });
                                        });

                                    });

                                    describe("on deletion of a list item", function () {

                                        beforeEach(function () {
                                            a11yDiv.find('#a11y-' + hiddenSelectId + '-js').val(testSecondInputValues[index]).trigger('input');
                                            listItem.find('span button').click();
                                        });

                                        it("should delete the list item", function () {
                                            listItem = ulSelection.find('li');
                                            expect(listItem.length).toEqual(1);
                                            expect(listItem[0]).toContainText(testSecondInputValues[index]);
                                        });

                                        describe("on the hidden select", function () {
                                            var hiddenSelect;

                                            beforeEach(function () {
                                                hiddenSelect = hiddenDiv.find('select');
                                            });

                                            it("should unselect the option in the hidden select", function () {
                                                var selectedOptions = hiddenSelect.find('option:selected');
                                                expect(selectedOptions).toHaveLength(1);
                                                expect(selectedOptions[0]).toHaveText(testSecondInputValues[index]);
                                            });

                                        });
                                    });

                                });
                            })
                        });
                    });
                });
            }

            for (var index = 0; index < 2; index++) {
                executeTests(index);
            }

        });

    });

});
