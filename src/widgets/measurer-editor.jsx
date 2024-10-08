import _componentsRangeInputJsx from "../components/range-input.jsx";
import _componentsPropCheckBoxJsx from "../components/prop-check-box.jsx";
import _componentsNumberInputJsx from "../components/number-input.jsx";
import _componentsInfoTipJsx from "../components/info-tip.jsx";
import _mixinsEditorJsonifyJsx from "../mixins/editor-jsonify.jsx";
import _mixinsChangeableJsx from "../mixins/changeable.jsx";
import _underscore from "underscore";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable comma-dangle, no-var, react/jsx-closing-bracket-location, react/jsx-indent-props, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

const React = _react;
const _ = _underscore;

const Changeable = _mixinsChangeableJsx;
const EditorJsonify = _mixinsEditorJsonifyJsx;

const InfoTip = _componentsInfoTipJsx;
const NumberInput = _componentsNumberInputJsx;
const PropCheckBox = _componentsPropCheckBoxJsx;
const RangeInput = _componentsRangeInputJsx;

const defaultImage = {
    url: null,
    top: 0,
    left: 0,
};

const MeasurerEditor = createReactClass({
    className: "perseus-widget-measurer",

    propTypes: {
        ...Changeable.propTypes,
        box: PropTypes.arrayOf(PropTypes.number),
        image: PropTypes.shape({
            url: PropTypes.string,
            top: PropTypes.number,
            left: PropTypes.number,
        }),
        showProtractor: PropTypes.bool,
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
            showRuler: false,
            rulerLabel: "",
            rulerTicks: 10,
            rulerPixels: 40,
            rulerLength: 10,
        };
    },

    render: function() {
        var image = _.extend({}, defaultImage, this.props.image);

        return (
            <div className="perseus-widget-measurer">
                <div>Image displayed under protractor and/or ruler:</div>
                <div>
                    URL:{" "}
                    <input
                        type="text"
                        className="perseus-widget-measurer-url"
                        ref="image-url"
                        defaultValue={image.url}
                        onChange={this._changeUrl}
                    />
                    <InfoTip>
                        <p>
                            Create an image in graphie, or use the "Add image"
                            function to create a background.
                        </p>
                    </InfoTip>
                </div>
                {image.url &&
                    <div className="perseus-widget-row">
                        <label className="perseus-widget-left-col">
                            Pixels from top:{" "}
                            <NumberInput
                                placeholder={0}
                                onChange={this._changeTop}
                                value={image.top}
                                useArrowKeys={true}
                            />
                        </label>
                        <label className="perseus-widget-right-col">
                            Pixels from left:{" "}
                            <NumberInput
                                placeholder={0}
                                onChange={this._changeLeft}
                                value={image.left}
                                useArrowKeys={true}
                            />
                        </label>
                    </div>}
                <div>
                    Containing area [width, height]:{" "}
                    <RangeInput
                        onChange={this.change("box")}
                        value={this.props.box}
                        useArrowKeys={true}
                    />
                </div>
                <div className="perseus-widget-row">
                    <div className="perseus-widget-left-col">
                        <PropCheckBox
                            label="Show ruler"
                            showRuler={this.props.showRuler}
                            onChange={this.props.onChange}
                        />
                    </div>
                    <div className="perseus-widget-right-col">
                        <PropCheckBox
                            label="Show protractor"
                            showProtractor={this.props.showProtractor}
                            onChange={this.props.onChange}
                        />
                    </div>
                </div>
                {this.props.showRuler &&
                    <div>
                        <div>
                            <label>
                                {" "}Ruler label:{" "}
                                <select
                                    onChange={e => this.change(
                                        "rulerLabel",
                                        e.target.value
                                    )}
                                    value={this.props.rulerLabel}
                                >
                                    <option value="">None</option>
                                    <optgroup label="Metric">
                                        {this.renderLabelChoices([
                                            ["milimeters", "mm"],
                                            ["centimeters", "cm"],
                                            ["meters", "m"],
                                            ["kilometers", "km"],
                                        ])}
                                    </optgroup>
                                    <optgroup label="Imperial">
                                        {this.renderLabelChoices([
                                            ["inches", "in"],
                                            ["feet", "ft"],
                                            ["yards", "yd"],
                                            ["miles", "mi"],
                                        ])}
                                    </optgroup>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>
                                {" "}Ruler ticks:{" "}
                                <select
                                    onChange={e => this.change(
                                        "rulerTicks",
                                        +e.target.value
                                    )}
                                    value={this.props.rulerTicks}
                                >
                                    {_.map([1, 2, 4, 8, 10, 16], function(n) {
                                        return (
                                            <option key={n} value={n}>
                                                {n}
                                            </option>
                                        );
                                    })}
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>
                                Ruler pixels per unit:{" "}
                                <NumberInput
                                    placeholder={40}
                                    onChange={this.change("rulerPixels")}
                                    value={this.props.rulerPixels}
                                    useArrowKeys={true}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Ruler length in units:{" "}
                                <NumberInput
                                    placeholder={10}
                                    onChange={this.change("rulerLength")}
                                    value={this.props.rulerLength}
                                    useArrowKeys={true}
                                />
                            </label>
                        </div>
                    </div>}
            </div>
        );
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    _changeUrl: function(e) {
        this._changeImage("url", e.target.value);
    },

    _changeTop: function(newTop) {
        this._changeImage("top", newTop);
    },

    _changeLeft: function(newLeft) {
        this._changeImage("left", newLeft);
    },

    _changeImage: function(subProp, newValue) {
        var image = _.clone(this.props.image);
        image[subProp] = newValue;
        this.change("image", image);
    },

    renderLabelChoices: function(choices) {
        return _.map(choices, function(nameAndValue) {
            var [name, value] = nameAndValue;
            return (
                <option key={value} value={value}>
                    {name}
                </option>
            );
        });
    },

    serialize() {
        return EditorJsonify.serialize.call(this);
    },
});

_module_.exports = MeasurerEditor;
export default _module_.exports;
