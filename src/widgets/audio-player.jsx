import _componentsFixedToResponsiveJsx from "../components/fixed-to-responsive.jsx";
import _mixinsChangeableJsx from "../mixins/changeable.jsx";
import _underscore from "underscore";
import _react from "react";
import {ltbBlue} from "../styles/constants.js"

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

var buttonStyle = {
    backgroundColor: ltbBlue,
    padding: "7px",
    color: "white",
    border: "none",
    borderRadius: "3px",
    height: "2.4rem",
    width: "2.4rem",
}

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
        this.audioplayer = React.createRef();

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

    onEndedListener() {
        this.setState({
            play: false
        })
    },

    togglePlayPause() {
        if (this.state.play) {
            this.audioplayer.current.pause()
            this.audioplayer.current.removeEventListener("ended", this.onEndedListener)
        } else {
            this.audioplayer.current.play()
            if (this.audioplayer.current && this.audioplayer.current.addEventListener) {
                this.audioplayer.current.addEventListener("ended", this.onEndedListener)
            }
        }
        
        this.setState({
            play: !this.state.play
        })
    },

    playIcon: function() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{width:"1.5rem", height:"1.5rem"}}>
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
        )
    },
    
    pauseIcon: function() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{width:"1.5rem", height:"1.5rem"}}>
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
            </svg>
        )
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
                <audio ref={this.audioplayer} src={url} preload="auto" />
                <button aria-label={this.state.play? "pause" : "play"} onClick={this.togglePlayPause} style={buttonStyle}>
                    {this.state.play? this.pauseIcon() : this.playIcon()}
                </button>
            </div>
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
