// This is the TreeTransformer class described in detail at the
// top of this file.
export default class TreeTransformer {
    // To create a tree transformer, just pass the root node of the tree
    constructor(root) {
        this.root = root;
    }

    // A utility function for determing whether an arbitrary value is a node
    static isNode(n) {
        return n && typeof n === "object" && typeof n.type === "string";
    }

    // Determines whether a value is a node with type "text" and has
    // a text-valued `content` property.
    static isTextNode(n) {
        return (
            TreeTransformer.isNode(n) &&
            n.type === "text" &&
            typeof n.content === "string"
        );
    }

    // This is the main entry point for the traverse() method. See the comment
    // at the top of this file for a detailed description. Note that this
    // method just creates a new TraversalState object to use for this
    // traversal and then invokes the internal _traverse() method to begin the
    // recursion.
    traverse(f) {
        this._traverse(this.root, new TraversalState(this.root), f);
    }

    // Do a post-order traversal of node and its descendants, invoking the
    // callback function f() once for each node and returning the concatenated
    // text content of the node and its descendants. f() is passed three
    // arguments: the current node, a TraversalState object representing the
    // current state of the traversal, and a string that holds the
    // concatenated text of the node and its descendants.
    //
    // This private method holds all the traversal logic and implementation
    // details. Note that this method uses the TraversalState object to store
    // information about the structure of the tree.
    _traverse(n, state, f) {
        let content = "";
        if (TreeTransformer.isNode(n)) {
            // If we were called on a node object, then we handle it
            // this way.
            const node = (n); // safe cast; we just tested

            // Put the node on the stack before recursing on its children
            state._containers.push(node);
            state._ancestors.push(node);

            // Record the node's text content if it has any.
            // Usually this is for nodes with a type property of "text",
            // but other nodes types like "math" may also have content.
            if (typeof node.content === "string") {
                content = node.content;
            }

            // Recurse on the node. If there was content above, then there
            // probably won't be any children to recurse on, but we check
            // anyway.
            //
            // If we wanted to make the traversal completely specific to the
            // actual Perseus parse trees that we'll be dealing with we could
            // put a switch statement here to dispatch on the node type
            // property with specific recursion steps for each known type of
            // node.
            const keys = Object.keys(node);
            keys.forEach(key => {
                // Never recurse on the type property
                if (key === "type") {
                    return;
                }
                // Ignore properties that are null or primitive and only
                // recurse on objects and arrays. Note that we don't do a
                // isNode() check here. That is done in the recursive call to
                // _traverse(). Note that the recursive call on each child
                // returns the text content of the child and we add that
                // content to the content for this node. Also note that we
                // push the name of the property we're recursing over onto a
                // TraversalState stack.
                const value = node[key];
                if (value && typeof value === "object") {
                    state._indexes.push(key);
                    content += this._traverse(value, state, f);
                    state._indexes.pop();
                }
            });

            // Restore the stacks after recursing on the children
            state._currentNode = state._ancestors.pop();
            state._containers.pop();

            // And finally call the traversal callback for this node.  Note
            // that this is post-order traversal. We call the callback on the
            // way back up the tree, not on the way down.  That way we already
            // know all the content contained within the node.
            f(node, state, content);
        } else if (Array.isArray(n)) {
            // If we were called on an array instead of a node, then
            // this is the code we use to recurse.
            const nodes = n;

            // Push the array onto the stack. This will allow the
            // TraversalState object to locate siblings of this node.
            state._containers.push(nodes);

            // Now loop through this array and recurse on each element in it.
            // Before recursing on an element, we push its array index on a
            // TraversalState stack so that the TraversalState sibling methods
            // can work. Note that TraversalState methods can alter the length
            // of the array, and change the index of the current node, so we
            // are careful here to test the array length on each iteration and
            // to reset the index when we pop the stack. Also note that we
            // concatentate the text content of the children.
            let index = 0;
            while (index < nodes.length) {
                state._indexes.push(index);
                content += this._traverse(nodes[index], state, f);
                // Casting to convince Flow that this is a number
                index = (state._indexes.pop()) + 1;
            }

            // Pop the array off the stack. Note, however, that we do not call
            // the traversal callback on the array. That function is only
            // called for nodes, not arrays of nodes.
            state._containers.pop();
        }

        // The _traverse() method always returns the text content of
        // this node and its children. This is the one piece of state that
        // is not tracked in the TraversalState object.
        return content;
    }
}

// An instance of this class is passed to the callback function for
// each node traversed. The class itself is not exported, but its
// methods define the API available to the traversal callback.

/**
 * This class represents the state of a tree traversal. An instance is created
 * by the traverse() method of the TreeTransformer class to maintain the state
 * for that traversal, and the instance is passed to the traversal callback
 * function for each node that is traversed. This class is not intended to be
 * instantiated directly, but is exported so that its type can be used for
 * Flow annotaions.
 **/
export class TraversalState {
    // The constructor just stores the root node and creates empty stacks.
    constructor(root) {
        this.root = root;

        // When the callback is called, this property will hold the
        // node that is currently being traversed.
        this._currentNode = null;

        // This is a stack of the objects and arrays that we've
        // traversed through before reaching the currentNode.
        // It is different than the ancestors array.
        this._containers = new Stack();

        // This stack has the same number of elements as the _containers
        // stack. The last element of this._indexes[] is the index of
        // the current node in the object or array that is the last element
        // of this._containers[]. If the last element of this._containers[] is
        // an array, then the last element of this stack will be a number.
        // Otherwise if the last container is an object, then the last index
        // will be a string property name.
        this._indexes = new Stack();

        // This is a stack of the ancestor nodes of the current one.
        // It is different than the containers[] stack because it only
        // includes nodes, not arrays.
        this._ancestors = new Stack();
    }

    /**
     * Return the current node in the traversal. Any time the traversal
     * callback is called, this method will return the name value as the
     * first argument to the callback.
     */
    currentNode() {
        return this._currentNode || this.root;
    }

    /**
     * Return the parent of the current node, if there is one, or null.
     */
    parent() {
        return this._ancestors.top();
    }

    /**
     * Return an array of ancestor nodes. The first element of this array is
     * the same as this.parent() and the last element is the root node. If we
     * are currently at the root node, the the returned array will be empty.
     * This method makes a copy of the internal state, so modifications to the
     * returned array have no effect on the traversal.
     */
    ancestors() {
        return this._ancestors.values();
    }

    /**
     * Return the next sibling of this node, if it has one, or null otherwise.
     */
    nextSibling() {
        const siblings = this._containers.top();

        // If we're at the root of the tree or if the parent is an
        // object instead of an array, then there are no siblings.
        if (!siblings || !Array.isArray(siblings)) {
            return null;
        }

        // The top index is a number because the top container is an array
        const index = (this._indexes.top());
        if (siblings.length > index + 1) {
            return siblings[index + 1];
        } else {
            return null; // There is no next sibling
        }
    }

    /**
     * Return the previous sibling of this node, if it has one, or null
     * otherwise.
     */
    previousSibling() {
        const siblings = this._containers.top();

        // If we're at the root of the tree or if the parent is an
        // object instead of an array, then there are no siblings.
        if (!siblings || !Array.isArray(siblings)) {
            return null;
        }

        // The top index is a number because the top container is an array
        const index = (this._indexes.top());
        if (index > 0) {
            return siblings[index - 1];
        } else {
            return null; // There is no previous sibling
        }
    }

    /**
     * Remove the next sibling node (if there is one) from the tree.  Returns
     * the removed sibling or null. This method makes it easy to traverse a
     * tree and concatenate adjacent text nodes into a single node.
     */
    removeNextSibling() {
        const siblings = this._containers.top();
        if (siblings && Array.isArray(siblings)) {
            // top index is a number because top container is an array
            const index = (this._indexes.top());
            if (siblings.length > index + 1) {
                return siblings.splice(index + 1, 1)[0];
            }
        }
        return null;
    }

    /**
     * Replace the current node in the tree with the specified nodes.  If no
     * nodes are passed, this is a node deletion. If one node (or array) is
     * passed, this is a 1-for-1 replacement. If more than one node is passed
     * then this is a combination of deletion and insertion.  The new node or
     * nodes will not be traversed, so this method can safely be used to
     * reparent the current node node beneath a new parent.
     *
     * This method throws an error if you attempt to replace the root node of
     * the tree.
     */
    replace(...replacements) {
        const parent = this._containers.top();
        if (!parent) {
            throw new Error("Can't replace the root of the tree");
        }

        // The top of the container stack is either an array or an object
        // and the top of the indexes stack is a corresponding array index
        // or object property. This is hard for Flow, so we have to do some
        // unsafe casting and be careful when we use which cast version
        const parentIsArray = Array.isArray(parent);
        const array = (parent);
        const index = (this._indexes.top());
        const object = (parent);
        const property = (this._indexes.top());

        if (parentIsArray) {
            // For an array parent we just splice the new nodes in
            array.splice(index, 1, ...replacements);
            // Adjust the index to account for the changed array length.
            // We don't want to traverse any of the newly inserted nodes.
            this._indexes.pop();
            this._indexes.push(index + replacements.length - 1);
        } else {
            // For an object parent we care how many new nodes there are
            if (replacements.length === 0) {
                // Deletion
                delete object[property];
            } else if (replacements.length === 1) {
                // Replacement
                object[property] = replacements[0];
            } else {
                // Replace one node with an array of nodes
                object[property] = replacements;
            }
        }
    }

    /**
     * Returns true if the current node has a previous sibling and false
     * otherwise. If this method returns false, then previousSibling() will
     * return null, and goToPreviousSibling() will throw an error.
     */
    hasPreviousSibling() {
        return Array.isArray(this._containers.top()) &&
        (this._indexes.top()) > 0;
    }

    /**
     * Modify this traversal state object to have the state it would have had
     * when visiting the previous sibling. Note that you may want to use
     * clone() to make a copy before modifying the state object like this.
     * This mutator method is not typically used during ordinary tree
     * traversals, but is used by the Selector class for matching multi-node
     * selectors.
     */
    goToPreviousSibling() {
        if (!this.hasPreviousSibling()) {
            throw new Error(
                "goToPreviousSibling(): node has no previous sibling"
            );
        }

        this._currentNode = this.previousSibling();
        // Since we know that we have a previous sibling, we know that
        // the value on top of the stack is a number, but we have to do
        // this unsafe cast because Flow doesn't know that.
        const index = (this._indexes.pop());
        this._indexes.push(index - 1);
    }

    /**
     * Returns true if the current node has an ancestor and false otherwise.
     * If this method returns false, then the parent() method will return
     * null and goToParent() will throw an error
     */
    hasParent() {
        return this._ancestors.size() !== 0;
    }

    /**
     * Modify this object to look like it will look when we (later) visit the
     * parent node of this node. You should not modify the instance passed to
     * the tree traversal callback. Instead, make a copy with the clone()
     * method and modify that.  This mutator method is not typically used
     * during ordinary tree traversals, but is used by the Selector class for
     * matching multi-node selectors that involve parent and ancestor
     * selectors.
     */
    goToParent() {
        if (!this.hasParent()) {
            throw new Error("goToParent(): node has no ancestor");
        }

        this._currentNode = this._ancestors.pop();

        // We need to pop the containers and indexes stacks at least once
        // and more as needed until we restore the invariant that
        // this._containers.top()[this.indexes.top()] === this._currentNode
        //
        while (
            this._containers.size() &&
            // This is safe, but easier to just disable flow than do casts
            // $FlowFixMe
            this._containers.top()[this._indexes.top()] !== this._currentNode
        ) {
            this._containers.pop();
            this._indexes.pop();
        }
    }

    /**
     * Return a new TraversalState object that is a copy of this one.
     * This method is useful in conjunction with the mutating methods
     * goToParent() and goToPreviousSibling().
     */
    clone() {
        const clone = new TraversalState(this.root);
        clone._currentNode = this._currentNode;
        clone._containers = this._containers.clone();
        clone._indexes = this._indexes.clone();
        clone._ancestors = this._ancestors.clone();
        return clone;
    }

    /**
     * Returns true if this TraversalState object is equal to that
     * TraversalState object, or false otherwise. This method exists
     * primarily for use by our unit tests.
     */
    equals(that) {
        return (
            this.root === that.root &&
            this._currentNode === that._currentNode &&
            this._containers.equals(that._containers) &&
            this._indexes.equals(that._indexes) &&
            this._ancestors.equals(that._ancestors)
        );
    }
}

/**
 * This class is an internal utility that just treats an array as a stack
 * and gives us a top() method so we don't have to write expressions like
 * `ancestors[ancestors.length-1]`. The values() method automatically
 * copies the internal array so we don't have to worry about client code
 * modifying our internal stacks. The use of this Stack abstraction makes
 * the TraversalState class simpler in a number of places.
 */
class Stack {
    constructor(array) {
        this.stack = array ? array.slice(0) : [];
    }

    /** Push a value onto the stack. */
    push(v) {
        this.stack.push(v);
    }

    /** Pop a value off of the stack. */
    pop() {
        return this.stack.pop();
    }

    /** Return the top value of the stack without popping it. */
    top() {
        return this.stack[this.stack.length - 1];
    }

    /** Return a copy of the stack as an array */
    values() {
        return this.stack.slice(0);
    }

    /** Return the number of elements in the stack */
    size() {
        return this.stack.length;
    }

    /** Return a string representation of the stack */
    toString() {
        return this.stack.toString();
    }

    /** Return a shallow copy of the stack */
    clone() {
        return new Stack(this.stack);
    }

    /**
     * Compare this stack to another and return true if the contents of
     * the two arrays are the same.
     */
    equals(that) {
        if (!that || !that.stack || that.stack.length !== this.stack.length) {
            return false;
        }
        for (let i = 0; i < this.stack.length; i++) {
            if (this.stack[i] !== that.stack[i]) {
                return false;
            }
        }
        return true;
    }
}
