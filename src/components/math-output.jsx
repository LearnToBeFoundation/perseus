import _texWranglerJs from "../tex-wrangler.js";
import _perseusApiJsx from "../perseus-api.jsx";
import _reactComponentsTexJsx from "react-components/tex.jsx";
import _underscore from "underscore";
import _reactDom from "react-dom";
import _react from "react";
import $ from "jquery";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable react/sort-comp */

const React = _react;
const ReactDOM = _reactDom;
const _ = _underscore;
const TeX = _reactComponentsTexJsx;
const ApiClassNames = _perseusApiJsx.ClassNames;
const ModifyTex = _texWranglerJs.modifyTex;

const MathOutput = createReactClass({
    propTypes: {
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        className: PropTypes.string,
        labelText: PropTypes.string,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
    },

    getDefaultProps: function() {
        return {
            value: "",
            onFocus: function() {},
            onBlur: function() {},
        };
    },

    getInitialState: function() {
        return {
            focused: false,
            selectorNamespace: _.uniqueId("math-output"),
        };
    },

    _getInputClassName: function() {
        let className =
            "math-output " +
            ApiClassNames.INPUT +
            " " +
            ApiClassNames.INTERACTIVE;
        if (this.state.focused) {
            className += " " + ApiClassNames.FOCUSED;
        }
        if (this.props.className) {
            className += " " + this.props.className;
        }
        return className;
    },

    _getDisplayValue: function(value) {
        // Cast from (potentially a) number to string
        let displayText;
        if (value != null) {
            displayText = "" + value;
        } else {
            displayText = "";
        }
        return ModifyTex(displayText);
    },

    render: function() {
        const divStyle = {
            textAlign: "center",
        };

        return (
            <span
                ref="input"
                className={this._getInputClassName()}
                aria-label={this.props.labelText}
                onMouseDown={this.focus}
                onTouchStart={this.focus}
            >
                <div style={divStyle}>
                    <TeX>
                        {this._getDisplayValue(this.props.value)}
                    </TeX>
                </div>
            </span>
        );
    },

    getValue: function() {
        return this.props.value;
    },

    focus: function() {
        if (!this.state.focused) {
            this.props.onFocus();
            this._bindBlurHandler();
            this.setState({
                focused: true,
            });
        }
    },

    blur: function() {
        if (this.state.focused) {
            this.props.onBlur();
            this._unbindBlurHandler();
            this.setState({
                focused: false,
            });
        }
    },

    _bindBlurHandler: function() {
        $(document).bind("vclick." + this.state.selectorNamespace, e => {
            // Detect whether the target has our ReactDOMtags.node as a parent
            const $closestWidget = $(e.target).closest(
                ReactDOM.findDOMNode(this)
            );
            if (!$closestWidget.length) {
                this.blur();
            }
        });
    },

    _unbindBlurHandler: function() {
        $(document).unbind("." + this.state.selectorNamespace);
    },

    componentWillUnmount: function() {
        this._unbindBlurHandler();
    },
});

_module_.exports = MathOutput;
export default _module_.exports;
