import _enhancedChoiceJsx from "./enhanced-choice.jsx";
import _stylesMediaQueriesJs from "../../styles/media-queries.js";
import * as styleConstants from "../../styles/constants.js";
import _stylesSharedJs from "../../styles/shared.js";
import { ClassNames } from "../../perseus-api.jsx";
import _classnames from "classnames";
import _react from "react";
import _underscore from "underscore";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;

const _ = _underscore;
const React = _react;
const classNames = _classnames;

const sharedStyles = _stylesSharedJs;
const mediaQueries = _stylesMediaQueriesJs;
const EnhancedChoice = _enhancedChoiceJsx;

const BaseEnhancedRadio = createReactClass({
    propTypes: {
        apiOptions: PropTypes.shape({
            readOnly: PropTypes.bool,
            isMobile: PropTypes.bool,
            styling: PropTypes.shape({
                primaryProductColor: PropTypes.string,
            }),
        }),
        choices: PropTypes.arrayOf(PropTypes.shape({
            content: PropTypes.node,
            checked: PropTypes.bool,
            correct: PropTypes.bool,
            rationale: PropTypes.node,
            showRationale: PropTypes.bool,
            showCorrectness: PropTypes.bool,
            originalIndex: PropTypes.number,
        })),
        layout: PropTypes.oneOf(['vertical', 'horizontal', 'grid-2x2']),
        multipleSelect: PropTypes.bool,
        numCorrect: PropTypes.number,
        onChange: PropTypes.func,
        reviewModeRubric: PropTypes.object,
    },

    getDefaultProps: function() {
        return {
            choices: [],
            layout: 'vertical',
            multipleSelect: false,
            numCorrect: 1,
            apiOptions: {},
        };
    },

    getInitialState: function() {
        return {
            radioGroupName: _.uniqueId("perseus_radio_"),
        };
    },

    updateChoice: function(choiceIndex, newValues) {
        const selectedChoices = this.props.choices.map((choice, i) => {
            if (i === choiceIndex) {
                return newValues.checked;
            } else if (!this.props.multipleSelect && newValues.checked) {
                // For single select, uncheck all other choices
                return false;
            } else {
                return choice.checked;
            }
        });

        this.props.onChange(selectedChoices);
    },

    getInstructionsText: function() {
        if (this.props.multipleSelect) {
            return `Select all that apply (${this.props.numCorrect} correct)`;
        } else {
            return "Select one answer";
        }
    },

    render: function() {
        const isMobile = this.props.apiOptions.isMobile;
        const reviewMode = !!this.props.reviewModeRubric;
        const inputType = this.props.multipleSelect ? "checkbox" : "radio";

        const containerClassName = classNames(
            "perseus-widget-enhanced-radio",
            `perseus-enhanced-radio-${this.props.layout}`,
            css(
                styles.container,
                this.props.layout === 'horizontal' && styles.horizontalContainer,
                this.props.layout === 'grid-2x2' && styles.gridContainer,
                isMobile && styles.mobileContainer
            )
        );

        const instructionsClassName = classNames(
            "instructions",
            css(styles.instructions, isMobile && styles.instructionsMobile)
        );

        const instructions = this.getInstructionsText();

        return (
            <div className={css(styles.responsiveContainer)}>
                <fieldset className="perseus-widget-enhanced-radio-fieldset">
                    <legend className="perseus-sr-only">
                        {instructions}
                    </legend>
                    <div className={instructionsClassName}>
                        {instructions}
                    </div>
                    <ul className={containerClassName}>
                        {this.props.choices.map((choice, i) => {
                            const elementProps = {
                                ref: `enhancedRadio${i}`,
                                apiOptions: this.props.apiOptions,
                                checked: choice.checked,
                                reviewMode,
                                correct: choice.correct,
                                rationale: choice.rationale,
                                content: choice.content,
                                disabled: this.props.apiOptions.readOnly,
                                groupName: this.state.radioGroupName,
                                showCorrectness: reviewMode || !!choice.showCorrectness,
                                showRationale: choice.showRationale,
                                type: inputType,
                                pos: i,
                                layout: this.props.layout,
                                onChange: newValues => {
                                    this.updateChoice(i, newValues);
                                },
                            };

                            return (
                                <li
                                    key={i}
                                    className={css(
                                        styles.choiceItem,
                                        this.props.layout === 'grid-2x2' && styles.gridItem
                                    )}
                                >
                                    <EnhancedChoice {...elementProps} />
                                </li>
                            );
                        })}
                    </ul>
                </fieldset>
            </div>
        );
    },

    serialize: function() {
        return {
            selectedChoices: this.props.choices.map(choice => choice.checked || false),
        };
    },
});

const styles = StyleSheet.create({
    responsiveContainer: {
        width: "100%",
    },

    container: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    horizontalContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "16px",
    },

    gridContainer: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        [mediaQueries.smOrSmaller]: {
            gridTemplateColumns: "1fr",
        },
    },

    mobileContainer: {
        gap: "8px",
    },

    instructions: {
        fontSize: "14px",
        color: styleConstants.gray68,
        marginBottom: "16px",
        fontWeight: "500",
    },

    instructionsMobile: {
        fontSize: "13px",
        marginBottom: "12px",
    },

    choiceItem: {
        listStyle: "none",
        margin: 0,
        padding: 0,
    },

    gridItem: {
        minHeight: "60px",
    },
});

_module_.exports = BaseEnhancedRadio;
export default _module_.exports;
