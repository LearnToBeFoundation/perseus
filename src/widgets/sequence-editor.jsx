import _componentsInlineIconJsx from "../components/inline-icon.jsx";
import { iconCircleArrowDown, iconCircleArrowUp, iconPlus, iconTrash } from "../icon-paths.js";
import _editorJsx from "../editor.jsx";
import _perseusApiJsx from "../perseus-api.jsx";
import _underscore from "underscore";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable comma-dangle, no-alert, no-var, react/jsx-closing-bracket-location, react/jsx-indent-props, react/prop-types, react/sort-comp, space-infix-ops */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

const React = _react;
const _ = _underscore;

const ApiOptions = _perseusApiJsx.Options;
const Editor = _editorJsx;
const InlineIcon = _componentsInlineIconJsx;

var StepControlButton = createReactClass({
    render: function() {
        return (
            <a
                href="#"
                className={
                    "step-control-button " +
                    "simple-button " +
                    "simple-button--small " +
                    "orange"
                }
                onClick={e => {
                    e.preventDefault();
                    this.props.onClick();
                }}
            >
                <InlineIcon {...this.props.icon} />
            </a>
        );
    },
});

const SequenceEditor = createReactClass({
    propTypes: {
        json: PropTypes.arrayOf(
            PropTypes.shape({
                content: PropTypes.string,
                widgets: PropTypes.object,
                images: PropTypes.object,
            })
        ),
        apiOptions: ApiOptions.propTypes,
        onChange: PropTypes.func.isRequired,
    },

    getDefaultProps: function() {
        return {
            json: [
                {
                    content: "",
                    widgets: {},
                    images: {},
                },
            ],
        };
    },

    render: function() {
        return (
            <div className="perseus-sequence-editor">
                {_.map(this.props.json, (json, i) => {
                    return (
                        <div key={i}>
                            Step {i + 1}
                            <div
                                style={{
                                    display: "inline-block",
                                    float: "right",
                                }}
                            >
                                {i + 1 < this.props.json.length &&
                                    <StepControlButton
                                        icon={iconCircleArrowDown}
                                        onClick={() => {
                                            this._handleMoveStepLater(i);
                                        }}
                                    />}
                                {i > 0 &&
                                    <StepControlButton
                                        icon={iconCircleArrowUp}
                                        onClick={() => {
                                            this._handleMoveStepEarlier(i);
                                        }}
                                    />}
                                <StepControlButton
                                    icon={iconTrash}
                                    onClick={() => {
                                        var msg =
                                            "Are you sure you " +
                                            "want to remove step " +
                                            (i + 1) +
                                            "?";
                                        if (confirm(msg)) {
                                            this._handleRemoveStep(i);
                                        }
                                    }}
                                />
                                <StepControlButton
                                    icon={iconPlus}
                                    onClick={() => {
                                        this._handleAddStepAfter(i);
                                    }}
                                />
                            </div>
                            <Editor
                                ref={"editor" + i}
                                apiOptions={this.props.apiOptions}
                                content={json.content}
                                widgets={json.widgets}
                                images={json.images}
                                widgetEnabled={true}
                                immutableWidgets={false}
                                onChange={_.partial(
                                    this._handleEditorChange,
                                    i
                                )}
                            />
                        </div>
                    );
                })}
            </div>
        );
    },

    _handleEditorChange: function(i, newProps) {
        var steps = _.clone(this.props.json);
        steps[i] = _.extend({}, steps[i], newProps);
        this.props.onChange({json: steps});
    },

    serialize: function() {
        return {
            json: _.times(this.props.json.length, i => {
                return this.refs["editor" + i].serialize();
            }),
        };
    },

    _handleMoveStepEarlier: function(i) {
        if (i === 0) {
            return;
        }
        var steps = _.clone(this.props.json);
        var step = steps[i];
        steps.splice(i, 1);
        steps.splice(i - 1, 0, step);
        this.props.onChange({
            json: steps,
        });
    },

    _handleMoveStepLater: function(i) {
        var steps = _.clone(this.props.json);
        if (i + 1 === steps.length) {
            return;
        }
        var step = steps[i];
        steps.splice(i, 1);
        steps.splice(i + 1, 0, step);
        this.props.onChange({
            json: steps,
        });
    },

    _handleAddStepAfter: function(i) {
        // We do a full serialization here because we
        // might be copying widgets:
        var steps = _.clone(this.props.json);
        // Here we do magic to allow you to copy-paste
        // things from the previous section into the new
        // section while preserving widgets.
        // To enable this, we preserve the widgets
        // object for the new section, but wipe out
        // the content.
        var newStep =
            i >= 0
                ? {
                    widgets: steps[i].widgets,
                }
                : {};
        steps.splice(i + 1, 0, newStep);
        this.props.onChange({
            json: steps,
        });
    },

    _handleRemoveStep: function(i) {
        var steps = _.clone(this.props.json);
        steps.splice(i, 1);
        this.props.onChange({
            json: steps,
        });
    },
});

_module_.exports = SequenceEditor;
export default _module_.exports;
