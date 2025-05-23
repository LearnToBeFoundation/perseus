import { linterContextProps, linterContextDefault } from "../gorgon/proptypes.js";
import _rendererJsx from "../renderer.jsx";
import _mixinsChangeableJsx from "../mixins/changeable.jsx";
import _perseusApiJsx from "../perseus-api.jsx";
import _underscore from "underscore";
import _react from "react";
import _classnames from "classnames";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable comma-dangle, no-var, react/forbid-prop-types, react/jsx-closing-bracket-location, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var classNames = _classnames;
var React = _react;
var _ = _underscore;

var ApiOptions = _perseusApiJsx.Options;
var Changeable = _mixinsChangeableJsx;
var Renderer = _rendererJsx;

var Group = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
        content: PropTypes.string,
        widgets: PropTypes.object,
        images: PropTypes.object,
        icon: PropTypes.object,
        reviewModeRubric: PropTypes.object,
        linterContext: linterContextProps,
    },

    getDefaultProps: function() {
        return {
            content: "",
            widgets: {},
            images: {},
            icon: null,
            linterContext: linterContextDefault,
        };
    },

    componentDidMount: function() {
        // TODO(marcia): See comment in render method about our cyclical
        // numbering scheme. We force another render so that we can annotate
        // the group with the correct number.
        this.forceUpdate();
    },

    render: function() {
        var apiOptions = _.extend(
            {},
            ApiOptions.defaults,
            this.props.apiOptions,
            {
                // Api Rewriting to support correct onFocus/onBlur
                // events for the mobile API
                onFocusChange: (newFocus, oldFocus) => {
                    if (oldFocus) {
                        this.props.onBlur(oldFocus);
                    }
                    if (newFocus) {
                        this.props.onFocus(newFocus);
                    }
                },
            }
        );

        // Allow a problem number annotation to be added.
        // This is cyclical and should probably be reconsidered. In order to
        // render the annotation ("Question 3 of 10"), we call findWidgets to
        // figure out our index in the list of all fellow group widgets. On
        // first render, though, we don't exist yet in this list, and so we
        // give ourselves number -1. To combat this, we forceUpdate in
        // componentDidMount so that we can number ourselves properly. But,
        // really we should have a more unidirectional flow. TODO(marcia): fix.
        var number = _.indexOf(this.props.findWidgets("group"), this);
        var problemNumComponent = this.props.apiOptions.groupAnnotator(
            number,
            this.props.widgetId
        );

        // This is a little strange because the id of the widget that actually
        // changed is going to be lost in favor of the group widget's id. The
        // widgets prop also wasn't actually changed, and this only serves to
        // alert our renderer (our parent) of the fact that some interaction
        // has occurred.
        var onInteractWithWidget = id => {
            if (this.refs.renderer) {
                this.change("widgets", this.refs.renderer.props.widgets);
            }
        };

        var score = this.refs.renderer && this.refs.renderer.score();
        var isValid = score && score.type !== "invalid";
        var isInvalid = score && score.type === "invalid";

        // TODO(mdr): Widgets inside this Renderer are not discoverable through
        //     the parent Renderer's `findWidgets` function.
        return (
            <div
                className={classNames({
                    "perseus-group": true,
                    "perseus-group-valid-answer": isValid,
                    "perseus-group-invalid-answer": isInvalid,
                })}
            >
                {problemNumComponent}
                <Renderer
                    {...this.props}
                    ref="renderer"
                    apiOptions={apiOptions}
                    findExternalWidgets={this.props.findWidgets}
                    reviewMode={!!this.props.reviewModeRubric}
                    onInteractWithWidget={onInteractWithWidget}
                    linterContext={this.props.linterContext}
                />
                {this.props.icon &&
                    <div className="group-icon">
                        {this.props.icon}
                    </div>}
            </div>
        );
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    getUserInput: function() {
        return this.refs.renderer.getUserInput();
    },

    getSerializedState: function() {
        return this.refs.renderer.getSerializedState();
    },

    restoreSerializedState: function(state, callback) {
        this.refs.renderer.restoreSerializedState(state, callback);
        // Tell our renderer that we have no props to change
        // (all our changes were in state):
        return null;
    },

    simpleValidate: function(rubric) {
        return this.refs.renderer.score();
    },

    // Mobile API:
    getInputPaths: function() {
        return this.refs.renderer.getInputPaths();
    },

    setInputValue: function(path, newValue, cb) {
        return this.refs.renderer.setInputValue(path, newValue, cb);
    },

    getAcceptableFormatsForInputPath: function(path) {
        return this.refs.renderer.getAcceptableFormatsForInputPath(path);
    },

    /**
     * WARNING: This is an experimental/temporary API and should not be relied
     *     upon in production code. This function may change its behavior or
     *     disappear without notice.
     *
     * This function was created to allow Renderer.getAllWidgetIds to descend
     * into our renderer.
     */
    getRenderer: function() {
        return this.refs.renderer;
    },

    focus: function() {
        return this.refs.renderer.focus();
    },

    focusInputPath: function(path) {
        this.refs.renderer.focusPath(path);
    },

    blurInputPath: function(path) {
        this.refs.renderer.blurPath(path);
    },

    showRationalesForCurrentlySelectedChoices() {
        this.refs.renderer.showRationalesForCurrentlySelectedChoices();
    },
});

var traverseChildWidgets = function(props, traverseRenderer) {
    return _.extend({}, props, traverseRenderer(props));
};

_module_.exports = {
    name: "group",
    displayName: "Group (SAT only)",
    widget: Group,
    traverseChildWidgets: traverseChildWidgets,
    hidden: false,
    isLintable: true,
};
export default _module_.exports;
