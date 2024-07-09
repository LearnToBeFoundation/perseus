import * as React from 'react';
import ReactDOM from 'react-dom';
import _ from "underscore";
import { mapObject } from "./interactive2/objective_.js";
import Util from "./util.js";
import Renderer from "./renderer.jsx";
import ProvideKeypad from "./mixins/provide-keypad.jsx";
import HintsRenderer from "./hints-renderer.jsx";
import { Options as ApiOptions } from "./perseus-api.jsx";
import { StyleSheet, css } from "aphrodite";

/**
 * A copy of the ItemRenderer which renders its question renderer and hints
 * renderer normally instead of ReactDOM.render()ing them into elements in the
 * DOM.
 *
 * As well as check answer, grading, and hints buttons built in
 */
const colorLtbBlue = "#2563EB"

const styles = StyleSheet.create({
    hintsContainer: {
        marginLeft: 50,
    },
    checkAnswerButton: {
        padding: 10,
        color: "white",
        fontSize: 14,
        borderRadius: 5,
        display: "inline-grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr",
    },
    checkAnswerText: {
        gridArea: "1 / 1 / 2 / 2",
    },
});

const QuestionRenderer = createReactClass({
    propTypes: {
        ...ProvideKeypad.propTypes,
        apiOptions: PropTypes.any,
        initialHintsVisible: PropTypes.number,
        item: PropTypes.shape({
            answerArea: PropTypes.shape({
                calculator: PropTypes.bool,
                chi2Table: PropTypes.bool,
                periodicTable: PropTypes.bool,
                tTable: PropTypes.bool,
                zTable: PropTypes.bool,
            }),
            hints: PropTypes.arrayOf(PropTypes.object),
            question: PropTypes.object,
        }).isRequired,
        problemNum: PropTypes.number,
        reviewMode: PropTypes.bool,
        onAnswer: PropTypes.func,
        onHint: PropTypes.func,
        showSubmitButton: PropTypes.bool,
        showHintButton: PropTypes.bool,
    },

    getDefaultProps: function() {
        return {
            apiOptions: {}, // a deep default is done in `this.update()`
            initialHintsVisible: 0,
            problemNum: 0,
            reviewMode: false,
            onAnswer: () => {},
            onHint: () => {},
            showSubmitButton: true,
            showHintButton: true,
        };
    },

    getInitialState: function() {
        return {
            ...ProvideKeypad.getInitialState(),
            hintsVisible: this.props.initialHintsVisible,
            answerState: 'unanswered',
            questionHighlightedWidgets: [],
        };
    },

    componentDidMount: function() {
        ProvideKeypad.componentDidMount.call(this);
        this._currentFocus = null;
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            questionHighlightedWidgets: [],
        });
    },

    componentDidUpdate: function() {
        if (this.props.apiOptions.answerableCallback) {
            const isAnswerable =
                this.questionRenderer.emptyWidgets().length === 0;
            this.props.apiOptions.answerableCallback(isAnswerable);
        }
    },

    componentWillUnmount() {
        ProvideKeypad.componentWillUnmount.call(this);
    },

    keypadElement() {
        return ProvideKeypad.keypadElement.call(this);
    },

    _handleFocusChange: function(newFocus, oldFocus) {
        if (newFocus != null) {
            this._setCurrentFocus(newFocus);
        } else {
            this._onRendererBlur(oldFocus);
        }
    },

    // Sets the current focus path and element and
    // send an onChangeFocus event back to our parent.
    _setCurrentFocus: function(newFocus) {
        const keypadElement = this.keypadElement();

        // By the time this happens, newFocus cannot be a prefix of
        // prevFocused, since we must have either been called from
        // an onFocusChange within a renderer, which is only called when
        // this is not a prefix, or between the question and answer areas,
        // which can never prefix each other.
        const prevFocus = this._currentFocus;
        this._currentFocus = newFocus;

        // Determine whether the newly focused path represents an input.
        const inputPaths = this.getInputPaths();
        const didFocusInput =
            this._currentFocus &&
            inputPaths.some(inputPath => {
                return Util.inputPathsEqual(inputPath, this._currentFocus);
            });

        if (this.props.apiOptions.onFocusChange != null) {
            this.props.apiOptions.onFocusChange(
                this._currentFocus,
                prevFocus,
                didFocusInput &&
                    keypadElement &&
                    ReactDOM.findDOMNode(keypadElement)
            );
        }

        if (keypadElement) {
            if (didFocusInput) {
                keypadElement.activate();
            } else {
                keypadElement.dismiss();
            }
        }
    },

    _onRendererBlur: function(blurPath) {
        const blurringFocusPath = this._currentFocus;

        // Failsafe: abort if ID is different, because focus probably happened
        // before blur
        if (!_.isEqual(blurPath, blurringFocusPath)) {
            return;
        }

        // Wait until after any new focus events fire this tick before
        // declaring that nothing is focused.
        // If a different widget was focused, we'll see an onBlur event
        // now, but then an onFocus event on a different element before
        // this callback is executed
        _.defer(() => {
            if (_.isEqual(this._currentFocus, blurringFocusPath)) {
                this._setCurrentFocus(null);
            }
        });
    },

    /**
     * Accepts a question area widgetId, or an answer area widgetId of
     * the form "answer-input-number 1", or the string "answer-area"
     * for the whole answer area (if the answer area is a single widget).
     */
    _setWidgetProps: function(widgetId, newProps, callback) {
        this.questionRenderer._setWidgetProps(widgetId, newProps, callback);
    },

    _handleAPICall: function(functionName, path) {
        // Get arguments to pass to function, including `path`
        const functionArgs = _.rest(arguments);
        const caller = this.questionRenderer;

        return caller[functionName](...functionArgs);
    },

    setInputValue: function(path, newValue, focus) {
        return this._handleAPICall("setInputValue", path, newValue, focus);
    },

    focusPath: function(path) {
        return this._handleAPICall("focusPath", path);
    },

    blurPath: function(path) {
        return this._handleAPICall("blurPath", path);
    },

    getDOMNodeForPath: function(path) {
        return this._handleAPICall("getDOMNodeForPath", path);
    },

    getGrammarTypeForPath: function(path) {
        return this._handleAPICall("getGrammarTypeForPath", path);
    },

    getInputPaths: function() {
        const questionAreaInputPaths = this.questionRenderer.getInputPaths();
        return questionAreaInputPaths;
    },

    handleInteractWithWidget: function(widgetId) {
        const withRemoved = _.difference(
            this.state.questionHighlightedWidgets,
            [widgetId]
        );
        this.setState({
            answerState: "unanswered",
            questionHighlightedWidgets: withRemoved,
        });

        if (this.props.apiOptions.interactionCallback) {
            this.props.apiOptions.interactionCallback();
        }
    },

    focus: function() {
        return this.questionRenderer.focus();
    },

    blur: function() {
        if (this._currentFocus) {
            this.blurPath(this._currentFocus);
        }
    },

    showHint: function() {
        if (this.state.hintsVisible < this.getNumHints()) {
            this.props.onHint(this.state.hintsVisible + 1, this.getNumHints());
            this.setState({
                hintsVisible: this.state.hintsVisible + 1,
            });
        }
    },

    getNumHints: function() {
        return this.props.item.hints.length;
    },

    /**
     * Grades the item.
     *
     * Returns a KE-style score of {
     *     empty: bool,
     *     correct: bool,
     *     message: string|null,
     *     guess: Array
     * }
     */
    scoreInput: function() {
        const [guess, score] = this.questionRenderer.guessAndScore();

        const isCorrect = score.type === "points" && score.earned >= score.total;
        const emptyQuestionAreaWidgets = this.questionRenderer.emptyWidgets();

        // TODO(aria): Add in "unfinished"/invalid suppost to answerState
        // for better check answer messages
        this.setState({
            answerState: isCorrect ? "correct" : "incorrect",
            questionHighlightedWidgets: emptyQuestionAreaWidgets,
        });

        return [guess, score];
    },

    checkAnswer: function(e) {
        e.preventDefault();
        const [guess, score] = this.scoreInput();
        this.props.onAnswer(guess, score);
    },

    /**
     * Returns an array of all widget IDs in the order they occur in
     * the question content.
     */
    getWidgetIds: function() {
        return this.questionRenderer.getWidgetIds();
    },

    /**
     * Returns an object mapping from widget ID to KE-style score.
     * The keys of this object are the values of the array returned
     * from `getWidgetIds`.
     */
    scoreWidgets: function() {
        const qScore = this.questionRenderer.scoreWidgets();
        const qGuess = this.questionRenderer.getUserInputForWidgets();
        const state = this.questionRenderer.getSerializedState();
        return mapObject(qScore, (score, id) => {
            return Util.keScoreFromPerseusScore(score, qGuess[id], state);
        });
    },

    /**
     * Get a representation of the current state of the item.
     */
    getSerializedState: function() {
        return {
            question: this.questionRenderer.getSerializedState(),
            hints: this.hintsRenderer.getSerializedState(),
        };
    },

    restoreSerializedState: function(state, callback) {
        // We need to wait for both the question renderer and the hints
        // renderer to finish restoring their states.
        let numCallbacks = 2;
        const fireCallback = () => {
            --numCallbacks;
            if (callback && numCallbacks === 0) {
                callback();
            }
        };

        this.questionRenderer.restoreSerializedState(
            state.question,
            fireCallback
        );
        this.hintsRenderer.restoreSerializedState(state.hints, fireCallback);
    },

    showRationalesForCurrentlySelectedChoices() {
        this.questionRenderer.showRationalesForCurrentlySelectedChoices();
    },

    deselectIncorrectSelectedChoices() {
        this.questionRenderer.deselectIncorrectSelectedChoices();
    },

    render: function() {
        const apiOptions = {
            ...ApiOptions.defaults,
            ...this.props.apiOptions,
            onFocusChange: this._handleFocusChange,
        };

        const questionRenderer = (
            <Renderer
                keypadElement={this.keypadElement()}
                problemNum={this.props.problemNum}
                onInteractWithWidget={this.handleInteractWithWidget}
                highlightedWidgets={this.state.questionHighlightedWidgets}
                apiOptions={apiOptions}
                questionCompleted={this.state.answerState === "correct"}
                reviewMode={this.props.reviewMode}
                ref={elem => this.questionRenderer = elem}
                {...this.props.item.question}
            />
        );

        const hintsRenderer = (
            <HintsRenderer
                hints={this.props.item.hints}
                hintsVisible={this.state.hintsVisible}
                apiOptions={apiOptions}
                ref={elem => this.hintsRenderer = elem}
            />
        );

        const isOutOfHints = this.state.hintsVisible >= this.getNumHints()
        const showSubmitButton = this.props.showSubmitButton;
        const showHintButton = this.props.showHintButton;

        return (
            <form
                className="framework-perseus"
                onSubmit={this.checkAnswer}
            >
                <div>
                    {questionRenderer}
                </div>
                <div style={{ paddingTop: 10, paddingBottom: 10 }}>
                    {showSubmitButton && (
                        <button
                            type="submit"
                            className={"check-answer-button " + css(styles.checkAnswerButton)}
                            style={{
                                backgroundColor: this.state.answerState === "incorrect" ? "orange" : colorLtbBlue,
                            }}
                            disabled={this.state.answerState === "correct"}
                        >
                            <span className={css(styles.checkAnswerText)} style={{ visibility: this.state.answerState === "correct" ? "visible" : "hidden"}}>
                                🌟 Yes! You got it!
                            </span>
                            <span className={css(styles.checkAnswerText)} style={{ visibility: this.state.answerState === "incorrect" ? "visible" : "hidden"}}>
                                Try again
                            </span>
                            <span className={css(styles.checkAnswerText)} style={{ visibility: this.state.answerState === "unanswered" ? "visible" : "hidden"}}>
                                Check answer
                            </span>
                        </button>
                    )}
                    <div style={{ display: 'inline-block', width: 10 }} />

                    {showHintButton && (
                        <button
                            type="button"
                            style={{
                                padding: 10,
                                backgroundColor: isOutOfHints ? "darkgray" : "orange",
                                color: "white",
                                fontSize: 14,
                                borderRadius: 5,
                            }}
                            disabled={isOutOfHints}
                            onClick={this.showHint}
                        >
                            {isOutOfHints ?
                                "We're out of hints!" :
                                "I'd like a hint!"
                            }
                        </button>
                    )}
                </div>
                { showHintButton && (
                    <div
                        className={
                            // Avoid adding any horizontal padding when applying the
                            // mobile hint styles, which are flush to the left.
                            // NOTE(charlie): We may still want to apply this
                            // padding for desktop exercises.
                            !apiOptions.isMobile && css(styles.hintsContainer)
                        }
                    >
                        {hintsRenderer}
                    </div>
                )}
            </form>
        );
    },
});

export default QuestionRenderer;
