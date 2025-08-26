import _enhancedRadioWidgetJsx from "./enhanced-radio/widget.jsx";
import _utilJs from "../util.js";
import _underscore from "underscore";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;

const _ = _underscore;
const shuffle = _utilJs.shuffle;
const EnhancedRadio = _enhancedRadioWidgetJsx;

const _choiceTransform = (editorProps, problemNum) => {
    const _maybeRandomize = function(array) {
        return editorProps.randomize ? shuffle(array, problemNum) : array;
    };

    // Add meta-information to choices
    let choices = editorProps.choices.slice();
    choices = _.map(choices, (choice, i) => {
        return _.extend(
            {},
            choice,
            {
                originalIndex: i,
                correct: Boolean(choice.correct),
            }
        );
    });

    // Randomize choices if requested
    return _maybeRandomize(choices);
};

const transform = (editorProps, problemNum) => {
    const choices = _choiceTransform(editorProps, problemNum);

    const numCorrect = _.reduce(
        editorProps.choices,
        function(memo, choice) {
            return choice.correct ? memo + 1 : memo;
        },
        0
    );

    const {
        layout,
        multipleSelect,
        randomize,
    } = editorProps;

    return {
        numCorrect,
        layout: layout || 'vertical',
        multipleSelect: multipleSelect || false,
        randomize: randomize || false,
        choices,
        selectedChoices: _.pluck(choices, "correct"),
    };
};

const propUpgrades = {
    1: v0props => {
        // Convert from old radio widget format if needed
        return _.extend({}, v0props, {
            layout: v0props.layout || 'vertical',
            multipleSelect: v0props.multipleSelect || false,
        });
    },
};

_module_.exports = {
    name: "enhanced-radio",
    displayName: "Enhanced Multiple Choice",
    accessible: true,
    widget: EnhancedRadio,
    transform: transform,
    staticTransform: transform,
    version: {major: 1, minor: 0},
    propUpgrades: propUpgrades,
    isLintable: true,
};

export default _module_.exports;
