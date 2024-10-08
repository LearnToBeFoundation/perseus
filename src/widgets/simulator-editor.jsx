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
/* eslint-disable comma-dangle, react/jsx-closing-bracket-location, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/* globals i18n */
const React = _react;
const _ = _underscore;

const Changeable = _mixinsChangeableJsx;
const EditorJsonify = _mixinsEditorJsonifyJsx;

const InfoTip = _componentsInfoTipJsx;
const NumberInput = _componentsNumberInputJsx;

const maxTrials = 5000;

const SimulatorEditor = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
        xAxisLabel: PropTypes.string,
        yAxisLabel: PropTypes.string,
        numTrials: PropTypes.number,
        proportionLabel: PropTypes.string,
        proportionOrPercentage: PropTypes.string,
    },

    getDefaultProps: function() {
        return {
            xAxisLabel: "Proportion (%)",
            yAxisLabel: "Number of times seen",
            numTrials: 100,
            proportionLabel: "Underlying proportion",
            proportionOrPercentage: "proportion",
        };
    },

    render: function() {
        return (
            <div className="perseus-widget-simulator">
                <div>
                    {i18n._("X-Axis Label")}:
                    <input
                        type="text"
                        className="graph-settings-axis-label"
                        value={this.props.xAxisLabel}
                        onChange={_.partial(
                            this.handleTargetValueChange,
                            "xAxisLabel"
                        )}
                    />
                </div>
                <div>
                    {i18n._("Y-Axis Label")}:
                    <input
                        type="text"
                        className="graph-settings-axis-label"
                        value={this.props.yAxisLabel}
                        onChange={_.partial(
                            this.handleTargetValueChange,
                            "yAxisLabel"
                        )}
                    />
                </div>
                <div>
                    {i18n._('"True Proportion" Label')}:
                    <input
                        type="text"
                        className="graph-settings-axis-label"
                        value={this.props.proportionLabel}
                        onChange={_.partial(
                            this.handleTargetValueChange,
                            "proportionLabel"
                        )}
                    />
                    <InfoTip>
                        <p>
                            This text will be displayed next to the box in which
                            the user enters the sample proportion for their
                            simulation. For example, if your question is about
                            surveying for approval ratings, you might want this
                            to say "Sample approval rating".
                        </p>
                    </InfoTip>
                </div>
                <div>
                    {i18n._("Proportion or Percentage")}:
                    <select
                        className="perseus-widget-dropdown"
                        value={this.props.proportionOrPercentage}
                        onChange={_.partial(
                            this.handleTargetValueChange,
                            "proportionOrPercentage"
                        )}
                    >
                        <option key="proportion" value="proportion">
                            Proportion
                        </option>
                        <option key="percentage" value="percentage">
                            Percentage
                        </option>
                    </select>
                    <InfoTip>
                        <p>
                            Do you want the user to describe their simulation in
                            terms of a proportion or a percentage?
                        </p>
                    </InfoTip>
                </div>
                <div>
                    {i18n._("Number of trials")}:
                    <NumberInput
                        value={this.props.numTrials}
                        checkValidity={val => {
                            return val >= 0 && val <= maxTrials;
                        }}
                        onChange={this.change("numTrials")}
                    />
                    <InfoTip>
                        <p>
                            This controls the number of trials used in the
                            simulation. For example, if you set this to 50, then
                            the survey will be conducted 50 times. Warning:
                            setting this too high (i.e., greater than 5000 or
                            so) will freeze the page.
                        </p>
                    </InfoTip>
                </div>
            </div>
        );
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    handleTargetValueChange: function(propName, e) {
        this.change(propName, e.target.value);
    },

    serialize() {
        return EditorJsonify.serialize.call(this);
    },
});

_module_.exports = SimulatorEditor;
export default _module_.exports;
