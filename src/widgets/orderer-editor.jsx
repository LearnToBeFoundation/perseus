import _componentsTextListEditorJsx from "../components/text-list-editor.jsx";
import _componentsInfoTipJsx from "../components/info-tip.jsx";
import _underscore from "underscore";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable brace-style, comma-dangle, max-len, no-var, object-curly-spacing, one-var, react/forbid-prop-types, react/jsx-closing-bracket-location, react/jsx-indent-props, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

const React = _react;
const _ = _underscore;

const InfoTip = _componentsInfoTipJsx;
const TextListEditor = _componentsTextListEditorJsx;

var NORMAL = "normal",
    AUTO = "auto",
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical";

const OrdererEditor = createReactClass({
    propTypes: {
        correctOptions: PropTypes.array,
        otherOptions: PropTypes.array,
        defaultCards: PropTypes.array,
        height: PropTypes.oneOf([NORMAL, AUTO]),
        layout: PropTypes.oneOf([HORIZONTAL, VERTICAL]),
        onChange: PropTypes.func.isRequired,
    },

    getDefaultProps: function() {
        return {
            correctOptions: [{content: "$x$"}],
            otherOptions: [{content: "$y$"}],
            defaultCards: [],
            height: NORMAL,
            layout: HORIZONTAL,
        };
    },

    render: function() {
        return (
            <div className="perseus-widget-orderer">
                <div>
                    {" "}Correct answer:{" "}
                    <InfoTip>
                        <p>
                            Place the cards in the correct order. The same card
                            can be used more than once in the answer but will
                            only be displayed once at the top of a stack of
                            identical cards.
                        </p>
                    </InfoTip>
                </div>
                <TextListEditor
                    options={_.pluck(this.props.correctOptions, "content")}
                    onChange={this.onOptionsChange.bind(this, "correctOptions")}
                    layout={this.props.layout}
                />

                <div>
                    {" "}Other cards:{" "}
                    <InfoTip>
                        <p>Create cards that are not part of the answer.</p>
                    </InfoTip>
                </div>
                <TextListEditor
                    options={_.pluck(this.props.otherOptions, "content")}
                    onChange={this.onOptionsChange.bind(this, "otherOptions")}
                    layout={this.props.layout}
                />

                <div>
                    {" "}Default cards in dropzone:{" "}
                    <InfoTip>
                        <p>
                            Cards that will appear in the dropzone when the problem loads.
                            These cards will still be available in the bank if moved out.
                        </p>
                    </InfoTip>
                </div>
                <TextListEditor
                    options={_.pluck(this.props.defaultCards, "content")}
                    onChange={this.onOptionsChange.bind(this, "defaultCards")}
                    layout={this.props.layout}
                />

                <div>
                    <label>
                        {" "}Layout:{" "}
                        <select
                            value={this.props.layout}
                            onChange={this.onLayoutChange}
                        >
                            <option value={HORIZONTAL}>Horizontal</option>
                            <option value={VERTICAL}>Vertical</option>
                        </select>
                    </label>
                    <InfoTip>
                        <p>
                            Use the horizontal layout for short text and small
                            images. The vertical layout is best for longer text
                            (e.g. proofs).
                        </p>
                    </InfoTip>
                </div>
                <div>
                    <label>
                        {" "}Height:{" "}
                        <select
                            value={this.props.height}
                            onChange={this.onHeightChange}
                        >
                            <option value={NORMAL}>Normal</option>
                            <option value={AUTO}>Automatic</option>
                        </select>
                    </label>
                    <InfoTip>
                        <p>Use "Normal" for text, "Automatic" for images.</p>
                    </InfoTip>
                </div>
            </div>
        );
    },

    onOptionsChange: function(whichOptions, options, cb) {
        var props = {};
        props[whichOptions] = _.map(options, function(option) {
            return {content: option};
        });
        this.props.onChange(props, cb);
    },

    onLayoutChange: function(e) {
        this.props.onChange({layout: e.target.value});
    },

    onHeightChange: function(e) {
        this.props.onChange({height: e.target.value});
    },

    serialize: function() {
        // We combine the correct answer, other cards, and default cards by merging them,
        // removing duplicates and empty cards, and sorting them into
        // categories based on their content
        var options = _.chain(_.pluck(this.props.correctOptions, "content"))
            .union(_.pluck(this.props.otherOptions, "content"))
            .union(_.pluck(this.props.defaultCards, "content"))
            .uniq()
            .reject(function(content) {
                return content === "";
            })
            .sort()
            .sortBy(function(content) {
                if (/\d/.test(content)) {
                    return 0;
                } else if (/^\$?[a-zA-Z]+\$?$/.test(content)) {
                    return 2;
                } else {
                    return 1;
                }
            })
            .map(function(content) {
                return {content: content};
            })
            .value();

        return {
            options: options,
            correctOptions: this.props.correctOptions,
            otherOptions: this.props.otherOptions,
            defaultCards: this.props.defaultCards,
            height: this.props.height,
            layout: this.props.layout,
        };
    },
});

_module_.exports = OrdererEditor;
export default _module_.exports;
