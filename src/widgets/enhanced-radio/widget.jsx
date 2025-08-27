import _baseEnhancedRadioJsx from "./base-enhanced-radio.jsx";
import _rendererJsx from "../../renderer.jsx";
import _underscore from "underscore";
import _react from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;

const _ = _underscore;
const React = _react;

const BaseEnhancedRadio = _baseEnhancedRadioJsx;
const Renderer = _rendererJsx;

const EnhancedRadio = createReactClass({
    propTypes: {
        apiOptions: PropTypes.shape({
            readOnly: PropTypes.bool,
            isMobile: PropTypes.bool,
            styling: PropTypes.shape({
                primaryProductColor: PropTypes.string,
            }),
        }),
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

    _renderRenderer: function(content, widgets = {}, images = {}, refName = "renderer") {
        if (!content) {
            return null;
        }

        // Follow the same pattern as hints - just pass everything to Renderer
        return (
            <Renderer
                ref={refName}
                content={content || ""}
                widgets={widgets || {}}
                images={images || {}}
                apiOptions={this.props.apiOptions}
                findExternalWidgets={this.props.findWidgets}
                linterContext={this.props.linterContext}
            />
        );
    },

    render: function() {
        console.log('Enhanced Radio render - props:', {
            choices: this.props.choices,
            choicesLength: this.props.choices ? this.props.choices.length : 0,
            firstChoice: this.props.choices ? this.props.choices[0] : null
        });

        const choices = this.props.choices.map((choice, i) => {
            const selected = this.state.selectedChoices[i];
            const rationaleShown = choice.clue && selected;
            const correctnessShown = this.props.reviewModeRubric && selected;

            return {
                content: this._renderRenderer(
                    choice.content,
                    choice.widgets,
                    choice.images,
                    `choice-renderer-${i}`
                ),
                checked: selected,
                correct: choice.correct,
                rationale: this._renderRenderer(
                    choice.clue,
                    {},
                    {},
                    `clue-renderer-${i}`
                ),
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
                onChange={(selectedChoices) => this.updateChoices(selectedChoices)}
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

    /**
     * Expose nested widgets to Perseus widget discovery system.
     * This allows nested widgets to be found for editing and interaction.
     */
    findWidgets: function(filterCriterion) {
        // Collect all widgets from all choice renderers
        const widgets = [];

        // Get widgets from each choice's content renderer
        this.props.choices.forEach((choice, i) => {
            const choiceRenderer = this.refs[`choice-renderer-${i}`];
            if (choiceRenderer && choiceRenderer.findInternalWidgets) {
                widgets.push(...choiceRenderer.findInternalWidgets(filterCriterion));
            }

            const clueRenderer = this.refs[`clue-renderer-${i}`];
            if (clueRenderer && clueRenderer.findInternalWidgets) {
                widgets.push(...clueRenderer.findInternalWidgets(filterCriterion));
            }
        });

        return widgets;
    },
});

_module_.exports = EnhancedRadio;
export default _module_.exports;
