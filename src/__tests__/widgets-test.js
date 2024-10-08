import _rendererJsx from "../renderer.jsx";
import _reactDom from "react-dom";
import _react from "react";
import _underscore from "underscore";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* global beforeEach, notStrictEqual, strictEqual, xit */

const _ = _underscore;
const React = _react;
const ReactDOM = _reactDom;

let fixture;

function translateScore(guessAndScore) {
    // Translate a guessAndScore from internal Perseus format to the
    // result format used everywhere else.
    //
    // TODO(eater): Use the existance of these unit tests to
    //              convert eveything to The One True Format.
    const guess = guessAndScore[0];
    const score = guessAndScore[1];
    if (score.type === "points") {
        return {
            empty: false,
            correct: score.earned >= score.total,
            message: score.message,
            guess: guess,
        };
    } else if (score.type === "invalid") {
        return {
            empty: true,
            correct: false,
            message: score.message,
            guess: guess,
        };
    }
}

function testAnswer(component, input, result, description) {
    $(fixture).find("input").val(input);
    checkAnswer(component, result, `${description} [${input}]`);
}

function testMultipleAnswer(component, inputs, result, description) {
    _.chain($(fixture).find("input")).zip(inputs).each(function(args) {
        const el = args[0];
        const text = args[1];
        if (typeof text === "string") {
            $(el).val(text);
        } else {
            $(el).prop("checked", text);
        }
    });
    checkAnswer(component, result, `${description} [${inputs.join(", ")}]`);
}

function checkAnswer(component, result, description) {
    const answer = translateScore(component.guessAndScore());
    if (result === "right") {
        strictEqual(answer.empty, false, `${description} - not empty`);
        strictEqual(answer.message, null, `${description} - no message`);
        strictEqual(answer.correct, true, `${description} - correct`);
    } else if (result === "right-message") {
        strictEqual(answer.empty, false, `${description} - not empty`);
        notStrictEqual(answer.message, null, `${description} - message`);
        strictEqual(answer.correct, true, `${description} - correct`);
    } else if (result === "wrong") {
        strictEqual(answer.empty, false, `${description} - not empty`);
        strictEqual(answer.message, null, `${description} - no message`);
        strictEqual(answer.correct, false, `${description} - not correct`);
    } else if (result === "wrong-message") {
        strictEqual(answer.empty, false, `${description} - not empty`);
        notStrictEqual(answer.message, null, `${description} - message`);
        strictEqual(answer.correct, false, `${description} - not correct`);
    } else if (result === "empty") {
        strictEqual(answer.empty, true, `${description} - empty`);
        strictEqual(answer.message, null, `${description} - no message`);
        strictEqual(answer.correct, false, `${description} - not correct`);
    } else if (result === "empty-message") {
        strictEqual(answer.empty, true, `${description} - empty`);
        notStrictEqual(answer.message, null, `${description} - message`);
        strictEqual(answer.correct, false, `${description} - not correct`);
    }
}


describe("widgets", function() {
    let Renderer;

    beforeEach(function() {
        Renderer = React.createFactory(_rendererJsx);
        fixture = document.createElement('div');
    });

    xit("grades input-number", function() {
        const component = ReactDOM.render(Renderer({
            content: "[[☃ input-number 1]]",
            widgets: {
                "input-number 1": {
                    options: {
                        value: "-42",
                        simplify: "required",
                        size: "normal",
                        inexact: false,
                        maxError: 0.1,
                        answerType: "number",
                    },
                    type: "input-number",
                },
            },
        }), fixture);

        testAnswer(component, "", "empty", "empty answer is empty");
        testAnswer(component, "123", "wrong", "wrong answer is wrong");
        testAnswer(component, "2/4", "wrong", "wrong answer is wrong");
        testAnswer(component, "-42", "right", "right answer is right");
        testAnswer(component, "-84/2", "empty-message",
            "non-simplified right answer gives message");
        testAnswer(component, " \u2212 42 ", "right",
            "weirdly formatted right answer is right");
        testAnswer(component, "- 4 2", "wrong",
            "crazily formatted answer is wrong");
        testAnswer(component, "-41.9999999", "wrong",
            "close decimal is wrong");
        testAnswer(component, "-,42", "wrong",
            "sort of tricky wrong answer is wrong");
    });

    xit("grades widget input-number multiple", function() {
        const component = ReactDOM.render(Renderer({
            "content": "[[☃ input-number 1]]\n[[☃ input-number 2]]",
            "widgets": {
                "input-number 1": {
                    "options": {
                        "value": "7",
                        "simplify": "required",
                        "size": "normal",
                        "inexact": false,
                        "maxError": 0.1,
                        "answerType": "number",
                    },
                    "type": "input-number",
                },
                "input-number 2": {
                    "options": {
                        "value": "1.5",
                        "simplify": "required",
                        "size": "normal",
                        "inexact": false,
                        "maxError": 0.1,
                        "answerType": "number",
                    },
                    "type": "input-number",
                },
            },
        }), fixture);

        testMultipleAnswer(component, ["7", "3/2"], "right",
            "right answer is right");
        testMultipleAnswer(component, ["7", "1.5"], "right",
            "right answer is right");
        testMultipleAnswer(component, ["3/2", "7"], "wrong",
            "wrong answer is wrong");
        testMultipleAnswer(component, ["7", ""], "empty",
            "incomplete answer gives empty");
        testMultipleAnswer(component, ["", "3/2"], "empty",
            "incomplete answer gives empty");
        testMultipleAnswer(component, ["", ""], "empty",
            "empty answer is empty");
        testMultipleAnswer(component, ["7", "6/4"], "empty-message",
            "unsimplified right answer provides a message");
        testMultipleAnswer(component, ["14/2", "6/4"], "empty-message",
            "unsimplified right gives message");
        testMultipleAnswer(component, ["14/2", "3/2"], "empty-message",
            "unsimplified right gives message");
        testMultipleAnswer(component, ["7", "6/4"], "empty-message",
            "unsimplified right gives message");
        // testMultipleAnswer(component, ["14/2", "7"], "wrong",
        //    "unsimplified right and wrong is wrong");
        // testMultipleAnswer(component, ["3", "6/4"], "wrong",
        //    "unsimplified right and wrong is wrong");
        testMultipleAnswer(component, ["4/2", "4/2"], "wrong",
            "unsimplified wrong is wrong");
        // testMultipleAnswer(component, ["14/2", ""], "empty",
        //    "unsimplified incomplete answer is empty");
    });

    xit("grades widget input-number multiple simplify-enforced", 21,
        function() {
            const component = ReactDOM.render(Renderer({
                "content": "[[☃ input-number 1]]\n[[☃ input-number 2]]",
                "widgets": {
                    "input-number 1": {
                        "options": {
                            "value": "7",
                            "simplify": "enforced",
                            "size": "normal",
                            "inexact": false,
                            "maxError": 0.1,
                            "answerType": "number",
                        },
                        "type": "input-number",
                    },
                    "input-number 2": {
                        "options": {
                            "value": "1.5",
                            "simplify": "enforced",
                            "size": "normal",
                            "inexact": false,
                            "maxError": 0.1,
                            "answerType": "number",
                        },
                        "type": "input-number",
                    },
                },
            }), fixture);

            testMultipleAnswer(component, ["7", "3/2"], "right",
                "right answer is right");
            testMultipleAnswer(component, ["7", "1.5"], "right",
                "right answer is right");
            testMultipleAnswer(component, ["3/2", "7"], "wrong",
                "wrong answer is wrong");
            testMultipleAnswer(component, ["7", ""], "empty",
                "incomplete answer is empty");
            testMultipleAnswer(component, ["", "3/2"], "empty",
                "incomplete answer is empty");
            testMultipleAnswer(component, ["", ""], "empty",
                "empty answer is empty");
            // testMultipleAnswer(component, ["7", "6/4"], "wrong",
            //    "unsimplified is wrong");
            // testMultipleAnswer(component, ["14/2", "6/4"], "wrong",
            //    "unsimplified is wrong");
            // testMultipleAnswer(component, ["14/2", "3/2"], "wrong",
            //    "unsimplified is wrong");
            // testMultipleAnswer(component, ["7", "6/4"], "wrong",
            //    "unsimplified is wrong");
            testMultipleAnswer(component, ["4/2", "4/2"], "wrong",
                "unsimplified wrong is wrong");
        }
    );
});
export default _module_.exports;
