import _componentsNumberInputJsx from "../components/number-input.jsx";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable react/forbid-prop-types, react/sort-comp */

const React = _react;
const NumberInput = _componentsNumberInputJsx;

const truth = () => true;

/* A minor abstraction on top of NumberInput for ranges
 *
 */
const RangeInput = createReactClass({
    propTypes: {
        value: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        placeholder: PropTypes.array,
        checkValidity: PropTypes.func,
    },

    getDefaultProps: function() {
        return {
            placeholder: [null, null],
        };
    },

    render: function() {
        const value = this.props.value;
        const checkValidity = this.props.checkValidity || truth;

        return (
            <div className="range-input">
                <NumberInput
                    {...this.props}
                    value={value[0]}
                    checkValidity={val => checkValidity([val, value[1]])}
                    onChange={this.onChange.bind(this, 0)}
                    placeholder={this.props.placeholder[0]}
                />
                <NumberInput
                    {...this.props}
                    value={value[1]}
                    checkValidity={val => checkValidity([value[0], val])}
                    onChange={this.onChange.bind(this, 1)}
                    placeholder={this.props.placeholder[1]}
                />
            </div>
        );
    },

    onChange: function(i, newVal) {
        const value = this.props.value;
        if (i === 0) {
            this.props.onChange([newVal, value[1]]);
        } else {
            this.props.onChange([value[0], newVal]);
        }
    },
});

_module_.exports = RangeInput;
export default _module_.exports;
