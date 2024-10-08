import _componentsHudJsx from "./components/hud.jsx";
import _iframeContentRendererJsx from "./iframe-content-renderer.jsx";
import _componentsDeviceFramerJsx from "./components/device-framer.jsx";
import _jsonEditorJsx from "./json-editor.jsx";
import _componentsInlineIconJsx from "./components/inline-icon.jsx";
import { iconCircleArrowDown, iconCircleArrowUp, iconPlus, iconTrash } from "./icon-paths.js";
import _editorJsx from "./editor.jsx";
import _perseusApiJsx from "./perseus-api.jsx";
import _underscore from "underscore";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;

/**
 * An article editor. Articles are long-form pieces of content, composed of
 * multiple (Renderer) sections concatenated together.
 */

const React = _react;
const _ = _underscore;

const ApiOptions = _perseusApiJsx.Options;
const Editor = _editorJsx;
const InlineIcon = _componentsInlineIconJsx;
const JsonEditor = _jsonEditorJsx;
const DeviceFramer = _componentsDeviceFramerJsx;
const IframeContentRenderer = _iframeContentRendererJsx;
const HUD = _componentsHudJsx;

const rendererProps = PropTypes.shape({
    content: PropTypes.string,
    widgets: PropTypes.object,
    images: PropTypes.object,
});

const SectionControlButton = createReactClass({
    propTypes: {
        icon: PropTypes.shape(InlineIcon.propTypes).isRequired,
        onClick: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
    },
    render: function() {
        const {icon, onClick, title} = this.props;
        return (
            <a
                href="#"
                className={
                    "section-control-button " +
                    "simple-button " +
                    "simple-button--small " +
                    "orange"
                }
                onClick={e => {
                    e.preventDefault();
                    onClick();
                }}
                title={title}
            >
                <InlineIcon {...icon} />
            </a>
        );
    },
});

const ArticleEditor = createReactClass({
    propTypes: {
        apiOptions: PropTypes.shape({}),
        contentPaths: PropTypes.arrayOf(PropTypes.string),
        frameSource: PropTypes.string.isRequired,
        imageUploader: PropTypes.func,
        json: PropTypes.oneOfType([
            rendererProps,
            PropTypes.arrayOf(rendererProps),
        ]),
        mode: PropTypes.oneOf(["diff", "edit", "json", "preview"]),
        onChange: PropTypes.func.isRequired,
        screen: PropTypes.oneOf(["phone", "tablet", "desktop"]),
        sectionImageUploadGenerator: PropTypes.func,
        useNewStyles: PropTypes.bool,
    },

    getDefaultProps: function() {
        return {
            contentPaths: [],
            json: [{}],
            mode: "edit",
            screen: "desktop",
            sectionImageUploadGenerator: () => <span />,
            useNewStyles: false,
        };
    },

    getInitialState: function() {
        return {
            highlightLint: true,
        };
    },

    componentDidMount: function() {
        this._updatePreviewFrames();
    },

    componentDidUpdate: function() {
        this._updatePreviewFrames();
    },

    _updatePreviewFrames: function() {
        if (this.props.mode === "preview") {
            this.refs["frame-all"].sendNewData({
                type: "article-all",
                data: this._sections().map((section, i) => {
                    return this._apiOptionsForSection(section, i);
                }),
            });
        } else if (this.props.mode === "edit") {
            this._sections().forEach((section, i) => {
                this.refs["frame-" + i].sendNewData({
                    type: "article",
                    data: this._apiOptionsForSection(section, i),
                });
            });
        }
    },

    _apiOptionsForSection: function(section, sectionIndex) {
        const editor = this.refs[`editor${sectionIndex}`];
        return {
            apiOptions: {
                ...ApiOptions.defaults,
                ...this.props.apiOptions,

                // Alignment options are always available in article
                // editors
                showAlignmentOptions: true,
                isArticle: true,
            },
            json: section,
            useNewStyles: this.props.useNewStyles,
            linterContext: {
                contentType: "article",
                highlightLint: this.state.highlightLint,
                paths: this.props.contentPaths,
            },
            legacyPerseusLint: editor ? editor.getSaveWarnings() : [],
        };
    },

    _sections: function() {
        return _.isArray(this.props.json) ? this.props.json : [this.props.json];
    },

    _renderEditor: function() {
        const {imageUploader, sectionImageUploadGenerator} = this.props;

        const apiOptions = {
            ...ApiOptions.defaults,
            ...this.props.apiOptions,

            // Alignment options are always available in article editors
            showAlignmentOptions: true,
            isArticle: true,
        };

        const sections = this._sections();

        /* eslint-disable max-len */
        return (
            <div className="perseus-editor-table">
                {sections.map((section, i) => {
                    return [
                        <div className="perseus-editor-row">
                            <div className="perseus-editor-left-cell">
                                <div className="pod-title">
                                    Section {i + 1}
                                    <div
                                        style={{
                                            display: "inline-block",
                                            float: "right",
                                        }}
                                    >
                                        {sectionImageUploadGenerator(i)}
                                        <SectionControlButton
                                            icon={iconPlus}
                                            onClick={() => {
                                                this._handleAddSectionAfter(i);
                                            }}
                                            title={
                                                "Add a new section after this one"
                                            }
                                        />
                                        {i + 1 < sections.length &&
                                            <SectionControlButton
                                                icon={iconCircleArrowDown}
                                                onClick={() => {
                                                    this._handleMoveSectionLater(
                                                        i
                                                    );
                                                }}
                                                title="Move this section down"
                                            />}
                                        {i > 0 &&
                                            <SectionControlButton
                                                icon={iconCircleArrowUp}
                                                onClick={() => {
                                                    this._handleMoveSectionEarlier(
                                                        i
                                                    );
                                                }}
                                                title="Move this section up"
                                            />}
                                        <SectionControlButton
                                            icon={iconTrash}
                                            onClick={() => {
                                                const msg =
                                                    "Are you sure you " +
                                                    "want to delete section " +
                                                    (i + 1) +
                                                    "?";
                                                /* eslint-disable no-alert */
                                                if (confirm(msg)) {
                                                    this._handleRemoveSection(
                                                        i
                                                    );
                                                }
                                                /* eslint-enable no-alert */
                                            }}
                                            title="Delete this section"
                                        />
                                    </div>
                                </div>
                                <Editor
                                    {...section}
                                    apiOptions={apiOptions}
                                    imageUploader={imageUploader}
                                    onChange={_.partial(
                                        this._handleEditorChange,
                                        i
                                    )}
                                    placeholder="Type your section text here..."
                                    ref={"editor" + i}
                                />
                            </div>

                            <div className={"editor-preview"}>
                                {this._renderIframePreview(i, true)}
                            </div>
                        </div>,
                    ];
                })}
                {this._renderAddSection()}
                {this._renderLinterHUD()}
            </div>
        );
        /* eslint-enable max-len */
    },

    _renderAddSection: function() {
        return (
            <div className="perseus-editor-row">
                <div className="perseus-editor-left-cell">
                    <a
                        href="#"
                        className="simple-button orange"
                        onClick={() => {
                            this._handleAddSectionAfter(
                                this._sections().length - 1
                            );
                        }}
                    >
                        <InlineIcon {...iconPlus} /> Add a section
                    </a>
                </div>
            </div>
        );
    },

    _renderLinterHUD: function() {
        return (
            <HUD
                message="Style warnings"
                enabled={this.state.highlightLint}
                onClick={() => {
                    this.setState({
                        highlightLint: !this.state.highlightLint,
                    });
                }}
            />
        );
    },

    _renderIframePreview: function(i, nochrome) {
        const isMobile =
            this.props.screen === "phone" || this.props.screen === "tablet";

        return (
            <DeviceFramer deviceType={this.props.screen} nochrome={nochrome}>
                <IframeContentRenderer
                    ref={"frame-" + i}
                    key={this.props.screen}
                    content={this.props.frameSource}
                    datasetKey="mobile"
                    datasetValue={isMobile}
                    seamless={nochrome}
                />
            </DeviceFramer>
        );
    },

    _renderPreviewMode: function() {
        return (
            <div className="standalone-preview">
                {this._renderIframePreview("all", false)}
            </div>
        );
    },

    _handleJsonChange: function(newJson) {
        this.props.onChange({json: newJson});
    },

    _handleEditorChange: function(i, newProps) {
        const sections = _.clone(this._sections());
        sections[i] = _.extend({}, sections[i], newProps);
        this.props.onChange({json: sections});
    },

    _handleMoveSectionEarlier: function(i) {
        if (i === 0) {
            return;
        }
        const sections = _.clone(this._sections());
        const section = sections[i];
        sections.splice(i, 1);
        sections.splice(i - 1, 0, section);
        this.props.onChange({
            json: sections,
        });
    },

    _handleMoveSectionLater: function(i) {
        const sections = _.clone(this._sections());
        if (i + 1 === sections.length) {
            return;
        }
        const section = sections[i];
        sections.splice(i, 1);
        sections.splice(i + 1, 0, section);
        this.props.onChange({
            json: sections,
        });
    },

    _handleAddSectionAfter: function(i) {
        // We do a full serialization here because we
        // might be copying widgets:
        const sections = _.clone(this.serialize());
        // Here we do magic to allow you to copy-paste
        // things from the previous section into the new
        // section while preserving widgets.
        // To enable this, we preserve the widgets
        // object for the new section, but wipe out
        // the content.
        const newSection =
            i >= 0
                ? {
                    widgets: sections[i].widgets,
                }
                : {};
        sections.splice(i + 1, 0, newSection);
        this.props.onChange({
            json: sections,
        });
    },

    _handleRemoveSection: function(i) {
        const sections = _.clone(this._sections());
        sections.splice(i, 1);
        this.props.onChange({
            json: sections,
        });
    },

    serialize: function() {
        if (this.props.mode === "edit") {
            return this._sections().map((section, i) => {
                return this.refs["editor" + i].serialize();
            });
        } else if (
            this.props.mode === "preview" ||
            this.props.mode === "json"
        ) {
            return this.props.json;
        } else {
            throw new Error(
                "Could not serialize; mode " + this.props.mode + " not found"
            );
        }
    },

    /**
     * Returns an array, with one element be section.
     * Each element is an array of lint warnings present in that section.
     *
     * This function can currently only be called in edit mode.
     */
    getSaveWarnings: function() {
        if (this.props.mode !== "edit") {
            // TODO(joshuan): We should be able to get save warnings in
            // preview mode.
            throw new Error("Cannot only get save warnings in edit mode.");
        }

        return this._sections().map((section, i) => {
            return this.refs["editor" + i].getSaveWarnings();
        });
    },

    render: function() {
        return (
            <div className="framework-perseus perseus-article-editor">
                {this.props.mode === "edit" && this._renderEditor()}

                {this.props.mode === "preview" && this._renderPreviewMode()}

                {this.props.mode === "json" &&
                    <div className="json-editor">
                        <div className="json-editor-warning">
                            <span>
                                Warning: Editing in this mode can lead to broken
                                articles!
                            </span>
                        </div>
                        <JsonEditor
                            multiLine={true}
                            onChange={this._handleJsonChange}
                            value={this.props.json}
                        />
                    </div>}
            </div>
        );
    },
});

_module_.exports = ArticleEditor;
export default _module_.exports;
