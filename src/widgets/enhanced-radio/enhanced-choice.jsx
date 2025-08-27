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

const EnhancedChoice = createReactClass({
    propTypes: {
        apiOptions: PropTypes.shape({
            readOnly: PropTypes.bool,
            isMobile: PropTypes.bool,
            styling: PropTypes.shape({
                primaryProductColor: PropTypes.string,
            }),
        }),
        checked: PropTypes.bool,
        content: PropTypes.node,
        correct: PropTypes.bool,
        disabled: PropTypes.bool,
        groupName: PropTypes.string,
        layout: PropTypes.oneOf(['vertical', 'horizontal', 'grid-2x2']),
        pos: PropTypes.number,
        rationale: PropTypes.node,
        reviewMode: PropTypes.bool,
        showCorrectness: PropTypes.bool,
        showRationale: PropTypes.bool,
        type: PropTypes.string,
        onChange: PropTypes.func,
    },

    getDefaultProps: function() {
        return {
            checked: false,
            disabled: false,
            pos: 0,
            layout: 'vertical',
            type: 'radio',
        };
    },

    getInitialState: function() {
        return {
            isHovered: false,
            isFocused: false,
            isPressed: false,
        };
    },

    onMouseEnter: function() {
        if (!this.props.disabled) {
            this.setState({isHovered: true});
        }
    },

    onMouseLeave: function() {
        this.setState({isHovered: false, isPressed: false});
    },

    onMouseDown: function() {
        if (!this.props.disabled) {
            this.setState({isPressed: true});
        }
    },

    onMouseUp: function() {
        this.setState({isPressed: false});
    },

    onFocus: function() {
        this.setState({isFocused: true});
    },

    onBlur: function() {
        this.setState({isFocused: false});
    },

    onChange: function(event) {
        if (!this.props.disabled) {
            this.props.onChange({
                checked: event.target.checked,
            });
        }
    },



    render: function() {
        const {
            checked,
            correct,
            reviewMode,
            showCorrectness,
            layout,
            type,
            groupName,
            pos,
            content,
            rationale,
            showRationale,
            disabled,
        } = this.props;

        const {isHovered, isFocused, isPressed} = this.state;

        // Determine the choice state for styling
        let choiceState = 'default';
        if (reviewMode && showCorrectness) {
            if (checked && correct) {
                choiceState = 'correct';
            } else if (checked && !correct) {
                choiceState = 'incorrect';
            } else if (!checked && correct) {
                choiceState = 'missed';
            }
        } else if (checked) {
            choiceState = 'selected';
        }

        const choiceClassName = classNames(
            "enhanced-choice",
            `enhanced-choice-${choiceState}`,
            css(
                styles.choice,
                styles[`choice${choiceState.charAt(0).toUpperCase() + choiceState.slice(1)}`],
                isHovered && !disabled && styles.choiceHovered,
                isFocused && styles.choiceFocused,
                isPressed && !disabled && styles.choicePressed,
                disabled && styles.choiceDisabled,
                layout === 'horizontal' && styles.choiceHorizontal,
                layout === 'grid-2x2' && styles.choiceGrid
            )
        );

        const inputId = `${groupName}-choice-${pos}`;

        return (
            <label
                htmlFor={inputId}
                className={choiceClassName}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
            >
                <input
                    type={type}
                    id={inputId}
                    name={groupName}
                    checked={checked}
                    disabled={disabled}
                    onChange={this.onChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    className={css(styles.input)}
                />

                <div className={css(styles.choiceContent)}>
                    <div className={css(styles.contentText)}>
                        {content}
                    </div>
                    
                    {showRationale && rationale && (
                        <div className={css(styles.rationale)}>
                            {rationale}
                        </div>
                    )}
                </div>
            </label>
        );
    },
});

const styles = StyleSheet.create({
    choice: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        border: "2px solid #e5e5e5",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        position: "relative",
        minHeight: "60px",

        ":hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
    },

    choiceHovered: {
        borderColor: "#2563EB",
        backgroundColor: "#ffffff",
    },

    choiceFocused: {
        outline: "2px solid #2563EB",
        outlineOffset: "2px",
    },

    choicePressed: {
        transform: "translateY(0px)",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    },

    choiceSelected: {
        borderColor: "#2563EB",
        backgroundColor: "#DBEAFE",
    },

    choiceCorrect: {
        borderColor: "#2563EB",
        backgroundColor: "#DBEAFE",
    },

    choiceIncorrect: {
        borderColor: "#ff4b4b",
        backgroundColor: "#ffeaea",
    },

    choiceMissed: {
        borderColor: "#ffc107",
        backgroundColor: "#fff8e1",
    },

    choiceDisabled: {
        opacity: 0.6,
        cursor: "not-allowed",
        
        ":hover": {
            transform: "none",
            boxShadow: "none",
        },
    },

    choiceHorizontal: {
        minWidth: "200px",
        flex: "1 1 auto",
    },

    choiceGrid: {
        minHeight: "80px",
    },

    input: {
        position: "absolute",
        opacity: 0,
        width: 0,
        height: 0,
    },

    choiceContent: {
        flex: 1,
        minWidth: 0,
    },

    contentText: {
        fontSize: "16px",
        lineHeight: "1.4",
        color: "#333333",
        wordWrap: "break-word",
        textAlign: "center",
        width: "100%",

        [mediaQueries.smOrSmaller]: {
            fontSize: "14px",
        },
    },

    rationale: {
        marginTop: "12px",
        padding: "12px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        fontSize: "14px",
        color: "#666666",
        lineHeight: "1.4",
    },
});

_module_.exports = EnhancedChoice;
export default _module_.exports;
