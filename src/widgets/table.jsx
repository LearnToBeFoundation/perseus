import _interactive2InteractiveUtilJs from "../interactive2/interactive-util.js";
import { linterContextProps, linterContextDefault } from "../gorgon/proptypes.js";
import _utilAnswerTypesJs from "../util/answer-types.js";
import _perseusApiJsx from "../perseus-api.jsx";
import _mathInput from "@khanacademy/math-input";
import _utilJs from "../util.js";
import _rendererJsx from "../renderer.jsx";
import _componentsSimpleKeypadInputJsx from "../components/simple-keypad-input.jsx";
import _componentsMathOutputJsx from "../components/math-output.jsx";
import _underscore from "underscore";
import _reactDom from "react-dom";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable comma-dangle, no-var, react/jsx-closing-bracket-location, react/prop-types, react/sort-comp, space-before-function-paren */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var React = _react;
var ReactDOM = _reactDom;
var _ = _underscore;

var MathOutput = _componentsMathOutputJsx;
const SimpleKeypadInput = _componentsSimpleKeypadInputJsx;
var Renderer = _rendererJsx;
var Util = _utilJs;

const {keypadElementPropType} = _mathInput.propTypes;
var ApiOptions = _perseusApiJsx.Options;
const KhanAnswerTypes = _utilAnswerTypesJs;

var assert = _interactive2InteractiveUtilJs.assert;

/* Input handling: Maps a (row, column) pair to a unique ref used by React,
 * and extracts (row, column) pairs from input paths, used to allow outsiders
 * to focus, blur, set input values, etc. */
var getInputPath = function(row, column) {
    return ["" + row, "" + column];
};

var getDefaultPath = function() {
    return getInputPath(0, 0);
};

var getRowFromPath = function(path) {
    // 'path' should be a (row, column) pair
    assert(_.isArray(path) && path.length === 2);
    return +path[0];
};

var getColumnFromPath = function(path) {
    // 'path' should be a (row, column) pair
    assert(_.isArray(path) && path.length === 2);
    return +path[1];
};

var getRefForPath = function(path) {
    var row = getRowFromPath(path);
    var column = getColumnFromPath(path);
    return "answer" + row + "," + column;
};

var Table = createReactClass({
    propTypes: {
        answers: PropTypes.arrayOf(
            PropTypes.arrayOf(PropTypes.string)
        ),
        editableHeaders: PropTypes.bool,
        // The editor to use when editableHeaders is enabled
        Editor: PropTypes.func,
        headers: PropTypes.arrayOf(PropTypes.string),
        keypadElement: keypadElementPropType,
        trackInteraction: PropTypes.func.isRequired,
        linterContext: linterContextProps,
    },

    getDefaultProps: function() {
        var defaultRows = 4;
        var defaultColumns = 1;
        var blankAnswers = _.times(defaultRows, function() {
            return Util.stringArrayOfSize(defaultColumns);
        });
        return {
            apiOptions: ApiOptions.defaults,
            headers: [""],
            editableHeaders: false,
            rows: defaultRows,
            columns: defaultColumns,
            answers: blankAnswers,
            linterContext: linterContextDefault,
        };
    },

    _getRows: function() {
        return this.props.answers.length;
    },

    _getColumns: function() {
        return this.props.answers[0].length;
    },

    render: function() {
        var rows = this._getRows();
        var columns = this._getColumns();
        var headers = this.props.headers;

        let InputComponent;
        let inputStyle;
        if (this.props.apiOptions.customKeypad) {
            InputComponent = SimpleKeypadInput;
            // NOTE(charlie): This is intended to match the "width: 80px" in
            // input in table.less. Those values should be kept in-sync.
            inputStyle = {width: 80};
        } else if (this.props.apiOptions.staticRender) {
            InputComponent = MathOutput;
            inputStyle = {};
        } else {
            InputComponent = "input";
            inputStyle = {};
        }

        return (
            <table className="perseus-widget-table-of-values non-markdown">
                <thead>
                    <tr>
                        {_.map(headers, (header, i) => {
                            if (this.props.editableHeaders) {
                                return (
                                    <th key={i}>
                                        <this.props.Editor
                                            ref={"columnHeader" + i}
                                            apiOptions={this.props.apiOptions}
                                            content={header}
                                            widgetEnabled={false}
                                            onChange={_.partial(
                                                this.onHeaderChange,
                                                i
                                            )}
                                        />
                                    </th>
                                );
                            } else {
                                return (
                                    <th key={i}>
                                        <Renderer
                                            content={header}
                                            linterContext={
                                                this.props.linterContext
                                            }
                                        />
                                    </th>
                                );
                            }
                        })}
                    </tr>
                </thead>
                <tbody>
                    {_.times(rows, r => {
                        return (
                            <tr key={r}>
                                {_.times(columns, c => {
                                    return (
                                        <td key={c}>
                                            <InputComponent
                                                ref={getRefForPath(
                                                    getInputPath(r, c)
                                                )}
                                                type="text"
                                                value={this.props.answers[r][c]}
                                                keypadElement={
                                                    this.props.keypadElement
                                                }
                                                disabled={
                                                    this.props.apiOptions
                                                        .readOnly
                                                }
                                                onFocus={_.partial(
                                                    this._handleFocus,
                                                    getInputPath(r, c)
                                                )}
                                                onBlur={_.partial(
                                                    this._handleBlur,
                                                    getInputPath(r, c)
                                                )}
                                                onChange={_.partial(
                                                    this.onValueChange,
                                                    r,
                                                    c
                                                )}
                                                style={inputStyle}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    },

    getUserInput: function() {
        return _.map(this.props.answers, _.clone);
    },

    onValueChange: function(row, column, eventOrValue) {
        var answers = _.map(this.props.answers, _.clone);

        // If this is coming from an "input", the last argument will be an
        // event. If it's coming from a SimpleKeypadInput, it'll be the value.
        answers[row][column] = eventOrValue.target
            ? eventOrValue.target.value
            : eventOrValue;

        this.props.onChange({
            answers: answers,
        });
        this.props.trackInteraction();
    },

    onHeaderChange: function(index, e) {
        var headers = this.props.headers.slice();
        headers[index] = e.content;
        this.props.onChange({
            headers: headers,
        });
    },

    simpleValidate: function(rubric) {
        return Table.validate(this.getUserInput(), rubric);
    },

    _handleFocus: function(inputPath) {
        this.props.onFocus(inputPath);
    },

    _handleBlur: function(inputPath) {
        this.props.onBlur(inputPath);
    },

    focus: function() {
        this.focusInputPath(getDefaultPath());
        return true;
    },

    focusInputPath: function(path) {
        var inputID = getRefForPath(path);
        var inputComponent = this.refs[inputID];
        if (this.props.apiOptions.customKeypad) {
            inputComponent.focus();
        } else if (this.props.apiOptions.staticRender) {
            inputComponent.focus();
        } else {
            ReactDOM.findDOMNode(inputComponent).focus();
        }
    },

    blurInputPath: function(path) {
        var inputID = getRefForPath(path);
        var inputComponent = this.refs[inputID];
        if (this.props.apiOptions.customKeypad) {
            inputComponent.blur();
        } else if (this.props.apiOptions.staticRender) {
            inputComponent.blur();
        } else {
            ReactDOM.findDOMNode(inputComponent).blur();
        }
    },

    getDOMNodeForPath: function(path) {
        var inputID = getRefForPath(path);
        return ReactDOM.findDOMNode(this.refs[inputID]);
    },

    getInputPaths: function() {
        var rows = this._getRows();
        var columns = this._getColumns();
        var inputPaths = [];
        _.times(rows, r => {
            _.times(columns, c => {
                var inputPath = getInputPath(r, c);
                inputPaths.push(inputPath);
            });
        });
        return inputPaths;
    },

    getGrammarTypeForPath: function(inputPath) {
        return "number";
    },

    setInputValue: function(path, newValue, cb) {
        // Extract row, column information
        var row = getRowFromPath(path);
        var column = getColumnFromPath(path);

        var answers = _.map(this.props.answers, _.clone);
        answers[row][column] = newValue;
        this.props.onChange(
            {
                answers: answers,
            },
            cb
        );
    },
});

_.extend(Table, {
    validate: function(state, rubric) {
        var filterNonEmpty = function(table) {
            return _.filter(table, function(row) {
                // Check if row has a cell that is nonempty
                return _.some(row, _.identity);
            });
        };
        var solution = filterNonEmpty(rubric.answers);
        var supplied = filterNonEmpty(state);
        var hasEmptyCell = _.some(supplied, function(row) {
            return _.some(row, function(cell) {
                return cell === "";
            });
        });
        if (hasEmptyCell || !supplied.length) {
            return {
                type: "invalid",
                message: null,
            };
        }
        if (supplied.length !== solution.length) {
            return {
                type: "points",
                earned: 0,
                total: 1,
                message: null,
            };
        }
        var createValidator = KhanAnswerTypes.number.createValidatorFunctional;
        var message = null;
        var allCorrect = _.every(solution, function(rowSolution) {
            var i;
            for (i = 0; i < supplied.length; i++) {
                var rowSupplied = supplied[i];
                var correct = _.every(rowSupplied, function(cellSupplied, i) {
                    var cellSolution = rowSolution[i];
                    var validator = createValidator(cellSolution, {
                        simplify: true,
                    });
                    var result = validator(cellSupplied);
                    if (result.message) {
                        message = result.message;
                    }
                    return result.correct;
                });
                if (correct) {
                    supplied.splice(i, 1);
                    return true;
                }
            }
            return false;
        });
        return {
            type: "points",
            earned: allCorrect ? 1 : 0,
            total: 1,
            message: message,
        };
    },
});

var propTransform = editorProps => {
    // Remove answers before passing to widget
    var rows = editorProps.answers.length;
    var columns = editorProps.answers[0].length;
    var blankAnswers = _.times(rows, function() {
        return Util.stringArrayOfSize(columns);
    });
    return _.extend({}, editorProps, {
        answers: blankAnswers,
    });
};

_module_.exports = {
    name: "table",
    displayName: "Table of values",
    accessible: true,
    widget: Table,
    transform: propTransform,
    hidden: true,
    isLintable: true,
};
export default _module_.exports;
