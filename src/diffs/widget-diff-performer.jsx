import _underscore from "underscore";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
const _ = _underscore;

const UNCHANGED = "unchanged";
const CHANGED = "changed";
const ADDED = "added";
const REMOVED = "removed";

// For values which do not have further values nested within them (strings,
// numbers, and booleans)
const valueEntry = function(before, after, key) {
    let status;
    if (before === after) {
        status = UNCHANGED;
    } else if (before === undefined) {
        status = ADDED;
    } else if (after === undefined) {
        status = REMOVED;
    } else {
        status = CHANGED;
    }

    return {
        after: JSON.stringify(after),
        before: JSON.stringify(before),
        children: [],
        key: key,
        status: status,
    };
};

// For values which require a more granular diff (objects and arrays)
const objectEntry = function(before, after, key) {
    const beforeKeys = _.isObject(before) ? Object.keys(before) : [];
    const afterKeys = _.isObject(after) ? Object.keys(after) : [];
    const keys = _.union(beforeKeys, afterKeys);

    const children = _.map(keys, function(key) {
        return performDiff((before || {})[key], (after || {})[key], key);
    });

    let status;
    if (before === undefined) {
        status = ADDED;
    } else if (after === undefined) {
        status = REMOVED;
    } else {
        const changed = _.any(children, function(child) {
            return child.status !== UNCHANGED;
        });
        status = changed ? CHANGED : UNCHANGED;
    }

    return {
        after: "",
        before: "",
        children: children,
        key: key,
        status: status,
    };
};

const performDiff = function(before, after, /* optional */ key) {
    if (typeof before === "object" || typeof after === "object") {
        return objectEntry(before, after, key);
    } else {
        return valueEntry(before, after, key);
    }
};

_module_.exports = performDiff;
export default _module_.exports;
