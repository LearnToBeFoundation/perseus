import _mathInput from "@khanacademy/math-input";
import { createRoot } from "react-dom/client";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable object-curly-spacing */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/**
 * A mixin that renders a custom software keypad in additional to the base
 * component. The base component will receive blur events when the keypad is
 * dismissed and can access the keypad element itself so as to manage its
 * activation and dismissal.
 *
 * TODO(charlie): This would make a nicer higher-order component, except that
 * we need to expose methods on the base component (i.e., `ItemRenderer`). When
 * `ItemRenderer` and friends are written as ES6 Classes, we can have them
 * extend a `ProvideKeypad` component instead of using this mixin.
 */

const React = _react;

const { Keypad } = _mathInput.components;

const ProvideKeypad = {
    propTypes: {
        apiOptions: PropTypes.shape({
            customKeypad: PropTypes.bool,
        }),
        // An Aphrodite style object, to be applied to the keypad container.
        // Note that, given our awkward structure of injecting the keypad, this
        // style won't be applied or updated dynamically. Rather, it will only
        // be applied in `componentDidMount`.
        keypadStyle: PropTypes.any,
    },

    getInitialState() {
        return {
            keypadElement: null,
        };
    },

    componentDidMount() {
        if (this.props.apiOptions && this.props.apiOptions.customKeypad) {
            // TODO(charlie): Render this and the wrapped component in the same
            // React tree. We may also want to add this keypad asynchronously or
            // on-demand in the future.
            this._keypadContainer = document.createElement('div');
            document.body.appendChild(this._keypadContainer);

            this._keypadRoot = createRoot(this._keypadContainer);
            this._keypadRoot.render(
                <Keypad
                    onElementMounted={element => {
                        this.setState({
                            keypadElement: element,
                        });
                    }}
                    onDismiss={() => {
                        this.blur && this.blur();
                    }}
                    style={this.props.keypadStyle}
                />
            );
        }
    },

    componentWillUnmount() {
        if (this._keypadRoot) {
            this._keypadRoot.unmount();
            this._keypadRoot = null;
        }
        if (this._keypadContainer) {
            if (this._keypadContainer.parentNode) {
                // Note ChildNode.remove() isn't available in older Android
                // webviews.
                this._keypadContainer.parentNode.removeChild(
                        this._keypadContainer);
            }
            this._keypadContainer = null;
        }
    },

    keypadElement() {
        return this.state.keypadElement;
    },
};

_module_.exports = ProvideKeypad;
export default _module_.exports;
