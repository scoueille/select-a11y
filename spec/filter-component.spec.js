/* global describe, expect, it, beforeEach */
define(['../lib/filter-component'], function (filterComponent) {
    describe("A suite is just a function", function () {
        var a;
        var fixture = setFixtures('' +
            '<form action="" data-filter-component>' +
            '  <div class="form-group">' +
            '    <label for="select">Ajouter un filtre</label>' +
            '    <select class="form-control" id="select" multiple>' +
            '        <option>Option 1</option>' +
            '        <option>Option 2</option>' +
            '        <option>Option 3</option>' +
            '        <option>Option 4</option>' +
            '        <option>Option 5</option>' +
            '    </select>' +
            '  </div>' +
            '  <p>' +
            '    <button class="btn btn-primary" type="submit">Filtrer</button>' +
            '  </p>' +
            '</form>' +
            '' +
            '<form action="" class="form-i-must-not-tranform">' +
            '  <div class="form-group">' +
            '    <label for="select">Ajouter un filtre pas transformé</label>' +
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

        beforeEach(function () {
            $('body').append(fixture);
        });

        describe("Before transformation", function () {
            var formToTranform;

            beforeEach(function () {
                formToTranform = fixture.find('form[data-filter-component]');
            });

            it("should have a form with data-filter-component", function () {
                expect(formToTranform).toExist();
            });

            it("should have one submit button", function () {
                var button = formToTranform.find(':submit');
                expect(button).toExist();
            });

            it("should have one select", function () {
                var select = formToTranform.find('select');
                expect(select).toExist();
            });

            it("should have one select in a div", function () {
                var select = formToTranform.find('select');
                expect(select.parent()).toBeMatchedBy('div');
            });

        });

        describe("After transformation", function () {
            var tranformedForm;

            beforeEach(function () {
                filterComponent.transform();
                tranformedForm = fixture.find('form[data-filter-component]');
            });

            it("should hide the inner div of the transformed form", function () {
                var hiddenDiv = tranformedForm.find('select').parent();
                expect(hiddenDiv).toBeHidden();
            });

            it("should NOT hide the inner div of the form I must not transform", function () {
                var divIMustNotTransform = fixture.find('form.form-i-must-not-tranform div');
                expect(divIMustNotTransform).not.toBeHidden();
            });

            describe("A new div contains the a11y selector", function () {
                var a11yDiv;
                var hiddenDiv;

                beforeEach(function () {
                    hiddenDiv = tranformedForm.find('div:hidden');
                    a11yDiv = hiddenDiv.prev();
                });

                it("should add the div before the hidden div", function () {
                    expect(a11yDiv).toExist();
                    expect(a11yDiv).not.toBeHidden();
                    expect(a11yDiv).toBeMatchedBy('div');
                });

                it("should have a class row", function() {
                    expect(a11yDiv).toHaveClass('row');
                });

                it("should have the classes of the hidden div", function () {
                    var classList = hiddenDiv.attr('class').split(/\s+/);

                    classList.forEach(function (clazz) {
                        expect(a11yDiv).toHaveClass(clazz);
                    });
                });

                it("should have an input text", function () {
                    var input = a11yDiv.find(':text');
                    expect(input).toExist();
                });

                describe("The a11y input handles a datalist element", function () {
                    var input;

                    beforeEach(function() {
                        input = a11yDiv.find(':text');
                    });

                    it("should have an id", function() {
                        expect(input).toHaveId('a11y-select-js');
                    });

                    it("should have a class js-combobox", function() {
                        expect(input).toHaveClass('js-combobox');
                    });

                    it("should the classes of the hidden select", function () {
                        var hiddenSelect = hiddenDiv.find('select');
                        var classList = hiddenSelect.attr('class').split(/\s+/);

                        classList.forEach(function (clazz) {
                            expect(input).toHaveClass(clazz);
                        });
                    });

                    it("should have an attribut 'list'", function() {
                        expect(input).toHaveAttr('list', 'a11y-select-option-list');
                    });

                    it("should have a label for sr only", function () {
                        var label = a11yDiv.find('label');
                        expect(label).toExist();
                        expect(label).toHaveClass('sr-only');
                        expect(label).toHaveAttr('for', 'a11y-select-js');
                    });

                    describe("The datalist is filled with the hidden select options", function() {
                        var datalist;

                        beforeEach(function() {
                            datalist = a11yDiv.find('datalist');
                        });

                        it("should have a datalist", function () {
                            expect(datalist).toExist();
                        });

                        it("should have an id", function () {
                            expect(datalist).toHaveId('a11y-select-option-list');
                        });

                        it("should be filled with the existing hidden select options", function () {
                            var datalistOptions = datalist.find('option');
                            var hiddenSelectOptions = hiddenDiv.find('select option');

                            expect(datalistOptions).toHaveLength(hiddenSelectOptions.length);

                            var hiddenOptionValues = hiddenSelectOptions.map(function() {
                                return $(this).val();
                            });

                            datalistOptions.each(function(index, datalistOption) {
                                expect(hiddenOptionValues).toContain(datalistOption.value);
                            });
                        });
                    });

                });


            });


        });

    });

});
