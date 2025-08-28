import { linterContextProps, linterContextDefault } from "../gorgon/proptypes.js";
import _utilJs2 from "../util.js";
import _utilJs from "../util.js";
import _perseusApiJsx from "../perseus-api.jsx";
import _componentsSortableJsx from "../components/sortable.jsx";
import _rendererJsx from "../renderer.jsx";
import _underscore from "underscore";
import { StyleSheet, css } from "aphrodite";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable comma-dangle, no-var, react/forbid-prop-types, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

const React = _react;
const _ = _underscore;

const Renderer = _rendererJsx;
const Sortable = _componentsSortableJsx;

const ApiOptions = _perseusApiJsx.Options;
const shuffle = _utilJs.shuffle;
const seededRNG = _utilJs2.seededRNG;

const HACKY_CSS_CLASSNAME = "perseus-widget-matcher";

const Matcher = createReactClass({
    propTypes: {
        apiOptions: ApiOptions.propTypes,
        labels: PropTypes.array,
        left: PropTypes.array,
        onChange: PropTypes.func,
        orderMatters: PropTypes.bool,
        padding: PropTypes.bool,
        problemNum: PropTypes.number,
        right: PropTypes.array,
        trackInteraction: PropTypes.func.isRequired,
        linterContext: linterContextProps,
        // New props for nested widgets support
        leftWidgets: PropTypes.arrayOf(PropTypes.object),
        leftImages: PropTypes.arrayOf(PropTypes.object),
        rightWidgets: PropTypes.arrayOf(PropTypes.object),
        rightImages: PropTypes.arrayOf(PropTypes.object),
        findWidgets: PropTypes.func,
    },

    getDefaultProps: function() {
        return {
            left: [],
            right: [],
            labels: ["", ""],
            orderMatters: false,
            padding: true,
            problemNum: 0,
            onChange: function() {},
            linterContext: linterContextDefault,
            leftWidgets: [],
            leftImages: [],
            rightWidgets: [],
            rightImages: [],
        };
    },

    _renderRenderer: function(content, widgets = {}, images = {}, refName) {
        if (!content) {
            return null;
        }

        return (
            <Renderer
                ref={refName}
                content={content || ""}
                widgets={widgets || {}}
                images={images || {}}
                apiOptions={this.props.apiOptions}
                findExternalWidgets={this.props.findWidgets}
                linterContext={this.props.linterContext}
            />
        );
    },

    getInitialState: function() {
        return {
            leftHeight: 0,
            rightHeight: 0,
        };
    },

    render: function() {
        // Use the same random() function to shuffle both columns sequentially
        var rng = seededRNG(this.props.problemNum);

        var left;
        if (!this.props.orderMatters) {
            // If the order doesn't matter, don't shuffle the left column
            left = this.props.left;
        } else {
            left = shuffle(this.props.left, rng, /* ensurePermuted */ true);
        }

        var right = shuffle(this.props.right, rng, /* ensurePermuted */ true);

        // Transform left options to include widgets and images
        const leftOptions = left.map((content, i) => ({
            option: this._renderRenderer(
                content,
                this.props.leftWidgets && this.props.leftWidgets[i] ? this.props.leftWidgets[i] : {},
                this.props.leftImages && this.props.leftImages[i] ? this.props.leftImages[i] : {},
                `left-renderer-${i}`
            ),
            key: `left-${i}`,
        }));

        // Transform right options to include widgets and images
        const rightOptions = right.map((content, i) => ({
            option: this._renderRenderer(
                content,
                this.props.rightWidgets && this.props.rightWidgets[i] ? this.props.rightWidgets[i] : {},
                this.props.rightImages && this.props.rightImages[i] ? this.props.rightImages[i] : {},
                `right-renderer-${i}`
            ),
            key: `right-${i}`,
        }));

        var showLabels = _.any(this.props.labels);
        var constraints = {
            height: _.max([this.state.leftHeight, this.state.rightHeight]),
        };

        const cellMarginPx = this.props.apiOptions.isMobile ? 8 : 5;

        return (
            <table className={css(styles.widget) + " " + HACKY_CSS_CLASSNAME}>
                <tbody>
                    {showLabels &&
                        <tr className={css(styles.row)}>
                            <th
                                className={css(
                                    styles.column,
                                    styles.columnLabel
                                )}
                            >
                                <Renderer
                                    content={this.props.labels[0] || "..."}
                                    linterContext={this.props.linterContext}
                                />
                            </th>
                            <th
                                className={css(
                                    styles.column,
                                    styles.columnRight,
                                    styles.columnLabel
                                )}
                            >
                                <Renderer
                                    content={this.props.labels[1] || "..."}
                                    linterContext={this.props.linterContext}
                                />
                            </th>
                        </tr>}
                    <tr className={css(styles.row)}>
                        <td className={css(styles.column)}>
                            <Sortable
                                options={leftOptions}
                                layout="vertical"
                                padding={this.props.padding}
                                disabled={!this.props.orderMatters}
                                constraints={constraints}
                                onMeasure={this.onMeasureLeft}
                                onChange={this.changeAndTrack}
                                margin={cellMarginPx}
                                linterContext={this.props.linterContext}
                                ref="left"
                            />
                        </td>
                        <td className={css(styles.column, styles.columnRight)}>
                            <Sortable
                                options={rightOptions}
                                layout="vertical"
                                padding={this.props.padding}
                                constraints={constraints}
                                onMeasure={this.onMeasureRight}
                                onChange={this.changeAndTrack}
                                margin={cellMarginPx}
                                linterContext={this.props.linterContext}
                                ref="right"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    },

    changeAndTrack: function(e) {
        this.props.onChange(e);
        this.props.trackInteraction();
    },

    onMeasureLeft: function(dimensions) {
        var height = _.max(dimensions.heights);
        this.setState({leftHeight: height});
    },

    onMeasureRight: function(dimensions) {
        var height = _.max(dimensions.heights);
        this.setState({rightHeight: height});
    },

    getUserInput: function() {
        return {
            left: this.refs.left.getOptions(),
            right: this.refs.right.getOptions(),
        };
    },

    simpleValidate: function(rubric) {
        return Matcher.validate(this.getUserInput(), rubric);
    },

    /**
     * Expose nested widgets to Perseus widget discovery system.
     * This allows nested widgets to be found for editing and interaction.
     */
    findWidgets: function(filterCriterion) {
        // Collect all widgets from all renderers
        const widgets = [];

        // Get widgets from left column renderers
        this.props.left.forEach((content, i) => {
            const leftRenderer = this.refs[`left-renderer-${i}`];
            if (leftRenderer && leftRenderer.findInternalWidgets) {
                widgets.push(...leftRenderer.findInternalWidgets(filterCriterion));
            }
        });

        // Get widgets from right column renderers
        this.props.right.forEach((content, i) => {
            const rightRenderer = this.refs[`right-renderer-${i}`];
            if (rightRenderer && rightRenderer.findInternalWidgets) {
                widgets.push(...rightRenderer.findInternalWidgets(filterCriterion));
            }
        });

        return widgets;
    },
});

_.extend(Matcher, {
    validate: function(state, rubric) {
        var correct =
            _.isEqual(state.left, rubric.left) &&
            _.isEqual(state.right, rubric.right);

        return {
            type: "points",
            earned: correct ? 1 : 0,
            total: 1,
            message: null,
        };
    },
});

const padding = 5;
const columnSpacing = 24; // Increased spacing between columns
const border = "1px solid #444";

const styles = StyleSheet.create({
    widget: {
        paddingTop: padding,
        maxWidth: "100%",

        // Need to override minWidth in CSS :(
        minWidth: "auto",

        // Remove table borders
        borderCollapse: "separate",
        borderSpacing: 0,
    },

    row: {
        // Need to override global rules in CSS :(
        border: 0,
    },

    column: {
        // TODO(benkomalo): constraint to half width?
        padding: `0 ${columnSpacing / 2}px`, // Add horizontal padding for breathing room
        border: 0,
        verticalAlign: "top",
    },

    columnRight: {
        // Remove the left border to eliminate vertical line
        // borderLeft: border,
        paddingLeft: `${columnSpacing / 2}px`, // Maintain spacing without border
    },

    columnLabel: {
        fontWeight: "inherit",
        // Remove bottom border to eliminate horizontal line
        // borderBottom: border,
        padding: `0 ${columnSpacing / 2}px ${padding}px ${columnSpacing / 2}px`,
        textAlign: "center",
    },
});

_module_.exports = {
    name: "matcher",
    displayName: "Two column matcher",
    widget: Matcher,
    isLintable: true,
};
export default _module_.exports;
