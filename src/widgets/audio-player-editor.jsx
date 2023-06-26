import _reactComponentsBlurInputJsx from "react-components/blur-input.jsx";
import _componentsInfoTipJsx from "../components/info-tip.jsx";
import _mixinsEditorJsonifyJsx from "../mixins/editor-jsonify.jsx";
import _mixinsChangeableJsx from "../mixins/changeable.jsx";
import _underscore from "underscore";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable no-var */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

const React = _react;
const _ = _underscore;

const Changeable = _mixinsChangeableJsx;
const EditorJsonify = _mixinsEditorJsonifyJsx;

const InfoTip = _componentsInfoTipJsx;
const BlurInput = _reactComponentsBlurInputJsx;

/**
 * This is the main editor for this widget, to specify all the options.
 */
const AudioPlayerEditor = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
        location: PropTypes.string,
        onChange: PropTypes.func,
    },

    getDefaultProps: function() {
        return {
            location: "",
        };
    },

    _handleUrlChange: function(url) {
        this.props.onChange({location: url});
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    serialize() {
        return EditorJsonify.serialize.call(this);
    },

    render: function() {
        return (
            <div>
                <label>
                    URL of audio file:{" "}
                    <BlurInput
                        name="location"
                        value={this.props.location}
                        style={{width: 290}}
                        onChange={this._handleUrlChange}
                    />
                    <InfoTip>
                        You can paste any URL here.
                    </InfoTip>
                </label>
            </div>
        );
    },
});

_module_.exports = AudioPlayerEditor;
export default _module_.exports;
