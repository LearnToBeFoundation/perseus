import _mixinsEditorJsonifyJsx from "../mixins/editor-jsonify.jsx";
import _mixinsChangeableJsx from "../mixins/changeable.jsx";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;

var React = _react;
var Changeable = _mixinsChangeableJsx;
var EditorJsonify = _mixinsEditorJsonifyJsx;

const NumericKeypadEditor = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
    },

    getDefaultProps: function() {
        return {};
    },

    render: function() {
        return (
            <div>
                <p>
                    This widget enables the on‑screen keypad for numeric inputs when
                    present in a problem. No configuration needed.
                </p>
            </div>
        );
    },

    serialize() {
        return EditorJsonify.serialize.call(this);
    },
});

_module_.exports = NumericKeypadEditor;
export default _module_.exports;

