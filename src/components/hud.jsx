import * as constants from "../styles/constants.js";
import { StyleSheet, css } from "aphrodite";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
const React = _react;

const HUD = createReactClass({
    propTypes: {
        message: PropTypes.string.isRequired,
        enabled: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired,
    },

    // Displays a stylized open eye: lint warnings are visible
    renderVisibleIcon: function() {
        return (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className={css(styles.icon)}
            >
                <defs>
                    <path
                        id="a"
                        d={
                            "M7.401 10.035c-1.424.748-2.599 1.905-3.544 " +
                            "3.48a1 1 0 0 1-1.714-1.03C4.325 8.849 7.652 7 " +
                            "12 7c4.348 0 7.675 1.848 9.857 5.486a1 1 0 0 " +
                            "1-1.714 1.028c-.945-1.574-2.12-2.73-3.544-" +
                            "3.48a5 5 0 1 1-9.198 0zM12 15a3 3 0 1 0 0-6 3 3 " +
                            "0 0 0 0 6z"
                        }
                    />
                </defs>
                <g fill="none" fillRule="evenodd">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <mask id="b" fill="#fff">
                        <use href="#a" />
                    </mask>
                    <use fill="#fff" fillRule="nonzero" href="#a" />
                    <g fill="#fff" mask="url(#b)">
                        <path d="M0 0h24v24H0z" />
                    </g>
                </g>
            </svg>
        );
    },

    // Displays a stylized eye with a line through it: I don't want to see lint
    renderHiddenIcon: function() {
        return (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className={css(styles.icon)}
            >
                <defs>
                    <path
                        id="a"
                        d={
                            "M8.794 7.38C9.791 7.127 10.86 7 12 7c4.348 0 " +
                                "7.675 1.848 9.857 5.486a1 1 0 0 1-1.714 " +
                                "1.028c-.945-1.574-2.12-2.73-3.544-3.48.258." +
                                "604.401 1.268.401 1.966 0 1.02-.305 " +
                                "1.967-.828 2.757l2.535 2.536a1 1 0 0 " +
                                "1-1.414 1.414l-12-12a1 1 0 0 1 " +
                                "1.414-1.414L8.794 7.38zm5.914 5.913a3 3 0 0 " +
                                "0-4.001-4.001l4 4.001zM6.072 8.486l2.976 " +
                                "2.976a3 3 0 0 0 3.49 3.49l1.579 1.58A5 5 0 " +
                                "0 1 7.4 10.035c-1.424.747-2.599 1.904-3.544 " +
                                "3.478a1 1 0 0 1-1.714-1.028c1.049-1.75 " +
                                "2.363-3.085 3.929-4z"
                        }
                    />
                </defs>
                <g fill="none" fillRule="evenodd">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <mask id="b" fill="#fff">
                        <use href="#a" />
                    </mask>
                    <use fill="#fff" fillRule="nonzero" href="#a" />
                    <g fill="#fff" mask="url(#b)">
                        <path d="M0 0h24v24H0z" />
                    </g>
                </g>
            </svg>
        );
    },

    render: function() {
        let state;
        let icon;
        if (this.props.enabled) {
            state = styles.enabled;
            icon = this.renderVisibleIcon();
        } else {
            state = styles.disabled;
            icon = this.renderHiddenIcon();
        }

        return (
            <button
                className={css(styles.hud, state)}
                onClick={e => {
                    this.props.onClick();
                }}
            >
                {icon}
                {this.props.message}
            </button>
        );
    },
});

const styles = StyleSheet.create({
    hud: {
        position: "fixed",
        right: 20,
        bottom: 20,
        boxSizing: "border-box",
        height: 36,
        padding: "9px 16px",
        borderRadius: 18,
        fontFamily: constants.boldFontFamily,
        fontSize: "15px",
        lineHeight: "18px",
        color: constants.white,
        userSelect: "none",
        borderWidth: 0, // <button> gives us a border by default
    },

    icon: {
        width: 24,
        height: 24,
        marginRight: 8,
        marginTop: -3,
        verticalAlign: "middle",
    },

    enabled: {
        backgroundColor: constants.warningColor,
        ":hover": {
            backgroundColor: constants.warningColorHover,
        },
        ":active": {
            backgroundColor: constants.warningColorActive,
        },
    },

    disabled: {
        backgroundColor: constants.gray76,
        ":hover": {
            backgroundColor: "#a1a5a9", // in between those two grays
        },
        ":active": {
            backgroundColor: constants.gray68,
        },
    },
});

_module_.exports = HUD;
export default _module_.exports;
