import _componentsFixedToResponsiveJsx from "../components/fixed-to-responsive.jsx";
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

/**
 * This is a audio widget for embedding audio in articles.
 */

var React = _react;
var _ = _underscore;

var Changeable = _mixinsChangeableJsx;
//var FixedToResponsive = _componentsFixedToResponsiveJsx;

var IS_URL = /^https?:\/\//;

/**
 * Audio Player.
 */
var Audio = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
        alignment: PropTypes.string,
        location: PropTypes.string,
    },

    getInitialState: function() {
        return {
            play: false
        };
    },

    getUserInput: function() {
        return null;
    },

    simpleValidate: function(rubric) {
        return Audio.validate(null, rubric);
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    togglePlayPause() {
        if (this.state.play) {
            this.refs.audioplayer.pause()
        } else {
            this.refs.audioplayer.play()
        }
        
        this.setState({
            play: !this.state.play
        })
    },

    render: function() {
        var location = this.props.location;
        if (!location) {
            return <div />;
        }

        var url;

        if (IS_URL.test(location)) {
            url = location;
        } else {
            // do what here?
        }

        return (
            <div className="perseus-audio-widget">
                <audio ref="audioplayer" src={url} preload="auto" loop />
                <button onClick={this.togglePlayPause}>{this.state.play?"pause":"play"}</button>
            </div>

            /*<FixedToResponsive // @Nolint this is fine, the linter is wrong
                width={DEFAULT_WIDTH}
                height={DEFAULT_HEIGHT}
                // The key is here for the benefit of the editor, to ensure that
                // any changes cause a re-rendering of the frame.
                key={location + this.props.alignment}
            >
                <iframe
                    className="perseus-audio-widget"
                    sandbox="allow-same-origin allow-scripts"
                    width={DEFAULT_WIDTH}
                    height={DEFAULT_HEIGHT}
                    src={url}
                    allowFullScreen={true}
                />
            </FixedToResponsive>*/
        );
    },
});

/**
 * This is the widget's grading function.
 * Points for videos are tallied by the embedded video itself, in the case
 * of Khan Academy videos.
 */
_.extend(Audio, {
    validate: function(state, rubric) {
        return {
            type: "points",
            earned: 0,
            total: 0,
            message: null,
        };
    },
});

_module_.exports = {
    name: "audio",
    displayName: "Audio",
    defaultAlignment: "block",
    supportedAlignments: ["block", "float-left", "float-right", "full-width"],
    widget: Audio,
};
export default _module_.exports;
