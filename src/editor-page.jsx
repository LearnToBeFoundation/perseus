import _componentsHudJsx from "./components/hud.jsx";
import _componentsViewportResizerJsx from "./components/viewport-resizer.jsx";
import _jsonEditorJsx from "./json-editor.jsx";
import _itemEditorJsx from "./item-editor.jsx";
import _utilFixPassageRefsJsx from "./util/fix-passage-refs.jsx";
import _hintEditorJsx from "./hint-editor.jsx";
import _mixinsApiOptionsPropsJs from "./mixins/api-options-props.js";
import _perseusApiJsx from "./perseus-api.jsx";
import _underscore from "underscore";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable no-var, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var React = _react;
var _ = _underscore;

const ApiClassNames = _perseusApiJsx.ClassNames;
const ApiOptionsProps = _mixinsApiOptionsPropsJs;
var CombinedHintsEditor = _hintEditorJsx;
var FixPassageRefs = _utilFixPassageRefsJsx;
var ItemEditor = _itemEditorJsx;
var JsonEditor = _jsonEditorJsx;
var ViewportResizer = _componentsViewportResizerJsx;
const HUD = _componentsHudJsx;

var EditorPage = createReactClass({
    propTypes: {
        ...ApiOptionsProps.propTypes,

        answerArea: PropTypes.any, // related to the question

        developerMode: PropTypes.bool,

        // Source HTML for the iframe to render
        frameSource: PropTypes.string.isRequired,

        hints: PropTypes.any, // related to the question

        // A function which takes a file object (guaranteed to be an image) and
        // a callback, then calls the callback with the url where the image
        // will be hosted. Image drag and drop is disabled when imageUploader
        // is null.
        imageUploader: PropTypes.func,

        // Part of the question
        itemDataVersion: PropTypes.shape({
            major: PropTypes.number,
            minor: PropTypes.number,
        }),

        // Whether the question is displaying as JSON or if it is
        // showing the editor itself with the rendering
        jsonMode: PropTypes.bool,

        // A function which is called with the new JSON blob of content
        onChange: PropTypes.func,

        onPreviewDeviceChange: PropTypes.func,
        previewDevice: PropTypes.string,

        // Initial value of the question being edited
        question: PropTypes.any,
    },

    getDefaultProps: function() {
        return {
            developerMode: false,
            jsonMode: false,
            onChange: () => {},
        };
    },

    getInitialState: function() {
        return {
            json: _.pick(
                this.props,
                "question",
                "answerArea",
                "hints",
                "itemDataVersion"
            ),
            gradeMessage: "",
            wasAnswered: false,
            highlightLint: true,
        };
    },

    handleCheckAnswer: function() {
        var result = this.scorePreview();
        this.setState({
            gradeMessage: result.message,
            wasAnswered: result.correct,
        });
    },

    toggleJsonMode: function() {
        this.setState(
            {
                json: this.serialize({keepDeletedWidgets: true}),
            },
            function() {
                this.props.onChange({
                    jsonMode: !this.props.jsonMode,
                });
            }
        );
    },

    componentDidMount: function() {
        this.rendererMountNode = document.createElement("div");
        this.updateRenderer();
    },

    componentDidUpdate: function() {
        this.updateRenderer();
    },

    updateRenderer: function() {
        // Some widgets (namely the image widget) like to call onChange before
        // anything has actually been mounted, which causes problems here. We
        // just ensure don't update until we've mounted
        const hasEditor = !this.props.developerMode || !this.props.jsonMode;
        if (!this.isMounted() || !hasEditor) {
            return;
        }

        const touch =
            this.props.previewDevice === "phone" ||
            this.props.previewDevice === "tablet";
        const deviceBasedApiOptions = Object.assign(this.getApiOptions(), {
            customKeypad: touch,
            isMobile: touch,
        });

        this.refs.itemEditor.triggerPreviewUpdate({
            type: "question",
            data: Object.assign({
                item: this.serialize(),
                apiOptions: deviceBasedApiOptions,
                initialHintsVisible: 0,
                device: this.props.previewDevice,
                linterContext: {
                    contentType: "exercise",
                    highlightLint: this.state.highlightLint,
                    paths: this.props.contentPaths,
                },
                reviewMode: true,
                legacyPerseusLint: this.refs.itemEditor.getSaveWarnings(),
            },
                _.pick(this.props,
                    "workAreaSelector",
                    "solutionAreaSelector",
                    "hintsAreaSelector",
                    "problemNum"
                )
            ),
        });
    },

    getApiOptions() {
        return ApiOptionsProps.getApiOptions.call(this);
    },

    handleChange: function(toChange, cb, silent) {
        var newProps = _.pick(this.props, "question", "hints", "answerArea");
        _.extend(newProps, toChange);
        this.props.onChange(newProps, cb, silent);
    },

    changeJSON: function(newJson) {
        this.setState({
            json: newJson,
        });
        this.props.onChange(newJson);
    },

    _fixPassageRefs: function() {
        var itemData = this.serialize();
        var newItemData = FixPassageRefs(itemData);
        this.setState({
            json: newItemData,
        });
        this.props.onChange(newItemData);
    },

    scorePreview: function() {
        if (this.renderer) {
            return this.renderer.scoreInput();
        } else {
            return null;
        }
    },

    render: function() {
        let className = "framework-perseus";

        const touch =
            this.props.previewDevice === "phone" ||
            this.props.previewDevice === "tablet";
        const deviceBasedApiOptions = Object.assign(this.getApiOptions(), {
            customKeypad: touch,
            isMobile: touch,
        });

        if (deviceBasedApiOptions.isMobile) {
            className += " " + ApiClassNames.MOBILE;
        }

        return (
            <div id="perseus" className={className}>
                <div style={{marginBottom: 10}}>
                    {this.props.developerMode &&
                        <span>
                            <label>
                                {" "}Developer JSON Mode:{" "}
                                <input
                                    type="checkbox"
                                    checked={this.props.jsonMode}
                                    onChange={this.toggleJsonMode}
                                />
                            </label>{" "}
                            <button
                                type="button"
                                onClick={this._fixPassageRefs}
                            >
                                Fix passage-refs
                            </button>{" "}
                        </span>}

                    {!this.props.jsonMode &&
                        <ViewportResizer
                            deviceType={this.props.previewDevice}
                            onViewportSizeChanged={
                                this.props.onPreviewDeviceChange
                            }
                        />}

                    {!this.props.jsonMode &&
                        <HUD
                            message="Style warnings"
                            enabled={this.state.highlightLint}
                            onClick={() => {
                                this.setState({
                                    highlightLint: !this.state.highlightLint,
                                });
                            }}
                        />}
                </div>

                {this.props.developerMode &&
                    this.props.jsonMode &&
                    <div>
                        <JsonEditor
                            multiLine={true}
                            value={this.state.json}
                            onChange={this.changeJSON}
                        />
                    </div>}

                {(!this.props.developerMode || !this.props.jsonMode) &&
                    <ItemEditor
                        ref="itemEditor"
                        rendererOnly={this.props.jsonMode}
                        question={this.props.question}
                        answerArea={this.props.answerArea}
                        imageUploader={this.props.imageUploader}
                        onChange={this.handleChange}
                        wasAnswered={this.state.wasAnswered}
                        gradeMessage={this.state.gradeMessage}
                        onCheckAnswer={this.handleCheckAnswer}
                        deviceType={this.props.previewDevice}
                        apiOptions={deviceBasedApiOptions}
                        frameSource={this.props.frameSource}
                    />}

                {(!this.props.developerMode || !this.props.jsonMode) &&
                    <CombinedHintsEditor
                        ref="hintsEditor"
                        hints={this.props.hints}
                        imageUploader={this.props.imageUploader}
                        onChange={this.handleChange}
                        deviceType={this.props.previewDevice}
                        apiOptions={deviceBasedApiOptions}
                        frameSource={this.props.frameSource}
                        highlightLint={this.state.highlightLint}
                    />}
            </div>
        );
    },

    getSaveWarnings: function() {
        var issues1 = this.refs.itemEditor.getSaveWarnings();
        var issues2 = this.refs.hintsEditor.getSaveWarnings();
        return issues1.concat(issues2);
    },

    serialize: function(options) {
        if (this.props.jsonMode) {
            return this.state.json;
        } else {
            return _.extend(this.refs.itemEditor.serialize(options), {
                hints: this.refs.hintsEditor.serialize(options),
            });
        }
    },
});

_module_.exports = EditorPage;
export default _module_.exports;
