import _iframeContentRendererJsx from "./iframe-content-renderer.jsx";
import _componentsInlineIconJsx from "./components/inline-icon.jsx";
import { iconCircleArrowDown, iconCircleArrowUp, iconPlus, iconTrash } from "./icon-paths.js";
import _perseusApiJsx from "./perseus-api.jsx";
import _componentsDeviceFramerJsx from "./components/device-framer.jsx";
import _componentsInfoTipJsx from "./components/info-tip.jsx";
import Editor from "./editor.jsx";
import Renderer from "./renderer.jsx";
import _underscore from "underscore";
import _react from "react";

/* eslint-disable no-var, object-curly-spacing, react/jsx-closing-bracket-location, react/jsx-indent-props, react/prop-types, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/* Collection of classes for rendering the hint editor area,
 * hint editor boxes, and hint previews
 */

var React = _react;
var _ = _underscore;

var InfoTip = _componentsInfoTipJsx;
var DeviceFramer = _componentsDeviceFramerJsx;

const ApiOptions = _perseusApiJsx.Options;
const InlineIcon = _componentsInlineIconJsx;
const IframeContentRenderer = _iframeContentRendererJsx;

/* Renders a hint editor box
 *
 * This includes:
 *  ~ A "Hint" title
 *  ~ the textarea for the hint
 *  ~ the "remove this hint" box
 *  ~ the move hint up/down arrows
 */
export const HintEditor = createReactClass({
    propTypes: {
        apiOptions: ApiOptions.propTypes,
        className: PropTypes.string,
        imageUploader: PropTypes.func,
        showMoveButtons: PropTypes.bool,
        showRemoveButton: PropTypes.bool,
        showTitle: PropTypes.bool,
    },

    getDefaultProps: function() {
        return {
            content: "",
            replace: false,
            showMoveButtons: true,
            showTitle: true,
            showRemoveButton: true,
        };
    },

    handleChange: function(e) {
        this.props.onChange({replace: e.target.checked});
    },

    render: function() {
        return (
            <div className={"perseus-hint-editor " + this.props.className}>
                {this.props.showTitle && <div className="pod-title">Hint</div>}
                <Editor
                    ref="editor"
                    apiOptions={this.props.apiOptions}
                    widgets={this.props.widgets}
                    content={this.props.content}
                    images={this.props.images}
                    replace={this.props.replace}
                    placeholder="Type your hint here..."
                    imageUploader={this.props.imageUploader}
                    onChange={this.props.onChange}
                />
                <div className="hint-controls-container clearfix">
                    {this.props.showMoveButtons &&
                        <span className="reorder-hints">
                            <button
                                type="button"
                                className={this.props.isLast ? "hidden" : ""}
                                onClick={_.partial(this.props.onMove, 1)}
                            >
                                <InlineIcon {...iconCircleArrowDown} />
                            </button>{" "}
                            <button
                                type="button"
                                className={this.props.isFirst ? "hidden" : ""}
                                onClick={_.partial(this.props.onMove, -1)}
                            >
                                <InlineIcon {...iconCircleArrowUp} />
                            </button>{" "}
                            {this.props.isLast &&
                                <InfoTip>
                                    <p>
                                        The last hint is automatically bolded.
                                    </p>
                                </InfoTip>}
                        </span>}
                    <input
                        type="checkbox"
                        checked={this.props.replace}
                        onChange={this.handleChange}
                    />
                    Replace previous hint
                    {this.props.showRemoveButton &&
                        <button
                            type="button"
                            className="remove-hint simple-button orange"
                            onClick={this.props.onRemove}
                        >
                            <InlineIcon {...iconTrash} />
                            Remove this hint{" "}
                        </button>}
                </div>
            </div>
        );
    },

    focus: function() {
        this.refs.editor.focus();
    },

    getSaveWarnings: function() {
        return this.refs.editor.getSaveWarnings();
    },

    serialize: function(options) {
        return this.refs.editor.serialize(options);
    },
});

/* A single hint-row containing a hint editor and preview */
export const CombinedHintEditor = createReactClass({
    propTypes: {
        apiOptions: ApiOptions.propTypes,
        deviceType: PropTypes.string.isRequired,
        frameSource: PropTypes.string.isRequired,
        imageUploader: PropTypes.func,
        highlightLint: PropTypes.bool,
    },

    getDefaultProps: function() {
        return {
            highlightLint: false,
        };
    },

    updatePreview: function() {
        // TODO(aria): decide what to do with this
        //const shouldBold =
        //    this.props.isLast && !/\*\*/.test(this.props.hint.content);
        //this.refs.frame.sendNewData({
        //    type: "hint",
        //    data: {
        //        hint: this.props.hint,
        //        bold: shouldBold,
        //        pos: this.props.pos,
        //        apiOptions: this.props.apiOptions,
        //        linterContext: {
        //            contentType: "hint",
        //            highlightLint: this.props.highlightLint,
        //            paths: this.props.contentPaths,
        //        },
        //    },
        //});
    },

    componentDidMount: function() {
        this.updatePreview();
    },

    componentDidUpdate: function() {
        this.updatePreview();
    },

    render: function() {
        const isMobile =
            this.props.deviceType === "phone" ||
            this.props.deviceType === "tablet";
        return (
            <div
                className={
                    "perseus-combined-hint-editor " + "perseus-editor-row"
                }
            >
                <div className="perseus-editor-left-cell">
                    <HintEditor
                        ref="editor"
                        isFirst={this.props.isFirst}
                        isLast={this.props.isLast}
                        widgets={this.props.hint.widgets}
                        content={this.props.hint.content}
                        images={this.props.hint.images}
                        replace={this.props.hint.replace}
                        imageUploader={this.props.imageUploader}
                        onChange={this.props.onChange}
                        onRemove={this.props.onRemove}
                        onMove={this.props.onMove}
                        apiOptions={this.props.apiOptions}
                    />
                </div>
                <div className="perseus-editor-right-cell">
                    <Renderer
                        apiOptions={this.props.apiOptions}
                        {...this.props.hint}
                    />
                    {/*<DeviceFramer
                        deviceType={this.props.deviceType}
                        nochrome={true}
                    >
                        <IframeContentRenderer
                            ref="frame"
                            content={this.props.frameSource}
                            datasetKey="mobile"
                            datasetValue={isMobile}
                            seamless={true}
                        />
                    </DeviceFramer>*/}
                </div>
            </div>
        );
    },

    getSaveWarnings: function() {
        return this.refs.editor.getSaveWarnings();
    },

    serialize: function(options) {
        return this.refs.editor.serialize(options);
    },

    focus: function() {
        this.refs.editor.focus();
    },
});

/* The entire hints editing/preview area
 *
 * Includes:
 *  ~ All the hint edit boxes, move and remove buttons
 *  ~ All the hint previews
 *  ~ The "add a hint" button
 */
var CombinedHintsEditor = createReactClass({
    propTypes: {
        apiOptions: ApiOptions.propTypes,
        deviceType: PropTypes.string.isRequired,
        frameSource: PropTypes.string.isRequired,
        imageUploader: PropTypes.func,
        highlightLint: PropTypes.bool,
    },

    statics: {
        HintEditor,
    },

    getDefaultProps: function() {
        return {
            onChange: () => {},
            hints: [],
            highlightLint: false,
        };
    },

    render: function() {
        var hints = this.props.hints;
        var hintElems = _.map(
            hints,
            function(hint, i) {
                return (
                    <CombinedHintEditor
                        ref={"hintEditor" + i}
                        key={"hintEditor" + i}
                        isFirst={i === 0}
                        isLast={i + 1 === hints.length}
                        hint={hint}
                        pos={i}
                        imageUploader={this.props.imageUploader}
                        onChange={this.handleHintChange.bind(this, i)}
                        onRemove={this.handleHintRemove.bind(this, i)}
                        onMove={this.handleHintMove.bind(this, i)}
                        deviceType={this.props.deviceType}
                        apiOptions={this.props.apiOptions}
                        frameSource={this.props.frameSource}
                        highlightLint={this.props.highlightLint}
                    />
                );
            },
            this
        );

        /* eslint-disable max-len */
        return (
            <div className="perseus-hints-editor perseus-editor-table">
                {hintElems}
                <div className="perseus-editor-row">
                    <div className="add-hint-container perseus-editor-left-cell">
                        <button
                            type="button"
                            className="add-hint simple-button orange"
                            onClick={this.addHint}
                        >
                            <InlineIcon {...iconPlus} /> Add a hint
                        </button>
                    </div>
                </div>
            </div>
        );
        /* eslint-enable max-len */
    },

    handleHintChange: function(i, newProps, cb, silent) {
        // TODO(joel) - lens
        var hints = _.clone(this.props.hints);
        hints[i] = _.extend(
            {},
            this.serializeHint(i, {keepDeletedWidgets: true}),
            newProps
        );

        this.props.onChange({hints: hints}, cb, silent);
    },

    handleHintRemove: function(i) {
        var hints = _.clone(this.props.hints);
        hints.splice(i, 1);
        this.props.onChange({hints: hints});
    },

    handleHintMove: function(i, dir) {
        var hints = _.clone(this.props.hints);
        var hint = hints.splice(i, 1)[0];
        hints.splice(i + dir, 0, hint);
        this.props.onChange({hints: hints}, () => {
            this.refs["hintEditor" + (i + dir)].focus();
        });
    },

    addHint: function() {
        var hints = _.clone(this.props.hints).concat([{content: ""}]);
        this.props.onChange({hints: hints}, () => {
            var i = hints.length - 1;
            this.refs["hintEditor" + i].focus();
        });
    },

    getSaveWarnings: function() {
        return _.chain(this.props.hints)
            .map((hint, i) => {
                return _.map(
                    this.refs["hintEditor" + i].getSaveWarnings(),
                    issue => "Hint " + (i + 1) + ": " + issue
                );
            })
            .flatten(true)
            .value();
    },

    serialize: function(options) {
        return this.props.hints.map((hint, i) => {
            return this.serializeHint(i, options);
        });
    },

    serializeHint: function(index, options) {
        return this.refs["hintEditor" + index].serialize(options);
    },
});

export default  CombinedHintsEditor;
