import _componentsRangeInputJsx from "../components/range-input.jsx";
import _componentsInlineIconJsx from "../components/inline-icon.jsx";
import _componentsInfoTipJsx from "../components/info-tip.jsx";
import _editorJsx from "../editor.jsx";
import _reactComponentsBlurInputJsx from "react-components/blur-input.jsx";
import _mixinsEditorJsonifyJsx from "../mixins/editor-jsonify.jsx";
import _mixinsChangeableJsx from "../mixins/changeable.jsx";
import _utilJs from "../util.js";
import { iconTrash } from "../icon-paths.js";
import _underscore from "underscore";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable no-var, react/jsx-closing-bracket-location, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

const React = _react;
const _ = _underscore;

const Util = _utilJs;

const Changeable = _mixinsChangeableJsx;
const EditorJsonify = _mixinsEditorJsonifyJsx;

const BlurInput = _reactComponentsBlurInputJsx;
const Editor = _editorJsx;
const InfoTip = _componentsInfoTipJsx;
const InlineIcon = _componentsInlineIconJsx;
const RangeInput = _componentsRangeInputJsx;

const defaultBoxSize = 400;
const defaultRange = [0, 10];
const defaultBackgroundImage = {
    url: null,
    width: 0,
    height: 0,
};

// Domain restrictions removed - allow any image URL

/**
 * Alignment option for captions, relative to specified coordinates.
 */
var captionAlignments = [
    "center",
    "above",
    "above right",
    "right",
    "below right",
    "below",
    "below left",
    "left",
    "above left",
];

const ImageEditor = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
    },

    componentDidMount: function() {
        // defer this because it can call a change handler synchronously
        _.defer(() => {
            var url = this.props.backgroundImage.url;
            this.onUrlChange(url, true);
        });
    },

    getDefaultProps: function() {
        return {
            title: "",
            range: [defaultRange, defaultRange],
            box: [defaultBoxSize, defaultBoxSize],
            backgroundImage: defaultBackgroundImage,
            labels: [],
            alt: "",
            caption: "",
        };
    },

    getInitialState: function() {
        return {
            backgroundImageError: "",
        };
    },

    render: function() {
        var backgroundImage = this.props.backgroundImage;

        var imageSettings = (
            <div className="image-settings">
                <div>
                    <label>
                        <div>
                            Alt text:
                            <InfoTip>
                                This is important for screenreaders. The content
                                of this alt text will be formatted as markdown
                                (tables, emphasis, etc. are supported).
                            </InfoTip>
                        </div>
                        <Editor
                            apiOptions={this.props.apiOptions}
                            content={this.props.alt}
                            onChange={props => {
                                if (props.content != null) {
                                    this.change("alt", props.content);
                                }
                            }}
                            widgetEnabled={false}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <div>Caption:</div>
                        <Editor
                            apiOptions={this.props.apiOptions}
                            content={this.props.caption}
                            onChange={props => {
                                if (props.content != null) {
                                    this.change("caption", props.content);
                                }
                            }}
                            widgetEnabled={false}
                        />
                    </label>
                </div>
            </div>
        );

        var backgroundImageErrorText = (
            <div className="renderer-widget-error">
                {this.state.backgroundImageError}
            </div>
        );

        return (
            <div className="perseus-image-editor">
                <label>
                    Image url:
                    <InfoTip>Paste an image or graphie image URL.</InfoTip>
                    {this.state.backgroundImageError &&
                        backgroundImageErrorText}
                    <BlurInput
                        value={backgroundImage.url || ""}
                        style={{width: 332}}
                        onChange={url => this.onUrlChange(url, false)}
                    />
                </label>

                {backgroundImage.url && imageSettings}
            </div>
        );
    },

    _renderRowForLabel: function(label, i) {
        return (
            <tr key={i}>
                <td>
                    <RangeInput
                        value={label.coordinates}
                        onChange={this.onCoordinateChange.bind(this, i)}
                    />
                </td>
                <td style={{verticalAlign: "bottom", width: "5px"}}>
                    <input
                        type="text"
                        className="graph-settings-axis-label"
                        value={label.content}
                        onChange={this.onContentChange.bind(this, i)}
                    />
                </td>
                <td>
                    <select
                        className="perseus-widget-dropdown"
                        value={label.alignment}
                        onChange={this.onAlignmentChange.bind(this, i)}
                    >
                        {captionAlignments.map(function(alignment, i) {
                            return (
                                <option key={"" + i} value={alignment}>
                                    {alignment}
                                </option>
                            );
                        }, this)}
                    </select>
                </td>
                <td>
                    <a
                        href="#"
                        className="simple-button orange delete-label"
                        title="Remove this label"
                        onClick={this.removeLabel.bind(this, i)}
                    >
                        <InlineIcon {...iconTrash} />
                    </a>
                </td>
            </tr>
        );
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    removeLabel: function(labelIndex, e) {
        e.preventDefault();
        var labels = _.clone(this.props.labels);
        labels.splice(labelIndex, 1);
        this.props.onChange({labels: labels});
    },

    onCoordinateChange: function(labelIndex, newCoordinates) {
        var labels = this.props.labels.slice();
        labels[labelIndex] = _.extend({}, labels[labelIndex], {
            coordinates: newCoordinates,
        });
        this.props.onChange({labels: labels});
    },

    onContentChange: function(labelIndex, e) {
        var newContent = e.target.value;
        var labels = this.props.labels.slice();
        labels[labelIndex] = _.extend({}, labels[labelIndex], {
            content: newContent,
        });
        this.props.onChange({labels: labels});
    },

    onAlignmentChange: function(labelIndex, e) {
        var newAlignment = e.target.value;
        var labels = this.props.labels.slice();
        labels[labelIndex] = _.extend({}, labels[labelIndex], {
            alignment: newAlignment,
        });
        this.props.onChange({labels: labels});
    },

    setUrl: function(url, width, height, silent) {
        // Because this calls into WidgetEditor._handleWidgetChange, which
        // checks for this widget's ref to serialize it.
        //
        // Errors if you switch items before the `Image` from `onUrlChange`
        // loads.
        if (!this.isMounted()) {
            return;
        }

        var image = _.clone(this.props.backgroundImage);
        image.url = url;
        image.width = width;
        image.height = height;
        var box = [image.width, image.height];
        this.props.onChange(
            {
                backgroundImage: image,
                box: box,
            },
            null,
            silent
        );
    },

    // silently load the image when the component mounts
    // silently update url and sizes when the image loads
    // noisily load the image in response to the author changing it
    onUrlChange: function(url, silent) {
        // Allow any valid image URL
        this.setState({backgroundImageError: ""});

        // We update our background image prop after the image loads below. To
        // avoid weirdness when we change to a very slow URL, then a much
        // faster URL, we keep track of the URL we're trying to change to.
        this._leadingUrl = url;

        if (!url) {
            this.setUrl(url, 0, 0, silent);
            return;
        }

        Util.getImageSize(url, (width, height) => {
            if (this._leadingUrl !== url) {
                return;
            }

            this.setUrl(url, width, height, true);
        });
    },

    onRangeChange: function(type, newRange) {
        var range = this.props.range.slice();
        range[type] = newRange;
        this.props.onChange({range: range});
    },

    serialize() {
        return EditorJsonify.serialize.call(this);
    },
});

_module_.exports = ImageEditor;
export default _module_.exports;
