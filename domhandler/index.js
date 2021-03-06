var ElementType = require("domelementtype");

var re_whitespace = /\s+/g;
var NodePrototype = require("./lib/node");
var ElementPrototype = require("./lib/element");

function DomHandler(callback, options, elementCB) {
    if (typeof callback === "object") {
        elementCB = options;
        options = callback;
        callback = null;
    } else if (typeof options === "function") {
        elementCB = options;
        options = defaultOpts;
    }
    this._callback = callback;
    this._options = options || defaultOpts;
    this._elementCB = elementCB;
    this.dom = [];
    this._done = false;
    this._tagStack = [];
    this._parser = this._parser || null;
}

//default options
var defaultOpts = {
    normalizeWhitespace: false, //Replace all whitespace with single spaces
    withStartIndices: false, //Add startIndex properties to nodes
    withEndIndices: false, //Add endIndex properties to nodes
};

DomHandler.prototype.onparserinit = function (parser) {
    this._parser = parser;
};

//Resets the handler back to starting state
DomHandler.prototype.onreset = function () {
    DomHandler.call(this, this._callback, this._options, this._elementCB);
};

//Signals the handler that parsing is done
DomHandler.prototype.onend = function () {
    if (this._done) return;
    this._done = true;
    this._parser = null;
    this._handleCallback(null);
};

DomHandler.prototype._handleCallback =
    DomHandler.prototype.onerror = function (error) {
        if (typeof this._callback === "function") {
            this._callback(error, this.dom);
        } else {
            if (error) throw error;
        }
    };

DomHandler.prototype.onclosetag = function () {
    //if(this._tagStack.pop().name !== name) this._handleCallback(Error("Tagname didn't match!"));

    var elem = this._tagStack.pop();

    if (this._options.withEndIndices && elem) {
        elem.endIndex = this._parser.endIndex;
    }

    elem.end = this._parser.endIndex + 1/*>*/;
    if (this._elementCB) this._elementCB(elem);
};

DomHandler.prototype._createDomElement = function (properties) {
    if (!this._options.withDomLvl1) return properties;

    var element;
    if (properties.type === "tag") {
        element = Object.create(ElementPrototype);
    } else {
        element = Object.create(NodePrototype);
    }

    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            element[key] = properties[key];
        }
    }

    return element;
};

DomHandler.prototype._addDomElement = function (element) {
    var parent = this._tagStack[this._tagStack.length - 1];
    var siblings = parent ? parent.children : this.dom;
    var previousSibling = siblings[siblings.length - 1];

    element.next = null;

    if (this._options.withStartIndices) {
        element.startIndex = this._parser.startIndex;
    }
    if (this._options.withEndIndices) {
        element.endIndex = this._parser.endIndex;
    }

    if (previousSibling) {
        element.prev = previousSibling;
        previousSibling.next = element;
    } else {
        element.prev = null;
    }

    siblings.push(element);
    element.parent = parent || null;
};

DomHandler.prototype.onopentag = function (name, attribs) {
    var properties = {
        type: ElementType.Tag,
        name: name,
        attrs: attribs,
        children: [],
        start: this._parser.startIndex,
        end: 0
    };

    var element = this._createDomElement(properties);

    this._addDomElement(element);

    this._tagStack.push(element);
};

DomHandler.prototype.ontext = function (value) {
    //the ignoreWhitespace is officially dropped, but for now,
    //it's an alias for normalizeWhitespace
    var normalize = this._options.normalizeWhitespace || this._options.ignoreWhitespace;

    var lastTag;

    if (!this._tagStack.length && this.dom.length && (lastTag = this.dom[this.dom.length - 1]).type === ElementType.Text) {
        if (normalize) {
            lastTag.value = (lastTag.value + value).replace(re_whitespace, " ");
        } else {
            lastTag.value += value;
            lastTag.end += value.length;
        }
    } else {
        if (
            this._tagStack.length &&
            (lastTag = this._tagStack[this._tagStack.length - 1]) &&
            (lastTag = lastTag.children[lastTag.children.length - 1]) &&
            lastTag.type === ElementType.Text
        ) {
            if (normalize) {
                lastTag.value = (lastTag.value + value).replace(re_whitespace, " ");
            } else {
                lastTag.value += value;
                lastTag.end += value.length;
            }
        } else {
            if (normalize) {
                value = value.replace(re_whitespace, " ");
            }

            var element = this._createDomElement({
                value: value,
                type: ElementType.Text,
                start: this._parser.startIndex,
                end: this._parser.startIndex + value.length
            });

            this._addDomElement(element);
        }
    }
};

DomHandler.prototype.oncomment = function (value) {
    var lastTag = this._tagStack[this._tagStack.length - 1];

    if (lastTag && lastTag.type === ElementType.Comment) {
        lastTag.value += value;
        lastTag.end += value.length;
        return;
    }

    var properties = {
        value: value,
        type: ElementType.Comment,
        start: this._parser.startIndex,
        end: this._parser.endIndex + 1/*>*/
    };

    var element = this._createDomElement(properties);

    this._addDomElement(element);
    this._tagStack.push(element);
};

DomHandler.prototype.oncdatastart = function () {
    var properties = {
        children: [{
            value: "",
            type: ElementType.Text
        }],
        type: ElementType.CDATA,
        start: this._parser.startIndex,
        end: this._parser.endIndex
    };

    var element = this._createDomElement(properties);

    this._addDomElement(element);
    this._tagStack.push(element);
};

DomHandler.prototype.oncommentend = DomHandler.prototype.oncdataend = function () {
    this._tagStack.pop();
};

DomHandler.prototype.onprocessinginstruction = function (name, value) {
    var element = this._createDomElement({
        name: name,
        value: value,
        type: ElementType.Directive,
        start: this._parser.startIndex,
        end: this._parser._tokenizer._index + 1/*>*/
    });

    this._addDomElement(element);
};

module.exports = DomHandler;
