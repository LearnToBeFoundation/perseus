import _splitDiffJsx from "../split-diff.jsx";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* global beforeEach, expect */

describe("split diff", function() {
    let splitDiff;

    beforeEach(function() {
        splitDiff = _splitDiffJsx;
    });

    it("splits an empty diff", function() {
        expect(splitDiff([])).toEqual([]);
    });

    it("does not split a one line string", function() {
        expect(splitDiff([{value: "hello"}])).toEqual([[{value: "hello"}]]);
    });

    it("splits a multiline string into two parts", function() {
        expect(splitDiff([{value: "he\nllo"}])).toEqual([
            [{value: "he"}],
            [{value: "llo"}],
        ]);
    });

    it(
        "keeps things on the same line when splitting a changed value",
        function() {
            expect(
                splitDiff([{value: "hello"}, {value: "goodbye", removed: true}])
            ).toEqual([[{value: "hello"}, {value: "goodbye", removed: true}]]);
        }
    );

    it("splits a string with a change and a newline", function() {
        expect(
            splitDiff([{value: "hello"}, {value: "good\nbye", removed: true}])
        ).toEqual([
            [{value: "hello"}, {value: "good", removed: true}],
            [{value: "bye", removed: true}],
        ]);
    });
});
export default _module_.exports;
