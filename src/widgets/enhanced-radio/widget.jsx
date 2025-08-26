import _baseEnhancedRadioJsx from "./base-enhanced-radio.jsx";
import _rendererJsx from "../../renderer.jsx";
import _underscore from "underscore";
import _react from "react";
import PropTypes from "prop-types";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;

const _ = _underscore;
const React = _react;
const createReactClass = React.createClass;

const BaseEnhancedRadio = _baseEnhancedRadioJsx;
const Renderer = _rendererJsx;

const EnhancedRadio = createReactClass({
    propTypes: {
        apiOptions: BaseEnhancedRadio.propTypes.apiOptions,
        choices: PropTypes.arrayOf(
            PropTypes.shape({
                content: PropTypes.string,
                widgets: PropTypes.object, // For nested widgets
                images: PropTypes.object,  // For nested widgets
                clue: PropTypes.string,
                correct: PropTypes.bool,
                originalIndex: PropTypes.number.isRequired,
            }).isRequired
        ).isRequired,

        layout: PropTypes.oneOf(['vertical', 'horizontal', 'grid-2x2']),
        multipleSelect: PropTypes.bool,
        numCorrect: PropTypes.number,
        onChange: PropTypes.func.isRequired,
        reviewModeRubric: PropTypes.object,
        findWidgets: PropTypes.func,
        linterContext: PropTypes.object,
    },

    getDefaultProps: function() {
        return {
            choices: [],
            layout: 'vertical',
            multipleSelect: false,
            numCorrect: 1,
        };
    },

    getInitialState: function() {
        return {
            selectedChoices: this.props.choices.map(() => false),
        };
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.choices.length !== this.props.choices.length) {
            this.setState({
                selectedChoices: nextProps.choices.map(() => false),
            });
        }
    },

    updateChoices: function(selectedChoices) {
        this.setState({selectedChoices});
        this.props.onChange({selectedChoices});
    },

    _renderRenderer: function(content, widgets = {}, images = {}) {
        if (!content) {
            return null;
        }

        // If content is just a string, render it directly
        if (typeof content === 'string' && !widgets) {
            return content;
        }

        // Use Renderer for complex content with potential widgets
        return (
            <Renderer
                key="choiceContentRenderer"
                content={content}
                widgets={widgets || {}}
                images={images || {}}
                findExternalWidgets={this.props.findWidgets}
                alwaysUpdate={true}
                linterContext={this.props.linterContext}
            />
        );
    },

    render: function() {
        const choices = this.props.choices.map((choice, i) => {
            const selected = this.state.selectedChoices[i];
            const rationaleShown = choice.clue && selected;
            const correctnessShown = this.props.reviewModeRubric && selected;

            return {
                content: this._renderRenderer(
                    choice.content, 
                    choice.widgets, 
                    choice.images
                ),
                checked: selected,
                correct: choice.correct,
                rationale: this._renderRenderer(choice.clue),
                showRationale: rationaleShown,
                showCorrectness: correctnessShown,
                originalIndex: choice.originalIndex,
            };
        });

        return (
            <BaseEnhancedRadio
                ref="baseEnhancedRadio"
                layout={this.props.layout}
                multipleSelect={this.props.multipleSelect}
                numCorrect={this.props.numCorrect}
                choices={choices}
                onChange={this.updateChoices}
                reviewModeRubric={this.props.reviewModeRubric}
                apiOptions={this.props.apiOptions}
            />
        );
    },

    getUserInput: function() {
        return {
            selectedChoices: this.state.selectedChoices,
        };
    },

    simpleValidate: function(rubric) {
        return this.validate(rubric, false);
    },

    validate: function(rubric, onInputError) {
        const selectedChoices = this.state.selectedChoices;
        const correctChoices = rubric.choices.map(choice => choice.correct);
        
        // Check if the selected choices match the correct choices
        const isCorrect = selectedChoices.every((selected, i) => 
            selected === correctChoices[i]
        );

        if (isCorrect) {
            return {
                type: "points",
                earned: 1,
                total: 1,
                message: null,
            };
        } else {
            return {
                type: "points",
                earned: 0,
                total: 1,
                message: null,
            };
        }
    },
});

_module_.exports = EnhancedRadio;
export default _module_.exports;
