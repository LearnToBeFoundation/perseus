import {
    boldFontFamily,
    gray68,
    gray76,
    gray85,
    gray95,
    kaGreen,
    phoneMargin,
    negativePhoneMargin,
} from "../styles/constants.js";

import { iconStar, iconTryAgain } from "../icon-paths.js";
import _componentsInlineIconJsx from "../components/inline-icon.jsx";
import _perseusApiJsx from "../perseus-api.jsx";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* globals i18n */
/**
 * Renders answer bar for mobile graded groups. [STATELESS]
 */
const React = _react;

const ApiOptions = _perseusApiJsx.Options;
const InlineIcon = _componentsInlineIconJsx;

const ANSWER_BAR_STATES = {
    // Initial state before the question is answerable.  The user must complete
    // each of the widgets before the answer bar becomes visible.
    HIDDEN: Symbol("HIDDEN"),

    // The 'Check' button is active whenever the question is answerable or any
    // of the input widgets have been modified after getting the answer wrong.
    ACTIVE: Symbol("ACTIVE"),

    // The 'Check' button is disabled and there is no message.  This occurs when
    // some of the widgets haven't been filled in after the has already become
    // visible.
    INACTIVE: Symbol("INACTIVE"),

    // This happens immediately after clicking 'Check' with a wrong answer.
    // The 'Check' button is disabled and the 'Try Again' message is displayed.
    INCORRECT: Symbol("INCORRECT"),

    // Final state.  This occurs after the user submits the correct answer.
    // The widgets in this grade-group are disabled.
    CORRECT: Symbol("CORRECT"),
};

const GradedGroupAnswerBar = createReactClass({
    propTypes: {
        // TODO(kevinb) update to oneOf once we update to 15.2
        answerBarState: PropTypes.any.isRequired,
        apiOptions: ApiOptions.propTypes,
        onCheckAnswer: PropTypes.func.isRequired,

        // The function to call when clicking "Next question" after correctly
        // answering one graded group out of a set. If this is null, the
        // "Next question" button will not appear.
        onNextQuestion: PropTypes.func,
    },

    render() {
        const {
            apiOptions,
            answerBarState,
            onCheckAnswer,
            onNextQuestion,
        } = this.props;

        const answerBarStyle = {
            ...styles.answerBar,
            backgroundColor:
                answerBarState === ANSWER_BAR_STATES.CORRECT ? gray95 : "white",
            // Center the "Correct!" message only when there's no next question
            justifyContent:
                answerBarState === ANSWER_BAR_STATES.CORRECT && !onNextQuestion
                    ? "center"
                    : "space-between",
        };

        const buttonStyle = {
            ...styles.button,
            // "Check" and "Next question" buttons should both be green
            backgroundColor:
                answerBarState === ANSWER_BAR_STATES.ACTIVE ||
                answerBarState === ANSWER_BAR_STATES.CORRECT
                    ? kaGreen
                    : gray85,
        };

        const textStyle = {
            ...styles.text,
            color:
                answerBarState === ANSWER_BAR_STATES.CORRECT ? kaGreen : gray68,
        };

        const message =
            answerBarState === ANSWER_BAR_STATES.INCORRECT
                ? <span style={textStyle}>
                      <span style={styles.tryAgainIcon}>
                          <InlineIcon {...iconTryAgain} />
                      </span>
                      <span style={{marginLeft: 8}}>
                          {i18n._("Keep trying")}
                      </span>
                  </span>
                : <span />; // empty span keeps the button on the right side

        if (answerBarState !== ANSWER_BAR_STATES.CORRECT) {
            const buttonLabel =
                answerBarState === ANSWER_BAR_STATES.INCORRECT
                    ? i18n._("Try again")
                    : i18n._("Check");

            // Use <button> instead of <input> b/c iOS 9.3 on iPhone 6 renders
            // the <input> as a faded out green button instead of using our
            // styles.
            return (
                <div style={answerBarStyle}>
                    {message}
                    <button
                        style={buttonStyle}
                        disabled={
                            apiOptions.readOnly ||
                            answerBarState !== ANSWER_BAR_STATES.ACTIVE
                        }
                        onClick={onCheckAnswer}
                    >
                        {buttonLabel}
                    </button>
                </div>
            );
        } else {
            return (
                <div style={answerBarStyle}>
                    <span style={textStyle}>
                        <span style={{fontSize: 28, color: "#FFB300"}}>
                            <InlineIcon
                                {...iconStar}
                                style={{marginBottom: 5}}
                            />
                        </span>
                        <span style={{marginLeft: 8}}>
                            {i18n._("Correct!")}
                        </span>
                    </span>
                    {onNextQuestion &&
                        <button style={buttonStyle} onClick={onNextQuestion}>
                            {i18n._("Next question")}
                        </button>}
                </div>
            );
        }
    },
});

const fontSize = 17;

const styles = {
    answerBar: {
        display: "flex",
        alignItems: "center",
        height: 68, // so that we don't have calculate the vertical padding
        marginLeft: negativePhoneMargin,
        marginRight: negativePhoneMargin,
        marginBottom: negativePhoneMargin,
        marginTop: phoneMargin,
        paddingLeft: phoneMargin,
        paddingRight: 10,
        borderTop: `1px solid ${gray76}`,
    },

    // TODO(kevinb) figure out a way inject styles/components from webapp
    button: {
        height: 48,
        width: 143,
        borderRadius: 4,
        color: "white",
        fontFamily: boldFontFamily,
        fontSize: fontSize,
        border: "none",
    },

    tryAgainIcon: {
        fontSize: 28,
        color: "#63D9EA",
        transform: "scale(-1,1) rotate(-268deg)",
    },

    text: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        fontFamily: boldFontFamily,
        fontSize: fontSize,
    },
};

GradedGroupAnswerBar.ANSWER_BAR_STATES = ANSWER_BAR_STATES;

_module_.exports = GradedGroupAnswerBar;
export default _module_.exports;
