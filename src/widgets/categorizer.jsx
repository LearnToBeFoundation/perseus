import { linterContextProps, linterContextDefault } from "../gorgon/proptypes.js";
import _stylesSharedJs from "../styles/shared.js";
import _stylesMediaQueriesJs from "../styles/media-queries.js";
import _utilJs from "../util.js";
import _rendererJsx from "../renderer.jsx";
import _componentsInlineIconJsx from "../components/inline-icon.jsx";
import { iconCircle, iconCircleThin } from "../icon-paths.js";
import _perseusApiJsx2 from "../perseus-api.jsx";
import _perseusApiJsx from "../perseus-api.jsx";
import _underscore from "underscore";
import _mixinsWidgetJsonifyDeprecatedJsx from "../mixins/widget-jsonify-deprecated.jsx";
import _mixinsChangeableJsx from "../mixins/changeable.jsx";
import _classnames from "classnames";
import _react from "react";
import { StyleSheet, css } from "aphrodite";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
const React = _react;
const classNames = _classnames;
const Changeable = _mixinsChangeableJsx;
const WidgetJsonifyDeprecated = _mixinsWidgetJsonifyDeprecatedJsx;
const _ = _underscore;

const ApiClassNames = _perseusApiJsx.ClassNames;
const ApiOptions = _perseusApiJsx2.Options;
const InlineIcon = _componentsInlineIconJsx;
const Renderer = _rendererJsx;
const Util = _utilJs;
const mediaQueries = _stylesMediaQueriesJs;
const sharedStyles = _stylesSharedJs;

const Categorizer = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
        apiOptions: ApiOptions.propTypes,

        // List of categories (across the top)
        categories: PropTypes.arrayOf(PropTypes.string),
        // List of items that are being categorized (along the left side)
        items: PropTypes.arrayOf(PropTypes.string),
        trackInteraction: PropTypes.func.isRequired,
        // Ordered list of correct answers, mapping items to categories thusly:
        //   values[<items_index>] == <categories_index>
        values: PropTypes.arrayOf(PropTypes.number),
        linterContext: linterContextProps,
    },

    getDefaultProps: function() {
        return {
            items: [],
            categories: [],
            values: [],
            linterContext: linterContextDefault,
        };
    },

    getInitialState: function() {
        return {
            uniqueId: _.uniqueId("perseus_radio_"),
        };
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    getUserInput: function() {
        return WidgetJsonifyDeprecated.getUserInput.call(this);
    },

    render: function() {
        const self = this;

        // In this context, isMobile is used to differentiate mobile from
        // desktop.
        const isMobile = this.props.apiOptions.isMobile;
        let indexedItems = this.props.items.map((item, n) => [item, n]);
        if (this.props.randomizeItems) {
            indexedItems = Util.shuffle(indexedItems, this.props.problemNum);
        }

        const table = (
            <table className="categorizer-table">
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        {this.props.categories.map((category, i) => {
                            // Array index is the correct key here, as that's
                            // how category grading actually works -- no way
                            // to add or remove categories or items in the
                            // middle. (If we later add that, this should be
                            // fixed.)
                            return (
                                <th className={css(styles.header)} key={i}>
                                    <Renderer
                                        content={category}
                                        linterContext={this.props.linterContext}
                                    />
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {indexedItems.map(indexedItem => {
                        var item = indexedItem[0];
                        var itemNum = indexedItem[1];
                        var uniqueId = self.state.uniqueId + "_" + itemNum;
                        /* eslint-disable max-len */
                        return (
                            <tr key={itemNum}>
                                <td>
                                    <Renderer
                                        content={item}
                                        linterContext={this.props.linterContext}
                                    />
                                </td>
                                {_.range(
                                    self.props.categories.length
                                ).map(catNum => {
                                    const selected =
                                        self.props.values[itemNum] === catNum;
                                    return (
                                        <td
                                            className={
                                                "category " +
                                                css(
                                                    styles.cell,
                                                    styles.responsiveCell
                                                )
                                            }
                                            key={catNum}
                                        >
                                            {/* a pseudo-label: toggle the
                                value of the checkbox when this div or the
                                checkbox is clicked */}
                                            <div
                                                className={
                                                    ApiClassNames.INTERACTIVE
                                                }
                                                onClick={this.onChange.bind(
                                                    this,
                                                    itemNum,
                                                    catNum
                                                )}
                                            >
                                                {isMobile &&
                                                    <input
                                                        type="radio"
                                                        name={uniqueId}
                                                        className={css(
                                                            sharedStyles.responsiveInput,
                                                            sharedStyles.responsiveRadioInput
                                                        )}
                                                        checked={selected}
                                                        onChange={this.onChange.bind(
                                                            this,
                                                            itemNum,
                                                            catNum
                                                        )}
                                                        onClick={e => e.stopPropagation()}
                                                    />}
                                                {!isMobile &&
                                                    <span
                                                        className={css(
                                                            styles.responsiveSpan,
                                                            styles.radioSpan,
                                                            selected &&
                                                                styles.checkedRadioSpan,
                                                            this.props.static &&
                                                                selected &&
                                                                styles.staticCheckedRadioSpan
                                                        )}
                                                    >
                                                        {selected
                                                            ? <InlineIcon
                                                                  {...iconCircle}
                                                              />
                                                            : <InlineIcon
                                                                  {...iconCircleThin}
                                                              />}
                                                    </span>}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                        /* eslint-enable max-len */
                    })}
                </tbody>
            </table>
        );

        // TODO(benkomalo): kill CSS-based styling and move everything to
        // aphrodite.
        const extraClassNames = classNames({
            "categorizer-container": true,
            "static-mode": this.props.static,
        });
        const inlineStyles = this.props.apiOptions.isMobile
            ? [styles.fullBleedContainer]
            : [];

        return (
            <div className={extraClassNames + " " + css(...inlineStyles)}>
                {table}
            </div>
        );
    },

    onChange: function(itemNum, catNum) {
        var values = _.clone(this.props.values);
        values[itemNum] = catNum;
        this.change("values", values);
        this.props.trackInteraction();
    },

    simpleValidate: function(rubric) {
        return Categorizer.validate(this.getUserInput(), rubric);
    },
});

_.extend(Categorizer, {
    validate: function(state, rubric) {
        var completed = true;
        var allCorrect = true;
        _.each(rubric.values, function(value, i) {
            if (state.values[i] == null) {
                completed = false;
            }
            if (state.values[i] !== value) {
                allCorrect = false;
            }
        });
        if (!completed) {
            return {
                type: "invalid",
                message: i18n._(
                    "Make sure you select something for every row."
                ),
            };
        }
        return {
            type: "points",
            earned: allCorrect ? 1 : 0,
            total: 1,
            message: null,
        };
    },
});

// TODO(benkomalo): inject page-margin into Perseus instead of hardcoding.
const pageMargin = 16;
const styles = StyleSheet.create({
    fullBleedContainer: {
        [mediaQueries.mdOrSmaller]: {
            marginLeft: -pageMargin,
            marginRight: -pageMargin,
            overflowX: "auto",
        },
    },

    header: {
        textAlign: "center",
        verticalAlign: "bottom",
    },

    cell: {
        textAlign: "center",
        padding: 0,
        color: "#ccc",
        verticalAlign: "middle",
    },

    radioSpan: {
        fontSize: 30,
        paddingRight: 3,

        ":hover": {
            color: "#999",
        },
    },

    checkedRadioSpan: {
        color: "#333",
    },

    // .static-mode is applied by the Categorizer when the rendered
    // widget is static; in this case we gray out the choices to show
    // the user that the widget can't be interacted with.
    staticCheckedRadioSpan: {
        color: "#888",
    },
});

_module_.exports = {
    name: "categorizer",
    displayName: "Categorizer",
    widget: Categorizer,
    transform: editorProps => {
        return _.pick(editorProps, "items", "categories", "randomizeItems");
    },
    staticTransform: editorProps => {
        return _.pick(
            editorProps,
            "items",
            "categories",
            "values",
            "randomizeItems"
        );
    },
    isLintable: true,
};
export default _module_.exports;
