import _utilMathJs from "../util/math.js";
import _utilColorsJs from "../util/colors.js";
import _kmath from "kmath";
import _utilJs2 from "../util.js";
import _utilJs from "../util.js";
import _componentsMathOutputJsx from "../components/math-output.jsx";
import _componentsNumberInputJsx from "../components/number-input.jsx";
import _componentsGraphieJsx from "../components/graphie.jsx";
import _interactive2InteractiveUtilJs from "../interactive2/interactive-util.js";
import _perseusApiJsx from "../perseus-api.jsx";
import _mixinsChangeableJsx from "../mixins/changeable.jsx";
import _underscore from "underscore";
import _reactDom from "react-dom";
import _react from "react";
import _componentsInfoTipJsx from "../components/info-tip.jsx";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable comma-dangle, indent, no-unused-vars, no-var, react/jsx-closing-bracket-location, react/jsx-indent-props, react/prop-types, react/sort-comp, space-unary-ops */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/* globals $_, i18n */
var InfoTip = _componentsInfoTipJsx;
var React = _react;
var ReactDOM = _reactDom;
var _ = _underscore;

var Changeable = _mixinsChangeableJsx;

var ApiOptions = _perseusApiJsx.Options;
var assert = _interactive2InteractiveUtilJs.assert;

var Graphie = _componentsGraphieJsx;
var {Path, Arc, Circle, Label, Line, MovablePoint, MovableLine} = Graphie;
var NumberInput = _componentsNumberInputJsx;
var MathOutput = _componentsMathOutputJsx;
var seededRNG = _utilJs.seededRNG;
var Util = _utilJs2;
var knumber = _kmath.number;
const KhanColors = _utilColorsJs;
const KhanMath = _utilMathJs;

var defaultBoxSize = 400;
var maxSampleSize = 1000;
var maxTrials = 5000;

var Histogram = createReactClass({
    propTypes: {
        data: PropTypes.arrayOf(PropTypes.number),
        xAxisLabel: PropTypes.string,
        yAxisLabel: PropTypes.string,
        box: PropTypes.arrayOf(PropTypes.number),
    },

    getDefaultProps: function() {
        return {
            data: null,
            xAxisLabel: "Proportion (%)",
            yAxisLabel: "Number of times seen",
            box: [defaultBoxSize, defaultBoxSize],
        };
    },

    getInitialState: function() {
        return {
            threshold: this._getInitialThreshold(this._range()),
        };
    },

    componentWillReceiveProps: function(nextProps) {
        // Reset the threshold if the range has changed
        var oldRange = this._range();
        var nextRange = this._range(nextProps);
        if (!Util.deepEq(oldRange, nextRange)) {
            this.setState({
                threshold: this._getInitialThreshold(nextRange),
            });
        }
    },

    /* Renders the vertical line that users can drag across the histogram. */
    _renderThresholdLine: function() {
        // Recall the the y-range goes from [-1, yMax] to allow for ticks on
        // the x-axis.
        var yRange = [0, this._range()[1][1]];
        var coords = _.map(yRange, y => [this.state.threshold, y]);

        // Returns an inivisble, placeholder coord that anchors the line
        var invisiblePointForCoord = (coord, i) => {
            return (
                <MovablePoint
                    key={i}
                    static={true}
                    coord={coord}
                    normalStyle={{stroke: "none", fill: "none"}}
                />
            );
        };

        return (
            <MovableLine onMove={this.handleMouseInteraction}>
                {_.map(coords, invisiblePointForCoord)}
            </MovableLine>
        );
    },

    /* Renders the shaded circle in the top right. */
    _renderCircle: function() {
        var data = this.props.data;

        // Get proportion of results below threshold
        var total = _.reduce(
            data,
            (sum, next) => {
                return sum + next;
            },
            0
        );
        var numBelow = _.reduce(
            data,
            (sum, next, i) => {
                if (this.state.threshold != null && i <= this.state.threshold) {
                    return sum + next;
                } else {
                    return sum;
                }
            },
            0
        );
        var proportionBelow = numBelow / total;

        // This is a hack around the arc taking angles modulo 360.
        // TODO(charlie): Find a better way around this.
        var epsilon = 1e-5;
        var radius = 20;
        var center = [this.props.box[0] - 1.5 * radius, 1.5 * radius];

        // Plot little circle
        var plotBelowCircle = () => {
            var options = {
                key: "below",
                center: center,
                radius: radius,
                startAngle: 0,
                endAngle:
                    proportionBelow < 1 ? 360 * proportionBelow : 360 - epsilon,
                sector: proportionBelow !== 1,
                unscaled: true,
                style: {
                    fill: KhanColors.LIGHT_RED,
                    stroke: KhanColors.RED,
                },
            };

            return <Arc {...options} />;
        };
        var plotAboveCircle = () => {
            var options = {
                key: "above",
                center: center,
                radius: radius,
                startAngle:
                    proportionBelow > 0 ? 360 * proportionBelow : epsilon,
                endAngle: 360,
                sector: proportionBelow !== 0,
                unscaled: true,
                style: {
                    fill: KhanColors.LIGHT_BLUE,
                    stroke: KhanColors.BLUE,
                },
            };

            return <Arc {...options} />;
        };

        // Plot the label below the circle
        var xRange = this._range()[0];
        var formattedThreshold = Math.min(
            Math.max(this.state.threshold, xRange[0]),
            xRange[1]
        ).toFixed(2);
        var plotLabel = () => {
            var options = {
                key: "label",
                coord: [center[0], center[1] + 1.5 * radius],
                text:
                    numBelow +
                    " of " +
                    total +
                    " results below " +
                    formattedThreshold +
                    "%",
                direction: "center",
                tex: false,
                unscaled: true,
                style: {
                    fontSize: "12px",
                },
            };
            return <Label {...options} />;
        };

        return [
            proportionBelow > 0 && plotBelowCircle(),
            proportionBelow < 1 && plotAboveCircle(),
            plotLabel(),
        ];
    },

    /* Renders the actual bars of the histogram. */
    _renderData: function() {
        var data = this.props.data;
        var range = this._range();

        // Plot bars
        var barWidth = 1;
        var pathForData = (count, i) => {
            // Avoid plotting bars of height 0, else you get a thick blue line
            // over the x-axis. We don't filter these out of the data passed in
            // to this function, however, to preserve absolute indices.
            if (!count) {
                return;
            }

            var isBelow =
                this.state.threshold != null && i <= this.state.threshold;
            var style = {
                fill: isBelow ? KhanColors.LIGHT_RED : KhanColors.LIGHT_BLUE,
                stroke: isBelow ? KhanColors.RED : KhanColors.BLUE,
            };
            var coords = [
                [i, 0],
                [i, count],
                [i + barWidth, count],
                [i + barWidth, 0],
            ];
            return <Path key={i} coords={coords} style={style} />;
        };

        return _.map(data, pathForData);
    },

    render: function() {
        var data = this.props.data;
        var range = this._range();

        var options = {
            xAxisLabel: this.props.xAxisLabel,
            yAxisLabel: this.props.yAxisLabel,
            box: this.props.box,
            range: range,
            data: data,
            scale: [
                Util.scaleFromExtent(range[0], this.props.box[0]),
                Util.scaleFromExtent(range[1], this.props.box[1]),
            ],
        };

        var axisStyle = {
            stroke: "#000",
            strokeWidth: 1,
            opacity: 1.0,
        };
        var origin = [range[0][0], 0];
        var bottomRight = [range[0][1], 0];

        return (
            <Graphie
                box={options.box}
                range={options.range}
                options={options}
                setup={this._setupGraphie}
                onMouseMove={this.handleMouseInteraction}
                onMouseDown={this.handleMouseInteraction}
                setDrawingAreaAvailable={this.props.setDrawingAreaAvailable}
            >
                <Line start={origin} end={bottomRight} style={axisStyle} />
                {/* Only plot these cool extra features if there's data */}
                {data && this._renderData()}
                {data && this._renderCircle()}
                {data && this._renderThresholdLine()}
            </Graphie>
        );
    },

    _setupGraphie: function(graphie, options) {
        var data = options.data;
        var range = options.range;
        var scale = options.scale;

        /* Plot the bars that run parallel to the x-axis. */
        var xWidth = range[0][1] - range[0][0];
        var yWidth = range[1][1] - 0;

        var maxYAxisEntities = 20;
        var ySkip = Math.ceil(yWidth / maxYAxisEntities);
        _.each(_.range(0, range[1][1], ySkip), y => {
            // If there's no data, we don't label the axes
            if (data) {
                graphie.label(
                    [range[0][0], y],
                    KhanMath.roundToApprox(y, 2),
                    "left",
                    /* isTeX */ true /* for the \approx symbol */
                );
            }

            graphie.line([range[0][0], y], [range[0][1], y], {
                stroke: "#000",
                strokeWidth: 1,
                opacity: 0.3,
            });
        });

        // If there's no data, we don't label the x-axis at all
        if (data) {
            // Plot the labels below the bars
            var maxXAxisEntities = 15;
            var xSkip = Math.ceil(xWidth / maxXAxisEntities);
            _.each(_.range(range[0][0], range[0][1], xSkip), x => {
                graphie.label([x, 0], knumber.round(x, 2), "below", true);

                var tickHeight = 8;
                graphie.line([x, 0], [x, -tickHeight / scale[1]], {
                    stroke: "#000",
                    strokeWidth: 1,
                });
            });
        }

        // Add y axis (x axis is added later to overlap the bars)
        var axisStyle = {
            stroke: "#000",
            strokeWidth: 2,
            opacity: 1.0,
        };
        var origin = [range[0][0], 0];
        var topLeft = [range[0][0], range[1][1]];
        graphie.line(origin, topLeft, axisStyle);

        // Add axis labels
        var xMid = range[0][0] + xWidth / 2;
        var xOffset = data ? 25 : 0;
        graphie
            .label(
                [xMid, -xOffset / scale[1]],
                options.xAxisLabel,
                "below",
                false
            )
            .css("font-weight", "bold");

        var yMid = 0 + yWidth / 2;
        var yOffset = data ? 55 : 28;
        graphie
            .label(
                [range[0][0] - yOffset / scale[0], yMid],
                options.yAxisLabel,
                "center",
                false
            )
            .css("font-weight", "bold")
            .css("-webkit-transform", "rotate(-90deg)");
    },

    handleMouseInteraction: function(point) {
        this.setState({
            threshold: point[0],
        });
    },

    /* Convenience functions that help calculate props based on other props. */
    _range: function(props) {
        var defaultRange = [[0, 100], [-1, 10]];
        props = props || this.props;
        return props.data ? this._getRangeForData(props.data) : defaultRange;
    },

    _getRangeForData: function(data) {
        // Find first/last non-zero entry and add some padding
        var padding = 10;
        var firstIndex = _.indexOf(data, _.find(data, n => n > 0));
        var xMin = Math.max(0, firstIndex - padding);
        var lastIndex = _.lastIndexOf(data, _.last(_.filter(data, n => n > 0)));
        var xMax = Math.min(100 + 1, lastIndex + 1 + padding);

        // The y-axis is bounded above by largest value, and below by 0.
        // However, the 'range' of the y-axis goes as low as -1 to allow
        // Graphie to draw ticks on the x-Axis that extend vertically below
        // y = 0.
        var yMin = -1;
        var yMax = _.max(data);

        return [[xMin, xMax], [yMin, yMax]];
    },

    _getInitialThreshold: function(range) {
        // We pick a pretty-looking threshold, 1/3 of the way along the axis
        var xRange = range[0];
        return xRange[0] + (xRange[1] - xRange[0]) / 3;
    },
});

var Simulator = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
        apiOptions: ApiOptions.propTypes,
        data: PropTypes.arrayOf(PropTypes.number),
        numTrials: PropTypes.number,
        proportionLabel: PropTypes.string,
        proportionOrPercentage: PropTypes.string,
        randomSeed: PropTypes.number,
        sampleSize: PropTypes.number,
        trackInteraction: PropTypes.func.isRequired,
        userProportion: PropTypes.number,
        xAxisLabel: PropTypes.string,
        yAxisLabel: PropTypes.string,
    },

    getInitialState: function() {
        return {
            invalidInput: false,
        };
    },

    getDefaultProps: function() {
        return {
            data: null,
            userProportion: null,
            sampleSize: null,
            numTrials: null,
            randomSeed: 0,
            xAxisLabel: "Proportion (%)",
            yAxisLabel: "Number of times seen",
            proportionLabel: "Underlying proportion",
            proportionOrPercentage: "proportion",
            apiOptions: ApiOptions.defaults,
        };
    },

    componentWillMount: function() {
        if (this.props.randomSeed != null) {
            this.generateNumber = Util.seededRNG(this.props.randomSeed);
        }
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.randomSeed !== this.props.randomSeed) {
            this.generateNumber = Util.seededRNG(nextProps.randomSeed);
        }
    },

    render: function() {
        var inputStyle = {
            marginLeft: "5px",
        };

        var highlight = "0px 0px 0px 2px rgba(255, 165, 0, 1)";
        var highlightStyle = _.extend({}, inputStyle, {
            WebkitBoxShadow: highlight,
            MozBoxShadow: highlight,
            boxShadow: highlight,
            transition: "all 0.15s",
        });
        var unhighlightStyle = _.extend({}, inputStyle, {
            transition: "all 0.15s",
        });
        var style = this.state.invalidInput ? highlightStyle : unhighlightStyle;

        var InputComponent = this.props.apiOptions.staticRender
            ? MathOutput
            : NumberInput;

        var proportionInput = (
            <div>
                <InputComponent
                    ref="userProportion"
                    style={style}
                    value={this.calculateDisplayProportion()}
                    checkValidity={this.checkProportionValidity}
                    disabled={this.props.apiOptions.readOnly}
                    onChange={this.handleUserProportionChange}
                    onFocus={() => this.props.onFocus(["userProportion"])}
                    onBlur={() => this.props.onBlur(["userProportion"])}
                />
                <InfoTip>
                    <p>
                        This controls the proportion or percentage that will be
                        used in your simulation.
                    </p>
                </InfoTip>
            </div>
        );

        var sampleSizeInput = (
            <div>
                <InputComponent
                    ref="sampleSize"
                    style={style}
                    value={this.props.sampleSize}
                    checkValidity={val => val >= 0}
                    disabled={this.props.apiOptions.readOnly}
                    onChange={this.handleSampleSizeChange}
                    onFocus={() => this.props.onFocus(["sampleSize"])}
                    onBlur={() => this.props.onBlur(["sampleSize"])}
                />
                <InfoTip>
                    <p>
                        This controls the sample size that will be used in your
                        simulation. For example, if you set this to 100, then
                        for each trial, responses from 100 participants will be
                        simulated.
                    </p>
                </InfoTip>
            </div>
        );

        var numTrialsDisplay = (
            <div style={{textAlign: "right"}}>
                <b>
                    {this.props.numTrials}
                </b>
                <InfoTip>
                    <p>
                        This is the number of trials used in the simulation. For
                        example, if set to 50, then the survey will be conducted
                        50 times.
                    </p>
                </InfoTip>
            </div>
        );

        // Generates a table from a set of titles and values.
        var generateTable = contents => {
            var header = (
                <thead>
                    <tr>
                        <th>Parameter</th>
                        <th>Value</th>
                    </tr>
                </thead>
            );

            var body = (
                <tbody>
                    {_.map(contents, (row, i) => {
                        return (
                            <tr key={i}>
                                <td>
                                    {row.title}
                                </td>
                                <td>
                                    {row.value}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            );

            return (
                <table>
                    {header}
                    {body}
                </table>
            );
        };

        // Contents for the table to-be generated
        var contents = [
            {
                title: this.props.proportionLabel + ":",
                value: proportionInput,
            },
            {
                title: "Sample size:",
                value: sampleSizeInput,
            },
            {
                title: "Number of trials:",
                value: numTrialsDisplay,
            },
        ];

        // The 'Run Simulation' button
        var buttonStyle = {
            margin: "20px 0",
        };
        var startButton = (
            <button
                className="simple-button"
                style={buttonStyle}
                disabled={this.props.apiOptions.readOnly}
                onClick={this.handleRunSimulation}
            >
                {i18n._("Run simulation")}
            </button>
        );

        // When we plot data, ticks on the x-axis require some vertical padding
        var histogramStyle = {
            paddingBottom: this.props.data ? 40 : 0,
        };
        var histogram = (
            <div style={histogramStyle}>
                <Histogram
                    data={this.props.data}
                    xAxisLabel={this.props.xAxisLabel}
                    yAxisLabel={this.props.yAxisLabel}
                    setDrawingAreaAvailable={
                        this.props.apiOptions.setDrawingAreaAvailable
                    }
                />
            </div>
        );

        return (
            <div>
                {generateTable(contents)}
                {startButton}
                {histogram}
            </div>
        );
    },

    calculateDisplayProportion: function() {
        var userProportion = this.props.userProportion;

        // If we want to display as a percentage, multiply proportion by 100.0.
        if (this.props.proportionOrPercentage === "percentage") {
            return Math.round(100 * userProportion);
        } else {
            return userProportion;
        }
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    checkProportionValidity: function(value) {
        return (
            (value >= 0.0 &&
                (this.props.proportionOrPercentage === "proportion" &&
                    value <= 1.0)) ||
            (this.props.proportionOrPercentage === "percentage" &&
                value <= 100.0)
        );
    },

    handleUserProportionChange: function(value, cb) {
        var userProportion;

        // If "percentage" mode is enabled, user will have entered value as
        // a percentage. However, we always store as a proportion, so we cast.
        if (this.props.proportionOrPercentage === "percentage") {
            userProportion = value / 100.0;
        } else {
            userProportion = value;
        }

        // If they entered a number, we may need to cap it
        if (userProportion != null) {
            userProportion = Math.min(1.0, Math.max(0.0, userProportion));
        }
        this.props.onChange(
            {
                userProportion: userProportion,
            },
            cb
        );
    },

    handleSampleSizeChange: function(sampleSize, cb) {
        if (sampleSize != null) {
            sampleSize = Math.min(
                maxSampleSize,
                Math.max(0, Math.floor(sampleSize))
            );
        }
        this.props.onChange(
            {
                sampleSize: sampleSize,
            },
            cb
        );
    },

    handleRunSimulation: function() {
        // If they haven't filled out a parameter field, highlight it.
        if (
            this.props.numTrials == null ||
            this.props.userProportion == null ||
            this.props.sampleSize == null
        ) {
            this.setState({
                invalidInput: true,
            });
            return;
        } else {
            this.setState({
                invalidInput: false,
            });
        }
        this.props.onChange({
            data: this.generateData(),
        });
        this.props.trackInteraction();
    },

    generateData: function(props) {
        props = props || this.props;
        var getSampleDistribution = (sampleSize, numTrials, proportion) => {
            var draw = () => {
                return this.generateNumber() < proportion;
            };
            var sampleDistribution = _.times(100 + 1, () => 0);
            _.times(numTrials, () => {
                var results = _.times(sampleSize, draw);
                var count = _.filter(results, _.identity).length;
                var normalizedCount = Math.floor(100 * count / sampleSize);
                sampleDistribution[normalizedCount]++;
            });
            return sampleDistribution;
        };
        return getSampleDistribution(
            props.sampleSize,
            props.numTrials,
            props.userProportion
        );
    },

    /* InputPath API */
    getInputPaths: function() {
        return [["userProportion"], ["sampleSize"]];
    },

    focus: function() {
        var path = _.head(this.getInputPaths());
        this.focusInputPath(path);
        return true;
    },

    focusInputPath: function(path) {
        assert(path.length > 0);
        var inputID = _.head(path);
        var inputComponent = this.refs[inputID];
        inputComponent.focus();
    },

    blurInputPath: function(path) {
        assert(path.length > 0);
        var inputID = _.head(path);
        var inputComponent = this.refs[inputID];
        inputComponent.blur();
    },

    getDOMNodeForPath: function(path) {
        assert(path.length > 0);
        var inputID = _.head(path);
        return ReactDOM.findDOMNode(this.refs[inputID]);
    },

    getGrammarTypeForPath: function(path) {
        assert(path.length > 0);
        return "number";
    },

    setInputValue: function(path, newValue, cb) {
        assert(path.length > 0);
        var inputID = _.head(path);
        var capitalizedID = inputID.charAt(0).toUpperCase() + inputID.slice(1);
        var functionName = "handle" + capitalizedID + "Change";
        this[functionName](newValue, cb);
    },

    getUserInput: function() {
        return null;
    },

    simpleValidate: function(rubric) {
        return Simulator.validate(this.getUserInput(), rubric);
    },
});

_.extend(Simulator, {
    validate: function(state, rubric) {
        return {
            type: "points",
            earned: 0,
            total: 0,
            message: null,
        };
    },
});

var propTransform = editorProps => {
    var widgetProps = _.clone(editorProps);
    widgetProps.randomSeed = editorProps.problemNum;
    return widgetProps;
};

_module_.exports = {
    name: "simulator",
    displayName: "Simulator",
    widget: Simulator,
    transform: propTransform,
    hidden: true,
};
export default _module_.exports;
