import _testutilsDelayedPromiseJsx from "../../testutils/delayed-promise.jsx";
import _reactAddonsTestUtils from "react-addons-test-utils";
import _underscore from "underscore";
import _reactDom from "react-dom";
import _react from "react";
import _perseusJs from "../../perseus.js";
import _hubbleIndexJs from "../../hubble/index.js";
import _assert from "assert";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable comma-dangle, no-unused-vars, no-var, react/jsx-closing-bracket-location */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var assert = _assert;
var lens = _hubbleIndexJs;
// TODO(jack): Package MathQuill
var MathQuill = window.MathQuill;
var MQ = MathQuill.getInterface(2);
var Perseus = _perseusJs;
var React = _react;
var ReactDOM = _reactDom;
const _ = _underscore;
var TestUtils = _reactAddonsTestUtils;
var delayedPromise = _testutilsDelayedPromiseJsx;

var expressionItem1 = {
    question: {
        content: "[[☃ expression 1]]",
        images: {},
        widgets: {
            "expression 1": {
                type: "expression",
                graded: true,
                options: {
                    value: "2^{-2}-3",
                    form: false,
                    simplify: false,
                    times: false,
                    buttonSets: ["basic"],
                    functions: ["f", "g", "h"],
                    buttonsVisible: "never",
                },
                version: {
                    major: 0,
                    minor: 1,
                },
            },
        },
    },
    answerArea: {
        calculator: false,
    },
    itemDataVersion: {
        major: 0,
        minor: 1,
    },
    hints: [],
};

var expressionItem2 = lens(expressionItem1)
    .set(["question", "widgets", "expression 1", "options"], {
        answerForms: [
            {
                considered: "correct",
                form: false,
                simplify: false,
                value: "123-x",
            },
            {
                considered: "correct",
                form: false,
                simplify: false,
                value: "x-123",
            },
        ],
        times: false,
        buttonSets: ["basic"],
        functions: ["f", "g", "h"],
    })
    .set(["question", "widgets", "expression 1", "version"], {
        major: 1,
        minor: 0,
    })
    .freeze();

var expressionItem3 = lens(expressionItem1)
    .set(["question", "widgets", "expression 1", "options"], {
        answerForms: [
            {
                considered: "ungraded",
                form: false,
                simplify: false,
                value: "1",
            },
            {
                considered: "incorrect",
                form: false,
                simplify: false,
                value: "2",
            },
            {
                considered: "correct",
                form: false,
                simplify: false,
                value: "3",
            },
        ],
        times: false,
        buttonSets: ["basic"],
        functions: ["f", "g", "h"],
    })
    .set(["question", "widgets", "expression 1", "version"], {
        major: 1,
        minor: 0,
    })
    .freeze();

var expressionItem4 = lens(expressionItem3)
    .zoom(["question", "widgets", "expression 1", "options", "answerForms"])
    .merge([0], {
        value: "\\left(x+2\\right)\\left(x-2\\right)",
        form: true,
        considered: "incorrect",
    })
    .merge([1], {
        value: "x^2-4",
        considered: "correct",
    })
    .del([2])
    .deZoom()
    .freeze();

var renderQuestionArea = function(item, apiOptions) {
    var Renderer = Perseus.Renderer;
    var renderer = TestUtils.renderIntoDocument(
        <Renderer
            content={item.question.content}
            images={item.question.images}
            widgets={item.question.widgets}
            problemNum={0}
            apiOptions={apiOptions}
        />
    );
    return renderer;
};

var findMathQuill = function(renderer) {
    var base = ReactDOM.findDOMNode(renderer);
    var span = base.querySelector(".mq-editable-field");
    assert.notEqual(span, null);
    var mathQuillField = MQ.MathField(span);
    assert.notEqual(mathQuillField, null);
    return mathQuillField;
};

var findMathQuillTextArea = function(renderer) {
    var base = ReactDOM.findDOMNode(renderer);
    var input = base.querySelector(".mq-textarea>textarea");
    assert.notEqual(input, null);
    return input;
};

// Input `value` into the mathquill input found in renderer
var mathQuillInput = function(renderer, value) {
    var input = findMathQuillTextArea(renderer);
    var $input = $(input);

    // mathquill needs a keypress to bind its keydown handler for
    // future events. this is super hacky and is a bad explanation.
    // sorry.
    $input.trigger("keypress");

    _.each(value, ch => {
        $input.val(ch).trigger("keypress");
    });
};

// promise a question area that has rendered
var makeRender = item => {
    var renderer = renderQuestionArea(item, {});
    return delayedPromise().then(() => renderer);
};

describe("Expression Widget", function() {
    describe("exponents", function() {
        it("2^-2-3 should produce 2^{-2} - 3", function() {
            return makeRender(expressionItem1).then(renderer => {
                mathQuillInput(renderer, "2^-2-3");
                var score = renderer.guessAndScore()[1];
                assert.strictEqual(score.type, "points");
                assert.strictEqual(score.earned, score.total);
            });
        });
    });

    describe("grading", function() {
        it("should not grade a thing that doesn't parse", function() {
            return makeRender(expressionItem2).then(renderer => {
                mathQuillInput(renderer, "+++");
                var score = renderer.guessAndScore()[1];
                assert.strictEqual(score.type, "invalid");
            });
        });

        it("should not grade a thing that is empty", function() {
            return makeRender(expressionItem2).then(renderer => {
                mathQuillInput(renderer, "");
                var score = renderer.guessAndScore()[1];
                assert.strictEqual(score.type, "invalid");
            });
        });
    });

    describe("fallthrough", function() {
        it("should grade answers which don't match anything as wrong", function() { // eslint-disable-line max-len
            return makeRender(expressionItem2).then(renderer => {
                mathQuillInput(renderer, "500");
                var score = renderer.guessAndScore()[1];
                assert.strictEqual(score.type, "points");
                assert.strictEqual(score.earned, 0);
            });
        });
    });

    describe("multiple answers", function() {
        it("should recognize either of two possibilities", function() {
            var renderer = renderQuestionArea(expressionItem2, {});

            // TODO(joel) - clear input instead of making a new renderer every
            // time!
            return makeRender(expressionItem2)
                .then(renderer => {
                    // FIRST ANSWER
                    mathQuillInput(renderer, "x-123");
                    var score = renderer.guessAndScore()[1];
                    assert.strictEqual(score.type, "points");
                    assert.strictEqual(score.earned, score.total);
                })
                .then(() => makeRender(expressionItem2))
                .then(renderer => {
                    // SECOND ANSWER
                    mathQuillInput(renderer, "123-x");
                    var score = renderer.guessAndScore()[1];
                    assert.strictEqual(score.type, "points");
                    assert.strictEqual(score.earned, score.total);
                });
        });

        it("should match from top to bottom", function() {
            /* We want to match the three forms in order:
             *
             *     considered: "ungraded"
             *     value: 1
             *
             *     considered: "incorrect"
             *     value: 2
             *
             *     considered: "correct"
             *     value: 3
             */

            // check that the ungraded one matches first and returns *invalid*
            return makeRender(expressionItem3)
                .then(renderer => {
                    mathQuillInput(renderer, "1");
                    var score = renderer.guessAndScore()[1];
                    assert.strictEqual(score.type, "invalid");
                })
                .then(() => makeRender(expressionItem3))
                .then(renderer => {
                    // now check that the incorrect one matches and returns no
                    // points
                    mathQuillInput(renderer, "2");
                    var score = renderer.guessAndScore()[1];
                    assert.strictEqual(score.type, "points");
                    assert.strictEqual(score.earned, 0);
                })
                .then(() => makeRender(expressionItem3))
                .then(renderer => {
                    // finally check that the correct one matches with points
                    mathQuillInput(renderer, "3");
                    var score = renderer.guessAndScore()[1];
                    assert.strictEqual(score.type, "points");
                    assert.strictEqual(score.earned, score.total);
                });
        });
    });
});
export default _module_.exports;
