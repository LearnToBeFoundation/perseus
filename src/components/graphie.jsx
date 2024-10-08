import _utilGraphUtilsJs from "../util/graph-utils.js";
import _interactive2InteractiveUtilJs from "../interactive2/interactive-util.js";
import _utilJs2 from "../util.js";
import _utilJs from "../util.js";
import _graphieMovablesJsx from "./graphie-movables.jsx";
import _graphieClassesJsx from "./graphie-classes.jsx";
import _underscore from "underscore";
import _reactDom from "react-dom";
import _react from "react";
import $ from "jquery";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
const React = _react;
const ReactDOM = _reactDom;
const _ = _underscore;

const GraphieClasses = _graphieClassesJsx;
const Movables = _graphieMovablesJsx;

const GraphieMovable = GraphieClasses.GraphieMovable;

const deepEq = _utilJs.deepEq;
const nestedMap = _utilJs2.nestedMap;
const assert = _interactive2InteractiveUtilJs.assert;

const GraphUtils = _utilGraphUtilsJs;
const createGraphie = GraphUtils.createGraphie;

const Graphie = createReactClass({
    propTypes: {
        addMouseLayer: PropTypes.bool,
        box: PropTypes.arrayOf(PropTypes.number).isRequired,
        children: PropTypes.node,
        isMobile: PropTypes.bool,
        onClick: PropTypes.func,
        onMouseDown: PropTypes.func,
        onMouseMove: PropTypes.func,
        onMouseUp: PropTypes.func,
        options: PropTypes.shape({
            snapStep: PropTypes.arrayOf(PropTypes.number),
        }),
        range: PropTypes.arrayOf(
            PropTypes.arrayOf(PropTypes.number)
        ),
        responsive: PropTypes.bool,
        setDrawingAreaAvailable: PropTypes.func,
        setup: PropTypes.func.isRequired,
    },

    getDefaultProps: function() {
        return {
            range: [[-10, 10], [-10, 10]],
            options: {},
            responsive: false,
            addMouseLayer: true,
        };
    },

    componentDidMount: function() {
        this._setupGraphie();
        this._updateMovables();
    },

    shouldComponentUpdate: function(nextProps) {
        return !deepEq(this.props, nextProps);
    },

    componentDidUpdate: function(prevProps) {
        // If someone changes the setup function passed in, we should
        // technically setup graphie again. But that's definitely an
        // anti-pattern, since it is most-likely caused by passing in an
        // anonymous function rather than a "real" change, and re-rendering
        // in that case would cause us to constantly re-setup graphie, which
        // would have horrible performance implications. In order to avoid
        // those, we just warn here.
        if (
            this.props.setup !== prevProps.setup &&
            window.console &&
            window.console.warn
        ) {
            window.console.warn(
                "<Graphie> was given a new setup function. " +
                    "This is a bad idea; please refactor your code to give " +
                    "the same setup function reference to <Graphie> on " +
                    "every render."
            );
        }
        if (
            !deepEq(this.props.options, prevProps.options) ||
            !deepEq(this.props.box, prevProps.box) ||
            !deepEq(this.props.range, prevProps.range)
        ) {
            this._setupGraphie();
        }
        this._updateMovables();
    },

    /**
     * Allow parents of the <Graphie> component to grab a reference to the
     * underlying graphie object using
     * `this.refs.graphieComponent.getGraphie()`
     *
     * This shouldn't be necessary for 90% of cases, but the power is there.
     * Use it for good and not evil.
     */
    getGraphie: function() {
        return this._graphie;
    },

    // bounds-checked range
    _range: function() {
        return _.map(this.props.range, dimRange => {
            if (dimRange[0] >= dimRange[1]) {
                return [-10, 10];
            } else {
                return dimRange;
            }
        });
    },

    _box: function() {
        return _.map(this.props.box, pixelDim => {
            // 340 = default size in the editor. exact value
            // is arbitrary; this is just a safety check.
            return pixelDim > 0 ? pixelDim : 340;
        });
    },

    _scale: function() {
        const box = this._box();
        const range = this._range();
        return _.map(box, (pixelDim, i) => {
            const unitDim = range[i][1] - range[i][0];
            return pixelDim / unitDim;
        });
    },

    _setupGraphie: function() {
        this._removeMovables();

        const graphieDiv = ReactDOM.findDOMNode(this.refs.graphieDiv);
        $(graphieDiv).empty();
        const graphie = (this._graphie = createGraphie(graphieDiv));

        // This has to be called before addMouseLayer. You can re-init
        // with graphInit later if you prefer
        graphie.init({
            range: this._range(),
            scale: this._scale(),
            isMobile: this.props.isMobile,
        });
        // Only add the mouselayer if we actually want one.
        if (this.props.addMouseLayer) {
            graphie.addMouseLayer({
                onClick: this.props.onClick,
                onMouseDown: this.props.onMouseDown,
                onMouseUp: this.props.onMouseUp,
                onMouseMove: this.props.onMouseMove,
                setDrawingAreaAvailable: this.props.setDrawingAreaAvailable,
            });
        }

        graphie.snap = this.props.options.snapStep || [1, 1];

        if (this.props.responsive) {
            // Overwrite fixed styles set in init()
            // TODO(alex): Either make this component always responsive by
            // itself, or always wrap it in other components so that it is.
            $(graphieDiv).css({width: "100%", height: "100%"});
            graphie.raphael.setSize("100%", "100%");
        }

        this.props.setup(
            graphie,
            _.extend(
                {
                    range: this._range(),
                    scale: this._scale(),
                },
                this.props.options
            )
        );
    },

    _removeMovables: function() {
        // _.invoke works even when this._movables is undefined
        _.invoke(this._movables, "remove");
        this._movables = {};
    },

    _renderMovables: function(children, options) {
        // Each leaf of `children` is a movable descriptor created by a call to
        // some `GraphieMovable`, such as `MovablePoint`.
        //
        // This function takes these descriptors and renders them into
        // on-screen movables, or updates on-screen movables for
        // descriptors when possible.
        //
        // If there is no movable with that key already, this descriptor is
        // stored in this._movables and promoted to an on-screen movable by
        // calling `child.add(graphie)`.
        //
        // If a movable of the same type with the same key exists already,
        // we take `child.props` and give them to the already-existing
        // on-screen movable, and call `movable.modify()`

        const graphie = options.graphie;
        const oldMovables = options.oldMovables;
        const newMovables = options.newMovables; /* output parameter */

        const renderChildren = elem => {
            _.each(elem.movableProps, prop => {
                // Render the children, and save the results of that
                // render to the appropriate props
                elem.props[prop] = this._renderMovables(
                    elem.props[prop],
                    options
                );
            });
        };

        // Add/modify movables

        // We want to keep track of whether we have added a new svg element,
        // because if we have, then we need to call .toFront() on any svg
        // elements occurring afterwards. If this happens, we set
        // `areMovablesOutOfOrder` to true:
        let areMovablesOutOfOrder = false;
        return nestedMap(children, childDescriptor => {
            if (!childDescriptor) {
                // Still increment the key to avoid cascading key changes
                // on hiding/unhiding children, i.e. by using
                // {someBoolean && <MovablePoint />}
                options.nextKey++;
                // preserve the null/undefined in the resulting array
                return childDescriptor;
            }

            // Instantiate the descriptor to turn it into a real Movable
            const child = new childDescriptor.type(childDescriptor.props);
            assert(
                child instanceof GraphieMovable,
                "All children of a Graphie component must be Graphie " +
                    "movables"
            );

            // Give each child a key
            const keyProp = childDescriptor.key;
            const key = keyProp == null ? "_no_id_" + options.nextKey : keyProp;
            options.nextKey++;
            const ref = childDescriptor.ref;

            // We render our children first. This allows us to replace any
            // `movableProps` on our child with the on-screen movables
            // corresponding with those descriptors.
            renderChildren(child);

            const prevMovable = oldMovables[key];
            if (!prevMovable) {
                // We're creating a new child
                child.add(graphie);
                areMovablesOutOfOrder = true;

                newMovables[key] = child;
            } else if (child.constructor === prevMovable.constructor) {
                // We're updating an old child
                prevMovable.props = child.props;
                const modifyResult = prevMovable.modify(graphie);
                if (modifyResult === "reordered") {
                    areMovablesOutOfOrder = true;
                }

                newMovables[key] = prevMovable;
            } else {
                // We're destroying an old child and replacing it
                // with a new child of a different type

                // This generally is a bad idea, so warn about it if this
                // is being caused by implicit keys
                if (keyProp == null) {
                    /* eslint-disable no-console */
                    if (typeof console !== "undefined" && console.warn) {
                        console.warn(
                            "Replacing a <Graphie> child with a " +
                                "child of a different type. Please add keys " +
                                "to your <Graphie> children"
                        );
                    }
                    /* eslint-enable no-console */
                }

                prevMovable.remove();
                child.add(graphie);
                areMovablesOutOfOrder = true;

                newMovables[key] = child;
            }

            if (areMovablesOutOfOrder) {
                newMovables[key].toFront();
            }

            if (ref) {
                this.movables[ref] = newMovables[key];
            }

            return newMovables[key];
        });
    },

    // Sort of like react diffing, but for movables
    _updateMovables: function() {
        const graphie = this._graphie;

        const oldMovables = this._movables;
        const newMovables = {};
        this._movables = newMovables;
        this.movables = {};

        this._renderMovables(this.props.children, {
            nextKey: 1,
            graphie: graphie,
            oldMovables: oldMovables,
            newMovables: newMovables,
        });

        // Remove any movables that no longer exist in the child array
        _.each(oldMovables, (oldMovable, key) => {
            if (!newMovables[key]) {
                oldMovable.remove();
            }
        });
    },

    render: function() {
        return (
            <div className="graphie-container">
                <div className="graphie" ref="graphieDiv" />
            </div>
        );
    },
});

// Attach Graphie.createClass and Graphie.createSimpleClass
_.extend(Graphie, GraphieClasses);
// Attach the Movable react components for easy reference
_.extend(Graphie, Movables);

_module_.exports = Graphie;
export default _module_.exports;
