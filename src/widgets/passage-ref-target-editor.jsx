import _mixinsEditorJsonifyJsx from "../mixins/editor-jsonify.jsx";
import _mixinsChangeableJsx from "../mixins/changeable.jsx";
import _underscore from "underscore";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable comma-dangle, react/jsx-closing-bracket-location, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

const React = _react;
const _ = _underscore;

const Changeable = _mixinsChangeableJsx;
const EditorJsonify = _mixinsEditorJsonifyJsx;

const PassageRefTargetEditor = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
        content: PropTypes.string,
    },

    getDefaultProps: function() {
        return {
            content: "",
        };
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    render: function() {
        return (
            <div>
                Content:
                <input
                    type="text"
                    value={this.props.content}
                    onChange={this.handleContentChange}
                />
            </div>
        );
    },

    handleContentChange: function(e) {
        this.change({content: e.target.value});
    },

    serialize() {
        return EditorJsonify.serialize.call(this);
    },
});

_module_.exports = PassageRefTargetEditor;
export default _module_.exports;
