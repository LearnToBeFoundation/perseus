import _utilGraphUtilsJs from "../util/graph-utils.js";
import _perseusApiJsx from "../perseus-api.jsx";
import _underscore from "underscore";
import _reactDom from "react-dom";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable comma-dangle, indent, no-var, react/jsx-closing-bracket-location, react/jsx-indent-props, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var React = _react;
var ReactDOM = _reactDom;
var _ = _underscore;

var ApiOptions = _perseusApiJsx.Options;
const GraphUtils = _utilGraphUtilsJs;

var defaultImage = {
    url: null,
    top: 0,
    left: 0,
};

var Measurer = createReactClass({
    propTypes: {
        apiOptions: ApiOptions.propTypes,
        box: PropTypes.arrayOf(PropTypes.number),
        image: PropTypes.shape({
            url: PropTypes.string,
            top: PropTypes.number,
            left: PropTypes.number,
        }),
        showProtractor: PropTypes.bool,
        protractorX: PropTypes.number,
        protractorY: PropTypes.number,
        showRuler: PropTypes.bool,
        rulerLabel: PropTypes.string,
        rulerTicks: PropTypes.number,
        rulerPixels: PropTypes.number,
        rulerLength: PropTypes.number,
    },

    getDefaultProps: function() {
        return {
            box: [480, 480],
            image: {},
            showProtractor: true,
            protractorX: 7.5,
            protractorY: 0.5,
            showRuler: false,
            rulerLabel: "",
            rulerTicks: 10,
            rulerPixels: 40,
            rulerLength: 10,
        };
    },

    getInitialState: function() {
        return {};
    },

    render: function() {
        var image = _.extend({}, defaultImage, this.props.image);
        return (
            <div
                className={
                    "perseus-widget perseus-widget-measurer " +
                    "graphie-container above-scratchpad"
                }
                style={{width: this.props.box[0], height: this.props.box[1]}}
            >
                {image.url &&
                    <img
                        src={image.url}
                        style={{
                            top: image.top,
                            left: image.left,
                        }}
                    />}
                <div className="graphie" ref="graphieDiv" />
            </div>
        );
    },

    componentDidMount: function() {
        this.setupGraphie();
    },

    componentDidUpdate: function(prevProps) {
        var shouldSetupGraphie = _.any(
            [
                "box",
                "showProtractor",
                "showRuler",
                "rulerLabel",
                "rulerTicks",
                "rulerPixels",
                "rulerLength",
            ],
            function(prop) {
                return prevProps[prop] !== this.props[prop];
            },
            this
        );

        if (shouldSetupGraphie) {
            this.setupGraphie();
        }
    },

    setupGraphie: function() {
        var graphieDiv = ReactDOM.findDOMNode(this.refs.graphieDiv);
        $(graphieDiv).empty();
        var graphie = (this.graphie = GraphUtils.createGraphie(graphieDiv));

        var scale = [40, 40];
        var range = [
            [0, this.props.box[0] / scale[0]],
            [0, this.props.box[1] / scale[1]],
        ];
        graphie.init({
            range: range,
            scale: scale,
        });
        graphie.addMouseLayer({
            allowScratchpad: true,
            setDrawingAreaAvailable: this.props.apiOptions
                .setDrawingAreaAvailable,
        });

        if (this.protractor) {
            this.protractor.remove();
        }

        if (this.props.showProtractor) {
            this.protractor = graphie.protractor([
                this.props.protractorX,
                this.props.protractorY,
            ]);
        }

        if (this.ruler) {
            this.ruler.remove();
        }

        if (this.props.showRuler) {
            this.ruler = graphie.ruler({
                center: [
                    (range[0][0] + range[0][1]) / 2,
                    (range[1][0] + range[1][1]) / 2,
                ],
                label: this.props.rulerLabel,
                pixelsPerUnit: this.props.rulerPixels,
                ticksPerUnit: this.props.rulerTicks,
                units: this.props.rulerLength,
            });
        }
    },

    getUserInput: function() {
        return {};
    },

    simpleValidate: function(rubric) {
        // TODO(joel) - I don't understand how this is useful!
        return Measurer.validate(this.getUserInput(), rubric);
    },

    focus: $.noop,
});

_.extend(Measurer, {
    validate: function(state, rubric) {
        return {
            type: "points",
            earned: 1,
            total: 1,
            message: null,
        };
    },
});

var propUpgrades = {
    1: v0props => {
        var v1props = _.chain(v0props)
            .omit("imageUrl", "imageTop", "imageLeft")
            .extend({
                image: {
                    url: v0props.imageUrl,
                    top: v0props.imageTop,
                    left: v0props.imageLeft,
                },
            })
            .value();
        return v1props;
    },
};

_module_.exports = {
    name: "measurer",
    displayName: "Measurer",
    widget: Measurer,
    version: {major: 1, minor: 0},
    propUpgrades: propUpgrades,
};
export default _module_.exports;
