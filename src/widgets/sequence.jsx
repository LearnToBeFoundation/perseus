import { linterContextProps, linterContextDefault } from "../gorgon/proptypes.js";
import _utilJs from "../util.js";
import _rendererJsx from "../renderer.jsx";
import _componentsInlineIconJsx from "../components/inline-icon.jsx";
import { iconOk } from "../icon-paths.js";
import _mixinsChangeableJsx from "../mixins/changeable.jsx";
import _perseusApiJsx from "../perseus-api.jsx";
import _underscore from "underscore";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable comma-dangle, no-var, react/jsx-closing-bracket-location, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var React = _react;
var _ = _underscore;

var ApiOptions = _perseusApiJsx.Options;
var Changeable = _mixinsChangeableJsx;
const InlineIcon = _componentsInlineIconJsx;
var Renderer = _rendererJsx;
var Util = _utilJs;

var Sequence = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
        apiOptions: ApiOptions.propTypes,
        json: PropTypes.arrayOf(
            PropTypes.shape({
                content: PropTypes.string,
                images: PropTypes.object,
                widgets: PropTypes.object,
            })
        ),
        trackInteraction: PropTypes.func.isRequired,
        linterContext: linterContextProps,
    },

    getDefaultProps: function() {
        return {
            json: [
                {
                    content: "",
                    widgets: {},
                    images: {},
                },
            ],
            linterContext: linterContextDefault,
        };
    },

    getInitialState: function() {
        return {
            visible: 1,
        };
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return nextProps !== this.props || nextState !== this.state;
    },

    render: function() {
        var icon = <InlineIcon {...iconOk} style={{color: "green"}} />;

        var content = _.chain(this.props.json)
            .first(this.state.visible)
            .map((step, i) => `[[${Util.snowman} group ${i}]]`)
            .join("\n\n")
            .value();

        var widgets = {};
        _.each(this.props.json, (step, i) => {
            var widgetId = `group ${i}`;
            widgets[widgetId] = {
                type: "group",
                graded: true,
                version: {major: 0, minor: 0},
                options: _.extend({}, step, {
                    icon: i < this.state.visible - 1 ? icon : null,
                }),
            };
        });

        return (
            <div className="perseus-sequence">
                <Renderer
                    ref="renderer"
                    content={content}
                    widgets={widgets}
                    onInteractWithWidget={this._handleInteraction}
                    apiOptions={this.props.apiOptions}
                    linterContext={this.props.linterContext}
                />
            </div>
        );
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    _handleInteraction: function(groupWidgetId) {
        var step = parseInt(groupWidgetId.split(" ")[1]);
        if (step === this.state.visible - 1) {
            var widget = this.refs.renderer.getWidgetInstance("group " + step);

            widget.showRationalesForCurrentlySelectedChoices();
            var score = widget.simpleValidate();

            if (score.type === "points" && score.total === score.earned) {
                this.setState({
                    visible: this.state.visible + 1,
                });
                this.props.trackInteraction({
                    visible: this.state.visible + 1,
                });
            }
        }
    },
});

var traverseChildWidgets = function(props, traverseRenderer) {
    var oldJson = props.json;
    if (!_.isArray(oldJson)) {
        oldJson = [oldJson];
    }
    var json = _.map(oldJson, rendererOptions => {
        return traverseRenderer(rendererOptions);
    });

    return _.extend({}, props, {json: json});
};

_module_.exports = {
    name: "sequence",
    displayName: "Graded Sequence",
    widget: Sequence,
    traverseChildWidgets: traverseChildWidgets,
    tracking: "all",
    hidden: true,
    isLintable: true,
};
export default _module_.exports;
