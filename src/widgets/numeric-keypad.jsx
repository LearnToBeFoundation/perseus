import _react from "react";
import {StyleSheet, css} from "aphrodite";
import * as styleConstants from "../styles/constants.js";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;

const React = _react;

const NumericKeypadWidget = createReactClass({
    propTypes: {},

    render: function() {
        // This widget acts as an activator: its mere presence enables the
        // custom software keypad via QuestionRenderer. We render a small card so
        // authors and learners see that a keypad is available.
        return (
            <div className={css(styles.container)}>
                <div className={css(styles.card)}>
                    On‑screen keypad enabled
                </div>
            </div>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        margin: 8,
    },
    card: {
        padding: 16,
        background: '#DBEAFE', // light blue, like orderer dropzone
        border: `2px solid ${styleConstants.ltbBlue}`,
        borderRadius: 12,
        color: styleConstants.gray25,
        fontFamily: styleConstants.baseFontFamily,
        textAlign: 'center',
    },
});

_module_.exports = {
    name: "numeric-keypad",
    displayName: "On-screen keypad",
    defaultAlignment: "block",
    accessible: true,
    widget: NumericKeypadWidget,
};
export default _module_.exports;

