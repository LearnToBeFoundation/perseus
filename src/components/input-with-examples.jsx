import _utilJs from "../util.js";
import { linterContextProps, linterContextDefault } from "../gorgon/proptypes.js";
import _gorgonGorgonJs from "../gorgon/gorgon.js";
import _componentsMathOutputJsx from "../components/math-output.jsx";
import _textInputJsx from "./text-input.jsx";
import _textNumericInputJsx from "./text-numeric-input.jsx";
import _rendererJsx from "../renderer.jsx";
import _mathInputJsx from "./math-input.jsx";
import _perseusApiJsx from "../perseus-api.jsx";
import _underscore from "underscore";
import _reactComponentsTooltipJsx from "react-components/tooltip.jsx";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable react/sort-comp */

const React = _react;
const Tooltip = _reactComponentsTooltipJsx;
const _ = _underscore;

const ApiClassNames = _perseusApiJsx.ClassNames;
const MathInput = _mathInputJsx;
const Renderer = _rendererJsx;
const TextInput = _textInputJsx;
const TextNumericInput = _textNumericInputJsx;
const MathOutput = _componentsMathOutputJsx;

const Gorgon = _gorgonGorgonJs;

const captureScratchpadTouchStart = _utilJs
    .captureScratchpadTouchStart;

const MATH = "math";
const TEXT = "text";
const NUMERIC = "numeric";
const TEX = "tex";

const InputWithExamples = createReactClass({
    propTypes: {
        type: PropTypes.oneOf([MATH, TEXT, TEX]),
        value: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        className: PropTypes.string,
        examples: PropTypes.arrayOf(PropTypes.string).isRequired,
        shouldShowExamples: PropTypes.bool,
        convertDotToTimes: PropTypes.bool,
        buttonSet: PropTypes.string,
        buttonsVisible: PropTypes.oneOf(["always", "never", "focused"]),
        labelText: PropTypes.string,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        disabled: PropTypes.bool,

        // A unique string identifying this InputWithExamples
        id: PropTypes.string.isRequired,
        linterContext: linterContextProps,
    },

    getDefaultProps: function() {
        return {
            type: TEXT,
            shouldShowExamples: true,
            onFocus: function() {},
            onBlur: function() {},
            disabled: false,
            linterContext: linterContextDefault,
        };
    },

    getInitialState: function() {
        return {
            focused: false,
            showExamples: false,
        };
    },

    _getUniqueId: function() {
        return `input-with-examples-${btoa(this.props.id).replace(/=/g, "")}`;
    },

    _getInputClassName: function() {
        // <MathOutput> is a special component that manages its own class and
        // state, as it's a <span> that wants to act like an <input>.
        if (this.props.type === TEX) {
            return this.props.className;
        }

        // Otherwise, we need to add these INPUT and FOCUSED tags here.
        let className = ApiClassNames.INPUT + " " + ApiClassNames.INTERACTIVE;
        if (this.state.focused) {
            className += " " + ApiClassNames.FOCUSED;
        }
        if (this.props.className) {
            className += " " + this.props.className;
        }
        return className;
    },

    _getPropsForInputType: function() {
        // Minimal set of props, used by each input type
        const inputProps = {
            "aria-describedby": this._getUniqueId(),
            ref: "input",
            className: this._getInputClassName(),
            labelText: this.props.labelText,
            value: this.props.value,
            onFocus: this._handleFocus,
            onBlur: this._handleBlur,
            disabled: this.props.disabled,
        };

        if (this.props.type === TEX) {
            return inputProps;
        }

        // Add useful props required for MATH and TEXT modes
        _.extend(inputProps, {
            onChange: this.props.onChange,
            onTouchStart: captureScratchpadTouchStart,
        });

        // And add final props that are MATH- and TEXT-specific
        if (this.props.type === MATH) {
            return _.extend(
                {
                    buttonSet: this.props.buttonSet,
                    buttonsVisible: this.props.buttonsVisible,
                    convertDotToTimes: this.props.convertDotToTimes,
                },
                inputProps
            );
        } else if (this.props.type === TEXT || this.props.type === NUMERIC) {
            return _.extend(
                {
                    autoCapitalize: "off",
                    autoComplete: "off",
                    autoCorrect: "off",
                    spellCheck: "false",
                },
                inputProps
            );
        }
    },

    _getComponentForInputType: function() {
        switch (this.props.type) {
            case TEX:
                return MathOutput;

            case MATH:
                return MathInput;

            case TEXT:
                return TextInput;
                
            case NUMERIC:
                return TextNumericInput;

            default:
                return null;
        }
    },

    _renderInput: function() {
        const inputProps = this._getPropsForInputType();
        const InputComponent = this._getComponentForInputType();
        return <InputComponent {...inputProps} />;
    },

    render: function() {
        const input = this._renderInput();

        // Static rendering, which doesn't include the 'tooltip' logic that the
        // other types require, and is hence handled separately.
        if (this.props.type === TEX) {
            return input;
        }

        // Else, we need to be able to show examples
        const examplesContent = _.map(this.props.examples, example => {
            return "- " + example;
        }).join("\n");

        const showExamples =
            this.props.shouldShowExamples && this.state.showExamples;

        return (
            <Tooltip
                ref="tooltip"
                className="perseus-formats-tooltip preview-measure"
                horizontalPosition="left"
                horizontalAlign="left"
                verticalPosition="bottom"
                arrowSize={10}
                borderColor="#ccc"
                show={showExamples}
            >
                {input}
                <div id={this._getUniqueId()}>
                    <Renderer
                        content={examplesContent}
                        linterContext={
                            Gorgon.pushContextStack(
                                this.props.linterContext, 'input-with-examples'
                            )
                        }
                    />
                </div>
            </Tooltip>
        );
    },

    _handleFocus: function() {
        this.props.onFocus();
        this.setState({
            focused: true,
            showExamples: true,
        });
    },

    show: function() {
        this.setState({showExamples: true});
    },

    hide: function() {
        this.setState({showExamples: false});
    },

    _handleBlur: function() {
        this.props.onBlur();
        this.setState({
            focused: false,
            showExamples: false,
        });
    },

    focus: function() {
        this.refs.input.focus();
    },

    blur: function() {
        this.refs.input.blur();
    },

    handleChange: function(e) {
        this.props.onChange(e.target.value);
    },
});

_module_.exports = InputWithExamples;
export default _module_.exports;
