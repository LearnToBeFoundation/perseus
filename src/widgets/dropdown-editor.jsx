import _mixinsEditorJsonifyJsx from "../mixins/editor-jsonify.jsx";
import _componentsInlineIconJsx from "../components/inline-icon.jsx";
import _componentsInfoTipJsx from "../components/info-tip.jsx";
import { iconPlus, iconTrash } from "../icon-paths.js";
import _underscore from "underscore";
import _reactDom from "react-dom";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable comma-dangle, max-len, no-var, react/jsx-closing-bracket-location, react/jsx-indent-props, react/prop-types, react/sort-comp, semi, space-before-function-paren */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var React = _react;
var ReactDOM = _reactDom;
var _ = _underscore;

var InfoTip = _componentsInfoTipJsx;
var InlineIcon = _componentsInlineIconJsx;
var EditorJsonify = _mixinsEditorJsonifyJsx;

var DropdownEditor = createReactClass({
    propTypes: {
        choices: PropTypes.arrayOf(
            PropTypes.shape({
                content: PropTypes.string,
                correct: PropTypes.bool,
            })
        ),
        placeholder: PropTypes.string,
    },

    getDefaultProps: function() {
        return {
            placeholder: "",
            choices: [
                {
                    content: "",
                    correct: false,
                },
            ],
        };
    },

    render: function() {
        var dropdownGroupName = _.uniqueId("perseus_dropdown_");
        return (
            <div className="perseus-widget-dropdown">
                <div className="dropdown-info">
                    Dropdown
                    <InfoTip>
                        <p>
                            The drop down is useful for making inequalities in a
                            custom format. We normally use the symbols {"<"},{" "}
                            {">"}, ≤, ≥ (in that order) which you can copy into
                            the choices. When possible, use the "multiple
                            choice" answer type instead.
                        </p>
                    </InfoTip>
                </div>
                <div className="dropdown-placeholder">
                    <input
                        type="text"
                        placeholder="Placeholder value"
                        value={this.props.placeholder}
                        onChange={this.onPlaceholderChange}
                    />
                    <InfoTip>
                        <p>
                            This value will appear as the drop down default. It
                            should give the user some indication of the values
                            available in the drop down itself, e.g.,
                            Yes/No/Maybe.
                        </p>
                    </InfoTip>
                </div>
                <div className="clearfix" />
                <ul className="dropdown-choices">
                    {this.props.choices.map(function(choice, i) {
                        var checkedClass = choice.correct
                            ? "correct"
                            : "incorrect";

                        return (
                            <li key={"" + i}>
                                <div>
                                    <input
                                        ref={"radio" + i}
                                        type="radio"
                                        name={dropdownGroupName}
                                        checked={
                                            choice.correct ? "checked" : ""
                                        }
                                        onChange={this.onCorrectChange.bind(
                                            this,
                                            i
                                        )}
                                        value={i}
                                    />
                                    <input
                                        type="text"
                                        ref={"editor" + i}
                                        onChange={this.onContentChange.bind(
                                            this,
                                            i
                                        )}
                                        className={checkedClass}
                                        value={choice.content}
                                    />
                                    <a
                                        href="#"
                                        className="simple-button orange"
                                        onClick={this.removeChoice.bind(
                                            this,
                                            i
                                        )}
                                    >
                                        <span className="remove-choice">
                                            <InlineIcon {...iconTrash} />
                                        </span>
                                    </a>
                                </div>
                            </li>
                        );
                    }, this)}
                </ul>

                <div className="add-choice-container">
                    <a
                        href="#"
                        className="simple-button orange"
                        onClick={this.addChoice}
                    >
                        <InlineIcon {...iconPlus} /> Add a choice{" "}
                    </a>
                </div>
            </div>
        );
    },

    onPlaceholderChange: function(e) {
        var placeholder = e.target.value;
        this.props.onChange({placeholder: placeholder});
    },

    onCorrectChange: function(choiceIndex) {
        var choices = _.map(this.props.choices, function(choice, i) {
            return _.extend({}, choice, {
                correct: i === choiceIndex,
            });
        });
        this.props.onChange({choices: choices});
    },

    onContentChange: function(choiceIndex, e) {
        var choices = this.props.choices.slice();
        var choice = _.clone(choices[choiceIndex]);
        choice.content = e.target.value;
        choices[choiceIndex] = choice;
        this.props.onChange({choices: choices});
    },

    addChoice: function(e) {
        e.preventDefault();

        var choices = this.props.choices;
        var blankChoice = {content: "", correct: false};
        this.props.onChange(
            {
                choices: choices.concat([blankChoice]),
            },
            this.focus.bind(this, choices.length)
        );
    },

    removeChoice: function(choiceIndex, e) {
        e.preventDefault();
        var choices = _.clone(this.props.choices);
        choices.splice(choiceIndex, 1);
        this.props.onChange({
            choices: choices,
        });
    },

    focus: function(i) {
        ReactDOM.findDOMNode(this.refs["editor" + i]).focus();
        return true;
    },

    serialize() {
        return EditorJsonify.serialize.call(this);
    },
});

_module_.exports = DropdownEditor;
export default _module_.exports;
