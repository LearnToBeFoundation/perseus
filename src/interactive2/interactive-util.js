import _movableHelperMethodsJs from "./movable-helper-methods.js";
import _underscore from "underscore";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/**
 * Utility functions for writing Interactive2 movablethings
 */

const _ = _underscore;
const MovableHelperMethods = _movableHelperMethodsJs;

/**
 * Compute the correct vendor-prefixed `transform`.
 */
let prefixedTransform = null;
function computePrefixedTransform() {
    // Temporary element for testing prefix validity
    const el = document.createElement("div");

    const prefixes = ["transform", "msTransform", "MozTransform",
        "WebkitTransform", "OTransform"];
    let correctPrefix = null;
    _.each(prefixes, function(prefix) {
        if (typeof el.style[prefix] !== 'undefined') {
            correctPrefix = prefix;
        }
    });
    return correctPrefix;
}

/**
 * Compute whether the browser can use 3d transforms by trying to use the
 * translateZ transformation.
 */
let canUse3dTransform = null;
function computeCanUse3dTransform() {
    const el = document.createElement("div");

    const prefix = InteractiveUtil.getPrefixedTransform();

    el.style[prefix] = "translateZ(0px)";
    return !!el.style[prefix];
}

const InteractiveUtil = {
    assert: function(isTrue, message) {
        if (!isTrue) {
            throw new Error("Assertion Error" +
                    (message ? ": " + message : ""));
        }
    },

    /**
     * Create getters for this.state, based on the default state, `defaults`
     */
    createGettersFor: function(Class, defaults) {
        _.each(_.keys(defaults), function(key) {
            if (Class.prototype[key] === undefined) {
                Class.prototype[key] = function() {
                    return this.state[key];
                };
            }
        });
    },

    /**
     * Add MovableHelperMethods methods to a MovableThing class
     */
    addMovableHelperMethodsTo: function(Class) {
        _.each(MovableHelperMethods, function(methodFunc, methodName) {
            if (Class.prototype[methodName] === undefined) {
                Class.prototype[methodName] = methodFunc;
            }
        });
    },

    /**
     * Turn a function or an array of functions into an array of functions
     */
    arrayify: function(funcOrArray) {
        if (funcOrArray == null) {
            return [];
        } else if (_.isArray(funcOrArray)) {
            return _.filter(_.flatten(funcOrArray), _.identity);
        } else {
            return [funcOrArray];
        }
    },

    /**
     * Convert all function-or-array arguments to arrays of functions
     */
    normalizeOptions: function(arrayOptionNames, options) {
        // TODO(jack): Having to clone here is annoying; this
        // function should really just modify this.state in place
        // (and maybe be a function on MovableHelperMethods to get access
        // to this.state), which would also be nicer because we could
        // normalizeOptions once in this.modify
        const result = _.clone(options);
        _.each(arrayOptionNames, function(eventName) {
            const funcOrArray = options[eventName];
            // Only propagate values which were set; not present values
            // shouldn't be added to options because we'd like them to
            // fall through to defaults
            if (funcOrArray !== undefined) {
                const funcArray = InteractiveUtil.arrayify(funcOrArray);
                result[eventName] = funcArray;
            }
        });
        return result;
    },

    /**
     * Get the correct vendor-prefixed `transform`.
     */
    getPrefixedTransform: function() {
        // Cache result to avoid re-computation
        prefixedTransform = prefixedTransform || computePrefixedTransform();
        return prefixedTransform;
    },

    /**
     * Get whether the browser can use 3d transforms.
     */
    getCanUse3dTransform: function() {
        if (canUse3dTransform == null) {
            canUse3dTransform = computeCanUse3dTransform();
        }
        return canUse3dTransform;
    },
};

export const getCanUse3dTransform = InteractiveUtil.getCanUse3dTransform;
export default InteractiveUtil;
