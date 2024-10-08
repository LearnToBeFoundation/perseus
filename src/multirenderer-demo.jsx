import { buildEmptyItemForShape, MultiRenderer, shapes } from "./multi-items.js";
import _utilJs from "./util.js";
import _multirendererEditorJsx from "./multirenderer-editor.jsx";
import _react from "react";
import { StyleSheet, css } from "aphrodite";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
const React = _react;

const MultiRendererEditor = _multirendererEditorJsx;
const Util = _utilJs;

const DemoLayout = createReactClass({
    propTypes: {
        item: PropTypes.any.isRequired,
    },

    statics: {
        shape: shapes.shape({
            sharedContext: shapes.content,
            questions: shapes.arrayOf(
                shapes.shape({
                    tags: shapes.tags,
                    question: shapes.content,
                })
            ),
            hints: shapes.hints,
        }),
    },

    getInitialState() {
        return {numHints: 0};
    },

    score() {
        return this.multirenderer.score();
    },

    getSerializedState() {
        return this.multirenderer.getSerializedState();
    },

    restoreSerializedState(state) {
        this.multirenderer.restoreSerializedState(state);
    },

    addHint() {
        this.setState((
            {
                numHints
            }
        ) => ({
            numHints: numHints + 1
        }));
    },

    clearHints() {
        this.setState({numHints: 0});
    },

    render() {
        return (
            <MultiRenderer
                ref={e => this.multirenderer = e}
                item={this.props.item}
                shape={DemoLayout.shape}
            >
                {(
                    {
                        renderers
                    }
                ) => <div>
                    <div className={css(demoStyles.left)}>
                        {renderers.sharedContext}
                    </div>
                    <div className={css(demoStyles.right)}>
                        <h2>Questions</h2>
                        <ul>
                            {renderers.questions.map((r, i) => <li key={i}>
                                {r.question}
                            </li>
                            )}
                        </ul>
                        {renderers.hints.length > 0 &&
                            <div>
                                <h2>Hints</h2>
                                {renderers.hints.firstN(
                                    this.state.numHints
                                )}
                                {this.state.numHints <
                                    renderers.hints.length &&
                                    <div>
                                        <button onClick={this.addHint}>
                                            Get a hint
                                        </button>
                                    </div>}
                                {this.state.numHints > 0 &&
                                    <div>
                                        <button onClick={this.clearHints}>
                                            Clear hints
                                        </button>
                                    </div>}
                            </div>}
                    </div>
                </div>}
            </MultiRenderer>
        );
    },
});

const demoStyles = StyleSheet.create({
    left: {
        float: "left",
    },

    right: {
        float: "right",
    },
});

const MultiRendererDemo = createReactClass({
    propTypes: {
        item: PropTypes.any.isRequired,
    },

    getDefaultProps() {
        return {
            item: buildEmptyItemForShape(DemoLayout.shape),
        };
    },

    getInitialState() {
        return {
            item: this.props.item,
            editorMode: "edit",
        };
    },

    getEditorProps() {
        return {
            Layout: DemoLayout,
            apiOptions: {
                onFocusChange: function(newPath, oldPath) {
                    console.log("onFocusChange", newPath, oldPath);
                },
                trackInteraction: function(trackData) {
                    console.log("Interaction with", trackData.type, trackData);
                },
            },

            item: this.state.item,
            editorMode: this.state.editorMode,
        };
    },

    handleChange(newState) {
        this.setState(newState);
    },

    _getContentHash: function() {
        return Util.strongEncodeURIComponent(
            // TODO(emily): this.editor.serialize()
            JSON.stringify(this.state.item)
        );
    },

    handlePermalink(e) {
        window.location.hash = `content=${this._getContentHash()}`;
        e.preventDefault();
    },

    handleScore() {
        console.log(this.editor.score());
    },

    handleSerializeState() {
        this._state = this.editor.getSerializedState();
    },

    handleRestoreState() {
        this.editor.restoreSerializedState(this._state);
    },

    render() {
        const previewVisible =
            this.state.editorMode === "edit" ||
            this.state.editorMode === "preview";

        return (
            <div>
                <div id="extras">
                    <button onClick={this.handlePermalink}>
                        Permalink
                    </button>{" "}
                    <button
                        onClick={this.handleScore}
                        disabled={!previewVisible}
                    >
                        Score
                    </button>{" "}
                    <button
                        onClick={this.handleSerializeState}
                        disabled={!previewVisible}
                    >
                        Store state
                    </button>{" "}
                    <button
                        onClick={this.handleRestoreState}
                        disabled={!previewVisible}
                    >
                        Restore state
                    </button>
                </div>
                <div className="framework-perseus">
                    <MultiRendererEditor
                        {...this.getEditorProps()}
                        onChange={this.handleChange}
                        ref={e => this.editor = e}
                    />
                </div>
            </div>
        );
    },
});

_module_.exports = MultiRendererDemo;
export default _module_.exports;
