import _mixinsWidgetJsonifyDeprecatedJsx from "../mixins/widget-jsonify-deprecated.jsx";
import _perseusMarkdownJsx from "../perseus-markdown.jsx";
import _mixinsChangeableJsx from "../mixins/changeable.jsx";
import _underscore from "underscore";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable comma-dangle, no-var, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/* globals $_ */
var React = _react;
var _ = _underscore;

var Changeable = _mixinsChangeableJsx;
var PerseusMarkdown = _perseusMarkdownJsx;
var WidgetJsonifyDeprecated = _mixinsWidgetJsonifyDeprecatedJsx;

var EN_DASH = "\u2013";

var PassageRef = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
        passageNumber: PropTypes.number,
        referenceNumber: PropTypes.number,
        summaryText: PropTypes.string,
    },

    getDefaultProps: function() {
        return {
            passageNumber: 1,
            referenceNumber: 1,
            summaryText: "",
        };
    },

    getInitialState: function() {
        return {
            lineRange: null,
            content: null,
        };
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return (
            !_.isEqual(this.props, nextProps) ||
            !_.isEqual(this.state, nextState)
        );
    },

    getUserInput: function() {
        return WidgetJsonifyDeprecated.getUserInput.call(this);
    },

    render: function() {
        var lineRange = this.state.lineRange;
        var lineRangeOutput;
        if (!lineRange) {
            lineRangeOutput = $_(
                {lineRange: `?${EN_DASH}?`},
                "lines %(lineRange)s"
            );
        } else if (lineRange[0] === lineRange[1]) {
            lineRangeOutput = $_(
                {lineNumber: lineRange[0]},
                "line %(lineNumber)s"
            );
        } else {
            lineRangeOutput = $_(
                {
                    lineRange: lineRange[0] + EN_DASH + lineRange[1],
                },
                "lines %(lineRange)s"
            );
        }

        var summaryOutput;
        if (this.props.summaryText) {
            var summaryTree = PerseusMarkdown.parseInline(
                this.props.summaryText
            );
            summaryOutput = (
                <span aria-hidden={true}>
                    {" "}{/* curly quotes */}
                    (&ldquo;
                    {PerseusMarkdown.basicOutput(summaryTree)}
                    &rdquo;)
                </span>
            );
        } else {
            summaryOutput = null;
        }

        return (
            <span>
                {lineRangeOutput}
                {summaryOutput}
                {lineRange &&
                    <div className="perseus-sr-only">
                        {this.state.content}
                    </div>}
            </span>
        );
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    componentDidMount: function() {
        this._deferredUpdateRange();

        this._throttledUpdateRange = _.throttle(this._deferredUpdateRange, 500);
        window.addEventListener("resize", this._throttledUpdateRange);
    },

    componentDidUpdate: function() {
        this._deferredUpdateRange();
    },

    componentWillUnmount: function() {
        window.removeEventListener("resize", this._throttledUpdateRange);
    },

    _deferredUpdateRange: function() {
        _.defer(this._updateRange);
    },

    _updateRange: function() {
        var passage = this.props.findWidgets(
            "passage " + this.props.passageNumber
        )[0];

        var refInfo = null;
        if (passage) {
            refInfo = passage.getReference(this.props.referenceNumber);
        }

        if (this.isMounted()) {
            if (refInfo) {
                this.setState({
                    lineRange: [refInfo.startLine, refInfo.endLine],
                    content: refInfo.content,
                });
            } else {
                this.setState({
                    lineRange: null,
                    content: null,
                });
            }
        }
    },

    simpleValidate: function(rubric) {
        return PassageRef.validate(this.getUserInput(), rubric);
    },
});

_.extend(PassageRef, {
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
    name: "passage-ref",
    displayName: "PassageRef (SAT only)",
    defaultAlignment: "inline",
    widget: PassageRef,
    transform: editorProps => {
        return _.pick(
            editorProps,
            "passageNumber",
            "referenceNumber",
            "summaryText"
        );
    },
    version: {major: 0, minor: 1},
};
export default _module_.exports;
