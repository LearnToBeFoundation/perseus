import "./lib/perseus-admin.css";
import _iframeContentRendererJsx from "./iframe-content-renderer.jsx";
import _versionJson from "./version.json";
import _componentsDeviceFramerJsx from "./components/device-framer.jsx";
import _itemExtrasEditorJsx from "./item-extras-editor.jsx";
import Editor from "./editor.jsx";
import Renderer from "./renderer.jsx";
import _perseusApiJsx from "./perseus-api.jsx";
import _underscore from "underscore";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable no-var, object-curly-spacing, react/prop-types, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var React = _react;
var _ = _underscore;

var ApiOptions = _perseusApiJsx.Options;
var ItemExtrasEditor = _itemExtrasEditorJsx;
var DeviceFramer = _componentsDeviceFramerJsx;
var ITEM_DATA_VERSION = _versionJson.itemDataVersion;
const IframeContentRenderer = _iframeContentRendererJsx;

var ItemEditor = createReactClass({
    propTypes: {
        apiOptions: ApiOptions.propTypes,
        deviceType: PropTypes.string,
        frameSource: PropTypes.string.isRequired,
        gradeMessage: PropTypes.string,
        imageUploader: PropTypes.func,
        wasAnswered: PropTypes.bool,
    },

    getDefaultProps: function() {
        return {
            onChange: () => {},
            question: {},
            answerArea: {},
        };
    },

    // Notify the parent that the question or answer area has been updated.
    updateProps: function(newProps, cb, silent) {
        var props = _.pick(this.props, "question", "answerArea");

      this.props.onChange(Object.assign({}, props, newProps), cb, silent);
    },

    render: function() {
        const isMobile =
            this.props.deviceType === "phone" ||
            this.props.deviceType === "tablet";
        return (
            <div className="perseus-editor-table">
                <div className="perseus-editor-row perseus-question-container">
                    <div className="perseus-editor-left-cell">
                        <div className="pod-title">Question</div>
                        <Editor
                            ref="questionEditor"
                            placeholder="Type your question here..."
                            className="perseus-question-editor"
                            imageUploader={this.props.imageUploader}
                            onChange={this.handleEditorChange}
                            apiOptions={this.props.apiOptions}
                            showWordCount={true}
                            {...this.props.question}
                        />
                    </div>

                    <div className="perseus-editor-right-cell">
                        <div id="problemarea">
                            <Renderer
                                ref="questionRenderer"
                                apiOptions={this.props.apiOptions}
                                {...this.props.question}
                            />
                            {/*<DeviceFramer
                                deviceType={this.props.deviceType}
                                nochrome={true}
                            >
                                <IframeContentRenderer
                                    ref="frame"
                                    key={this.props.deviceType}
                                    content={this.props.frameSource}
                                    datasetKey="mobile"
                                    datasetValue={isMobile}
                                    seamless={true}
                                />
                            </DeviceFramer>*/}
                            <div
                                id="hintsarea"
                                className="hintsarea"
                                style={{display: "none"}}
                            />
                        </div>
                    </div>
                </div>

                <div className="perseus-editor-row perseus-answer-container">
                    <div className="perseus-editor-left-cell">
                        <div className="pod-title">Question extras</div>
                        <ItemExtrasEditor
                            ref="itemExtrasEditor"
                            onChange={this.handleItemExtrasChange}
                            {...this.props.answerArea}
                        />
                    </div>

                    <div className="perseus-editor-right-cell">
                        <div id="answer_area" />
                    </div>
                </div>
            </div>
        );
    },

    triggerPreviewUpdate: function(newData) {
      // TODO(aria): remove this?
      //this.refs.frame.sendNewData(newData);
    },

    handleEditorChange: function(newProps, cb, silent) {
        var question = _.extend({}, this.props.question, newProps);
        this.updateProps({question}, cb, silent);
    },

    handleItemExtrasChange: function(newProps, cb, silent) {
        var answerArea = _.extend({}, this.props.answerArea, newProps);
        this.updateProps({answerArea}, cb, silent);
    },

    getSaveWarnings: function() {
        return this.refs.questionEditor.getSaveWarnings();
    },

    serialize: function(options) {
        return {
            question: this.refs.questionEditor.serialize(options),
            answerArea: this.refs.itemExtrasEditor.serialize(options),
            itemDataVersion: ITEM_DATA_VERSION,
        };
    },

    focus: function() {
        this.questionEditor.focus();
    },
});

_module_.exports = ItemEditor;
export default _module_.exports;
