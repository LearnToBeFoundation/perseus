import _baseEnhancedRadioJsx from "./base-enhanced-radio.jsx";
import _editorJsx from "../../editor.jsx";
import _componentsInfoTipJsx from "../../components/info-tip.jsx";
import _componentsInlineIconJsx from "../../components/inline-icon.jsx";
import { iconTrash, iconPlus } from "../../icon-paths.js";
import _mixinsChangeableJsx from "../../mixins/changeable.jsx";
import _mixinsEditorJsonifyJsx from "../../mixins/editor-jsonify.jsx";
import _perseusApiJsx from "../../perseus-api.jsx";
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
const Editor = _editorJsx;
const InfoTip = _componentsInfoTipJsx;
const InlineIcon = _componentsInlineIconJsx;
const Changeable = _mixinsChangeableJsx;
const EditorJsonify = _mixinsEditorJsonifyJsx;

const ChoiceEditor = createReactClass({
    propTypes: {
        choice: PropTypes.shape({
            content: PropTypes.string,
            widgets: PropTypes.object,
            images: PropTypes.object,
            clue: PropTypes.string,
            correct: PropTypes.bool,
        }),
        apiOptions: PropTypes.object,
        onContentChange: PropTypes.func,
        onClueChange: PropTypes.func,
        onCorrectChange: PropTypes.func,
        onDelete: PropTypes.func,
        showDelete: PropTypes.bool,
    },

    render: function() {
        const checkedClass = this.props.choice.correct ? "correct" : "incorrect";
        const placeholder = "Type a choice here...";

        return (
            <div className="perseus-widget-enhanced-radio-choice-editor">
                <div className="perseus-widget-enhanced-radio-choice-container">
                    <label>
                        <input
                            type="checkbox"
                            checked={this.props.choice.correct}
                            onChange={(e) => this.props.onCorrectChange(e.target.checked)}
                        />
                        <span className={`choice-correctness ${checkedClass}`}>
                            {this.props.choice.correct ? "Correct" : "Incorrect"}
                        </span>
                    </label>
                    
                    {this.props.showDelete && (
                        <button
                            type="button"
                            className="simple-button orange delete-choice"
                            onClick={this.props.onDelete}
                            title="Delete choice"
                        >
                            <InlineIcon {...iconTrash} />
                        </button>
                    )}
                </div>

                <Editor
                    ref="content-editor"
                    apiOptions={this.props.apiOptions}
                    content={this.props.choice.content || ""}
                    widgets={this.props.choice.widgets || {}}
                    images={this.props.choice.images || {}}
                    widgetEnabled={true}
                    placeholder={placeholder}
                    onChange={this.props.onContentChange}
                />

                <div className="perseus-widget-enhanced-radio-clue-container">
                    <label>Explanation (optional):</label>
                    <Editor
                        ref="clue-editor"
                        apiOptions={this.props.apiOptions}
                        content={this.props.choice.clue || ""}
                        widgetEnabled={true}
                        placeholder="Why is this choice correct/incorrect?"
                        onChange={this.props.onClueChange}
                    />
                </div>
            </div>
        );
    },
});

const EnhancedRadioEditor = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
        choices: PropTypes.arrayOf(PropTypes.shape({
            content: PropTypes.string,
            widgets: PropTypes.object,
            images: PropTypes.object,
            clue: PropTypes.string,
            correct: PropTypes.bool,
        })),
        layout: PropTypes.oneOf(['vertical', 'horizontal', 'grid-2x2']),
        multipleSelect: PropTypes.bool,
        randomize: PropTypes.bool,
        apiOptions: PropTypes.object,
    },

    getDefaultProps: function() {
        return {
            choices: [
                {content: "", correct: false},
                {content: "", correct: false},
            ],
            layout: 'vertical',
            multipleSelect: false,
            randomize: false,
        };
    },

    render: function() {
        const numCorrect = _.reduce(
            this.props.choices,
            function(memo, choice) {
                return choice.correct ? memo + 1 : memo;
            },
            0
        );

        return (
            <div className="perseus-widget-enhanced-radio-editor">
                <div className="perseus-widget-enhanced-radio-options">
                    <div className="perseus-widget-row">
                        <label>
                            Layout:
                            <select
                                value={this.props.layout}
                                onChange={(e) => this.props.onChange({layout: e.target.value})}
                            >
                                <option value="vertical">Vertical</option>
                                <option value="horizontal">Horizontal</option>
                                <option value="grid-2x2">2x2 Grid</option>
                            </select>
                        </label>
                    </div>

                    <div className="perseus-widget-row">
                        <label>
                            <input
                                type="checkbox"
                                checked={this.props.multipleSelect}
                                onChange={(e) => this.props.onChange({multipleSelect: e.target.checked})}
                            />
                            Allow multiple selections
                        </label>
                        <InfoTip>
                            <p>
                                When enabled, users can select multiple choices.
                                Make sure to mark all correct choices.
                            </p>
                        </InfoTip>
                    </div>

                    <div className="perseus-widget-row">
                        <label>
                            <input
                                type="checkbox"
                                checked={this.props.randomize}
                                onChange={(e) => this.props.onChange({randomize: e.target.checked})}
                            />
                            Randomize answer order
                        </label>
                    </div>
                </div>

                <BaseEnhancedRadio
                    ref="baseEnhancedRadio"
                    layout={this.props.layout}
                    multipleSelect={this.props.multipleSelect}
                    numCorrect={numCorrect}
                    editMode={true}
                    apiOptions={this.props.apiOptions}
                    choices={this.props.choices.map((choice, i) => {
                        return {
                            content: (
                                <ChoiceEditor
                                    ref={`choice-editor${i}`}
                                    apiOptions={this.props.apiOptions}
                                    choice={choice}
                                    onContentChange={newProps => {
                                        this.onContentChange(i, newProps);
                                    }}
                                    onClueChange={newProps => {
                                        this.onClueChange(i, newProps);
                                    }}
                                    onCorrectChange={correct => {
                                        this.onCorrectChange(i, correct);
                                    }}
                                    onDelete={() => this.onDelete(i)}
                                    showDelete={this.props.choices.length >= 2}
                                />
                            ),
                            checked: choice.correct,
                        };
                    })}
                />

                <div className="perseus-widget-enhanced-radio-add-choice">
                    <button
                        type="button"
                        className="simple-button orange"
                        onClick={this.addChoice}
                    >
                        <InlineIcon {...iconPlus} /> Add a choice
                    </button>
                </div>
            </div>
        );
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    onContentChange: function(choiceIndex, newProps) {
        console.log('🔄 Enhanced Radio Editor - onContentChange START:', {
            choiceIndex,
            'newProps.content': newProps.content,
            'newProps.widgets': newProps.widgets,
            'newProps.images': newProps.images,
            'oldChoice.content': this.props.choices[choiceIndex]?.content,
            'oldChoice.widgets': this.props.choices[choiceIndex]?.widgets,
            widgetKeysOld: Object.keys(this.props.choices[choiceIndex]?.widgets || {}),
            widgetKeysNew: Object.keys(newProps.widgets || {}),
            hasWidgetsOld: Object.keys(this.props.choices[choiceIndex]?.widgets || {}).length > 0,
            hasWidgetsNew: Object.keys(newProps.widgets || {}).length > 0
        });

        const choices = this.props.choices.slice();
        const oldChoice = choices[choiceIndex];
        const newChoice = _.extend({}, oldChoice, {
            // Only update content if it's not undefined
            content: newProps.content !== undefined ? newProps.content : oldChoice.content,
            // Only update widgets if it's not undefined
            widgets: newProps.widgets !== undefined ? newProps.widgets : oldChoice.widgets,
            // Only update images if it's not undefined
            images: newProps.images !== undefined ? newProps.images : oldChoice.images,
        });
        choices[choiceIndex] = newChoice;

        console.log('🔄 Enhanced Radio Editor - onContentChange END:', {
            'oldChoice': oldChoice,
            'newChoice': newChoice,
            'contentChanged': oldChoice.content !== newChoice.content,
            'widgetsChanged': JSON.stringify(oldChoice.widgets) !== JSON.stringify(newChoice.widgets),
            'allChoices': choices.map(c => ({content: c.content, widgetKeys: Object.keys(c.widgets || {})}))
        });

        this.props.onChange({choices: choices});
    },

    onClueChange: function(choiceIndex, newProps) {
        const choices = this.props.choices.slice();
        choices[choiceIndex] = _.extend({}, choices[choiceIndex], {
            clue: newProps.content,
        });
        if (newProps.content === "") {
            delete choices[choiceIndex].clue;
        }
        this.props.onChange({choices: choices});
    },

    onCorrectChange: function(choiceIndex, correct) {
        const choices = this.props.choices.slice();
        choices[choiceIndex] = _.extend({}, choices[choiceIndex], {
            correct: correct,
        });
        this.props.onChange({choices: choices});
    },

    onDelete: function(choiceIndex) {
        const choices = this.props.choices.slice();
        choices.splice(choiceIndex, 1);
        this.props.onChange({choices: choices});
    },

    addChoice: function() {
        const choices = this.props.choices.slice();
        choices.push({
            content: "",
            correct: false,
        });
        this.props.onChange({choices: choices});
    },

    getSaveWarnings: function() {
        const issues = [];
        
        if (this.props.choices.length < 2) {
            issues.push("You need at least 2 choices");
        }

        const numCorrect = _.reduce(
            this.props.choices,
            (memo, choice) => choice.correct ? memo + 1 : memo,
            0
        );

        if (numCorrect === 0) {
            issues.push("You need to select at least one correct answer");
        }

        return issues;
    },

    serialize: function() {
        return EditorJsonify.serialize.call(this);
    },
});

_module_.exports = EnhancedRadioEditor;
export default _module_.exports;
