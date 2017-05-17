/* global describe, expect, it, beforeEach, afterEach, jasmine, $ */
define(['../lib/select-a11y'], function (filterComponent) {
    describe("An accessybility select", function () {
        var fixture;

        beforeEach(function () {
            fixture = setFixtures('' +
                '<form action="">' +
                '  <div class="form-group">' +
                '    <label for="select-option">Sélectionner une option</label>' +
                '    <select class="form-control" id="select-option" multiple data-select-a11y data-placeholder="Choisissez une option">' +
                '        <option>Option 1</option>' +
                '        <option>Option 2</option>' +
                '        <option>Option 3</option>' +
                '        <option>Option 4</option>' +
                '        <option selected>Option 5</option>' +
                '    </select>' +
                '  </div>' +
                '  <div class="form-group">' +
                '    <label for="select-element">Sélectionner un élément</label>' +
                '    <select class="form-control" id="select-element" multiple data-select-a11y data-placeholder="Choisissez un élément">' +
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
                var $selectToTransform;

                beforeEach(function () {
                    $selectToTransform = $(selectsToTransform[index]);
                });

                describe("for select[" + index + "]", function () {
                    var ids = ['select-option', 'select-element'];
                    var placeholders = ['Choisissez une option', 'Choisissez un élément'];

                    it("should have a data-select-a11y", function () {
                        expect($selectToTransform).toExist();
                    });

                    it("should have a div as parent", function () {
                        expect($selectToTransform.parent()).toBeMatchedBy('div');
                    });

                    it("should have an id", function () {
                        expect($selectToTransform).toHaveId(ids[index]);
                    });

                    it("should have a label", function () {
                        var label = $selectToTransform.parent().find('label');
                        expect(label).toHaveAttr('for', ids[index]);
                    });

                    it("should have a data-placeholder", function () {
                        expect($selectToTransform).toHaveData('placeholder', placeholders[index]);
                    });

                });

            }

            for (var index = 0; index < 2; index++) {
                executeTests(index);
            }
        });

        describe("after transformation", function () {
            var $transformedSelect;
            var hiddenSelectId;
            var $a11ySelectContainer;
            var $hiddenSelectContainer;
            var $wrappedContainer;

            function createTabEvent(shift) {
                return $.Event('keydown', {keyCode: 9, shiftKey: !!shift});
            }

            function createUpArrowEvent() {
                return $.Event('keydown', {keyCode: 38});
            }

            function createDownArrowEvent() {
                return $.Event('keydown', {keyCode: 40});
            }

            function createEscEvent() {
                return $.Event('keydown', {keyCode: 27});
            }

            function createEnterEvent() {
                return $.Event('keydown', {keyCode: 13});
            }

            function createSpaceEvent() {
                return $.Event('keydown', {keyCode: 32});
            }

            beforeEach(function () {
                filterComponent.transform();
                var transformedSelects = fixture.find('select[data-select-a11y]');
                $transformedSelect = $(transformedSelects[0]);
                hiddenSelectId = $transformedSelect.attr('id');
                $hiddenSelectContainer = $transformedSelect.parent();
                $a11ySelectContainer = $hiddenSelectContainer.prev();
                $wrappedContainer = $hiddenSelectContainer.parent();
            });


            it("should add a div to wrap all the elements", function () {
                expect($wrappedContainer).toExist();
                expect($wrappedContainer).toBeMatchedBy('div');
                expect($wrappedContainer).toHaveClass('select-a11y');
            });

            it("should add the a11y select container before the container of the select to transform", function () {
                expect($a11ySelectContainer).toExist();
                expect($a11ySelectContainer).toBeMatchedBy('div');
            });

            it("should hide the a11y select container", function () {
                expect($a11ySelectContainer).toBeHidden();
            });

            it("should hide the container of the select to transform", function () {
                expect($hiddenSelectContainer).toBeHidden();
            });

            it("should add an attribut aria-hidden to true to the container of the select to transform", function () {
                expect($hiddenSelectContainer).toHaveAttr('aria-hidden', 'true');
            });

            it("should add an attribut tabindex to -1 to the select to transform", function () {
                expect($transformedSelect).toHaveAttr('tabindex', '-1');
            });

            it("should NOT hide the select I must not transform", function () {
                var $selectIMustNotTransform = fixture.find('#select-i-must-not-transform');
                expect($selectIMustNotTransform).not.toBeHidden();
            });

            describe("a new button permit to show the a11y select container", function () {
                var $revealButton;

                beforeEach(function () {
                    $revealButton = $a11ySelectContainer.prev();
                });

                it("should be before the a11y select container", function () {
                    expect($revealButton).toExist();
                    expect($revealButton).toBeMatchedBy('button');
                    expect($revealButton).toHaveClass('btn');
                });

                it("should have aria-expanded to 'false' when a11y select container is hidden", function () {
                    expect($revealButton).toHaveAttr('aria-expanded', 'false');
                });

                it("should have the same text than the label of the hidden select", function () {
                    var $hiddenSelectLabel = $hiddenSelectContainer.find("label");
                    expect($revealButton).toHaveText($hiddenSelectLabel.text());
                });

                describe("on click on the button", function () {
                    var $input;

                    beforeEach(function () {
                        $revealButton.click();
                        $input = $a11ySelectContainer.find('#a11y-' + hiddenSelectId + '-js');
                    });

                    it("should still hide the container of the select to transform", function () {
                        expect($hiddenSelectContainer).toBeHidden();
                    });

                    it("should add a class is-open on the wrapped container", function () {
                        expect($wrappedContainer).toHaveClass('is-open');
                    });

                    it("should have aria-expanded to 'true' when a11y select container is shown", function () {
                        expect($revealButton).toHaveAttr('aria-expanded', 'true');
                    });

                    it("should change the focus to the input", function () {
                        expect($input).toBeFocused();
                    });

                    describe("the a11y select container", function () {

                        it("should have a class a11y-container", function () {
                            expect($a11ySelectContainer).toHaveClass('a11y-container');
                        });

                        it("should have the classes of the container of the select to transform (except the hidden class)", function () {
                            var classList = $hiddenSelectContainer.attr('class').split(/\s+/);

                            var indexOfTagHiddenClass = classList.indexOf('tag-hidden');
                            classList.splice(indexOfTagHiddenClass, 1);

                            classList.forEach(function (clazz) {
                                expect($a11ySelectContainer).toHaveClass(clazz);
                            });
                        });

                        describe("the input handles suggestions", function () {
                            it("should have an input text", function () {
                                expect($input).toExist();
                            });

                            it("should have an id built with transformed select id", function () {
                                expect($input).toHaveId('a11y-' + hiddenSelectId + '-js');
                            });

                            it("should the classes of the hidden select", function () {
                                var classList = $transformedSelect.attr('class').split(/\s+/);

                                classList.forEach(function (clazz) {
                                    expect($input).toHaveClass(clazz);
                                });
                            });

                            it("should have 'autocomplete' to off", function () {
                                expect($input).toHaveAttr('autocomplete', 'off');
                            });

                            it("should have 'autocapitalize' to 'off'", function () {
                                expect($input).toHaveAttr('autocapitalize', 'off');
                            });

                            it("should have 'spellcheck' to 'false'", function () {
                                expect($input).toHaveAttr('spellcheck', 'false');
                            });

                            it("should have a placeholder", function () {
                                expect($input).toHaveAttr('placeholder', 'Choisissez une option');
                            });

                            it("should have a 'aria-describedby'", function () {
                                expect($input).toHaveAttr('aria-describedby', 'a11y-usage' + hiddenSelectId + '-js');
                            });

                            it("should have a label for sr only with the placeholder", function () {
                                var $label = $a11ySelectContainer.find('label');
                                expect($label).toExist();
                                expect($label).toHaveClass('sr-only');
                                expect($label).toHaveAttr('for', 'a11y-' + hiddenSelectId + '-js');
                                expect($label).toHaveText('Choisissez une option');
                            });

                            it("should have a paragraph for sr only with the explaination of the keys", function () {
                                var $p = $a11ySelectContainer.find('p');
                                expect($p).toExist();
                                expect($p).toHaveClass('sr-only');
                                expect($p).toHaveAttr('id', 'a11y-usage' + hiddenSelectId + '-js');
                                expect($p).toHaveText('Utilisez la tabulation (ou la touche flèche du bas) pour naviguer dans la liste des suggestions');
                            });

                            describe("to show the suggestions", function () {
                                var $suggestions;
                                var $listbox;
                                var $ariaLiveZone;
                                var $ariaLiveDescription;

                                beforeEach(function () {
                                    $suggestions = $a11ySelectContainer.find('div.a11y-suggestions');
                                    $listbox = $suggestions.find('div');
                                    $ariaLiveZone = $a11ySelectContainer.prev().prev();
                                    $ariaLiveDescription = $ariaLiveZone.find('p');
                                });

                                it("should have a div as container", function () {
                                    expect($suggestions).toExist();
                                    expect($suggestions).toBeMatchedBy('div');
                                });

                                it("should have an id built with transformed select id", function () {
                                    expect($suggestions).toHaveId('a11y-' + hiddenSelectId + '-suggestions');
                                });

                                it("should contain a div with a 'listbox' role", function () {
                                    expect($listbox).toExist();
                                    expect($listbox).toHaveAttr('role', 'listbox');
                                });

                                it("should add suggestions to the div", function () {
                                    expect($listbox.find('.a11y-suggestion')).toHaveLength(5);
                                });

                                it("should update the 'aria-live' zone with the number of filtered items", function () {
                                    expect($ariaLiveDescription).toHaveText('5 suggestions disponibles');
                                });

                                describe('on second click on the button', function () {

                                    beforeEach(function () {
                                        $revealButton.click();
                                    });

                                    it("should empty the suggestions", function () {
                                        expect($listbox.find('.a11y-suggestion')).toHaveLength(0);
                                    });

                                    it("should empty the input", function () {
                                        expect($input).toHaveValue('');
                                    });

                                    it("should focus on reveal button", function () {
                                        expect($revealButton).toBeFocused();
                                    });

                                    it("should remove class is-open on the wrapped container", function () {
                                        expect($wrappedContainer).not.toHaveClass('is-open');
                                    });

                                    it("should hide a11y select container", function () {
                                        expect($a11ySelectContainer).toBeHidden();
                                        expect($revealButton).toHaveAttr('aria-expanded', 'false');
                                    });

                                    it('should empty the "aria-live" zone', function () {
                                        expect($ariaLiveDescription).toBeEmpty();
                                    });
                                });

                                describe("on input and keydown in a11y select container", function () {
                                    var numberOfAlreadySelectedOption;

                                    beforeEach(function () {
                                        numberOfAlreadySelectedOption = $hiddenSelectContainer.find(':selected').length;

                                        $input.val('Option').trigger('input');
                                    });

                                    it("should NOT add a list item in the selected items list", function () {
                                        var $selectedListItems = $hiddenSelectContainer.next().find('li');
                                        expect($selectedListItems.length).toEqual(numberOfAlreadySelectedOption);
                                    });

                                    it("should add suggestions to the div", function () {
                                        expect($listbox.find('.a11y-suggestion')).toHaveLength(5);
                                    });

                                    describe("the description for a11y screen reader", function () {

                                        it("should add the div before the a11y select container", function () {
                                            expect($ariaLiveZone).toExist();
                                            expect($ariaLiveZone).toBeMatchedBy('div');
                                        });

                                        it("should have a class sr-only", function () {
                                            expect($ariaLiveZone).toHaveClass('sr-only');
                                        });

                                        it("should contain a paragraph", function () {
                                            expect($ariaLiveZone.find('p')).toExist();
                                        });

                                        it("should have an attribute 'aria-live'", function () {
                                            expect($ariaLiveZone).toHaveAttr('aria-live', 'polite');
                                        });

                                        it("should update the 'aria-live' zone with the number of filtered items", function () {
                                            expect($ariaLiveDescription).toHaveText('5 suggestions disponibles');
                                        });

                                    });

                                    describe("on esc keydown", function () {
                                        var escEvent;

                                        beforeEach(function () {
                                            escEvent = createEscEvent();
                                            $input.trigger(escEvent);
                                        });

                                        it("should prevent event", function () {
                                            expect(escEvent.isDefaultPrevented()).toBeTruthy();
                                        });

                                        it("should empty the suggestions", function () {
                                            expect($listbox.find('.a11y-suggestion')).toHaveLength(0);
                                        });

                                        it("should empty the input", function () {
                                            expect($input).toHaveValue('');
                                        });

                                        it("should focus on reveal button", function () {
                                            expect($revealButton).toBeFocused();
                                        });

                                        it("should remove class is-open on the wrapped container", function () {
                                            expect($wrappedContainer).not.toHaveClass('is-open');
                                        });

                                        it("should hide a11y select container", function () {
                                            expect($a11ySelectContainer).toBeHidden();
                                            expect($revealButton).toHaveAttr('aria-expanded', 'false');
                                        });

                                        it("should empty the 'aria-live' zone ", function () {
                                            expect($ariaLiveDescription).toBeEmpty();
                                        });
                                    });

                                    describe("on 'shift+tab' keydown", function () {
                                        var shiftTabEvent;

                                        beforeEach(function () {
                                            shiftTabEvent = createTabEvent('with shift');
                                            $input.trigger(shiftTabEvent);
                                        });

                                        it("should prevent event", function () {
                                            expect(shiftTabEvent.isDefaultPrevented()).toBeTruthy();
                                        });

                                        it("should empty the suggestions", function () {
                                            expect($listbox.find('.a11y-suggestion')).toHaveLength(0);
                                        });

                                        it("should empty the input", function () {
                                            expect($input).toHaveValue('');
                                        });

                                        it("should focus on reveal button", function () {
                                            expect($revealButton).toBeFocused();
                                        });

                                        it("should remove class is-open on the wrapped container", function () {
                                            expect($wrappedContainer).not.toHaveClass('is-open');
                                        });

                                        it("should hide a11y select container", function () {
                                            expect($a11ySelectContainer).toBeHidden();
                                            expect($revealButton).toHaveAttr('aria-expanded', 'false');
                                        });

                                        it("should empty the 'aria-live' zone ", function () {
                                            expect($ariaLiveDescription).toBeEmpty();
                                        });
                                    });

                                    describe("on 'click' outside the input", function () {
                                        beforeEach(function () {
                                            $('body').click();
                                        });

                                        it("should empty the suggestions", function () {
                                            expect($listbox.find('.a11y-suggestion')).toHaveLength(0);
                                        });

                                        it("should hide a11y select container on 'click' outside the input", function () {
                                            expect($a11ySelectContainer).toBeHidden();
                                            expect($revealButton).toHaveAttr('aria-expanded', 'false');
                                        });

                                        it("should empty the input on 'click' outside the input", function () {
                                            expect($input).toHaveValue('');
                                        });

                                        it("should remove class is-open on the wrapped container on 'click' outside the input", function () {
                                            expect($wrappedContainer).not.toHaveClass('is-open');
                                        });

                                        it("should empty the 'aria-live' zone ", function () {
                                            expect($ariaLiveDescription).toBeEmpty();
                                        });
                                    });

                                    describe('on "focusout" of the select-a11y component', function () {
                                        beforeEach(function () {
                                            jasmine.clock().install();
                                            $('#select-i-must-not-transform').focus();
                                        });

                                        afterEach(function () {
                                            jasmine.clock().uninstall();
                                        });

                                        it("should empty the 'aria-live' zone ", function () {
                                            jasmine.clock().tick(10);
                                            expect($ariaLiveDescription).toBeEmpty();
                                        });
                                    });

                                    it("should NOT empty the suggestions on 'click' inside the input", function () {
                                        $input.click();

                                        expect($listbox.find('.a11y-suggestion')).not.toHaveLength(0);
                                    });

                                    it("should NOT empty the suggestions on 'click' inside the suggestions", function () {
                                        $suggestions.click();

                                        expect($listbox.find('.a11y-suggestion')).not.toHaveLength(0);
                                    });

                                    it("should NOT empty the suggestions on 'click' inside the listbox", function () {
                                        $listbox.click();

                                        expect($listbox.find('.a11y-suggestion')).not.toHaveLength(0);
                                    });

                                    it("should focus on first suggestion on 'tab' keydown", function () {
                                        var tabEvent = createTabEvent();
                                        $input.trigger(tabEvent);

                                        expect($listbox.find('div:first')).toBeFocused();
                                        expect(tabEvent.isDefaultPrevented()).toBeTruthy();
                                    });

                                    it("should focus on first suggestion on 'down arrow' keydown", function () {
                                        var downArrowEvent = createDownArrowEvent();
                                        $input.trigger(downArrowEvent);
                                        expect($listbox.find('div:first')).toBeFocused();
                                        expect(downArrowEvent.isDefaultPrevented()).toBeTruthy();
                                    });

                                    describe("on keydown in the list of suggestions", function () {
                                        var $currentSuggestion;
                                        var $firstSuggestion;
                                        var $lastSuggestion;

                                        beforeEach(function () {
                                            $firstSuggestion = $listbox.find('div:first');
                                            $lastSuggestion = $listbox.find('div:last');
                                        });

                                        describe("on first suggestion", function () {
                                            var $nextSuggestion;

                                            beforeEach(function () {
                                                $firstSuggestion.focus();
                                                $currentSuggestion = $firstSuggestion;
                                                $nextSuggestion = $currentSuggestion.next();
                                            });

                                            it("it should focus on the next suggestion on 'tab' keydown", function () {
                                                var tabEvent = createTabEvent();
                                                $currentSuggestion.trigger(tabEvent);

                                                expect($nextSuggestion).toBeFocused();
                                                expect(tabEvent.isDefaultPrevented()).toBeTruthy();
                                            });

                                            it("it should focus on the next suggestion on 'down arrow' keydown", function () {
                                                var $nextSuggestion = $currentSuggestion.next();
                                                var downArrowEvent = createDownArrowEvent();
                                                $currentSuggestion.trigger(downArrowEvent);

                                                expect($nextSuggestion).toBeFocused();
                                                expect(downArrowEvent.isDefaultPrevented()).toBeTruthy();
                                            });

                                            it("it should focus on the last suggestion on 'up arrow' keydown", function () {
                                                var upArrowEvent = createUpArrowEvent();
                                                $currentSuggestion.trigger(upArrowEvent);

                                                expect($lastSuggestion).toBeFocused();
                                                expect(upArrowEvent.isDefaultPrevented()).toBeTruthy();
                                            });

                                            it("it should focus on the reveal button on 'shift+tab' keydown", function () {
                                                var shiftTabEvent = createTabEvent('with shift');
                                                $currentSuggestion.trigger(shiftTabEvent);

                                                expect($input).toBeFocused();
                                                expect(shiftTabEvent.isDefaultPrevented()).toBeTruthy();
                                            });

                                            describe("on 'esc' keydown", function () {
                                                var escEvent;

                                                beforeEach(function () {
                                                    escEvent = createEscEvent();
                                                    $currentSuggestion.trigger(escEvent);
                                                });

                                                it("should prevent 'esc' event", function () {
                                                    expect(escEvent.isDefaultPrevented()).toBeTruthy();
                                                });

                                                it("should empty the suggestions", function () {
                                                    expect($listbox.find('.a11y-suggestion')).toHaveLength(0);
                                                });

                                                it("should empty the input", function () {
                                                    expect($input).toHaveValue('');
                                                });

                                                it("should focus on reveal button", function () {
                                                    expect($revealButton).toBeFocused();
                                                });

                                                it("should remove class is-open on the wrapped container", function () {
                                                    expect($wrappedContainer).not.toHaveClass('is-open');
                                                });

                                                it("should hide the a11y select container", function () {
                                                    expect($a11ySelectContainer).toBeHidden();
                                                    expect($revealButton).toHaveAttr('aria-expanded', 'false');
                                                });

                                                it("should empty the 'aria-live' zone", function () {
                                                    expect($ariaLiveDescription).toBeEmpty();
                                                });
                                            });

                                            describe("on 'enter' keydown", function () {
                                                var enterEvent;

                                                beforeEach(function () {
                                                    enterEvent = createEnterEvent();
                                                    $currentSuggestion.trigger(enterEvent);
                                                });

                                                it("should prevent event", function () {
                                                    expect(enterEvent.isDefaultPrevented()).toBeTruthy();
                                                });

                                                it("should empty the input after selection", function () {
                                                    expect($input).toHaveValue('');
                                                });

                                                it("should hide the a11y select container after selection", function () {
                                                    expect($a11ySelectContainer).toBeHidden();
                                                    expect($revealButton).toHaveAttr('aria-expanded', 'false');
                                                });

                                                it("should focus on reveal button", function () {
                                                    expect($revealButton).toBeFocused();
                                                });

                                                it("should remove class is-open on the wrapped container", function () {
                                                    expect($wrappedContainer).not.toHaveClass('is-open');
                                                });

                                                it("should empty suggestions", function () {
                                                    expect($listbox.find('.a11y-suggestion')).toHaveLength(0);
                                                });

                                                it("should update the 'aria-live' zone with the selected item", function () {
                                                    expect($ariaLiveDescription).toHaveText('Option 1 sélectionné');
                                                });
                                            });

                                            describe("on 'click'", function () {

                                                beforeEach(function () {
                                                    $currentSuggestion.click();
                                                });

                                                it("should empty the input", function () {
                                                    expect($input).toHaveValue('');
                                                });

                                                it("should hide the a11y select container", function () {
                                                    expect($a11ySelectContainer).toBeHidden();
                                                    expect($revealButton).toHaveAttr('aria-expanded', 'false');
                                                });

                                                it("should focus on reveal button", function () {
                                                    expect($revealButton).toBeFocused();
                                                });

                                                it("should remove class is-open on the wrapped container", function () {
                                                    expect($wrappedContainer).not.toHaveClass('is-open');
                                                });

                                                it("should empty suggestions", function () {
                                                    expect($listbox.find('.a11y-suggestion')).toHaveLength(0);
                                                });

                                                it("should update the 'aria-live' zone with the selected item", function () {
                                                    expect($ariaLiveDescription).toHaveText('Option 1 sélectionné');
                                                });
                                            });
                                        });

                                        describe("on the last suggestion", function () {
                                            var tabEvent;
                                            var $previousSuggestion;

                                            beforeEach(function () {
                                                $lastSuggestion.focus();
                                                $currentSuggestion = $lastSuggestion;
                                                $previousSuggestion = $currentSuggestion.prev();
                                            });

                                            it("it should focus on the first suggestion on 'down arrow' keydown on the last suggestion", function () {
                                                var downArrowEvent = createDownArrowEvent();
                                                $currentSuggestion.trigger(downArrowEvent);

                                                expect($firstSuggestion).toBeFocused();
                                                expect(downArrowEvent.isDefaultPrevented()).toBeTruthy();
                                            });

                                            it("it should focus on the previous suggestion on 'shift+tab' keydown", function () {
                                                var shiftTabEvent = createTabEvent('with shift');
                                                $currentSuggestion.trigger(shiftTabEvent);

                                                expect($previousSuggestion).toBeFocused();
                                                expect(shiftTabEvent.isDefaultPrevented()).toBeTruthy();
                                            });

                                            it("it should focus on the previous suggestion on 'up arrow' keydown", function () {
                                                var upArrowEvent = createUpArrowEvent();
                                                $currentSuggestion.trigger(upArrowEvent);

                                                expect($previousSuggestion).toBeFocused();
                                                expect(upArrowEvent.isDefaultPrevented()).toBeTruthy();
                                            });

                                            describe("on tab keydown", function () {
                                                beforeEach(function () {
                                                    tabEvent = createTabEvent();
                                                    $currentSuggestion.trigger(tabEvent);
                                                });

                                                it("should not prevent event", function () {
                                                    expect(tabEvent.isDefaultPrevented()).toBeFalsy();
                                                });

                                                it("should empty the input", function () {
                                                    expect($input).toHaveValue('');
                                                });

                                                it("should hide the a11y select container", function () {
                                                    expect($a11ySelectContainer).toBeHidden();
                                                    expect($revealButton).toHaveAttr('aria-expanded', 'false');
                                                });

                                                it("should remove class is-open on the wrapped container", function () {
                                                    expect($wrappedContainer).not.toHaveClass('is-open');
                                                });

                                                it("should empty suggestions", function () {
                                                    expect($listbox.find('.a11y-suggestion')).toHaveLength(0);
                                                });

                                                it("should empty the 'aria-live' zone ", function () {
                                                    expect($ariaLiveDescription).toBeEmpty();
                                                });
                                            });
                                        });
                                    });

                                    describe("on empty suggestions", function () {

                                        beforeEach(function () {
                                            $input.val('zzz').trigger('input');
                                        });

                                        it("should update the 'aria-live' zone ", function () {
                                            expect($ariaLiveDescription).toHaveText('aucun résultat');
                                        });

                                        it("should have 'aucun résultat' in suggestions", function () {
                                            expect($listbox.find('div')).toHaveLength(1);
                                            var $noResult = $listbox.find('div:first');
                                            expect($noResult).toExist();
                                            expect($noResult).toHaveClass('a11y-no-suggestion');
                                            expect($noResult).toHaveText('aucun résultat');
                                        });

                                        describe("on tab keydown", function () {
                                            var tabEvent;

                                            beforeEach(function () {
                                                tabEvent = createTabEvent();
                                                $input.trigger(tabEvent);
                                            });

                                            it("should not prevent event", function () {
                                                expect(tabEvent.isDefaultPrevented()).toBeFalsy();
                                            });

                                            it("should empty the input", function () {
                                                expect($input).toHaveValue('');
                                            });

                                            it("should hide the a11y select container", function () {
                                                expect($a11ySelectContainer).toBeHidden();
                                                expect($revealButton).toHaveAttr('aria-expanded', 'false');
                                            });

                                            it("should remove class is-open on the wrapped container", function () {
                                                expect($wrappedContainer).not.toHaveClass('is-open');
                                            });

                                            it("should empty the suggestions", function () {
                                                expect($listbox.find('.a11y-suggestion')).toHaveLength(0);
                                            });

                                        });
                                    });

                                    describe("a list contains the selected items", function () {
                                        var $ulSelection;
                                        var $selectedListItems;

                                        beforeEach(function () {
                                            $ulSelection = $hiddenSelectContainer.next();
                                            $selectedListItems = $ulSelection.find('li');
                                        });

                                        it("should add the ul after the container of the select to transform", function () {
                                            expect($ulSelection).toExist();
                                            expect($ulSelection).toBeMatchedBy('ul');
                                        });

                                        it("should have a class list-inline", function () {
                                            expect($ulSelection).toHaveClass('list-inline');
                                        });

                                        it("should add selected items when option is selected in transformed select", function () {
                                            expect($selectedListItems.length).toEqual(1);
                                            expect($selectedListItems).toContainText('Option 5');
                                        });

                                        describe("on selection of an item in a11y select container", function () {

                                            beforeEach(function () {
                                                numberOfAlreadySelectedOption = $hiddenSelectContainer.find(':selected').length;
                                                var $listbox = $a11ySelectContainer.find('div.a11y-suggestions div');
                                                var $secondSuggestion = $listbox.find('.a11y-suggestion:first').next();
                                                var enterEvent = createEnterEvent();
                                                $secondSuggestion.trigger(enterEvent);
                                            });

                                            describe("the added list item", function () {
                                                beforeEach(function () {
                                                    $selectedListItems = $ulSelection.find('li');
                                                });

                                                it("should add a list item in the selected items list", function () {
                                                    expect($selectedListItems.length).toEqual(numberOfAlreadySelectedOption + 1);
                                                    expect($selectedListItems).toContainText('Option 2');
                                                });

                                                it("should have a span which references the hidden selected option", function () {
                                                    var span = $selectedListItems.last().find('span');
                                                    expect(span).toExist();
                                                    expect(span).toHaveId(hiddenSelectId + '-1');
                                                    expect(span).toHaveClass('tag-item');
                                                    expect(span).toHaveData('value', 'Option 2');
                                                });

                                                it("should have a button to permit the deletion", function () {
                                                    var button = $selectedListItems.last().find('span button');
                                                    expect(button).toExist();
                                                    expect(button).toHaveClass('tag-item-supp');
                                                    expect(button).toHaveAttr('title', 'supprimer Option 2');
                                                    expect(button).toHaveAttr('type', 'button');
                                                });

                                                it("should have a span in the button for the screen reader", function () {
                                                    var innerSpan = $selectedListItems.last().find('span button span');
                                                    expect(innerSpan).toExist();
                                                    expect(innerSpan).toHaveClass('sr-only');
                                                    expect(innerSpan).toHaveText('supprimer');
                                                });

                                                describe("when the selected element is already selected", function () {
                                                    beforeEach(function () {
                                                        numberOfAlreadySelectedOption = $hiddenSelectContainer.find(':selected').length;
                                                        $revealButton.click();
                                                        var $listbox = $a11ySelectContainer.find('div.a11y-suggestions div');
                                                        var $secondSuggestion = $listbox.find('.a11y-suggestion:first').next();
                                                        var enterEvent = createEnterEvent();
                                                        $secondSuggestion.trigger(enterEvent);
                                                        $selectedListItems = $ulSelection.find('li');
                                                    });

                                                    it("should not add the item to the list", function () {
                                                        expect($selectedListItems.length).toEqual(numberOfAlreadySelectedOption);
                                                        expect($selectedListItems).toContainText('Option 2');
                                                    });

                                                    it("should update the 'aria-live' zone", function () {
                                                        expect($ariaLiveDescription).toHaveText('Option 2 déjà sélectionné');
                                                    });
                                                });
                                            });

                                            describe("on the hidden select", function () {
                                                var hiddenSelect;

                                                beforeEach(function () {
                                                    numberOfAlreadySelectedOption = $hiddenSelectContainer.find(':selected').length;
                                                    hiddenSelect = $hiddenSelectContainer.find('select');
                                                });

                                                it("should select the option in the hidden select", function () {
                                                    var selectedOptions = hiddenSelect.find('option:selected');
                                                    expect(selectedOptions).toHaveLength(numberOfAlreadySelectedOption);
                                                    expect(selectedOptions[0]).toHaveText('Option 2');
                                                });

                                                describe("with several selections", function () {

                                                    beforeEach(function () {
                                                        $input.val('Option').trigger('input');
                                                        var $listbox = $a11ySelectContainer.find('div.a11y-suggestions div');
                                                        var $thirdSuggestion = $listbox.find('.a11y-suggestion:first').next().next();
                                                        var enterEvent = createEnterEvent();
                                                        $thirdSuggestion.trigger(enterEvent);
                                                    });

                                                    it("should select the multiple options in the hidden select", function () {
                                                        var selectedOptions = hiddenSelect.find('option:selected');
                                                        expect(selectedOptions).toHaveLength(numberOfAlreadySelectedOption + 1);
                                                        expect(selectedOptions[0]).toHaveText('Option 2');
                                                        expect(selectedOptions[1]).toHaveText('Option 3');
                                                    });

                                                    describe("on deletion of a list item", function () {

                                                        beforeEach(function () {
                                                            $selectedListItems = $ulSelection.find('li');
                                                            $selectedListItems.last().find('span button').click();
                                                            $selectedListItems = $ulSelection.find('li');
                                                        });

                                                        it("should delete the list item", function () {
                                                            expect($selectedListItems.length).toEqual(numberOfAlreadySelectedOption);
                                                            expect($selectedListItems.last()).toContainText('Option 2');
                                                        });

                                                        it("should focus on the previous list item button", function () {
                                                            var previousDeleteButton = $selectedListItems.last().find('button');
                                                            expect(previousDeleteButton).toBeFocused();
                                                        });

                                                        it("should empty the 'aria-live' zone", function () {
                                                            expect($ariaLiveDescription).toBeEmpty();
                                                        });

                                                        describe("on the hidden select", function () {
                                                            var hiddenSelect;

                                                            beforeEach(function () {
                                                                hiddenSelect = $hiddenSelectContainer.find('select');
                                                            });

                                                            it("should unselect the option in the hidden select", function () {
                                                                var selectedOptions = hiddenSelect.find('option:selected');
                                                                expect(selectedOptions).toHaveLength(numberOfAlreadySelectedOption);
                                                                expect(selectedOptions.text()).toContain('Option 2');
                                                            });

                                                        });

                                                        describe("on the last item deletion", function () {
                                                            beforeEach(function () {
                                                                $selectedListItems.each(function (index, selectedItem) {
                                                                    $(selectedItem).find('span button').click();
                                                                });
                                                            });

                                                            it("should focus on the reveal button", function () {
                                                                expect($revealButton).toBeFocused();
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    })
                                });
                            });
                        });
                    });
                });
            });
        });

    });

});
