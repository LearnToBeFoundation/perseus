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
 * This is a video widget for embedding videos in articles.
 */

var React = _react;
var _ = _underscore;

var Changeable = _mixinsChangeableJsx;
var FixedToResponsive = _componentsFixedToResponsiveJsx;

// Current default is 720p, based on the typical videos we upload currently
var DEFAULT_WIDTH = 1280;
var DEFAULT_HEIGHT = 720;

var KA_EMBED =
    "https://{hostname}/embed_video?slug={slug}" + "&internal_video_only=1";
var IS_URL = /^https?:\/\//;
var IS_KA_SITE = /khanacademy\.org/;

/**
 * Video renderer.
 */
var Video = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
        alignment: PropTypes.string,
        location: PropTypes.string,
    },

    getUserInput: function() {
        return null;
    },

    simpleValidate: function(rubric) {
        return Video.validate(null, rubric);
    },

    change(...args) {
        return Changeable.change.apply(this, args);
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
            url = KA_EMBED.replace("{slug}", location);
            var currentHostname = document.location.hostname;
            var embedHostname = "www.khanacademy.org";
            if (IS_KA_SITE.test(currentHostname)) {
                embedHostname = currentHostname;
            }
            url = url.replace("{hostname}", embedHostname);
        }

        return (
            <FixedToResponsive // @Nolint this is fine, the linter is wrong
                width={DEFAULT_WIDTH}
                height={DEFAULT_HEIGHT}
                // The key is here for the benefit of the editor, to ensure that
                // any changes cause a re-rendering of the frame.
                key={location + this.props.alignment}
            >
                <iframe
                    className="perseus-video-widget"
                    sandbox="allow-same-origin allow-scripts"
                    width={DEFAULT_WIDTH}
                    height={DEFAULT_HEIGHT}
                    src={url}
                    allowFullScreen={true}
                />
            </FixedToResponsive>
        );
    },
});

/**
 * This is the widget's grading function.
 * Points for videos are tallied by the embedded video itself, in the case
 * of Khan Academy videos.
 */
_.extend(Video, {
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
    name: "video",
    displayName: "Video",
    defaultAlignment: "block",
    supportedAlignments: ["block", "float-left", "float-right", "full-width"],
    widget: Video,
};
export default _module_.exports;
