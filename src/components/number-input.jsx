import _utilMathJs from "../util/math.js";
import _kmath from "kmath";
import _utilJs2 from "../util.js";
import _utilJs from "../util.js";
import _underscore from "underscore";
import _reactDom from "react-dom";
import _react from "react";
import _classnames from "classnames";
import $ from "jquery";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable react/prop-types, react/sort-comp */

const classNames = _classnames;
const React = _react;
const ReactDOM = _reactDom;
const _ = _underscore;

const firstNumericalParse = _utilJs.firstNumericalParse;
const captureScratchpadTouchStart = _utilJs2
    .captureScratchpadTouchStart;
const knumber = _kmath.number;
const KhanMath = _utilMathJs;

const toNumericString = KhanMath.toNumericString;
const getNumericFormat = KhanMath.getNumericFormat;

/* An input box that accepts only numeric strings
 *
 * Calls onChange(value, format) for valid numbers.
 * Reverts to the current value onBlur or on [ENTER],
 *   but maintains the format (i.e. 3/2, 1 1/2, 150%)
 * Accepts empty input and sends it to onChange as null
 *   if no numeric placeholder is set.
 * If given a checkValidity function, will turn
 *   the background/outline red when invalid
 * If useArrowKeys is set to true, up/down arrows will
 *   increment/decrement integers
 * Optionally takes a size ("mini", "small", "normal")
 */
const NumberInput = createReactClass({
    propTypes: {
        value: PropTypes.number,
        format: PropTypes.string,
        placeholder: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        onChange: PropTypes.func.isRequired,
        onFormatChange: PropTypes.func,
        checkValidity: PropTypes.func,
        size: PropTypes.string,
        label: PropTypes.oneOf(["put your labels outside your inputs!"]),
    },

    getDefaultProps: function() {
        return {
            value: null,
            placeholder: null,
            format: null,
            onFormatChange: () => null,
            checkValidity: () => true,
            useArrowKeys: false,
        };
    },

    getInitialState: function() {
        return {
            format: this.props.format,
        };
    },

    render: function() {
        let classes = classNames({
            "number-input": true,
            "invalid-input": !this._checkValidity(this.props.value),
            mini: this.props.size === "mini",
            small: this.props.size === "small",
            normal: this.props.size === "normal",
        });
        if (this.props.className != null) {
            classes = classes + " " + this.props.className;
        }

        return (
            <input
                {...this.props}
                className={classes}
                type="text"
                ref="input"
                onChange={this._handleChange}
                onFocus={this._handleFocus}
                onBlur={this._handleBlur}
                onKeyPress={this._handleBlur}
                onKeyDown={this._onKeyDown}
                onTouchStart={captureScratchpadTouchStart}
                defaultValue={toNumericString(
                    this.props.value,
                    this.state.format
                )}
                value={undefined}
            />
        );
    },

    componentDidUpdate: function(prevProps) {
        if (!knumber.equal(this.getValue(), this.props.value)) {
            this._setValue(this.props.value, this.state.format);
        }
    },

    /* Return the current "value" of this input
     * If empty, it returns the placeholder (if it is a number) or null
     */
    getValue: function() {
        return this.parseInputValue(
            ReactDOM.findDOMNode(this.refs.input).value
        );
    },

    /* Return the current string value of this input */
    getStringValue: function() {
        return ReactDOM.findDOMNode(this.refs.input).value.toString();
    },

    parseInputValue: function(value) {
        if (value === "") {
            const placeholder = this.props.placeholder;
            return _.isFinite(placeholder) ? +placeholder : null;
        } else {
            const result = firstNumericalParse(value);
            return _.isFinite(result) ? result : this.props.value;
        }
    },

    /* Set text input focus to this input */
    focus: function() {
        ReactDOM.findDOMNode(this.refs.input).focus();
        this._handleFocus();
    },

    blur: function() {
        ReactDOM.findDOMNode(this.refs.input).blur();
        this._handleBlur();
    },

    setSelectionRange: function(selectionStart, selectionEnd) {
        ReactDOM.findDOMNode(this).setSelectionRange(
            selectionStart,
            selectionEnd
        );
    },

    getSelectionStart: function() {
        return ReactDOM.findDOMNode(this).selectionStart;
    },

    getSelectionEnd: function() {
        return ReactDOM.findDOMNode(this).selectionEnd;
    },

    _checkValidity: function(value) {
        if (value == null) {
            return true;
        }

        const val = firstNumericalParse(value);
        const checkValidity = this.props.checkValidity;

        return _.isFinite(val) && checkValidity(val);
    },

    _handleChange: function(e) {
        const text = e.target.value;
        const value = this.parseInputValue(text);
        const format = getNumericFormat(text);

        this.props.onChange(value);
        if (format) {
            this.props.onFormatChange(value, format);
            this.setState({format: format});
        }
    },

    _handleFocus: function() {
        if (this.props.onFocus) {
            this.props.onFocus();
        }
    },

    _handleBlur: function(e) {
        // Only continue on blur or "enter"
        if (e && e.type === "keypress" && e.keyCode !== 13) {
            return;
        }

        this._setValue(this.props.value, this.state.format);
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    },

    _onKeyDown: function(e) {
        if (this.props.onKeyDown) {
            this.props.onKeyDown(e);
        }

        if (
            !this.props.useArrowKeys ||
            !_.contains(["ArrowUp", "ArrowDown"], e.key)
        ) {
            return;
        }

        let val = this.getValue();
        if (val !== Math.floor(val)) {
            return; // bail if not an integer
        }

        if (e.key === "ArrowUp") {
            val = val + 1;
        } else if (e.key === "ArrowDown") {
            val = val - 1;
        }

        if (this._checkValidity(val)) {
            this.props.onChange(val);
        }
    },

    _setValue: function(val, format) {
        $(ReactDOM.findDOMNode(this.refs.input)).val(
            toNumericString(val, format)
        );
    },
});

_module_.exports = NumberInput;
export default _module_.exports;
