import _componentsPropCheckBoxJsx from "../components/prop-check-box.jsx";
import _componentsInfoTipJsx from "../components/info-tip.jsx";
import _reactComponentsBlurInputJsx from "react-components/blur-input.jsx";
import _mixinsEditorJsonifyJsx from "../mixins/editor-jsonify.jsx";
import _mixinsChangeableJsx from "../mixins/changeable.jsx";
import _underscore from "underscore";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable comma-dangle, no-console, no-var, react/jsx-closing-bracket-location, react/jsx-indent-props, react/sort-comp, space-before-function-paren, space-infix-ops */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var React = _react;
var _ = _underscore;

var Changeable = _mixinsChangeableJsx;
var EditorJsonify = _mixinsEditorJsonifyJsx;

var BlurInput = _reactComponentsBlurInputJsx;
var InfoTip = _componentsInfoTipJsx;
var PropCheckBox = _componentsPropCheckBoxJsx;

var DEFAULT_WIDTH = 400;
var DEFAULT_HEIGHT = 400;

/**
 * This is used for editing a name/value pair.
 */
var PairEditor = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
        name: PropTypes.string,
        value: PropTypes.string,
    },

    getDefaultProps: function() {
        return {
            name: "",
            value: "",
        };
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    render: function() {
        return (
            <fieldset className="pair-editor">
                <label>
                    Name:{" "}
                    <BlurInput
                        value={this.props.name}
                        onChange={this.change("name")}
                    />
                </label>
                <label>
                    {" "}Value:{" "}
                    <BlurInput
                        value={this.props.value}
                        onChange={this.change("value")}
                    />
                </label>
            </fieldset>
        );
    },

    serialize() {
        return EditorJsonify.serialize.call(this);
    },
});

/**
 * This is used for editing a set of name/value pairs.
 */
var PairsEditor = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
        pairs: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                value: PropTypes.string,
            })
        ).isRequired,
    },

    render: function() {
        var editors = _.map(this.props.pairs, (pair, i) => {
            return (
                <PairEditor
                    key={i}
                    name={pair.name}
                    value={pair.value}
                    onChange={this.handlePairChange.bind(this, i)}
                />
            );
        });
        return (
            <div>
                {editors}
            </div>
        );
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    handlePairChange: function(pairIndex, pair) {
        // If they're both non empty, add a new one
        var pairs = this.props.pairs.slice();
        pairs[pairIndex] = pair;

        var lastPair = pairs[pairs.length - 1];
        if (lastPair.name && lastPair.value) {
            pairs.push({name: "", value: ""});
        }
        this.change("pairs", pairs);
    },

    serialize() {
        return EditorJsonify.serialize.call(this);
    },
});

var KA_PROGRAM_URL = /khanacademy\.org\/computer-programming\/[^\/]+\/(\d+)/;

/**
 * Given a program URL from the site, extract its program ID.
 * If the input does not match the known URL patterns, it is assumed to be
 * a program ID.
 */
function isolateProgramID(programUrl) {
    var match = KA_PROGRAM_URL.exec(programUrl);
    if (match) {
        programUrl = match[1];
    }

    return programUrl;
}

/**
 * This is the main editor for this widget, to specify all the options.
 */
var CSProgramEditor = createReactClass({
    propTypes: {
        ...Changeable.propTypes,
    },

    getDefaultProps: function() {
        return {
            programID: "",
            settings: [{name: "", value: ""}],
            showEditor: false,
            showButtons: false,
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
        };
    },

    render: function() {
        return (
            <div>
                <label>
                    Url or Program ID:{" "}
                    <BlurInput
                        name="programID"
                        value={this.props.programID}
                        onChange={this._handleProgramIDChange}
                    />
                </label>
                <br />
                <PropCheckBox
                    label="Show Editor"
                    showEditor={this.props.showEditor}
                    onChange={this.props.onChange}
                />
                <InfoTip>
                    If you show the editor, you should use the "full-width"
                    alignment to make room for the width of the editor.
                </InfoTip>
                <br />
                <PropCheckBox
                    label="Show Buttons"
                    showButtons={this.props.showButtons}
                    onChange={this.props.onChange}
                />
                <br />
                <label>
                    Settings:
                    <PairsEditor
                        name="settings"
                        pairs={this.props.settings}
                        onChange={this._handleSettingsChange}
                    />
                    <InfoTip>
                        Settings that you add here are available to the program
                        as an object returned by <code>Program.settings()</code>
                    </InfoTip>
                </label>
            </div>
        );
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    _handleSettingsChange: function(settings) {
        this.change({settings: settings.pairs});
    },

    _handleProgramIDChange: function(programID) {
        programID = isolateProgramID(programID);

        $.getJSON(
            "https://www.khanacademy.org/api/internal/scratchpads/" + programID
        )
            .done(programInfo => {
                this.change({
                    width: programInfo.width,
                    height: programInfo.height,
                    programID: programID,
                });
            })
            .fail((jqxhr, textStatus, error) => {
                console.error(
                    "Error retrieving scratchpad info for " + "program ID ",
                    programID
                );
                console.error(textStatus + ", " + error);
                this.change({
                    width: DEFAULT_WIDTH,
                    height: DEFAULT_HEIGHT,
                    programID: programID,
                });
            });
    },

    serialize() {
        return EditorJsonify.serialize.call(this);
    },
});

_module_.exports = CSProgramEditor;
export default _module_.exports;
