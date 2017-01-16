/* global describe, expect, it */
define(['../lib/filter-component'], function (filterComponent) {
    describe("A suite is just a function", function() {
        var a;
        var fixture = setFixtures('<div class="post">foo</div>')

        it("and so is a spec", function() {
            a = filterComponent.toto();

            expect(a).toBe('toto');
        });

        it("and so is a spec 2", function() {
            var post = fixture.find('.post');

            expect(post).toContainText('foo');
        });

    });

});
