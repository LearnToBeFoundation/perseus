import _componentsInfoTipJsx from "./components/info-tip.jsx";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable no-var */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var React = _react;

var InfoTip = _componentsInfoTipJsx;

var ItemExtrasEditor = createReactClass({
    propTypes: {
        calculator: PropTypes.bool,
        chi2Table: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        periodicTable: PropTypes.bool,
        tTable: PropTypes.bool,
        zTable: PropTypes.bool,
    },

    getDefaultProps: function() {
        return {
            calculator: false,
            chi2Table: false,
            periodicTable: false,
            tTable: false,
            zTable: false,
        };
    },

    serialize: function() {
        return {
            calculator: this.props.calculator,
            chi2Table: this.props.chi2Table,
            periodicTable: this.props.periodicTable,
            tTable: this.props.tTable,
            zTable: this.props.zTable,
        };
    },

    render: function() {
        return (
            <div className="perseus-answer-editor">
                <div className="perseus-answer-options">
                    <div>
                        <label>
                            Show calculator:{" "}
                            <input
                                type="checkbox"
                                checked={this.props.calculator}
                                onChange={e => {
                                    this.props.onChange({
                                        calculator: e.target.checked,
                                    });
                                }}
                            />
                        </label>
                        <InfoTip>
                            Use the calculator when completing difficult
                            calculations is NOT the intent of the question.
                            DON’T use the calculator when testing the student’s
                            ability to complete different types of computations.
                        </InfoTip>
                    </div>

                    <div>
                        <label>
                            Show periodic table:{" "}
                            <input
                                type="checkbox"
                                checked={this.props.periodicTable}
                                onChange={e => {
                                    this.props.onChange({
                                        periodicTable: e.target.checked,
                                    });
                                }}
                            />
                        </label>
                        <InfoTip>
                            This provides the student with the ability to view a
                            periodic table of the elements, e.g., for answering
                            chemistry questions.
                        </InfoTip>
                    </div>

                    <div>
                        <label>
                            Show z table (statistics):{" "}
                            <input
                                type="checkbox"
                                checked={this.props.zTable}
                                onChange={e => {
                                    this.props.onChange({
                                        zTable: e.target.checked,
                                    });
                                }}
                            />
                        </label>
                        <InfoTip>
                            This provides the student with the ability to view a
                            table of critical values for the z distribution,
                            e.g. for answering statistics questions.
                        </InfoTip>
                    </div>

                    <div>
                        <label>
                            Show t table (statistics):{" "}
                            <input
                                type="checkbox"
                                checked={this.props.tTable}
                                onChange={e => {
                                    this.props.onChange({
                                        tTable: e.target.checked,
                                    });
                                }}
                            />
                        </label>
                        <InfoTip>
                            This provides the student with the ability to view a
                            table of critical values for the Student's t
                            distribution, e.g. for answering statistics
                            questions.
                        </InfoTip>
                    </div>

                    <div>
                        <label>
                            Show chi-squared table (statistics):{" "}
                            <input
                                type="checkbox"
                                checked={this.props.chi2Table}
                                onChange={e => {
                                    this.props.onChange({
                                        chi2Table: e.target.checked,
                                    });
                                }}
                            />
                        </label>
                        <InfoTip>
                            This provides the student with the ability to view a
                            table of critical values for the chi-squared
                            distribution, e.g. for answering statistics
                            questions.
                        </InfoTip>
                    </div>
                </div>
            </div>
        );
    },
});

_module_.exports = ItemExtrasEditor;
export default _module_.exports;
