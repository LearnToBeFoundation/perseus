import _mathInput3 from "@khanacademy/math-input";
import _mathInput2 from "@khanacademy/math-input";
import _mathInput from "@khanacademy/math-input";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/**
 * A version of the `math-input` subrepo's KeypadInput component that adheres to
 * the same API as Perseus's  MathOuput and NumberInput, allowing it to be
 * dropped in as a replacement for those components without any modifications.
 *
 * TODO(charlie): Once the keypad API has stabilized, move this into the
 * `math-input` subrepo and use it everywhere as a simpler, keypad-coupled
 * interface to `math-input`'s MathInput component.
 */

const React = _react;

const {KeypadInput} = _mathInput.components;
const {KeypadTypes} = _mathInput2.consts;
const {keypadElementPropType} = _mathInput3.propTypes;

const SimpleKeypadInput = createReactClass({
    propTypes: {
        keypadElement: keypadElementPropType,
        onFocus: PropTypes.func,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        // Allow callers to choose keypad type; default to NUMBER for numeric inputs
        keypadType: PropTypes.oneOf([
            KeypadTypes.NUMBER,
            KeypadTypes.FRACTION,
            KeypadTypes.EXPRESSION,
        ]),
    },

    focus() {
        this.refs.input.focus();
    },

    blur() {
        this.refs.input.blur();
    },

    getValue: function() {
        return this.props.value;
    },

    render() {
        // Intercept the `onFocus` prop, as we need to configure the keypad
        // before continuing with the default focus logic for Perseus inputs.
        // Intercept the `value` prop so as to map `null` to the empty string,
        // as the `KeypadInput` does not support `null` values.
        const {keypadElement, onFocus, value, ...rest} = this.props;

        return (
            <KeypadInput
                ref="input"
                keypadElement={keypadElement}
                onFocus={() => {
                    if (keypadElement) {
                        keypadElement.configure(
                            {
                                keypadType: this.props.keypadType || KeypadTypes.NUMBER,
                            },
                            () => {
                                if (this.isMounted()) {
                                    onFocus && onFocus();
                                }
                            }
                        );
                    } else {
                        onFocus && onFocus();
                    }
                }}
                value={value == null ? "" : "" + value}
                {...rest}
            />
        );
    },
});

_module_.exports = SimpleKeypadInput;
export default _module_.exports;
