import _kmath from "kmath";
import _objective_Js from "./objective_.js";
import _interactiveUtilJs from "./interactive-util.js";
import _underscore from "underscore";
import $ from "jquery";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/**
 * Default methods for a wrapped movable.
 */

const _ = _underscore;
const InteractiveUtil = _interactiveUtilJs;
const objective_ = _objective_Js;
const kvector = _kmath.vector;

/*
 * These functions, when called on the wrapped object, simply pass the
 * arguments to the underlying Raphael object.
 */
const PASS_TO_RAPHAEL = [
    "attr",
    "animate",
];

const WrappedDefaults = _.extend({
    transform: function(transformation) {
        const prefixedTransform = InteractiveUtil.getPrefixedTransform();
        this.wrapper.style[prefixedTransform] = transformation;
    },

    toFront: function() {
        const parentNode = this.wrapper.parentNode;
        // TODO(emily): Sometimes, we call `.remove()` but then hold a
        // reference to this object, and sometimes call `.toFront` on it.
        // Notably, this happens in the reflection transformation in the
        // Transformer widget. This is a hacky fix. Make this less bad.
        if (parentNode) {
            parentNode.appendChild(this.wrapper);
        }
    },

    toBack: function() {
        const parentNode = this.wrapper.parentNode;
        if (parentNode.firstChild !== this.wrapper) {
            parentNode.insertBefore(
                this.wrapper,
                parentNode.firstChild
            );
        }
    },

    remove: function() {
        this.visibleShape.remove();
        $(this.wrapper).remove();
    },

    getMouseTarget: function() {
        return this.visibleShape[0];
    },

    moveTo: function(point) {
        const delta = kvector.subtract(
            this.graphie.scalePoint(point),
            this.graphie.scalePoint(this.initialPoint)
        );
        const do3dTransform = InteractiveUtil.getCanUse3dTransform();
        const transformation = "translateX(" + delta[0] + "px) " +
                             "translateY(" + delta[1] + "px)" +
                             (do3dTransform ? " translateZ(0)" : "");
        this.transform(transformation);
    },

    hide: function() {
        this.visibleShape.hide();
    },

    show: function() {
        this.visibleShape.show();
    },
}, objective_.mapObjectFromArray(PASS_TO_RAPHAEL, function(attribute) {
    return function() {
        this.visibleShape[attribute](...arguments);
    };
}));

_module_.exports = WrappedDefaults;
export default _module_.exports;
