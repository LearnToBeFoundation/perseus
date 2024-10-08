import _moleculeSmilesParserJsx from "./molecule/smiles-parser.jsx";
import { layout } from "./molecule/molecule-layout.jsx";
import _moleculeMoleculeDrawingJsx from "./molecule/molecule-drawing.jsx";
import _react from "react";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/* eslint-disable brace-style, object-curly-spacing */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

const React = _react;

const draw = _moleculeMoleculeDrawingJsx;
const SmilesParser = _moleculeSmilesParserJsx;

const parse = SmilesParser.parse;
const ParseError = SmilesParser.ParseError;

const borderSize = 30;

const Molecule = createReactClass({
    propTypes: {
        id: PropTypes.string.isRequired,
        rotationAngle: PropTypes.number,
        smiles: PropTypes.string,
    },

    getInitialState: function() {
        return {parsedSmiles: null, error: null};
    },

    componentWillMount: function() {
        this.stateFromSmiles(this.props.smiles);
    },

    componentDidMount: function() {
        this.canvasRender();
    },

    componentWillReceiveProps: function(nextProps) {
        this.stateFromSmiles(nextProps.smiles);
    },

    componentDidUpdate: function() {
        this.canvasRender();
    },

    stateFromSmiles: function(smiles) {
        try {
            this.setState({
                parsedSmiles: parse(smiles),
                error: null,
            });
        } catch (e) {
            if (e instanceof ParseError) {
                this.setState({error: e.message});
            } else {
                throw e;
            }
        }
    },

    setCanvasBounds: function(canvas, items) {
        const xmax = Math.max(
            ...items.map(item => item.pos ? item.pos[0] : -Infinity)
        );
        const ymax = Math.max(
            ...items.map(item => item.pos ? item.pos[1] : -Infinity)
        );
        const xmin = Math.min(
            ...items.map(item => item.pos ? item.pos[0] : Infinity)
        );
        const ymin = Math.min(
            ...items.map(item => item.pos ? item.pos[1] : Infinity)
        );
        const width = xmax - xmin + 2 * borderSize;
        const height = ymax - ymin + 2 * borderSize;
        canvas.width = width;
        canvas.height = height;
        return [borderSize - xmin, borderSize - ymin];
    },

    canvasRender: function() {
        // Since canvas drawing happens only through an imperative API, we sync
        // up the component with the canvas here, which happens when the
        // component mounts or updates.
        if (!!this.state.error || !this.state.parsedSmiles) {
            return;
        }
        const items = layout(this.state.parsedSmiles, this.props.rotationAngle);
        const canvas = this.refs.canvas;
        const translation = this.setCanvasBounds(canvas, items);
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(translation[0], translation[1]);
        draw(ctx, items);
        ctx.restore();
    },
    render: function() {
        // TODO(colin): escape the punctuation in the SMILES alt text for
        // screen readers?
        let content = (
            <canvas
                className="molecule-canvas"
                id={this.props.id + "-molecule"}
                ref="canvas"
            >
                A molecular structure drawing. SMILES notation:
                {this.props.smiles}.
            </canvas>
        );
        if (this.state.error) {
            content = (
                <div className="error">
                    {this.state.error}
                </div>
            );
        }
        return (
            <div className="molecule-canvas">
                {content}
            </div>
        );
    },
});

const MoleculeWidget = createReactClass({
    propTypes: {
        rotationAngle: PropTypes.number,
        smiles: PropTypes.string,
        widgetId: PropTypes.string,
    },

    getDefaultProps: function() {
        return {rotationAngle: 0};
    },

    simpleValidate: function() {
        return {type: "points", earned: 0, total: 0, message: null};
    },

    getUserInput: function() {
        return [];
    },

    validate: function(state, rubric) {
        // TODO(colin): this is here as part of the interface for a component.
        // Figure out if there is something more appropriate that this should
        // return.
        return {
            type: "points",
            earned: 0,
            total: 0,
            message: null,
        };
    },

    render: function() {
        return (
            <Molecule
                id={this.props.widgetId}
                smiles={this.props.smiles}
                rotationAngle={this.props.rotationAngle}
            />
        );
    },
});

_module_.exports = {
    name: "molecule-renderer",
    displayName: "Molecule renderer",
    hidden: true,
    widget: MoleculeWidget,
    molecule: Molecule,
};
export default _module_.exports;
