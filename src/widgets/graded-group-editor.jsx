import { iconPlus, iconTrash } from "../icon-paths.js";
import _componentsInlineIconJsx from "../components/inline-icon.jsx";
import _componentsTextInputJsx from "../components/text-input.jsx";
import _editorJsx from "../editor.jsx";
import _mixinsChangeableJsx from "../mixins/changeable.jsx";
import _perseusApiJsx from "../perseus-api.jsx";
import { StyleSheet, css } from "aphrodite";
import _underscore from "underscore";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable react/forbid-prop-types, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

const React = _react;
const _ = _underscore;

const ApiOptions = _perseusApiJsx.Options;
const Changeable = _mixinsChangeableJsx;
const Editor = _editorJsx;
const TextInput = _componentsTextInputJsx;
const InlineIcon = _componentsInlineIconJsx;

const GradedGroupEditor = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
        title: PropTypes.string,
        content: PropTypes.string,
        widgets: PropTypes.object,
        images: PropTypes.object,
        apiOptions: ApiOptions.propTypes,
    },

    getDefaultProps: function() {
        return {
            title: "",
            content: "",
            widgets: {},
            images: {},
            hint: null,
        };
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    handleAddHint: function() {
        const hint = {content: ""};
        this.props.onChange({hint}, () => {
            this.refs["hint-editor"].focus();
        });
    },

    handleRemoveHint: function(i) {
        this.props.onChange({hint: null});
    },

    render: function() {
        return (
            <div className="perseus-group-editor">
                <div className="perseus-widget-row">
                    <label className={css(styles.title)}>
                        Title:{" "}
                        <TextInput
                            value={this.props.title}
                            className={css(styles.input)}
                            onChange={this.change("title")}
                        />
                    </label>
                </div>
                <Editor
                    ref="editor"
                    content={this.props.content}
                    widgets={this.props.widgets}
                    apiOptions={this.props.apiOptions}
                    images={this.props.images}
                    widgetEnabled={true}
                    immutableWidgets={false}
                    onChange={this.props.onChange}
                    warnNoPrompt={true}
                    warnNoWidgets={true}
                />
                {!this.props.hint &&
                    <button
                        type="button"
                        style={{marginTop: 10}}
                        className="add-hint simple-button orange"
                        onClick={this.handleAddHint}
                    >
                        <InlineIcon {...iconPlus} /> Add a hint
                    </button>}
                {this.props.hint &&
                    <div className="perseus-hint-editor">
                        <div className={css(styles.hintsTitle)}>Hint</div>
                        <Editor
                            ref="hint-editor"
                            content={
                                this.props.hint ? this.props.hint.content : ""
                            }
                            widgets={
                                this.props.hint ? this.props.hint.widgets : {}
                            }
                            apiOptions={this.props.apiOptions}
                            images={this.props.hint && this.props.hint.images}
                            widgetEnabled={true}
                            immutableWidgets={false}
                            onChange={props => {
                                // Copy all props over from the existing hint
                                // and then add new props.
                                this.change(
                                    "hint",
                                    Object.assign({}, this.props.hint, props)
                                );
                            }}
                        />
                        <button
                            type="button"
                            className="remove-hint simple-button orange"
                            onClick={this.handleRemoveHint}
                        >
                            <InlineIcon {...iconTrash} /> Remove this hint
                        </button>
                    </div>}
            </div>
        );
    },

    getSaveWarnings: function() {
        return this.refs.editor.getSaveWarnings();
    },

    serialize: function() {
        return {
            title: this.props.title,
            ...this.refs.editor.serialize(),
            hint:
                this.refs["hint-editor"] &&
                this.refs["hint-editor"].serialize(),
        };
    },
});

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },

    input: {
        fontSize: 18,
    },

    hintsTitle: {
        marginTop: 10,
        fontSize: "110%",
        fontWeight: "bold",
    },
});

_module_.exports = GradedGroupEditor;
export default _module_.exports;
