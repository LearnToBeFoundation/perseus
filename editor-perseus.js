'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var perseus = require('./perseus-eee09be1.js');
var aphrodite = require('aphrodite');
var _react = require('react');
var _underscore = require('underscore');
var _reactDom = require('react-dom');
var _classnames = require('classnames');
require('react-addons-pure-render-mixin');
require('jquery');
require('create-react-class');
require('prop-types');
require('katex');
require('mathquill');
require('@khanacademy/math-input');
require('simple-markdown');
require('immutable');
require('draft-js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _react__default = /*#__PURE__*/_interopDefaultLegacy(_react);
var _underscore__default = /*#__PURE__*/_interopDefaultLegacy(_underscore);
var _reactDom__default = /*#__PURE__*/_interopDefaultLegacy(_reactDom);
var _classnames__default = /*#__PURE__*/_interopDefaultLegacy(_classnames);

var _excluded$1 = ["children", "color", "onClick"];
var _module_$q = {
  exports: {}
};
/**
  * Provides a simple styled button
  *
  */

var React$i = _react__default["default"];
var SimpleButton$1 = createReactClass({
  displayName: "SimpleButton",
  propTypes: {
    children: PropTypes.node,
    color: PropTypes.oneOf(["orange", "green"]),
    onClick: PropTypes.func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      children: null,
      color: "green",
      onClick: () => {}
    };
  },
  render: function render() {
    var _this$props = this.props,
      {
        children,
        color,
        onClick
      } = _this$props,
      otherProps = perseus._objectWithoutProperties(_this$props, _excluded$1);
    return /*#__PURE__*/React$i.createElement("div", perseus._extends({
      className: aphrodite.css(styles$3.baseButton, styles$3[color]),
      onClick: onClick
    }, otherProps), children);
  }
});
var styles$3 = aphrodite.StyleSheet.create({
  baseButton: {
    top: "0",
    fontSize: "11px",
    padding: "3px 10px",
    backgroundRepeat: "repeat-x",
    borderColor: "\n            rgba(0, 0, 0, 0.1)\n            rgba(0, 0, 0, 0.1)\n            rgba(0, 0, 0, 0.25)\n        ",
    color: "#ffffff",
    borderRadius: "3px",
    lineHeight: "15px",
    cursor: "pointer",
    transition: "box-shadow ease-in-out 0.15s",
    appearance: "none",
    textDecoration: "none",
    textAlign: "center",
    ":hover": {
      boxShadow: "0 1px 1px rgba(0, 0, 0, 0.35),\n                inset 0 0 50px 5px rgba(255, 255, 255, 0.2)"
    }
  },
  green: {
    border: "1px solid #7fab07",
    backgroundColor: "#80ac07",
    backgroundImage: "linear-gradient(to bottom, #8aba08, #719807)",
    ":hover": {
      borderBottomColor: "#547105",
      backgroundColor: "#719807"
    }
  },
  orange: {
    border: "1px solid #d45704",
    backgroundColor: "#d55704",
    backgroundImage: "linear-gradient(to bottom, #e35d04, #c04f03)",
    ":hover": {
      borderBottomColor: "#983e03",
      bakgroundColor: "#c04f03"
    }
  }
});
_module_$q.exports = SimpleButton$1;
var _simpleButtonJsx = _module_$q.exports;

var _module_$p = {
  exports: {}
};
/* eslint-disable comma-dangle, no-var, react/jsx-closing-bracket-location, react/prop-types, react/sort-comp, space-infix-ops */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var React$h = _react__default["default"];
var _$i = _underscore__default["default"];
var JsonEditor$3 = createReactClass({
  displayName: "JsonEditor",
  getInitialState: function getInitialState() {
    return {
      currentValue: JSON.stringify(this.props.value, null, 4),
      valid: true
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var shouldReplaceContent = !this.state.valid || !_$i.isEqual(nextProps.value, JSON.parse(this.state.currentValue));
    if (shouldReplaceContent) {
      this.setState(this.getInitialState());
    }
  },
  render: function render() {
    var classes = "perseus-json-editor " + (this.state.valid ? "valid" : "invalid");
    return /*#__PURE__*/React$h.createElement("textarea", {
      className: classes,
      value: this.state.currentValue,
      onChange: this.handleChange,
      onKeyDown: this.handleKeyDown,
      onBlur: this.handleBlur
    });
  },
  handleKeyDown: function handleKeyDown(e) {
    // This handler allows the tab character to be entered by pressing
    // tab, instead of jumping to the next (non-existant) field
    if (e.key === "Tab") {
      var cursorPos = e.target.selectionStart;
      var v = e.target.value;
      var textBefore = v.substring(0, cursorPos);
      var textAfter = v.substring(cursorPos, v.length);
      e.target.value = textBefore + "    " + textAfter;
      e.target.selectionStart = textBefore.length + 4;
      e.target.selectionEnd = textBefore.length + 4;
      e.preventDefault();
      this.handleChange(e);
    }
  },
  handleChange: function handleChange(e) {
    var nextString = e.target.value;
    try {
      var json = JSON.parse(nextString);
      // Some extra handling to allow copy-pasting from /api/vi
      if (_$i.isString(json)) {
        json = JSON.parse(json);
      }
      // This callback unfortunately causes multiple renders,
      // but seems to be necessary to avoid componentWillReceiveProps
      // being called before setState has gone through
      this.setState({
        currentValue: nextString,
        valid: true
      }, function () {
        this.props.onChange(json);
      });
    } catch (ex) {
      this.setState({
        currentValue: nextString,
        valid: false
      });
    }
  },
  // You can type whatever you want as you're typing, but if it's not valid
  // when you blur, it will revert to the last valid value.
  handleBlur: function handleBlur(e) {
    var nextString = e.target.value;
    try {
      var json = JSON.parse(nextString);
      // Some extra handling to allow copy-pasting from /api/vi
      if (_$i.isString(json)) {
        json = JSON.parse(json);
      }
      // This callback unfortunately causes multiple renders,
      // but seems to be necessary to avoid componentWillReceiveProps
      // being called before setState has gone through
      this.setState({
        currentValue: JSON.stringify(json, null, 4),
        valid: true
      }, function () {
        this.props.onChange(json);
      });
    } catch (ex) {
      this.setState({
        currentValue: JSON.stringify(this.props.value, null, 4),
        valid: true
      });
    }
  }
});
_module_$p.exports = JsonEditor$3;
var _jsonEditorJsx = _module_$p.exports;

var _module_$o = {
  exports: {}
};
/**
 * Displays the given content in an iframe, isolating it from the parent page
 *
 * To simulate the environment of content rendered by itself, content previews
 * are rendered inside iframes, where components such as the math keypad work
 * because the body of the document is not the body of the editor. To make this
 * work, this component renders an iframe and can communicate objects to it
 * through postMessage. The recipient then needs to listen for these messages
 * and pull out the appropriate object stored in the parent's iframeDataStore
 * to get the data to render. When the iframe is loaded, it's javascript calls
 * its requestIframeData function in the parent, which triggers the parent to
 * send the current data.
 */

var React$g = _react__default["default"];
var nextIframeID = 0;
var requestIframeData = {};
var updateIframeHeight = {};
window.iframeDataStore = {};

// This is called once after Perseus is loaded and the iframe
// is ready to render content, then twice a second afterwards
// to capture the result of animations.
window.addEventListener("message", event => {
  if (typeof event.data === "string") {
    // In Perseus, we expect the callback to exist, as it is added by
    // `IframeContentRenderer.componentDidMount()`. Unfortunately, this
    // event listener also gets added in Manticore (since we include Perseus
    // from there), and Crowdin fires its own "message" events. So we'll
    // just have to ignore the event when we can't find the callback.
    var callback = requestIframeData[event.data];
    if (callback) {
      callback();
    }
  } else if (event.data.id) {
    if (event.data.height !== undefined) {
      updateIframeHeight[event.data.id](event.data.height);
    } else if (event.data.lintWarnings) {
      // This is a lint report being sent back from the linter.
      // TODO:
      // We'll want to display the number of warnings in the HUD.
      // But for now, we just log it to the console
      // eslint-disable-next-line no-console
      console.log("LINTER REPORT", event.data.lintWarnings);
    }
  }
});
var IframeContentRenderer$2 = createReactClass({
  displayName: "IframeContentRenderer",
  propTypes: {
    // The HTML content to render to the iframe
    content: PropTypes.string.isRequired,
    // The data-* suffix for passing information to the iframe's JS
    datasetKey: PropTypes.any,
    // The value of the data-* attribute
    datasetValue: PropTypes.any,
    // Whether to make the iframe's height match its content's height,
    // used to prevent scrolling inside the iframe.
    seamless: PropTypes.bool
  },
  componentDidMount: function componentDidMount() {
    this.iframeID = nextIframeID;
    nextIframeID++;
    this._prepareFrame();
    requestIframeData[this.iframeID] = () => {
      this.sendNewData(this._lastData);
    };
    updateIframeHeight[this.iframeID] = height => {
      this._lastHeight = height;
      if (this.isMounted() && this.props.seamless) {
        this.refs.container.style.height = height + "px";
      }
    };
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    return nextProps.content !== this.props.content || nextProps.datasetValue !== this.props.datasetValue || nextProps.seamless !== this.props.seamless;
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (!this.props.seamless) {
      this.refs.container.style.height = "100%";
    } else {
      this.refs.container.style.height = this._lastHeight + "px";
    }
    if (prevProps.content !== this.props.content || prevProps.datasetValue !== this.props.datasetValue) {
      // Not just a change in seamless
      this._prepareFrame();
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    requestIframeData[this.iframeID] = null;
    updateIframeHeight[this.iframeID] = null;
  },
  _prepareFrame: function _prepareFrame() {
    // Don't initialize the iframe until the page has loaded
    if (this._frame) {
      this.refs.container.removeChild(this._frame);
    }
    this._frame = document.createElement("iframe");
    this._frame.style.width = "100%";
    this._frame.style.height = "100%";
    if (this.props.datasetKey) {
      // If the user has specified a data-* attribute to place on the
      // iframe, we set it here. Right now, this is used to
      // communicate if the iframe should be enabling touch emulation.
      this._frame.dataset[this.props.datasetKey] = this.props.datasetValue;
    }
    this._frame.dataset.id = this.iframeID;
    if (this.props.seamless) {
      // The seamless prop is the same as the "nochrome" prop that
      // gets passed to DeviceFramer. If it is set, then we're going
      // to be displaying editor previews and want to leave some room
      // for lint indicators in the right margin. We use the dataset
      // as above to pass this information on to the perseus-frame
      // component inside the iframe
      this._frame.dataset.lintGutter = true;
    }

    // To make sure the value of location.href inside the iframe is the
    // same as the location of the parent, we wait for the iframe to
    // load before writing contents. Without the wait, the location
    // inside the iframe becomes "about:blank", which causes problems
    // with loading $LAB.
    this._frame.onload = () => {
      this._frame.onload = null;

      // To prevent an issue with the contents of the iframe not being
      // loaded properly, where the javascript inside the iframe is
      // not executed, we push the content window write to the end
      // of the event queue.
      setTimeout(() => {
        this._frame.contentWindow.document.open();
        this._frame.contentWindow.document.write(this.props.content);
        this._frame.contentWindow.document.close();
      });
    };
    this.refs.container.appendChild(this._frame);
  },
  sendNewData: function sendNewData(data) {
    if (this.isMounted() && data) {
      this._lastData = data;

      // We can't use JSON.stringify/parse for this because the apiOptions
      // includes the functions GroupMetadataEditor, groupAnnotator,
      // onFocusChange, and onInputError.
      window.iframeDataStore[this.iframeID] = data;
      this._frame.contentWindow.postMessage(this.iframeID, "*");
    }
  },
  render: function render() {
    return /*#__PURE__*/React$g.createElement("div", {
      ref: "container",
      style: {
        width: "100%",
        height: "100%"
      }
    });
  }
});
_module_$o.exports = IframeContentRenderer$2;
var _iframeContentRendererJsx = _module_$o.exports;

var devices = {
  PHONE: "phone",
  TABLET: "tablet",
  DESKTOP: "desktop"
};

// How many pixels do we reserve on the right-hand side of a preview
// for displaying lint indicators? This space needs to be reserved
// in DeviceFramer, but it is actually allocated in PerseusFrame
var lintGutterWidth = 36;

// How wide a border does PerseusFrame draw? We need to allocate enough
// space for it in DeviceFramer.
var perseusFrameBorderWidth = 1;
var _constantsJs = {
  devices: devices,
  lintGutterWidth,
  perseusFrameBorderWidth
};

var _module_$n = {
  exports: {}
};
/**
 * A component that displays its contents inside a device frame.
 */

var React$f = _react__default["default"];
var constants = _constantsJs;
var SCREEN_SIZES = {
  phone: {
    width: 320,
    height: 480,
    framedWidth: 320
  },
  tablet: {
    width: 750,
    height: 920,
    framedWidth: 525
  },
  desktop: {
    width: 688,
    height: 600,
    framedWidth: 688
  }
};
var DeviceFramer$2 = createReactClass({
  displayName: "DeviceFramer",
  propTypes: {
    children: PropTypes.element.isRequired,
    deviceType: PropTypes.oneOf([constants.devices.PHONE, constants.devices.TABLET, constants.devices.DESKTOP]).isRequired,
    // TODO(kevinb) rename to variableHeight
    nochrome: PropTypes.bool
  },
  render: function render() {
    var deviceType = this.props.deviceType;
    if (this.props.nochrome) {
      // Render content inside a variable height iframe.  Used on the
      // "edit" table of the content editor. In this mode, PerseusFrame
      // will draw the border and reserve space on the right for
      // lint indicators.
      return /*#__PURE__*/React$f.createElement("div", null, /*#__PURE__*/React$f.createElement("div", {
        key: "screen",
        style: {
          width: SCREEN_SIZES[deviceType].framedWidth + 2 * constants.perseusFrameBorderWidth + constants.lintGutterWidth
        }
      }, /*#__PURE__*/React$f.createElement("div", null, this.props.children)));
    } else {
      var scale = SCREEN_SIZES[deviceType].framedWidth / SCREEN_SIZES[deviceType].width;

      // In this mode we draw our own border and don't reserve
      // space for a lint gutter.
      var screenStyle = {
        backgroundColor: "white",
        color: "black",
        textAlign: "left",
        width: SCREEN_SIZES[deviceType].width,
        height: SCREEN_SIZES[deviceType].height,
        border: "solid 1px #CCC",
        margin: 8,
        zoom: scale
      };
      return /*#__PURE__*/React$f.createElement("div", {
        key: "screen",
        className: "screen",
        style: screenStyle
      }, this.props.children);
    }
  }
});
_module_$n.exports = DeviceFramer$2;
var _componentsDeviceFramerJsx = _module_$n.exports;

/* eslint-disable no-var, object-curly-spacing, react/jsx-closing-bracket-location, react/jsx-indent-props, react/prop-types, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/* Collection of classes for rendering the hint editor area,
 * hint editor boxes, and hint previews
 */

var React$e = _react__default["default"];
var _$h = _underscore__default["default"];
var InfoTip$1 = perseus._componentsInfoTipJsx;
var ApiOptions$3 = perseus._perseusApiJsx.Options;
var InlineIcon$3 = perseus._componentsInlineIconJsx;

/* Renders a hint editor box
 *
 * This includes:
 *  ~ A "Hint" title
 *  ~ the textarea for the hint
 *  ~ the "remove this hint" box
 *  ~ the move hint up/down arrows
 */
var HintEditor = createReactClass({
  displayName: "HintEditor",
  propTypes: {
    apiOptions: ApiOptions$3.propTypes,
    className: PropTypes.string,
    imageUploader: PropTypes.func,
    showMoveButtons: PropTypes.bool,
    showRemoveButton: PropTypes.bool,
    showTitle: PropTypes.bool
  },
  getDefaultProps: function getDefaultProps() {
    return {
      content: "",
      replace: false,
      showMoveButtons: true,
      showTitle: true,
      showRemoveButton: true
    };
  },
  handleChange: function handleChange(e) {
    this.props.onChange({
      replace: e.target.checked
    });
  },
  render: function render() {
    return /*#__PURE__*/React$e.createElement("div", {
      className: "perseus-hint-editor " + this.props.className
    }, this.props.showTitle && /*#__PURE__*/React$e.createElement("div", {
      className: "pod-title"
    }, "Hint"), /*#__PURE__*/React$e.createElement(perseus._editorJsx, {
      ref: "editor",
      apiOptions: this.props.apiOptions,
      widgets: this.props.widgets,
      content: this.props.content,
      images: this.props.images,
      replace: this.props.replace,
      placeholder: "Type your hint here...",
      imageUploader: this.props.imageUploader,
      onChange: this.props.onChange
    }), /*#__PURE__*/React$e.createElement("div", {
      className: "hint-controls-container clearfix"
    }, this.props.showMoveButtons && /*#__PURE__*/React$e.createElement("span", {
      className: "reorder-hints"
    }, /*#__PURE__*/React$e.createElement("button", {
      type: "button",
      className: this.props.isLast ? "hidden" : "",
      onClick: _$h.partial(this.props.onMove, 1)
    }, /*#__PURE__*/React$e.createElement(InlineIcon$3, perseus.iconCircleArrowDown)), " ", /*#__PURE__*/React$e.createElement("button", {
      type: "button",
      className: this.props.isFirst ? "hidden" : "",
      onClick: _$h.partial(this.props.onMove, -1)
    }, /*#__PURE__*/React$e.createElement(InlineIcon$3, perseus.iconCircleArrowUp)), " ", this.props.isLast && /*#__PURE__*/React$e.createElement(InfoTip$1, null, /*#__PURE__*/React$e.createElement("p", null, "The last hint is automatically bolded."))), /*#__PURE__*/React$e.createElement("input", {
      type: "checkbox",
      checked: this.props.replace,
      onChange: this.handleChange
    }), "Replace previous hint", this.props.showRemoveButton && /*#__PURE__*/React$e.createElement("button", {
      type: "button",
      className: "remove-hint simple-button orange",
      onClick: this.props.onRemove
    }, /*#__PURE__*/React$e.createElement(InlineIcon$3, perseus.iconTrash), "Remove this hint", " ")));
  },
  focus: function focus() {
    this.refs.editor.focus();
  },
  getSaveWarnings: function getSaveWarnings() {
    return this.refs.editor.getSaveWarnings();
  },
  serialize: function serialize(options) {
    return this.refs.editor.serialize(options);
  }
});

/* A single hint-row containing a hint editor and preview */
var CombinedHintEditor = createReactClass({
  displayName: "CombinedHintEditor",
  propTypes: {
    apiOptions: ApiOptions$3.propTypes,
    deviceType: PropTypes.string.isRequired,
    frameSource: PropTypes.string.isRequired,
    imageUploader: PropTypes.func,
    highlightLint: PropTypes.bool
  },
  getDefaultProps: function getDefaultProps() {
    return {
      highlightLint: false
    };
  },
  updatePreview: function updatePreview() {
    // TODO(aria): decide what to do with this
    //const shouldBold =
    //    this.props.isLast && !/\*\*/.test(this.props.hint.content);
    //this.refs.frame.sendNewData({
    //    type: "hint",
    //    data: {
    //        hint: this.props.hint,
    //        bold: shouldBold,
    //        pos: this.props.pos,
    //        apiOptions: this.props.apiOptions,
    //        linterContext: {
    //            contentType: "hint",
    //            highlightLint: this.props.highlightLint,
    //            paths: this.props.contentPaths,
    //        },
    //    },
    //});
  },
  componentDidMount: function componentDidMount() {
    this.updatePreview();
  },
  componentDidUpdate: function componentDidUpdate() {
    this.updatePreview();
  },
  render: function render() {
    this.props.deviceType === "phone" || this.props.deviceType === "tablet";
    return /*#__PURE__*/React$e.createElement("div", {
      className: "perseus-combined-hint-editor " + "perseus-editor-row"
    }, /*#__PURE__*/React$e.createElement("div", {
      className: "perseus-editor-left-cell"
    }, /*#__PURE__*/React$e.createElement(HintEditor, {
      ref: "editor",
      isFirst: this.props.isFirst,
      isLast: this.props.isLast,
      widgets: this.props.hint.widgets,
      content: this.props.hint.content,
      images: this.props.hint.images,
      replace: this.props.hint.replace,
      imageUploader: this.props.imageUploader,
      onChange: this.props.onChange,
      onRemove: this.props.onRemove,
      onMove: this.props.onMove,
      apiOptions: this.props.apiOptions
    })), /*#__PURE__*/React$e.createElement("div", {
      className: "perseus-editor-right-cell"
    }, /*#__PURE__*/React$e.createElement(perseus.Renderer, perseus._extends({
      apiOptions: this.props.apiOptions
    }, this.props.hint))));
  },
  getSaveWarnings: function getSaveWarnings() {
    return this.refs.editor.getSaveWarnings();
  },
  serialize: function serialize(options) {
    return this.refs.editor.serialize(options);
  },
  focus: function focus() {
    this.refs.editor.focus();
  }
});

/* The entire hints editing/preview area
 *
 * Includes:
 *  ~ All the hint edit boxes, move and remove buttons
 *  ~ All the hint previews
 *  ~ The "add a hint" button
 */
var CombinedHintsEditor$1 = createReactClass({
  displayName: "CombinedHintsEditor",
  propTypes: {
    apiOptions: ApiOptions$3.propTypes,
    deviceType: PropTypes.string.isRequired,
    frameSource: PropTypes.string.isRequired,
    imageUploader: PropTypes.func,
    highlightLint: PropTypes.bool
  },
  statics: {
    HintEditor
  },
  getDefaultProps: function getDefaultProps() {
    return {
      onChange: () => {},
      hints: [],
      highlightLint: false
    };
  },
  render: function render() {
    var hints = this.props.hints;
    var hintElems = _$h.map(hints, function (hint, i) {
      return /*#__PURE__*/React$e.createElement(CombinedHintEditor, {
        ref: "hintEditor" + i,
        key: "hintEditor" + i,
        isFirst: i === 0,
        isLast: i + 1 === hints.length,
        hint: hint,
        pos: i,
        imageUploader: this.props.imageUploader,
        onChange: this.handleHintChange.bind(this, i),
        onRemove: this.handleHintRemove.bind(this, i),
        onMove: this.handleHintMove.bind(this, i),
        deviceType: this.props.deviceType,
        apiOptions: this.props.apiOptions,
        frameSource: this.props.frameSource,
        highlightLint: this.props.highlightLint
      });
    }, this);

    /* eslint-disable max-len */
    return /*#__PURE__*/React$e.createElement("div", {
      className: "perseus-hints-editor perseus-editor-table"
    }, hintElems, /*#__PURE__*/React$e.createElement("div", {
      className: "perseus-editor-row"
    }, /*#__PURE__*/React$e.createElement("div", {
      className: "add-hint-container perseus-editor-left-cell"
    }, /*#__PURE__*/React$e.createElement("button", {
      type: "button",
      className: "add-hint simple-button orange",
      onClick: this.addHint
    }, /*#__PURE__*/React$e.createElement(InlineIcon$3, perseus.iconPlus), " Add a hint"))));
    /* eslint-enable max-len */
  },
  handleHintChange: function handleHintChange(i, newProps, cb, silent) {
    // TODO(joel) - lens
    var hints = _$h.clone(this.props.hints);
    hints[i] = _$h.extend({}, this.serializeHint(i, {
      keepDeletedWidgets: true
    }), newProps);
    this.props.onChange({
      hints: hints
    }, cb, silent);
  },
  handleHintRemove: function handleHintRemove(i) {
    var hints = _$h.clone(this.props.hints);
    hints.splice(i, 1);
    this.props.onChange({
      hints: hints
    });
  },
  handleHintMove: function handleHintMove(i, dir) {
    var hints = _$h.clone(this.props.hints);
    var hint = hints.splice(i, 1)[0];
    hints.splice(i + dir, 0, hint);
    this.props.onChange({
      hints: hints
    }, () => {
      this.refs["hintEditor" + (i + dir)].focus();
    });
  },
  addHint: function addHint() {
    var hints = _$h.clone(this.props.hints).concat([{
      content: ""
    }]);
    this.props.onChange({
      hints: hints
    }, () => {
      var i = hints.length - 1;
      this.refs["hintEditor" + i].focus();
    });
  },
  getSaveWarnings: function getSaveWarnings() {
    return _$h.chain(this.props.hints).map((hint, i) => {
      return _$h.map(this.refs["hintEditor" + i].getSaveWarnings(), issue => "Hint " + (i + 1) + ": " + issue);
    }).flatten(true).value();
  },
  serialize: function serialize(options) {
    return this.props.hints.map((hint, i) => {
      return this.serializeHint(i, options);
    });
  },
  serializeHint: function serializeHint(index, options) {
    return this.refs["hintEditor" + index].serialize(options);
  }
});

var _excluded = ["depth"],
  _excluded2 = ["shape", "data", "path", "actions", "name", "controls"],
  _excluded3 = ["shape", "data", "path", "actions"],
  _excluded4 = ["shape", "data", "path"];
var _module_$m = {
  exports: {}
};
var React$d = _react__default["default"];
var ReactDOM = _reactDom__default["default"];
var lens = perseus.lens;
var ApiOptions$2 = perseus._perseusApiJsx.Options;
var Editor$2 = perseus._editorJsx;
var InlineIcon$2 = perseus._componentsInlineIconJsx;
var JsonEditor$2 = _jsonEditorJsx;
var SimpleButton = _simpleButtonJsx;
var EDITOR_MODES = ["edit", "preview", "json"];

/**
 * Component that displays the mode dropdown.
 *
 * The mode dropdown is the selector at the top of the editor that lets you
 * switch between edit, preview, and dev-only JSON mode.
 */
var ModeDropdown = createReactClass({
  displayName: "ModeDropdown",
  propTypes: {
    currentMode: PropTypes.oneOf(EDITOR_MODES),
    // A function that takes in a string signifying the mode (ex: "edit")
    onChange: PropTypes.func
  },
  _handleSelectMode: function _handleSelectMode(event) {
    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  },
  render: function render() {
    return /*#__PURE__*/React$d.createElement("label", null, "Mode:", " ", /*#__PURE__*/React$d.createElement("select", {
      value: this.props.currentMode,
      onChange: this._handleSelectMode
    }, /*#__PURE__*/React$d.createElement("option", {
      value: "edit"
    }, "Edit"), /*#__PURE__*/React$d.createElement("option", {
      value: "preview"
    }, "Preview"), /*#__PURE__*/React$d.createElement("option", {
      value: "json"
    }, "Dev-only JSON")));
  }
});

/**
 * Convert a camel-cased string to a human-formatted string.
 * "superCoolThings" -> "super cool things"
 */
function camelCaseToHuman(str) {
  // Decapitalize the capital letters, and add a space before each.
  return str.replace(/[A-Z]/g, s => " " + s.toLowerCase());
}

/**
 * Capitalize the first letter of the given string.
 * "super cool things" -> "Super cool things"
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert the given pluralized word to a singularized word.
 * "super cool things" -> "super cool thing"
 */
function pluralToSingular(str) {
  if (str.charAt(str.length - 1) === "s") {
    // Incredibly weak implementation :P
    return str.slice(0, -1);
  } else {
    // Uh oh, dunno how to singularize anything but the simplest case!
    // Let's just return the plural form, and hope the user forgives the
    // grammatical inconsistency.
    return str;
  }
}

/**
 * When iterating through the editors, we don't keep track of the extra
 * `_multi` part at the beginning. This is a helper function which takes a path
 * and prepends that key.
 */
function multiPath(path) {
  return ["_multi", ...path];
}

// Return an h1 if depth=0, h2 if depth=1, etc.
function Header(_ref) {
  var {
      depth
    } = _ref,
    props = perseus._objectWithoutProperties(_ref, _excluded);
  var headerLevel = Math.min(depth, 5) + 1;
  var HeaderTag = "h".concat(headerLevel);
  return /*#__PURE__*/React$d.createElement(HeaderTag, props);
}
Header.propTypes = {
  depth: PropTypes.number.isRequired
};
var nodePropTypes = {
  shape: perseus.shapePropType,
  data: PropTypes.any.isRequired,
  path: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])).isRequired,
  actions: PropTypes.shape({
    addArrayElement: PropTypes.func.isRequired,
    mergeValueAtPath: PropTypes.func.isRequired,
    setValueAtPath: PropTypes.func.isRequired,
    moveArrayElementDown: PropTypes.func.isRequired,
    moveArrayElementUp: PropTypes.func.isRequired,
    removeArrayElement: PropTypes.func.isRequired
  }).isRequired,
  apiOptions: PropTypes.any.isRequired,
  // TODO(mdr): real proptype?

  // For the left-hand column, we use edit mode and leave renderers empty.
  // For the right-hand column, we use preview mode and provide renderers
  // via a MultiRenderer.
  renderers: PropTypes.any
};

/**
 * Render a node in the editor tree, given the shape of the target
 * node, the data stored in the target node, the path to the target
 * node, and any UI controls that affect how this node relates to its
 * parent (e.g. remove from parent array).
 *
 * This returns a container element with a pretty title and additional
 * UI controls for this node. Its contents are produced by
 * `NodeContent`. The two functions are mutually recursive.
 *
 * Leaf nodes, like items and hints, render an editor pod around their
 * content. Container nodes, like arrays and objects, render a header above
 * their content.
 */
var NodeContainer = props => {
  var {
      shape,
      data,
      path,
      actions,
      name: givenName,
      controls
    } = props,
    otherProps = perseus._objectWithoutProperties(props, _excluded2);
  var name = givenName || camelCaseToHuman(path[path.length - 1] || "");
  var Container;
  if (shape.type === "array") {
    Container = ArrayContainer;
  } else if (shape.type === "object") {
    Container = ObjectContainer;
  } else {
    Container = LeafContainer;
  }
  return /*#__PURE__*/React$d.createElement(Container, {
    key: path.join("."),
    name: name,
    controls: controls,
    path: path,
    shape: shape,
    actions: actions
  }, /*#__PURE__*/React$d.createElement(NodeContent, perseus._extends({}, otherProps, {
    shape: shape,
    data: data,
    path: path,
    actions: actions
  })));
};
NodeContainer.propTypes = perseus._objectSpread2(perseus._objectSpread2({}, nodePropTypes), {}, {
  controls: PropTypes.arrayOf(PropTypes.node)
});
var LeafContainer = _ref2 => {
  var {
    name,
    controls,
    children,
    path,
    shape
  } = _ref2;
  var hasPreviewHeading = shape.type === "content" || shape.type === "hint";
  var previewHeading = hasPreviewHeading && /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.containerHeader)
  }, /*#__PURE__*/React$d.createElement(Header, {
    depth: path.length,
    className: aphrodite.css(styles$2.containerTitle)
  }, capitalize(name)));
  return /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.container)
  }, /*#__PURE__*/React$d.createElement("span", {
    className: aphrodite.css(styles$2.row, styles$2.rowHeading)
  }, /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.columnLeft)
  }, /*#__PURE__*/React$d.createElement("div", {
    className: "pod-title " + aphrodite.css(styles$2.containerHeader)
  }, /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.containerTitle)
  }, capitalize(name)), controls)), /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.columnRight)
  }, previewHeading)), children);
};
LeafContainer.propTypes = {
  name: PropTypes.string,
  controls: PropTypes.node,
  children: PropTypes.node,
  path: PropTypes.arrayOf(PropTypes.any).isRequired,
  shape: perseus.shapePropType
};
var ArrayContainer = props => {
  var {
    name,
    controls,
    children,
    path,
    shape,
    actions
  } = props;
  return /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.container)
  }, controls && /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.columnLeft, styles$2.containerHeader)
  }, controls), /*#__PURE__*/React$d.createElement("div", null, children), /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.columnLeft)
  }, /*#__PURE__*/React$d.createElement("a", {
    href: "javascript:void 0",
    onClick: () => actions.addArrayElement(path, shape.elementShape)
  }, "Add a ", pluralToSingular(name))));
};
ArrayContainer.propTypes = {
  name: PropTypes.string,
  controls: PropTypes.node,
  children: PropTypes.node,
  path: PropTypes.arrayOf(PropTypes.any).isRequired,
  shape: perseus.shapePropType,
  actions: PropTypes.shape({
    addArrayElement: PropTypes.func.isRequired
  }).isRequired
};
var ObjectContainer = _ref3 => {
  var {
    name,
    controls,
    children,
    path
  } = _ref3;
  var headingEditor = /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.containerHeader)
  }, /*#__PURE__*/React$d.createElement(Header, {
    depth: path.length,
    className: aphrodite.css(styles$2.containerTitle)
  }, capitalize(name)), controls);
  var headingPreview = (name || controls) && /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.containerHeader, styles$2.previewCollectionHeader)
  }, /*#__PURE__*/React$d.createElement(Header, {
    depth: path.length,
    className: aphrodite.css(styles$2.containerTitle)
  }, capitalize(name)));
  var hasBothHeadings = headingEditor && headingPreview;
  return /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.container)
  }, hasBothHeadings && /*#__PURE__*/React$d.createElement("span", {
    className: aphrodite.css(styles$2.row)
  }, /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.columnLeft)
  }, headingEditor), /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.columnRight)
  }, headingPreview)), /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(path.length > 0 && styles$2.contentIndent)
  }, children));
};
ObjectContainer.propTypes = {
  name: PropTypes.string,
  controls: PropTypes.node,
  children: PropTypes.node,
  path: PropTypes.arrayOf(PropTypes.any).isRequired
};

/**
 * Render the content of node in the editor tree, given the shape of
 * the target node, the data stored in the target node, and the path to
 * the target node.
 *
 * If the target node is a leaf, this returns an editor. Otherwise, it
 * iterates over the child nodes, and outputs `NodeContainer` for
 * each of them. The two functions are mutually recursive.
 */
var NodeContent = props => {
  var {
    shape
  } = props;
  if (shape.type === "content") {
    return /*#__PURE__*/React$d.createElement(ItemNodeContent, props);
  } else if (shape.type === "hint") {
    return /*#__PURE__*/React$d.createElement(HintNodeContent, props);
  } else if (shape.type === "tags") {
    return /*#__PURE__*/React$d.createElement(TagsNodeContent, props);
  } else if (shape.type === "array") {
    return /*#__PURE__*/React$d.createElement(ArrayNodeContent, props);
  } else if (shape.type === "object") {
    return /*#__PURE__*/React$d.createElement(ObjectNodeContent, props);
  }
};
NodeContent.propTypes = nodePropTypes;

/**
 * HOC that adds a "sticky" prop to the wrapped component that is true
 * when the rendered component is taller than the window. Since sticky content
 * can be somewhat distracting, we'd like to avoid it when not useful. This
 * HOC is useful for only making content sticky when useful.
 *
 * It does so by polling the height and comparing it to the window height.
 */
function withStickiness(Component) {
  return class StickyComponent extends React$d.Component {
    constructor() {
      super(...arguments);
      perseus._defineProperty(this, "state", {
        sticky: false
      });
      perseus._defineProperty(this, "updateStickiness", () => {
        var domNode = ReactDOM.findDOMNode(this);
        var height = domNode.offsetHeight;
        var windowHeight = window.innerHeight;
        var sticky = height > windowHeight;
        if (sticky !== this.state.sticky) {
          this.setState({
            sticky
          });
        }
      });
    }
    componentDidMount() {
      this.stickynessTimer = setInterval(this.updateStickiness, 1000);
      this.updateStickiness();
    }
    componentWillUnmount() {
      clearInterval(this.stickynessTimer);
    }
    render() {
      return /*#__PURE__*/React$d.createElement(Component, perseus._extends({
        sticky: this.state.sticky
      }, this.props));
    }
  };
}
function getChromeVersion() {
  var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? parseInt(raw[2], 10) : null;
}

/**
 * HOC that makes a textareas in sticky components temporarily fixed when
 * editing in Blink browsers.
 *
 * This workaround is necessary because Chrome incorrectly calculates how to
 * scroll "position: sticky" containers to ensure the textarea's cursor is
 * visible in by calculating offsets as if they were "position: relative".
 *
 * This will be resolved once Chrome 62 is released.
 *   https://bugs.chromium.org/p/chromium/issues/detail?id=702936
 *
 * TODO(joshuan): Remove this after December 2017.
 */
function withChromeHack(Component) {
  return class ChromeHack extends React$d.Component {
    constructor() {
      super(...arguments);
      perseus._defineProperty(this, "_detached", false);
      perseus._defineProperty(this, "_reattachTimer", null);
      perseus._defineProperty(this, "getTextAreas", () => {
        return ReactDOM.findDOMNode(this).querySelectorAll("textarea");
      });
      /**
       * Removes all textareas from the container
       */
      perseus._defineProperty(this, "detach", () => {
        this.getTextAreas().forEach(textarea => {
          if (textarea !== document.activeElement) {
            return;
          }
          if (!this._detached) {
            var r = textarea.getBoundingClientRect();
            var style = textarea.style;
            style.setProperty("position", "fixed", "important");
            style.setProperty("top", "".concat(r.y, "px"), "important");
            style.setProperty("left", "".concat(r.x, "px"), "important");
            style.setProperty("width", "".concat(r.width, "px"), "important");
            style.setProperty("height", "".concat(r.height, "px"), "important");
            style.setProperty("z-index", "1", "important");
            style.setProperty("height", "".concat(r.height, "px"), "important");
            if (this._reattachTimer) {
              clearTimeout(this._reattachTimer);
            }
          }
        });
        this._detached = true;
        this._reattachTimer = setTimeout(this.reattach, 1000);
      });
      perseus._defineProperty(this, "reattach", () => {
        this.getTextAreas().forEach(textarea => {
          var style = textarea.style;
          style.removeProperty("position");
          style.removeProperty("top");
          style.removeProperty("left");
          style.removeProperty("width");
          style.removeProperty("z-index");
          style.removeProperty("height");
        });
        this._detached = false;
      });
    }
    render() {
      var _this = this;
      var chromeVersion = getChromeVersion();
      var requiresHack = chromeVersion && chromeVersion < 62;
      var isSticky = this.props.sticky;
      if (!requiresHack || !isSticky) {
        return /*#__PURE__*/React$d.createElement(Component, this.props);
      }

      // We indiscriminately make all textareas fixed whenever anything
      // changes.
      var actions = perseus._objectSpread2({}, this.props.actions);
      actions.mergeValueAtPath = function () {
        _this.props.actions.mergeValueAtPath(...arguments);
        _this.detach();
      };
      return /*#__PURE__*/React$d.createElement(Component, perseus._extends({}, this.props, {
        actions: actions
      }));
    }
  };
}
var ItemNodeContent = withStickiness(withChromeHack(props => {
  var {
    data,
    path,
    actions,
    apiOptions,
    renderers,
    sticky
  } = props;
  var preview = /*#__PURE__*/React$d.createElement("div", {
    className: "framework-perseus"
  }, lens(renderers).get(path));
  return /*#__PURE__*/React$d.createElement("span", null, /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.row)
  }, /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.columnLeft)
  }, /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(sticky && styles$2.sticky)
  }, /*#__PURE__*/React$d.createElement(Editor$2, perseus._extends({}, data, {
    onChange: newVal => actions.mergeValueAtPath(path, newVal),
    apiOptions: apiOptions
  })))), /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.columnRight)
  }, /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(sticky && styles$2.sticky)
  }, preview))));
}));
ItemNodeContent.propTypes = nodePropTypes;
var HintNodeContent = withStickiness(withChromeHack(props => {
  var {
    data,
    path,
    actions,
    apiOptions,
    renderers,
    sticky
  } = props;
  var preview = /*#__PURE__*/React$d.createElement("div", {
    className: "framework-perseus"
  }, lens(renderers).get(path));
  return /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.row)
  }, /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.columnLeft)
  }, /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(sticky && styles$2.sticky)
  }, /*#__PURE__*/React$d.createElement(HintEditor, perseus._extends({}, data, {
    className: aphrodite.css(styles$2.hintEditor),
    onChange: newVal => actions.mergeValueAtPath(path, newVal),
    apiOptions: apiOptions,
    showTitle: false,
    showRemoveButton: false,
    showMoveButtons: false
  })))), /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.columnRight)
  }, /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(sticky && styles$2.sticky)
  }, preview)));
}));
HintNodeContent.propTypes = nodePropTypes;
var TagsNodeContent = props => {
  var {
    data,
    path,
    actions,
    apiOptions
  } = props;
  var {
    GroupMetadataEditor
  } = apiOptions;
  return /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.columnLeft)
  }, /*#__PURE__*/React$d.createElement("div", {
    className: aphrodite.css(styles$2.tagsEditor)
  }, /*#__PURE__*/React$d.createElement(GroupMetadataEditor, {
    value: data,
    onChange: newVal => actions.setValueAtPath(path, newVal),
    showTitle: false
  })));
};
TagsNodeContent.propTypes = nodePropTypes;
var ArrayNodeContent = props => {
  var {
      shape,
      data,
      path,
      actions
    } = props,
    otherProps = perseus._objectWithoutProperties(props, _excluded3);
  var collectionName = camelCaseToHuman(path[path.length - 1]);
  var elementName = pluralToSingular(collectionName);
  var elementType = shape.elementShape.type;
  var elementIsLeaf = elementType === "content" || elementType === "hint";
  var children = data.map((subdata, i) => {
    var subpath = path.concat(i);
    var controls = [i > 0 && /*#__PURE__*/React$d.createElement("div", {
      key: "moveArrayElementUp",
      className: aphrodite.css(styles$2.control)
    }, /*#__PURE__*/React$d.createElement(SimpleButton, {
      color: "orange",
      title: "Move up",
      onClick: () => actions.moveArrayElementUp(subpath)
    }, /*#__PURE__*/React$d.createElement("div", {
      className: aphrodite.css(styles$2.verticalFlip)
    }, /*#__PURE__*/React$d.createElement(InlineIcon$2, perseus.iconChevronDown)))), i < data.length - 1 && /*#__PURE__*/React$d.createElement("div", {
      key: "moveArrayElementDown",
      className: aphrodite.css(styles$2.control)
    }, /*#__PURE__*/React$d.createElement(SimpleButton, {
      color: "orange",
      title: "Move down",
      onClick: () => actions.moveArrayElementDown(subpath)
    }, /*#__PURE__*/React$d.createElement(InlineIcon$2, perseus.iconChevronDown))), /*#__PURE__*/React$d.createElement("div", {
      key: "removeArrayElement",
      className: aphrodite.css(styles$2.control)
    }, /*#__PURE__*/React$d.createElement(SimpleButton, {
      color: "orange",
      title: "Delete",
      onClick: () => actions.removeArrayElement(subpath)
    }, /*#__PURE__*/React$d.createElement(InlineIcon$2, perseus.iconTrash)))];
    return /*#__PURE__*/React$d.createElement("div", {
      key: i,
      className: aphrodite.css(styles$2.arrayElement, !elementIsLeaf && styles$2.arrayElementAndNotLeaf)
    }, /*#__PURE__*/React$d.createElement(NodeContainer, perseus._extends({}, otherProps, {
      key: i,
      shape: shape.elementShape,
      data: subdata,
      path: subpath,
      actions: actions,
      name: "".concat(elementName, " ").concat(i + 1),
      controls: controls
    })));
  });
  return /*#__PURE__*/React$d.createElement("div", null, children);
};
ArrayNodeContent.propTypes = nodePropTypes;
var ObjectNodeContent = props => {
  var {
      shape,
      data,
      path
    } = props,
    otherProps = perseus._objectWithoutProperties(props, _excluded4);

  // Object iteration order should automatically match the order in which the
  // keys were defined in the object literal. So, whatever order semantically
  // made sense to the shape's author is the order in which we'll iterate :)
  var children = Object.keys(shape.shape).map(subkey => /*#__PURE__*/React$d.createElement("div", {
    key: subkey,
    className: aphrodite.css(styles$2.objectElement)
  }, /*#__PURE__*/React$d.createElement(NodeContainer, perseus._extends({}, otherProps, {
    shape: shape.shape[subkey],
    data: data[subkey],
    path: path.concat(subkey)
  }))));
  return /*#__PURE__*/React$d.createElement("div", null, children);
};
ObjectNodeContent.propTypes = nodePropTypes;
var MultiRendererEditor$1 = createReactClass({
  displayName: "MultiRendererEditor",
  propTypes: {
    Layout: PropTypes.func,
    // TODO(emily): use ApiOptions.propTypes
    apiOptions: PropTypes.any.isRequired,
    item: PropTypes.any.isRequired,
    editorMode: PropTypes.oneOf(EDITOR_MODES).isRequired,
    onChange: PropTypes.func.isRequired
  },
  _renderLayout() {
    var {
      Layout,
      apiOptions,
      item
    } = this.props;
    return /*#__PURE__*/React$d.createElement(Layout, {
      ref: e => this.layout = e,
      item: item,
      apiOptions: apiOptions
    });
  },
  _renderJson() {
    return /*#__PURE__*/React$d.createElement("div", null, /*#__PURE__*/React$d.createElement(ModeDropdown, {
      currentMode: this.props.editorMode,
      onChange: editorMode => this.props.onChange({
        editorMode
      })
    }), /*#__PURE__*/React$d.createElement(JsonEditor$2, {
      multiLine: true,
      value: this.props.item,
      onChange: item => this.props.onChange({
        item
      })
    }));
  },
  _renderPreview() {
    return /*#__PURE__*/React$d.createElement("div", null, /*#__PURE__*/React$d.createElement(ModeDropdown, {
      currentMode: this.props.editorMode,
      onChange: editorMode => this.props.onChange({
        editorMode
      })
    }), this._renderLayout());
  },
  mergeValueAtPath(path, newValue) {
    this.props.onChange({
      item: lens(this.props.item).merge(multiPath(path), newValue).freeze()
    });
  },
  setValueAtPath(path, newValue) {
    this.props.onChange({
      item: lens(this.props.item).set(multiPath(path), newValue).freeze()
    });
  },
  addArrayElement(path, shape) {
    var currentLength = lens(this.props.item).get(multiPath(path)).length;
    var newElementPath = path.concat(currentLength);
    var newValue = perseus.buildEmptyItemTreeForShape(shape);
    this.props.onChange({
      item: lens(this.props.item).set(multiPath(newElementPath), newValue).freeze()
    });
  },
  removeArrayElement(path) {
    this.props.onChange({
      item: lens(this.props.item).del(multiPath(path)).freeze()
    });
  },
  moveArrayElementDown(path) {
    // Moving an element down can also be expressed as swapping it with the
    // following element.
    var index = path[path.length - 1];
    var nextElementIndex = index + 1;
    var nextElementPath = path.slice(0, -1).concat(nextElementIndex);
    var element = lens(this.props.item).get(multiPath(path));
    var nextElement = lens(this.props.item).get(multiPath(nextElementPath));
    this.props.onChange({
      item: lens(this.props.item).set(multiPath(path), nextElement).set(multiPath(nextElementPath), element).freeze()
    });
  },
  moveArrayElementUp(path) {
    // Moving an element up can also be expressed as moving the previous
    // element down.
    var index = path[path.length - 1];
    var previousElementPath = path.slice(0, -1).concat(index - 1);
    this.moveArrayElementDown(previousElementPath);
  },
  _renderEdit() {
    var apiOptions = perseus._objectSpread2(perseus._objectSpread2({}, ApiOptions$2.defaults), this.props.apiOptions);
    var item = this.props.item;
    var itemShape = this.props.Layout.shape;
    return /*#__PURE__*/React$d.createElement("div", {
      className: "perseus-multirenderer-editor"
    }, /*#__PURE__*/React$d.createElement(ModeDropdown, {
      currentMode: this.props.editorMode,
      onChange: editorMode => this.props.onChange({
        editorMode
      })
    }), /*#__PURE__*/React$d.createElement(perseus.MultiRenderer, {
      item: item,
      shape: itemShape,
      apiOptions: apiOptions
    }, _ref4 => {
      var {
        renderers
      } = _ref4;
      return /*#__PURE__*/React$d.createElement(NodeContainer, {
        mode: "edit",
        shape: itemShape,
        data: perseus.itemToTree(item),
        path: [],
        actions: this,
        apiOptions: apiOptions,
        renderers: renderers
      });
    }));
  },
  score() {
    if (this.layout) {
      return this.layout.score();
    }
  },
  getSerializedState() {
    if (this.layout) {
      return this.layout.getSerializedState();
    }
  },
  restoreSerializedState(state) {
    if (this.layout) {
      this.layout.restoreSerializedState(state);
    }
  },
  _renderContent() {
    switch (this.props.editorMode) {
      case "json":
        return this._renderJson();
      case "preview":
        return this._renderPreview();
      case "edit":
        return this._renderEdit();
      default:
        return /*#__PURE__*/React$d.createElement(ModeDropdown, {
          currentMode: this.props.editorMode,
          onChange: editorMode => this.props.onChange({
            editorMode
          })
        });
    }
  },
  render() {
    return /*#__PURE__*/React$d.createElement("div", {
      id: "perseus"
    }, this._renderContent());
  }
});
var styles$2 = aphrodite.StyleSheet.create({
  editor: {
    width: "100%"
  },
  treePreview: {
    position: "relative"
  },
  verticalFlip: {
    transform: "scaleY(-1)"
  },
  control: {
    marginLeft: 12
  },
  containerHeader: {
    alignItems: "flex-end",
    display: "flex",
    flexDirection: "row"
  },
  previewCollectionHeader: {
    marginBottom: 16
  },
  containerTitle: {
    flexGrow: 1,
    margin: 0
  },
  contentIndent: {
    marginLeft: 8
  },
  hintEditor: {
    paddingBottom: 0
  },
  arrayElement: {
    marginBottom: 16
  },
  // Leaf nodes are already wrapped in cute little pods, so they don't need
  // this extra border between array elements.
  arrayElementAndNotLeaf: {
    borderBottom: "1px solid #ccc",
    ":first-child": {
      borderTop: "1px solid #ccc",
      paddingTop: 16
    }
  },
  objectElement: {
    marginBottom: 16
  },
  tagsEditor: {
    border: "1px solid #ddd",
    padding: "5px 10px"
  },
  /**
   * A row contains a fixed width editor and a preview that expands as
   * needed.
   */
  row: {
    display: "flex",
    position: "relative"
  },
  /**
   * The editor.
   */
  columnLeft: {
    width: 360,
    marginRight: 30,
    // so that the `position: absolute` of line markers are positioned
    // relative to this.
    position: "relative"
  },
  /**
   * The preview.
   */
  columnRight: {
    flex: 1,
    marginLeft: 30,
    position: "relative"
  },
  /**
   * Sticks to just under the heading.
   */
  sticky: {
    position: "sticky",
    top: 33 // height of the cute pod for the editor
  },
  /**
   * Used for sticky headings.
   */
  rowHeading: {
    position: "sticky",
    backgroundColor: "white",
    width: "100%",
    // TODO(joshuan): Make this less arbitrary. It should be higher than
    // perseus content.
    zIndex: 101,
    top: -1
  }
});
_module_$m.exports = MultiRendererEditor$1;
var _multirendererEditorJsx = _module_$m.exports;

var _module_$l = {
  exports: {}
};
var React$c = _react__default["default"];
var HUD$2 = createReactClass({
  displayName: "HUD",
  propTypes: {
    message: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
  },
  // Displays a stylized open eye: lint warnings are visible
  renderVisibleIcon: function renderVisibleIcon() {
    return /*#__PURE__*/React$c.createElement("svg", {
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      className: aphrodite.css(styles$1.icon)
    }, /*#__PURE__*/React$c.createElement("defs", null, /*#__PURE__*/React$c.createElement("path", {
      id: "a",
      d: "M7.401 10.035c-1.424.748-2.599 1.905-3.544 " + "3.48a1 1 0 0 1-1.714-1.03C4.325 8.849 7.652 7 " + "12 7c4.348 0 7.675 1.848 9.857 5.486a1 1 0 0 " + "1-1.714 1.028c-.945-1.574-2.12-2.73-3.544-" + "3.48a5 5 0 1 1-9.198 0zM12 15a3 3 0 1 0 0-6 3 3 " + "0 0 0 0 6z"
    })), /*#__PURE__*/React$c.createElement("g", {
      fill: "none",
      fillRule: "evenodd"
    }, /*#__PURE__*/React$c.createElement("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }), /*#__PURE__*/React$c.createElement("mask", {
      id: "b",
      fill: "#fff"
    }, /*#__PURE__*/React$c.createElement("use", {
      href: "#a"
    })), /*#__PURE__*/React$c.createElement("use", {
      fill: "#fff",
      fillRule: "nonzero",
      href: "#a"
    }), /*#__PURE__*/React$c.createElement("g", {
      fill: "#fff",
      mask: "url(#b)"
    }, /*#__PURE__*/React$c.createElement("path", {
      d: "M0 0h24v24H0z"
    }))));
  },
  // Displays a stylized eye with a line through it: I don't want to see lint
  renderHiddenIcon: function renderHiddenIcon() {
    return /*#__PURE__*/React$c.createElement("svg", {
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      className: aphrodite.css(styles$1.icon)
    }, /*#__PURE__*/React$c.createElement("defs", null, /*#__PURE__*/React$c.createElement("path", {
      id: "a",
      d: "M8.794 7.38C9.791 7.127 10.86 7 12 7c4.348 0 " + "7.675 1.848 9.857 5.486a1 1 0 0 1-1.714 " + "1.028c-.945-1.574-2.12-2.73-3.544-3.48.258." + "604.401 1.268.401 1.966 0 1.02-.305 " + "1.967-.828 2.757l2.535 2.536a1 1 0 0 " + "1-1.414 1.414l-12-12a1 1 0 0 1 " + "1.414-1.414L8.794 7.38zm5.914 5.913a3 3 0 0 " + "0-4.001-4.001l4 4.001zM6.072 8.486l2.976 " + "2.976a3 3 0 0 0 3.49 3.49l1.579 1.58A5 5 0 " + "0 1 7.4 10.035c-1.424.747-2.599 1.904-3.544 " + "3.478a1 1 0 0 1-1.714-1.028c1.049-1.75 " + "2.363-3.085 3.929-4z"
    })), /*#__PURE__*/React$c.createElement("g", {
      fill: "none",
      fillRule: "evenodd"
    }, /*#__PURE__*/React$c.createElement("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }), /*#__PURE__*/React$c.createElement("mask", {
      id: "b",
      fill: "#fff"
    }, /*#__PURE__*/React$c.createElement("use", {
      href: "#a"
    })), /*#__PURE__*/React$c.createElement("use", {
      fill: "#fff",
      fillRule: "nonzero",
      href: "#a"
    }), /*#__PURE__*/React$c.createElement("g", {
      fill: "#fff",
      mask: "url(#b)"
    }, /*#__PURE__*/React$c.createElement("path", {
      d: "M0 0h24v24H0z"
    }))));
  },
  render: function render() {
    var state;
    var icon;
    if (this.props.enabled) {
      state = styles$1.enabled;
      icon = this.renderVisibleIcon();
    } else {
      state = styles$1.disabled;
      icon = this.renderHiddenIcon();
    }
    return /*#__PURE__*/React$c.createElement("button", {
      className: aphrodite.css(styles$1.hud, state),
      onClick: e => {
        this.props.onClick();
      }
    }, icon, this.props.message);
  }
});
var styles$1 = aphrodite.StyleSheet.create({
  hud: {
    position: "fixed",
    right: 20,
    bottom: 20,
    boxSizing: "border-box",
    height: 36,
    padding: "9px 16px",
    borderRadius: 18,
    fontFamily: perseus.boldFontFamily,
    fontSize: "15px",
    lineHeight: "18px",
    color: perseus.white,
    userSelect: "none",
    borderWidth: 0 // <button> gives us a border by default
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
    marginTop: -3,
    verticalAlign: "middle"
  },
  enabled: {
    backgroundColor: perseus.warningColor,
    ":hover": {
      backgroundColor: perseus.warningColorHover
    },
    ":active": {
      backgroundColor: perseus.warningColorActive
    }
  },
  disabled: {
    backgroundColor: perseus.gray76,
    ":hover": {
      backgroundColor: "#a1a5a9" // in between those two grays
    },
    ":active": {
      backgroundColor: perseus.gray68
    }
  }
});
_module_$l.exports = HUD$2;
var _componentsHudJsx = _module_$l.exports;

var _module_$k = {
  exports: {}
};
/**
 * A component that displays controls for choosing a viewport size.
 * Renders three buttons: "Phone", "Tablet", and "Desktop".
 */

var React$b = _react__default["default"];
var ButtonGroup = perseus._reactComponentsButtonGroupJsx;
var InlineIcon$1 = perseus._componentsInlineIconJsx;
var ViewportResizer$2 = createReactClass({
  displayName: "ViewportResizer",
  propTypes: {
    // The current device type that is selected.
    deviceType: PropTypes.string.isRequired,
    // A callback that is passed (width, height) as the dimensions of the
    // viewport to resize to.
    onViewportSizeChanged: PropTypes.func.isRequired
  },
  handleChange: function handleChange(value) {
    this.props.onViewportSizeChanged(value);
  },
  render: function render() {
    var phoneButtonContents = /*#__PURE__*/React$b.createElement("span", null, /*#__PURE__*/React$b.createElement(InlineIcon$1, perseus.iconMobilePhone), " Phone");
    var tabletButtonContents = /*#__PURE__*/React$b.createElement("span", null, /*#__PURE__*/React$b.createElement(InlineIcon$1, perseus.iconTablet), " Tablet");
    var desktopButtonContents = /*#__PURE__*/React$b.createElement("span", null, /*#__PURE__*/React$b.createElement(InlineIcon$1, perseus.iconDesktop), " Desktop");

    // TODO(david): Allow input of custom viewport sizes.
    return /*#__PURE__*/React$b.createElement("span", {
      className: "viewport-resizer"
    }, "Viewport:", " ", /*#__PURE__*/React$b.createElement(ButtonGroup, {
      value: this.props.deviceType,
      allowEmpty: false,
      buttons: [{
        value: devices.PHONE,
        content: phoneButtonContents
      }, {
        value: devices.TABLET,
        content: tabletButtonContents
      }, {
        value: devices.DESKTOP,
        content: desktopButtonContents
      }],
      onChange: this.handleChange
    }));
  }
});
_module_$k.exports = ViewportResizer$2;
var _componentsViewportResizerJsx = _module_$k.exports;

var _module_$j = {
  exports: {}
};
/* eslint-disable no-var */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var React$a = _react__default["default"];
var InfoTip = perseus._componentsInfoTipJsx;
var ItemExtrasEditor$1 = createReactClass({
  displayName: "ItemExtrasEditor",
  propTypes: {
    calculator: PropTypes.bool,
    chi2Table: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    periodicTable: PropTypes.bool,
    tTable: PropTypes.bool,
    zTable: PropTypes.bool
  },
  getDefaultProps: function getDefaultProps() {
    return {
      calculator: false,
      chi2Table: false,
      periodicTable: false,
      tTable: false,
      zTable: false
    };
  },
  serialize: function serialize() {
    return {
      calculator: this.props.calculator,
      chi2Table: this.props.chi2Table,
      periodicTable: this.props.periodicTable,
      tTable: this.props.tTable,
      zTable: this.props.zTable
    };
  },
  render: function render() {
    return /*#__PURE__*/React$a.createElement("div", {
      className: "perseus-answer-editor"
    }, /*#__PURE__*/React$a.createElement("div", {
      className: "perseus-answer-options"
    }, /*#__PURE__*/React$a.createElement("div", null, /*#__PURE__*/React$a.createElement("label", null, "Show calculator:", " ", /*#__PURE__*/React$a.createElement("input", {
      type: "checkbox",
      checked: this.props.calculator,
      onChange: e => {
        this.props.onChange({
          calculator: e.target.checked
        });
      }
    })), /*#__PURE__*/React$a.createElement(InfoTip, null, "Use the calculator when completing difficult calculations is NOT the intent of the question. DON\u2019T use the calculator when testing the student\u2019s ability to complete different types of computations.")), /*#__PURE__*/React$a.createElement("div", null, /*#__PURE__*/React$a.createElement("label", null, "Show periodic table:", " ", /*#__PURE__*/React$a.createElement("input", {
      type: "checkbox",
      checked: this.props.periodicTable,
      onChange: e => {
        this.props.onChange({
          periodicTable: e.target.checked
        });
      }
    })), /*#__PURE__*/React$a.createElement(InfoTip, null, "This provides the student with the ability to view a periodic table of the elements, e.g., for answering chemistry questions.")), /*#__PURE__*/React$a.createElement("div", null, /*#__PURE__*/React$a.createElement("label", null, "Show z table (statistics):", " ", /*#__PURE__*/React$a.createElement("input", {
      type: "checkbox",
      checked: this.props.zTable,
      onChange: e => {
        this.props.onChange({
          zTable: e.target.checked
        });
      }
    })), /*#__PURE__*/React$a.createElement(InfoTip, null, "This provides the student with the ability to view a table of critical values for the z distribution, e.g. for answering statistics questions.")), /*#__PURE__*/React$a.createElement("div", null, /*#__PURE__*/React$a.createElement("label", null, "Show t table (statistics):", " ", /*#__PURE__*/React$a.createElement("input", {
      type: "checkbox",
      checked: this.props.tTable,
      onChange: e => {
        this.props.onChange({
          tTable: e.target.checked
        });
      }
    })), /*#__PURE__*/React$a.createElement(InfoTip, null, "This provides the student with the ability to view a table of critical values for the Student's t distribution, e.g. for answering statistics questions.")), /*#__PURE__*/React$a.createElement("div", null, /*#__PURE__*/React$a.createElement("label", null, "Show chi-squared table (statistics):", " ", /*#__PURE__*/React$a.createElement("input", {
      type: "checkbox",
      checked: this.props.chi2Table,
      onChange: e => {
        this.props.onChange({
          chi2Table: e.target.checked
        });
      }
    })), /*#__PURE__*/React$a.createElement(InfoTip, null, "This provides the student with the ability to view a table of critical values for the chi-squared distribution, e.g. for answering statistics questions."))));
  }
});
_module_$j.exports = ItemExtrasEditor$1;
var _itemExtrasEditorJsx = _module_$j.exports;

var _module_$i = {
  exports: {}
};
/* eslint-disable no-var, object-curly-spacing, react/prop-types, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var React$9 = _react__default["default"];
var _$g = _underscore__default["default"];
var ApiOptions$1 = perseus._perseusApiJsx.Options;
var ItemExtrasEditor = _itemExtrasEditorJsx;
var ITEM_DATA_VERSION = perseus._versionJson.itemDataVersion;
var ItemEditor$1 = createReactClass({
  displayName: "ItemEditor",
  propTypes: {
    apiOptions: ApiOptions$1.propTypes,
    deviceType: PropTypes.string,
    frameSource: PropTypes.string.isRequired,
    gradeMessage: PropTypes.string,
    imageUploader: PropTypes.func,
    wasAnswered: PropTypes.bool
  },
  getDefaultProps: function getDefaultProps() {
    return {
      onChange: () => {},
      question: {},
      answerArea: {}
    };
  },
  // Notify the parent that the question or answer area has been updated.
  updateProps: function updateProps(newProps, cb, silent) {
    var props = _$g.pick(this.props, "question", "answerArea");
    this.props.onChange(Object.assign({}, props, newProps), cb, silent);
  },
  render: function render() {
    this.props.deviceType === "phone" || this.props.deviceType === "tablet";
    return /*#__PURE__*/React$9.createElement("div", {
      className: "perseus-editor-table"
    }, /*#__PURE__*/React$9.createElement("div", {
      className: "perseus-editor-row perseus-question-container"
    }, /*#__PURE__*/React$9.createElement("div", {
      className: "perseus-editor-left-cell"
    }, /*#__PURE__*/React$9.createElement("div", {
      className: "pod-title"
    }, "Question"), /*#__PURE__*/React$9.createElement(perseus._editorJsx, perseus._extends({
      ref: "questionEditor",
      placeholder: "Type your question here...",
      className: "perseus-question-editor",
      imageUploader: this.props.imageUploader,
      onChange: this.handleEditorChange,
      apiOptions: this.props.apiOptions,
      showWordCount: true
    }, this.props.question))), /*#__PURE__*/React$9.createElement("div", {
      className: "perseus-editor-right-cell"
    }, /*#__PURE__*/React$9.createElement("div", {
      id: "problemarea"
    }, /*#__PURE__*/React$9.createElement(perseus.Renderer, perseus._extends({
      ref: "questionRenderer",
      apiOptions: this.props.apiOptions
    }, this.props.question)), /*#__PURE__*/React$9.createElement("div", {
      id: "hintsarea",
      className: "hintsarea",
      style: {
        display: "none"
      }
    })))), /*#__PURE__*/React$9.createElement("div", {
      className: "perseus-editor-row perseus-answer-container"
    }, /*#__PURE__*/React$9.createElement("div", {
      className: "perseus-editor-left-cell"
    }, /*#__PURE__*/React$9.createElement("div", {
      className: "pod-title"
    }, "Question extras"), /*#__PURE__*/React$9.createElement(ItemExtrasEditor, perseus._extends({
      ref: "itemExtrasEditor",
      onChange: this.handleItemExtrasChange
    }, this.props.answerArea))), /*#__PURE__*/React$9.createElement("div", {
      className: "perseus-editor-right-cell"
    }, /*#__PURE__*/React$9.createElement("div", {
      id: "answer_area"
    }))));
  },
  triggerPreviewUpdate: function triggerPreviewUpdate(newData) {
    // TODO(aria): remove this?
    //this.refs.frame.sendNewData(newData);
  },
  handleEditorChange: function handleEditorChange(newProps, cb, silent) {
    var question = _$g.extend({}, this.props.question, newProps);
    this.updateProps({
      question
    }, cb, silent);
  },
  handleItemExtrasChange: function handleItemExtrasChange(newProps, cb, silent) {
    var answerArea = _$g.extend({}, this.props.answerArea, newProps);
    this.updateProps({
      answerArea
    }, cb, silent);
  },
  getSaveWarnings: function getSaveWarnings() {
    return this.refs.questionEditor.getSaveWarnings();
  },
  serialize: function serialize(options) {
    return {
      question: this.refs.questionEditor.serialize(options),
      answerArea: this.refs.itemExtrasEditor.serialize(options),
      itemDataVersion: ITEM_DATA_VERSION
    };
  },
  focus: function focus() {
    this.questionEditor.focus();
  }
});
_module_$i.exports = ItemEditor$1;
var _itemEditorJsx = _module_$i.exports;

var _module_$h = {
  exports: {}
};
/* eslint-disable no-var */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/**
 * Traverses a {content, widgets, images} renderer props object,
 * such as `itemData.question`
 *
 * This traversal is deep and handles some widget prop upgrades
 * (TODO(aria): Handle minor prop upgrades :) )
 *
 * This is the right way to traverse itemData.
 *
 * NOTE: We should not expose this on the perseus API yet. Instead,
 * build the traversal method you want inside perseus, and use this
 * from that. We might eventually expose this, but I'd like to be
 * more confident in the interface provided first.
 */

var _$f = _underscore__default["default"];
// TODO(aria): Pull this out of interactive2 / replace with new _.mapObject
var objective_ = perseus._interactive2Objective_Js;
var Widgets$4 = perseus._widgetsJs;
var noop = function noop() {};
var deepCallbackFor = function deepCallbackFor(contentCallback, widgetCallback, optionsCallback) {
  var deepCallback = function deepCallback(widgetInfo, widgetId) {
    // This doesn't modify the widget info if the widget info
    // is at a later version than is supported, which is important
    // for our latestVersion test below.
    var upgradedWidgetInfo = Widgets$4.upgradeWidgetInfoToLatestVersion(widgetInfo);
    var latestVersion = Widgets$4.getVersion(upgradedWidgetInfo.type);

    // Only traverse our children if we can understand this version
    // of the widget props.
    // TODO(aria): This will break if the traversal code assumes that
    // any props that usually get defaulted in are present. That is,
    // it can fail on minor version upgrades.
    // For this reason, and because the upgrade code doesn't handle
    // minor versions correctly (it doesn't report anything useful
    // about what minor version a widget is actually at, since it
    // doesn't have meaning in the context of upgrades), we
    // just check the major version here.
    // TODO(aria): This is seriously quirky and would be unpleasant
    // to think about while writing traverseChildWidgets code. Please
    // make all of this a little tighter.
    // I think once we use react class defaultProps instead of relying
    // on getDefaultProps, this will become easier.
    var newWidgetInfo;
    if (latestVersion && upgradedWidgetInfo.version.major === latestVersion.major) {
      newWidgetInfo = Widgets$4.traverseChildWidgets(upgradedWidgetInfo, rendererOptions => {
        return traverseRenderer$1(rendererOptions, contentCallback,
        // so that we traverse grandchildren, too:
        deepCallback, optionsCallback);
      });
    } else {
      newWidgetInfo = upgradedWidgetInfo;
    }
    var userWidgetInfo = widgetCallback(newWidgetInfo, widgetId);
    if (userWidgetInfo !== undefined) {
      return userWidgetInfo;
    } else {
      return newWidgetInfo;
    }
  };
  return deepCallback;
};
var traverseRenderer$1 = function traverseRenderer(rendererOptions, contentCallback, deepWidgetCallback, optionsCallback) {
  var newContent = rendererOptions.content;
  if (rendererOptions.content != null) {
    var modifiedContent = contentCallback(rendererOptions.content);
    if (modifiedContent !== undefined) {
      newContent = modifiedContent;
    }
  }
  var newWidgets = objective_.mapObject(rendererOptions.widgets || {}, function (widgetInfo, widgetId) {
    // Widgets without info or a type are empty widgets, and
    // should always be renderable. It's also annoying to write
    // checks for this everywhere, so we just filter them out once and
    // for all!
    if (widgetInfo == null || widgetInfo.type == null) {
      return widgetInfo;
    }
    return deepWidgetCallback(widgetInfo, widgetId);
  });
  var newOptions = _$f.extend({}, rendererOptions, {
    content: newContent,
    widgets: newWidgets
  });
  var userOptions = optionsCallback(newOptions);
  if (userOptions !== undefined) {
    return userOptions;
  } else {
    return newOptions;
  }
};
var traverseRendererDeep = function traverseRendererDeep(rendererOptions, contentCallback, widgetCallback, optionsCallback) {
  contentCallback = contentCallback || noop;
  widgetCallback = widgetCallback || noop;
  optionsCallback = optionsCallback || noop;
  return traverseRenderer$1(rendererOptions, contentCallback, deepCallbackFor(contentCallback, widgetCallback, optionsCallback), optionsCallback);
};
_module_$h.exports = {
  traverseRendererDeep: traverseRendererDeep
};
var _traversalJsx = _module_$h.exports;

var _module_$g = {
  exports: {}
};
/* eslint-disable comma-dangle, no-var */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var _$e = _underscore__default["default"];
var Traversal$2 = _traversalJsx;
var findPassageRefR = new RegExp(
// [[ passage-ref 1]]
// capture 1: widget markdown
// capture 2: widgetId
"(\\[\\[\u2603 (passage-ref [0-9]+)\\]\\])" +
// spaces between the ref and the summary
"\\s" +
// opening paren + quote
'\\(["\u201C]' +
// summary of passage reference text
// capture 3: summaryText
"([\\s\\S]*)" +
// closing quote + paren
'["\u201D]\\)', "g");
var fixWholeOptions = options => {
  // This parsing is technically illegal and should be done via
  // PerseusMarkdown, but because of the snowperson it's safe
  // in practice.
  // We should probably just get rid of this code once all the
  // passage-refs have been converted.

  var newWidgets = _$e.clone(options.widgets || {});
  var newContent = (options.content || "").replace(findPassageRefR, (passageRefText, widgetMarkdown, widgetId, summaryText) => {
    newWidgets[widgetId] = _$e.extend({}, newWidgets[widgetId], {
      options: _$e.extend({}, newWidgets[widgetId].options, {
        summaryText: summaryText
      })
    });
    return widgetMarkdown;
  });
  return _$e.extend({}, options, {
    content: newContent,
    widgets: newWidgets
  });
};
var findRadioRefsR = new RegExp(
// passage-ref notation
"\\{\\{(passage-ref \\d+ \\d+)}}" +
// a space
"\\s+" +
// ("
'\\(["\\u201C]' +
// <capture the content>
'([^"]*)' +
// ")
'["\\u201D]\\)',
// find all passage-refs
"g");
var replaceRadioRefs = (fullText, reference, summaryText) => {
  if (/\n\n/.test(summaryText)) {
    return fullText;
  }
  return "{{" + reference + ' "' + summaryText + '"}}';
};
var fixRadioWidget = widgetInfo => {
  if (widgetInfo.type !== "radio" || !widgetInfo.options || !widgetInfo.options.choices) {
    return widgetInfo;
  }
  var newChoices = _$e.map(widgetInfo.options.choices, choice => {
    if (!choice.content) {
      return choice;
    }
    var newChoice = choice.content.replace(findRadioRefsR, replaceRadioRefs);
    return _$e.extend({}, choice, {
      content: newChoice
    });
  });
  return _$e.extend({}, widgetInfo, {
    options: _$e.extend({}, widgetInfo.options, {
      choices: newChoices
    })
  });
};
var fixRendererPassageRefs = options => {
  return Traversal$2.traverseRendererDeep(options, null, fixRadioWidget, fixWholeOptions);
};
var FixPassageRefs$1 = itemData => {
  if (itemData._multi) {
    // We're in a multi-item. Don't do anything, just return the original
    // item data.
    return itemData;
  }
  var newQuestion = fixRendererPassageRefs(itemData.question);
  var newHints = _$e.map(itemData.hints, hint => fixRendererPassageRefs(hint));
  return _$e.extend({}, itemData, {
    question: newQuestion,
    hints: newHints
  });
};
_module_$g.exports = FixPassageRefs$1;
var _utilFixPassageRefsJsx = _module_$g.exports;

var _module_$f = {
  exports: {}
};
/* eslint-disable no-var, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var React$8 = _react__default["default"];
var _$d = _underscore__default["default"];
var ApiClassNames = perseus._perseusApiJsx.ClassNames;
var ApiOptionsProps = perseus._mixinsApiOptionsPropsJs;
var CombinedHintsEditor = CombinedHintsEditor$1;
var FixPassageRefs = _utilFixPassageRefsJsx;
var ItemEditor = _itemEditorJsx;
var JsonEditor$1 = _jsonEditorJsx;
var ViewportResizer$1 = _componentsViewportResizerJsx;
var HUD$1 = _componentsHudJsx;
var EditorPage$2 = createReactClass({
  displayName: "EditorPage",
  propTypes: perseus._objectSpread2(perseus._objectSpread2({}, ApiOptionsProps.propTypes), {}, {
    answerArea: PropTypes.any,
    // related to the question

    developerMode: PropTypes.bool,
    // Source HTML for the iframe to render
    frameSource: PropTypes.string.isRequired,
    hints: PropTypes.any,
    // related to the question

    // A function which takes a file object (guaranteed to be an image) and
    // a callback, then calls the callback with the url where the image
    // will be hosted. Image drag and drop is disabled when imageUploader
    // is null.
    imageUploader: PropTypes.func,
    // Part of the question
    itemDataVersion: PropTypes.shape({
      major: PropTypes.number,
      minor: PropTypes.number
    }),
    // Whether the question is displaying as JSON or if it is
    // showing the editor itself with the rendering
    jsonMode: PropTypes.bool,
    // A function which is called with the new JSON blob of content
    onChange: PropTypes.func,
    onPreviewDeviceChange: PropTypes.func,
    previewDevice: PropTypes.string,
    // Initial value of the question being edited
    question: PropTypes.any
  }),
  getDefaultProps: function getDefaultProps() {
    return {
      developerMode: false,
      jsonMode: false,
      onChange: () => {}
    };
  },
  getInitialState: function getInitialState() {
    return {
      json: _$d.pick(this.props, "question", "answerArea", "hints", "itemDataVersion"),
      gradeMessage: "",
      wasAnswered: false,
      highlightLint: true
    };
  },
  handleCheckAnswer: function handleCheckAnswer() {
    var result = this.scorePreview();
    this.setState({
      gradeMessage: result.message,
      wasAnswered: result.correct
    });
  },
  toggleJsonMode: function toggleJsonMode() {
    this.setState({
      json: this.serialize({
        keepDeletedWidgets: true
      })
    }, function () {
      this.props.onChange({
        jsonMode: !this.props.jsonMode
      });
    });
  },
  componentDidMount: function componentDidMount() {
    this.rendererMountNode = document.createElement("div");
    this.updateRenderer();
  },
  componentDidUpdate: function componentDidUpdate() {
    this.updateRenderer();
  },
  updateRenderer: function updateRenderer() {
    // Some widgets (namely the image widget) like to call onChange before
    // anything has actually been mounted, which causes problems here. We
    // just ensure don't update until we've mounted
    var hasEditor = !this.props.developerMode || !this.props.jsonMode;
    if (!this.isMounted() || !hasEditor) {
      return;
    }
    var touch = this.props.previewDevice === "phone" || this.props.previewDevice === "tablet";
    var deviceBasedApiOptions = Object.assign(this.getApiOptions(), {
      customKeypad: touch,
      isMobile: touch
    });
    this.refs.itemEditor.triggerPreviewUpdate({
      type: "question",
      data: Object.assign({
        item: this.serialize(),
        apiOptions: deviceBasedApiOptions,
        initialHintsVisible: 0,
        device: this.props.previewDevice,
        linterContext: {
          contentType: "exercise",
          highlightLint: this.state.highlightLint,
          paths: this.props.contentPaths
        },
        reviewMode: true,
        legacyPerseusLint: this.refs.itemEditor.getSaveWarnings()
      }, _$d.pick(this.props, "workAreaSelector", "solutionAreaSelector", "hintsAreaSelector", "problemNum"))
    });
  },
  getApiOptions() {
    return ApiOptionsProps.getApiOptions.call(this);
  },
  handleChange: function handleChange(toChange, cb, silent) {
    var newProps = _$d.pick(this.props, "question", "hints", "answerArea");
    _$d.extend(newProps, toChange);
    this.props.onChange(newProps, cb, silent);
  },
  changeJSON: function changeJSON(newJson) {
    this.setState({
      json: newJson
    });
    this.props.onChange(newJson);
  },
  _fixPassageRefs: function _fixPassageRefs() {
    var itemData = this.serialize();
    var newItemData = FixPassageRefs(itemData);
    this.setState({
      json: newItemData
    });
    this.props.onChange(newItemData);
  },
  scorePreview: function scorePreview() {
    if (this.renderer) {
      return this.renderer.scoreInput();
    } else {
      return null;
    }
  },
  render: function render() {
    var className = "framework-perseus";
    var touch = this.props.previewDevice === "phone" || this.props.previewDevice === "tablet";
    var deviceBasedApiOptions = Object.assign(this.getApiOptions(), {
      customKeypad: touch,
      isMobile: touch
    });
    if (deviceBasedApiOptions.isMobile) {
      className += " " + ApiClassNames.MOBILE;
    }
    return /*#__PURE__*/React$8.createElement("div", {
      id: "perseus",
      className: className
    }, /*#__PURE__*/React$8.createElement("div", {
      style: {
        marginBottom: 10
      }
    }, this.props.developerMode && /*#__PURE__*/React$8.createElement("span", null, /*#__PURE__*/React$8.createElement("label", null, " ", "Developer JSON Mode:", " ", /*#__PURE__*/React$8.createElement("input", {
      type: "checkbox",
      checked: this.props.jsonMode,
      onChange: this.toggleJsonMode
    })), " ", /*#__PURE__*/React$8.createElement("button", {
      type: "button",
      onClick: this._fixPassageRefs
    }, "Fix passage-refs"), " "), !this.props.jsonMode && /*#__PURE__*/React$8.createElement(ViewportResizer$1, {
      deviceType: this.props.previewDevice,
      onViewportSizeChanged: this.props.onPreviewDeviceChange
    }), !this.props.jsonMode && /*#__PURE__*/React$8.createElement(HUD$1, {
      message: "Style warnings",
      enabled: this.state.highlightLint,
      onClick: () => {
        this.setState({
          highlightLint: !this.state.highlightLint
        });
      }
    })), this.props.developerMode && this.props.jsonMode && /*#__PURE__*/React$8.createElement("div", null, /*#__PURE__*/React$8.createElement(JsonEditor$1, {
      multiLine: true,
      value: this.state.json,
      onChange: this.changeJSON
    })), (!this.props.developerMode || !this.props.jsonMode) && /*#__PURE__*/React$8.createElement(ItemEditor, {
      ref: "itemEditor",
      rendererOnly: this.props.jsonMode,
      question: this.props.question,
      answerArea: this.props.answerArea,
      imageUploader: this.props.imageUploader,
      onChange: this.handleChange,
      wasAnswered: this.state.wasAnswered,
      gradeMessage: this.state.gradeMessage,
      onCheckAnswer: this.handleCheckAnswer,
      deviceType: this.props.previewDevice,
      apiOptions: deviceBasedApiOptions,
      frameSource: this.props.frameSource
    }), (!this.props.developerMode || !this.props.jsonMode) && /*#__PURE__*/React$8.createElement(CombinedHintsEditor, {
      ref: "hintsEditor",
      hints: this.props.hints,
      imageUploader: this.props.imageUploader,
      onChange: this.handleChange,
      deviceType: this.props.previewDevice,
      apiOptions: deviceBasedApiOptions,
      frameSource: this.props.frameSource,
      highlightLint: this.state.highlightLint
    }));
  },
  getSaveWarnings: function getSaveWarnings() {
    var issues1 = this.refs.itemEditor.getSaveWarnings();
    var issues2 = this.refs.hintsEditor.getSaveWarnings();
    return issues1.concat(issues2);
  },
  serialize: function serialize(options) {
    if (this.props.jsonMode) {
      return this.state.json;
    } else {
      return _$d.extend(this.refs.itemEditor.serialize(options), {
        hints: this.refs.hintsEditor.serialize(options)
      });
    }
  }
});
_module_$f.exports = EditorPage$2;
var _editorPageJsx = _module_$f.exports;

var _module_$e = {
  exports: {}
};

/**
 * An article editor. Articles are long-form pieces of content, composed of
 * multiple (Renderer) sections concatenated together.
 */

var React$7 = _react__default["default"];
var _$c = _underscore__default["default"];
var ApiOptions = perseus._perseusApiJsx.Options;
var Editor$1 = perseus._editorJsx;
var InlineIcon = perseus._componentsInlineIconJsx;
var JsonEditor = _jsonEditorJsx;
var DeviceFramer$1 = _componentsDeviceFramerJsx;
var IframeContentRenderer$1 = _iframeContentRendererJsx;
var HUD = _componentsHudJsx;
var rendererProps$2 = PropTypes.shape({
  content: PropTypes.string,
  widgets: PropTypes.object,
  images: PropTypes.object
});
var SectionControlButton = createReactClass({
  displayName: "SectionControlButton",
  propTypes: {
    icon: PropTypes.shape(InlineIcon.propTypes).isRequired,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
  },
  render: function render() {
    var {
      icon,
      onClick: _onClick,
      title
    } = this.props;
    return /*#__PURE__*/React$7.createElement("a", {
      href: "#",
      className: "section-control-button " + "simple-button " + "simple-button--small " + "orange",
      onClick: e => {
        e.preventDefault();
        _onClick();
      },
      title: title
    }, /*#__PURE__*/React$7.createElement(InlineIcon, icon));
  }
});
var ArticleEditor$2 = createReactClass({
  displayName: "ArticleEditor",
  propTypes: {
    apiOptions: PropTypes.shape({}),
    contentPaths: PropTypes.arrayOf(PropTypes.string),
    frameSource: PropTypes.string.isRequired,
    imageUploader: PropTypes.func,
    json: PropTypes.oneOfType([rendererProps$2, PropTypes.arrayOf(rendererProps$2)]),
    mode: PropTypes.oneOf(["diff", "edit", "json", "preview"]),
    onChange: PropTypes.func.isRequired,
    screen: PropTypes.oneOf(["phone", "tablet", "desktop"]),
    sectionImageUploadGenerator: PropTypes.func,
    useNewStyles: PropTypes.bool
  },
  getDefaultProps: function getDefaultProps() {
    return {
      contentPaths: [],
      json: [{}],
      mode: "edit",
      screen: "desktop",
      sectionImageUploadGenerator: () => /*#__PURE__*/React$7.createElement("span", null),
      useNewStyles: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      highlightLint: true
    };
  },
  componentDidMount: function componentDidMount() {
    this._updatePreviewFrames();
  },
  componentDidUpdate: function componentDidUpdate() {
    this._updatePreviewFrames();
  },
  _updatePreviewFrames: function _updatePreviewFrames() {
    if (this.props.mode === "preview") {
      this.refs["frame-all"].sendNewData({
        type: "article-all",
        data: this._sections().map((section, i) => {
          return this._apiOptionsForSection(section, i);
        })
      });
    } else if (this.props.mode === "edit") {
      this._sections().forEach((section, i) => {
        this.refs["frame-" + i].sendNewData({
          type: "article",
          data: this._apiOptionsForSection(section, i)
        });
      });
    }
  },
  _apiOptionsForSection: function _apiOptionsForSection(section, sectionIndex) {
    var editor = this.refs["editor".concat(sectionIndex)];
    return {
      apiOptions: perseus._objectSpread2(perseus._objectSpread2(perseus._objectSpread2({}, ApiOptions.defaults), this.props.apiOptions), {}, {
        // Alignment options are always available in article
        // editors
        showAlignmentOptions: true,
        isArticle: true
      }),
      json: section,
      useNewStyles: this.props.useNewStyles,
      linterContext: {
        contentType: "article",
        highlightLint: this.state.highlightLint,
        paths: this.props.contentPaths
      },
      legacyPerseusLint: editor ? editor.getSaveWarnings() : []
    };
  },
  _sections: function _sections() {
    return _$c.isArray(this.props.json) ? this.props.json : [this.props.json];
  },
  _renderEditor: function _renderEditor() {
    var {
      imageUploader,
      sectionImageUploadGenerator
    } = this.props;
    var apiOptions = perseus._objectSpread2(perseus._objectSpread2(perseus._objectSpread2({}, ApiOptions.defaults), this.props.apiOptions), {}, {
      // Alignment options are always available in article editors
      showAlignmentOptions: true,
      isArticle: true
    });
    var sections = this._sections();

    /* eslint-disable max-len */
    return /*#__PURE__*/React$7.createElement("div", {
      className: "perseus-editor-table"
    }, sections.map((section, i) => {
      return [/*#__PURE__*/React$7.createElement("div", {
        className: "perseus-editor-row"
      }, /*#__PURE__*/React$7.createElement("div", {
        className: "perseus-editor-left-cell"
      }, /*#__PURE__*/React$7.createElement("div", {
        className: "pod-title"
      }, "Section ", i + 1, /*#__PURE__*/React$7.createElement("div", {
        style: {
          display: "inline-block",
          float: "right"
        }
      }, sectionImageUploadGenerator(i), /*#__PURE__*/React$7.createElement(SectionControlButton, {
        icon: perseus.iconPlus,
        onClick: () => {
          this._handleAddSectionAfter(i);
        },
        title: "Add a new section after this one"
      }), i + 1 < sections.length && /*#__PURE__*/React$7.createElement(SectionControlButton, {
        icon: perseus.iconCircleArrowDown,
        onClick: () => {
          this._handleMoveSectionLater(i);
        },
        title: "Move this section down"
      }), i > 0 && /*#__PURE__*/React$7.createElement(SectionControlButton, {
        icon: perseus.iconCircleArrowUp,
        onClick: () => {
          this._handleMoveSectionEarlier(i);
        },
        title: "Move this section up"
      }), /*#__PURE__*/React$7.createElement(SectionControlButton, {
        icon: perseus.iconTrash,
        onClick: () => {
          var msg = "Are you sure you " + "want to delete section " + (i + 1) + "?";
          /* eslint-disable no-alert */
          if (confirm(msg)) {
            this._handleRemoveSection(i);
          }
          /* eslint-enable no-alert */
        },
        title: "Delete this section"
      }))), /*#__PURE__*/React$7.createElement(Editor$1, perseus._extends({}, section, {
        apiOptions: apiOptions,
        imageUploader: imageUploader,
        onChange: _$c.partial(this._handleEditorChange, i),
        placeholder: "Type your section text here...",
        ref: "editor" + i
      }))), /*#__PURE__*/React$7.createElement("div", {
        className: "editor-preview"
      }, this._renderIframePreview(i, true)))];
    }), this._renderAddSection(), this._renderLinterHUD());
    /* eslint-enable max-len */
  },
  _renderAddSection: function _renderAddSection() {
    return /*#__PURE__*/React$7.createElement("div", {
      className: "perseus-editor-row"
    }, /*#__PURE__*/React$7.createElement("div", {
      className: "perseus-editor-left-cell"
    }, /*#__PURE__*/React$7.createElement("a", {
      href: "#",
      className: "simple-button orange",
      onClick: () => {
        this._handleAddSectionAfter(this._sections().length - 1);
      }
    }, /*#__PURE__*/React$7.createElement(InlineIcon, perseus.iconPlus), " Add a section")));
  },
  _renderLinterHUD: function _renderLinterHUD() {
    return /*#__PURE__*/React$7.createElement(HUD, {
      message: "Style warnings",
      enabled: this.state.highlightLint,
      onClick: () => {
        this.setState({
          highlightLint: !this.state.highlightLint
        });
      }
    });
  },
  _renderIframePreview: function _renderIframePreview(i, nochrome) {
    var isMobile = this.props.screen === "phone" || this.props.screen === "tablet";
    return /*#__PURE__*/React$7.createElement(DeviceFramer$1, {
      deviceType: this.props.screen,
      nochrome: nochrome
    }, /*#__PURE__*/React$7.createElement(IframeContentRenderer$1, {
      ref: "frame-" + i,
      key: this.props.screen,
      content: this.props.frameSource,
      datasetKey: "mobile",
      datasetValue: isMobile,
      seamless: nochrome
    }));
  },
  _renderPreviewMode: function _renderPreviewMode() {
    return /*#__PURE__*/React$7.createElement("div", {
      className: "standalone-preview"
    }, this._renderIframePreview("all", false));
  },
  _handleJsonChange: function _handleJsonChange(newJson) {
    this.props.onChange({
      json: newJson
    });
  },
  _handleEditorChange: function _handleEditorChange(i, newProps) {
    var sections = _$c.clone(this._sections());
    sections[i] = _$c.extend({}, sections[i], newProps);
    this.props.onChange({
      json: sections
    });
  },
  _handleMoveSectionEarlier: function _handleMoveSectionEarlier(i) {
    if (i === 0) {
      return;
    }
    var sections = _$c.clone(this._sections());
    var section = sections[i];
    sections.splice(i, 1);
    sections.splice(i - 1, 0, section);
    this.props.onChange({
      json: sections
    });
  },
  _handleMoveSectionLater: function _handleMoveSectionLater(i) {
    var sections = _$c.clone(this._sections());
    if (i + 1 === sections.length) {
      return;
    }
    var section = sections[i];
    sections.splice(i, 1);
    sections.splice(i + 1, 0, section);
    this.props.onChange({
      json: sections
    });
  },
  _handleAddSectionAfter: function _handleAddSectionAfter(i) {
    // We do a full serialization here because we
    // might be copying widgets:
    var sections = _$c.clone(this.serialize());
    // Here we do magic to allow you to copy-paste
    // things from the previous section into the new
    // section while preserving widgets.
    // To enable this, we preserve the widgets
    // object for the new section, but wipe out
    // the content.
    var newSection = i >= 0 ? {
      widgets: sections[i].widgets
    } : {};
    sections.splice(i + 1, 0, newSection);
    this.props.onChange({
      json: sections
    });
  },
  _handleRemoveSection: function _handleRemoveSection(i) {
    var sections = _$c.clone(this._sections());
    sections.splice(i, 1);
    this.props.onChange({
      json: sections
    });
  },
  serialize: function serialize() {
    if (this.props.mode === "edit") {
      return this._sections().map((section, i) => {
        return this.refs["editor" + i].serialize();
      });
    } else if (this.props.mode === "preview" || this.props.mode === "json") {
      return this.props.json;
    } else {
      throw new Error("Could not serialize; mode " + this.props.mode + " not found");
    }
  },
  /**
   * Returns an array, with one element be section.
   * Each element is an array of lint warnings present in that section.
   *
   * This function can currently only be called in edit mode.
   */
  getSaveWarnings: function getSaveWarnings() {
    if (this.props.mode !== "edit") {
      // TODO(joshuan): We should be able to get save warnings in
      // preview mode.
      throw new Error("Cannot only get save warnings in edit mode.");
    }
    return this._sections().map((section, i) => {
      return this.refs["editor" + i].getSaveWarnings();
    });
  },
  render: function render() {
    return /*#__PURE__*/React$7.createElement("div", {
      className: "framework-perseus perseus-article-editor"
    }, this.props.mode === "edit" && this._renderEditor(), this.props.mode === "preview" && this._renderPreviewMode(), this.props.mode === "json" && /*#__PURE__*/React$7.createElement("div", {
      className: "json-editor"
    }, /*#__PURE__*/React$7.createElement("div", {
      className: "json-editor-warning"
    }, /*#__PURE__*/React$7.createElement("span", null, "Warning: Editing in this mode can lead to broken articles!")), /*#__PURE__*/React$7.createElement(JsonEditor, {
      multiLine: true,
      onChange: this._handleJsonChange,
      value: this.props.json
    })));
  }
});
_module_$e.exports = ArticleEditor$2;
var _articleEditorJsx = _module_$e.exports;

var _module_$d = {
  exports: {}
};
/**
 * Functions for extracting data from items for use in i18n.
 */
var _$b = _underscore__default["default"];
var traversal = _traversalJsx;
var PerseusMarkdown = perseus._perseusMarkdownJsx;

// Takes a renderer content and parses the markdown for images
function findImagesInContent(content, images) {
  var parsed = PerseusMarkdown.parse(content);
  PerseusMarkdown.traverseContent(parsed, function (node) {
    if (node.type === "image") {
      images.push(node.target);
    }
  });
}

// Background images in some widgets are annoying to deal with because
// sometimes the objects aren't full when there isn't an image. So, we do some
// extra checking to make sure we don't cause an error or push an empty image.
function handleBackgroundImage(graph, images) {
  if (graph && graph.backgroundImage && graph.backgroundImage.url) {
    images.push(graph.backgroundImage.url);
  }
}

// The callback called for each widget. We check each of the areas of each
// widget where they contain a renderer for images by calling
// findImagesInContent. We don't have to recurse through child widgets, because
// traverseRendererDeep does that for us.
function widgetCallback(widgetInfo, images) {
  if (!widgetInfo.options) {
    return;
  }

  // TODO(emily/aria): Move this into the widget files, so we don't have the
  // logic out here.
  if (widgetInfo.type === "categorizer") {
    _$b.each(widgetInfo.options.items, function (item) {
      findImagesInContent(item, images);
    });
    _$b.each(widgetInfo.options.categories, function (category) {
      findImagesInContent(category, images);
    });
  } else if (widgetInfo.type === "image") {
    findImagesInContent(widgetInfo.options.title, images);
    findImagesInContent(widgetInfo.options.caption, images);
  } else if (widgetInfo.type === "matcher") {
    _$b.each(widgetInfo.options.left, function (option) {
      findImagesInContent(option, images);
    });
    _$b.each(widgetInfo.options.right, function (option) {
      findImagesInContent(option, images);
    });
    _$b.each(widgetInfo.options.labels, function (label) {
      findImagesInContent(label, images);
    });
  } else if (widgetInfo.type === "matrix") {
    findImagesInContent(widgetInfo.options.prefix, images);
    findImagesInContent(widgetInfo.options.suffix, images);
  } else if (widgetInfo.type === "orderer") {
    _$b.each(widgetInfo.options.options, function (option) {
      findImagesInContent(option.content, images);
    });
  } else if (widgetInfo.type === "passage") {
    findImagesInContent(widgetInfo.options.passageTitle, images);
  } else if (widgetInfo.type === "radio") {
    _$b.each(widgetInfo.options.choices, function (choice) {
      findImagesInContent(choice.content, images);
    });
  } else if (widgetInfo.type === "sorter") {
    _$b.each(widgetInfo.options.correct, function (option) {
      findImagesInContent(option, images);
    });
  } else if (widgetInfo.type === "table") {
    _$b.each(widgetInfo.options.headers, function (header) {
      findImagesInContent(header, images);
    });
  }
  if (widgetInfo.type === "grapher") {
    handleBackgroundImage(widgetInfo.options.graph, images);
  } else if (widgetInfo.type === "image") {
    handleBackgroundImage(widgetInfo.options, images);
  } else if (widgetInfo.type === "interactive-graph") {
    handleBackgroundImage(widgetInfo.options, images);
  } else if (widgetInfo.type === "measurer" && widgetInfo.options.image) {
    images.push(widgetInfo.options.image.url);
  } else if (widgetInfo.type === "plotter") {
    images.push(widgetInfo.options.picUrl);
  } else if (widgetInfo.type === "transformer") {
    handleBackgroundImage(widgetInfo.options.graph, images);
  }
}
function findImagesInRenderers(renderers) {
  var images = [];
  _$b.each(renderers, renderer => {
    traversal.traverseRendererDeep(renderer, content => {
      findImagesInContent(content, images);
    }, widget => widgetCallback(widget, images));
  });
  return images;
}

// Calls findImagesInContent on all of the different content areas for
// assessment items
function findImagesInItemData(itemData) {
  var renderers = [];
  if (itemData._multi) {
    var shape = perseus.inferItemShape(itemData);
    perseus.findContentNodesInItem(itemData, shape, node => renderers.push(node));
    perseus.findHintNodesInItem(itemData, shape, node => renderers.push(node));
  } else {
    renderers = [itemData.question, ...itemData.hints];
  }
  return findImagesInRenderers(renderers);
}

// Calls findImagesInContent on all of the different content areas for
// articles
function findImagesInArticles(perseusContent) {
  return findImagesInRenderers(perseusContent);
}
_module_$d.exports = {
  findImagesInArticles: findImagesInArticles,
  findImagesInItemData: findImagesInItemData
};
var _i18nJsx = _module_$d.exports;

var _module_$c = {
  exports: {}
};
/**
 * Identifies whether or not a given perseus item requires the use of a mouse
 * or screen, based on the widgets it contains.
 */

var _$a = _underscore__default["default"];
var Traversal$1 = _traversalJsx;
var Widgets$3 = perseus._widgetsJs;

// Iterate over a single Perseus renderer, mutating `widgets` by appending
// violating widget types discovered in this item.
function traverseRenderer(itemData, widgets) {
  Traversal$1.traverseRendererDeep(itemData, null, function (info) {
    if (info.type && !Widgets$3.isAccessible(info)) {
      widgets.push(info.type);
    }
  });
}
_module_$c.exports = {
  // Returns a list of widgets that cause a given perseus item to require
  // the use of a screen or mouse.
  //
  // For now we'll just check the `accessible` field on each of the widgets
  // in the item data, but in the future we may specify accessibility on
  // each widget with higher granularity.
  violatingWidgets: function violatingWidgets(itemData) {
    // TODO(jordan): Hints as well
    var widgets = [];
    if (itemData._multi) {
      var shape = perseus.inferItemShape(itemData);
      perseus.findContentNodesInItem(itemData, shape, content => traverseRenderer(content, widgets));
    } else {
      traverseRenderer(itemData.question, widgets);
    }

    // Uniquify the list of widgets (by type)
    return _$a.uniq(widgets);
  }
};
var _a11yJs = _module_$c.exports;

var _module_$b = {
  exports: {}
};
var Traversal = _traversalJsx;
var Widgets$2 = perseus._widgetsJs;
var isUpgradedWidgetInfoRenderableBy = function isUpgradedWidgetInfoRenderableBy(widgetInfo, widgetRendererVersion) {
  if (widgetRendererVersion == null) {
    // If the widget does not exist in this version, this will
    // be null, and that version of perseus cannot render the
    // widget (it doesn't even know the widget exists!)
    return false;
  }
  var widgetVersion = widgetInfo.version || {
    major: 0,
    minor: 0
  };
  if (widgetRendererVersion.major > widgetVersion.major) {
    return true;
  } else if (widgetRendererVersion.major < widgetVersion.major) {
    return false;
  } else {
    // If the major versions are the same, the minor version acts
    // like a tie-breaker.
    // For example, input-number 3.2 can render an input-number
    // 2.4, 3.0, or 3.2, but not an input number 3.3 or 4.0.
    return widgetRendererVersion.minor >= widgetVersion.minor;
  }
};
var isRawWidgetInfoRenderableBy = function isRawWidgetInfoRenderableBy(widgetInfo, rendererContentVersion) {
  // Empty/non-existant widgets are always safe to render
  if (widgetInfo == null || widgetInfo.type == null) {
    return true;
  }

  // NOTE: This doesn't modify the widget info if the widget info
  // is at a later version than is supported.
  var upgradedWidgetInfo = Widgets$2.upgradeWidgetInfoToLatestVersion(widgetInfo);
  return isUpgradedWidgetInfoRenderableBy(upgradedWidgetInfo, rendererContentVersion[upgradedWidgetInfo.type]);
};
var isRendererContentRenderableBy = function isRendererContentRenderableBy(rendererOptions, rendererContentVersion) {
  var isRenderable = true;
  Traversal.traverseRendererDeep(rendererOptions, null, function (widgetInfo) {
    isRenderable = isRenderable && isRawWidgetInfoRenderableBy(widgetInfo, rendererContentVersion);
  });
  return isRenderable;
};
var isItemRenderableBy = function isItemRenderableBy(itemData, rendererContentVersion) {
  if (itemData == null || rendererContentVersion == null) {
    throw new Error("missing parameter to Perseus.isRenderable.item");
  }
  if (itemData._multi) {
    var shape = perseus.inferItemShape(itemData);
    var isRenderable = true;
    perseus.findContentNodesInItem(itemData, shape, node => {
      var nodeIsRenderable = isRendererContentRenderableBy(node, rendererContentVersion);
      if (!nodeIsRenderable) {
        isRenderable = false;
      }
    });
    return isRenderable;
  } else {
    return isRendererContentRenderableBy(itemData.question, rendererContentVersion);
  }
};
_module_$b.exports = {
  isItemRenderableByVersion: isItemRenderableBy
};
var _renderabilityJsx = _module_$b.exports;

var _module_$a = {
  exports: {}
};
/* eslint-disable comma-dangle, no-var, react/sort-comp */
/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var React$6 = _react__default["default"];
var _$9 = _underscore__default["default"];
var EditorPage$1 = _editorPageJsx;

/* Renders an EditorPage (or an ArticleEditor) as a non-controlled component.
 *
 * Normally the parent of EditorPage must pass it an onChange callback and then
 * respond to any changes by modifying the EditorPage props to reflect those
 * changes. With StatefulEditorPage changes are stored in state so you can
 * query them with serialize.
 */
var StatefulEditorPage$1 = createReactClass({
  displayName: "StatefulEditorPage",
  propTypes: {
    componentClass: PropTypes.func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      componentClass: EditorPage$1
    };
  },
  render: function render() {
    return /*#__PURE__*/React$6.createElement(this.props.componentClass, this.state);
  },
  getInitialState: function getInitialState() {
    return _$9.extend({}, _$9.omit(this.props, "componentClass"), {
      onChange: this.handleChange,
      ref: "editor"
    });
  },
  // getInitialState isn't called if the react component is re-rendered
  // in-place on the dom, in which case this is called instead, so we
  // need to update the state here.
  // (This component is currently re-rendered by the "Add image" button.)
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.setState(_$9.pick(nextProps, "apiOptions", "imageUploader", "developerMode", "problemNum", "previewDevice", "frameSource"));
  },
  getSaveWarnings: function getSaveWarnings() {
    return this.refs.editor.getSaveWarnings();
  },
  serialize: function serialize() {
    return this.refs.editor.serialize();
  },
  handleChange: function handleChange(newState, cb) {
    if (this.isMounted()) {
      this.setState(newState, cb);
    }
  },
  scorePreview: function scorePreview() {
    return this.refs.editor.scorePreview();
  }
});
_module_$a.exports = StatefulEditorPage$1;
var _statefulEditorPageJsx = _module_$a.exports;

var _module_$9 = {
  exports: {}
};

/**
 * Renders an ArticleEditor as a non-controlled component.
 *
 * Normally the parent of ArticleEditor must pass it an onChange callback and
 * then respond to any changes by modifying the ArticleEditor props to reflect
 * those changes. With StatefulArticleEditor changes are stored in state so you
 * can query them with serialize.
 */

var React$5 = _react__default["default"];
var _$8 = _underscore__default["default"];
var ArticleEditor$1 = _articleEditorJsx;
var StatefulArticleEditor$1 = createReactClass({
  displayName: "StatefulArticleEditor",
  getInitialState: function getInitialState() {
    return Object.assign({}, this.props, {
      mode: "edit",
      onChange: this.handleChange,
      ref: "editor",
      screen: "phone"
    });
  },
  // getInitialState isn't called if the react component is re-rendered
  // in-place on the dom, in which case this is called instead, so we
  // need to update the state here.
  // (This component is currently re-rendered by the "Add image" button.)
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    // be careful not to overwrite our onChange and ref
    this.setState(_$8.omit(nextProps, "onChange", "ref"));
  },
  getSaveWarnings: function getSaveWarnings() {
    return this.refs.editor.getSaveWarnings();
  },
  serialize: function serialize() {
    return this.refs.editor.serialize();
  },
  handleChange: function handleChange(newState, cb) {
    if (this.isMounted()) {
      this.setState(newState, cb);
    }
  },
  scorePreview: function scorePreview() {
    return this.refs.editor.scorePreview();
  },
  render: function render() {
    var {
      mode,
      screen
    } = this.state;
    return /*#__PURE__*/React$5.createElement("div", null, /*#__PURE__*/React$5.createElement("div", {
      style: styles.controlBar
    }, /*#__PURE__*/React$5.createElement("span", {
      style: styles.controls
    }, "Mode:", " ", /*#__PURE__*/React$5.createElement("span", {
      onClick: () => this.setState({
        mode: "edit"
      }),
      style: mode === "edit" ? styles.controlSelected : styles.control
    }, "EDIT"), " | ", /*#__PURE__*/React$5.createElement("span", {
      onClick: () => this.setState({
        mode: "preview"
      }),
      style: mode === "preview" ? styles.controlSelected : styles.control
    }, "PREVIEW"), " | ", /*#__PURE__*/React$5.createElement("span", {
      onClick: () => this.setState({
        mode: "json"
      }),
      style: mode === "json" ? styles.controlSelected : styles.control
    }, "JSON")), /*#__PURE__*/React$5.createElement("span", {
      style: styles.controls
    }, "Screen:", " ", /*#__PURE__*/React$5.createElement("span", {
      onClick: () => this.setState({
        screen: "phone"
      }),
      style: screen === "phone" ? styles.controlSelected : styles.control
    }, "PHONE"), " | ", /*#__PURE__*/React$5.createElement("span", {
      onClick: () => this.setState({
        screen: "tablet"
      }),
      style: screen === "tablet" ? styles.controlSelected : styles.control
    }, "TABLET"), " | ", /*#__PURE__*/React$5.createElement("span", {
      onClick: () => this.setState({
        screen: "desktop"
      }),
      style: screen === "desktop" ? styles.controlSelected : styles.control
    }, "DESKTOP"))), /*#__PURE__*/React$5.createElement("div", {
      style: styles.editor
    }, /*#__PURE__*/React$5.createElement(ArticleEditor$1, this.state)));
  }
});
var styles = {
  controlBar: {
    marginBottom: 25,
    marginTop: 5
  },
  controls: {
    marginRight: 10
  },
  controlSelected: {
    cursor: "default",
    fontWeight: 700
  },
  control: {
    cursor: "pointer"
  },
  editor: {
    marginTop: -20
  }
};
_module_$9.exports = StatefulArticleEditor$1;
var _statefulArticleEditorJsx = _module_$9.exports;

var _module_$8 = {
  exports: {}
};
var _$7 = _underscore__default["default"];
var UNCHANGED$1 = "unchanged";
var CHANGED = "changed";
var ADDED = "added";
var REMOVED = "removed";

// For values which do not have further values nested within them (strings,
// numbers, and booleans)
var valueEntry = function valueEntry(before, after, key) {
  var status;
  if (before === after) {
    status = UNCHANGED$1;
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
    status: status
  };
};

// For values which require a more granular diff (objects and arrays)
var objectEntry = function objectEntry(before, after, key) {
  var beforeKeys = _$7.isObject(before) ? Object.keys(before) : [];
  var afterKeys = _$7.isObject(after) ? Object.keys(after) : [];
  var keys = _$7.union(beforeKeys, afterKeys);
  var children = _$7.map(keys, function (key) {
    return performDiff$1((before || {})[key], (after || {})[key], key);
  });
  var status;
  if (before === undefined) {
    status = ADDED;
  } else if (after === undefined) {
    status = REMOVED;
  } else {
    var changed = _$7.any(children, function (child) {
      return child.status !== UNCHANGED$1;
    });
    status = changed ? CHANGED : UNCHANGED$1;
  }
  return {
    after: "",
    before: "",
    children: children,
    key: key,
    status: status
  };
};
var performDiff$1 = function performDiff(before, after, /* optional */key) {
  if (typeof before === "object" || typeof after === "object") {
    return objectEntry(before, after, key);
  } else {
    return valueEntry(before, after, key);
  }
};
_module_$8.exports = performDiff$1;
var _widgetDiffPerformerJsx = _module_$8.exports;

var _module_$7 = {
  exports: {}
};
var classNames$1 = _classnames__default["default"];
var React$4 = _react__default["default"];
var _$6 = _underscore__default["default"];
var performDiff = _widgetDiffPerformerJsx;
var SvgImage$1 = perseus._componentsSvgImageJsx;
var indentationFromDepth = function indentationFromDepth(depth) {
  return (depth - 1) * 20;
};
var BEFORE$1 = "before";
var AFTER$1 = "after";
var UNCHANGED = "unchanged";
var DiffSide = createReactClass({
  displayName: "DiffSide",
  propTypes: {
    className: PropTypes.string.isRequired,
    depth: PropTypes.number.isRequired,
    propKey: PropTypes.string.isRequired,
    showKey: PropTypes.bool.isRequired,
    side: PropTypes.oneOf([BEFORE$1, AFTER$1]).isRequired,
    value: PropTypes.string
  },
  render: function render() {
    var className = classNames$1(this.props.className, {
      "diff-row": true,
      before: this.props.side === BEFORE$1,
      after: this.props.side === AFTER$1
    });
    return /*#__PURE__*/React$4.createElement("div", {
      className: className
    }, /*#__PURE__*/React$4.createElement("div", {
      style: {
        paddingLeft: indentationFromDepth(this.props.depth)
      }
    }, this.props.showKey && this.props.propKey + ": ", /*#__PURE__*/React$4.createElement("span", {
      className: "inner-value dark " + this.props.className
    }, this.props.value)));
  }
});
var CollapsedRow = createReactClass({
  displayName: "CollapsedRow",
  propTypes: {
    depth: PropTypes.number,
    onClick: PropTypes.func.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      depth: 0
    };
  },
  render: function render() {
    var self = this;
    return /*#__PURE__*/React$4.createElement("div", {
      onClick: self.props.onClick,
      style: {
        clear: "both"
      }
    }, _$6.map([BEFORE$1, AFTER$1], function (side) {
      return /*#__PURE__*/React$4.createElement("div", {
        className: "diff-row collapsed " + side,
        key: side
      }, /*#__PURE__*/React$4.createElement("div", {
        style: {
          paddingLeft: indentationFromDepth(self.props.depth)
        }
      }, /*#__PURE__*/React$4.createElement("span", null, " [ show unmodified ] ")));
    }));
  }
});

// Component representing a single property that may be nested.
var DiffEntry = createReactClass({
  displayName: "DiffEntry",
  propTypes: {
    depth: PropTypes.number,
    entry: PropTypes.shape({
      after: PropTypes.string,
      before: PropTypes.string,
      children: PropTypes.array,
      key: PropTypes.string
    }),
    expanded: PropTypes.bool
  },
  getDefaultProps: function getDefaultProps() {
    return {
      depth: 0
    };
  },
  getInitialState: function getInitialState() {
    return {
      expanded: this.props.expanded
    };
  },
  expand: function expand() {
    this.setState({
      expanded: true
    });
  },
  render: function render() {
    var entry = this.props.entry;
    var propertyDeleted = entry.status === "removed";
    var propertyAdded = entry.status === "added";
    var propertyChanged = entry.status === "changed";
    var hasChildren = entry.children.length > 0;
    var leftClass = classNames$1({
      "removed": propertyDeleted || propertyChanged && !hasChildren,
      "dark": propertyDeleted,
      "blank-space": propertyAdded
    });
    var rightClass = classNames$1({
      "added": propertyAdded || propertyChanged && !hasChildren,
      "dark": propertyAdded,
      "blank-space": propertyDeleted
    });
    var shownChildren;
    if (this.state.expanded) {
      shownChildren = entry.children;
    } else {
      shownChildren = _$6.select(entry.children, function (child) {
        return child.status !== UNCHANGED;
      });
    }
    var collapsed = shownChildren.length < entry.children.length;

    // don't hide just one entry
    if (entry.children.length === shownChildren.length + 1) {
      shownChildren = entry.children;
      collapsed = false;
    }
    var self = this;
    return /*#__PURE__*/React$4.createElement("div", null, entry.key && /*#__PURE__*/React$4.createElement("div", {
      style: {
        clear: "both"
      }
    }, /*#__PURE__*/React$4.createElement(DiffSide, {
      side: BEFORE$1,
      className: leftClass,
      depth: this.props.depth,
      propKey: entry.key,
      showKey: !propertyAdded,
      value: entry.before
    }), /*#__PURE__*/React$4.createElement(DiffSide, {
      side: AFTER$1,
      className: rightClass,
      depth: this.props.depth,
      propKey: entry.key,
      showKey: !propertyDeleted,
      value: entry.after
    })), _$6.map(shownChildren, function (child) {
      return /*#__PURE__*/React$4.createElement(DiffEntry, {
        key: child.key,
        depth: self.props.depth + 1,
        entry: child,
        expanded: self.state.expanded
      });
    }), collapsed && /*#__PURE__*/React$4.createElement(CollapsedRow, {
      depth: this.props.depth + 1,
      onClick: this.expand
    }));
  }
});

// For image widgets, show the actual image
var ImageWidgetDiff = createReactClass({
  displayName: "ImageWidgetDiff",
  propTypes: {
    after: PropTypes.shape({
      options: PropTypes.object
    }).isRequired,
    before: PropTypes.shape({
      options: PropTypes.object
    }).isRequired
  },
  render: function render() {
    var {
      before,
      after
    } = this.props;
    var beforeSrc = before.options && before.options.backgroundImage ? before.options.backgroundImage.url : "";
    var afterSrc = after.options && after.options.backgroundImage ? after.options.backgroundImage.url : "";
    return /*#__PURE__*/React$4.createElement("div", null, /*#__PURE__*/React$4.createElement("div", {
      className: "diff-row before"
    }, beforeSrc && /*#__PURE__*/React$4.createElement("div", {
      className: classNames$1({
        "image": true,
        "image-unchanged": beforeSrc === afterSrc,
        "image-removed": beforeSrc !== afterSrc
      })
    }, /*#__PURE__*/React$4.createElement(SvgImage$1, {
      src: beforeSrc,
      title: beforeSrc
    }))), /*#__PURE__*/React$4.createElement("div", {
      className: "diff-row after"
    }, afterSrc && /*#__PURE__*/React$4.createElement("div", {
      className: classNames$1({
        "image": true,
        "image-unchanged": beforeSrc === afterSrc,
        "image-added": beforeSrc !== afterSrc
      })
    }, /*#__PURE__*/React$4.createElement(SvgImage$1, {
      src: afterSrc,
      title: afterSrc
    }))));
  }
});
var WidgetDiff$2 = createReactClass({
  displayName: "WidgetDiff",
  propTypes: {
    after: PropTypes.shape({
      options: PropTypes.object
    }),
    before: PropTypes.shape({
      options: PropTypes.object
    }),
    title: PropTypes.string.isRequired,
    type: PropTypes.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      after: {},
      before: {},
      type: ""
    };
  },
  render: function render() {
    var {
      after,
      before,
      title,
      type
    } = this.props;
    var diff = performDiff(before, after);
    return /*#__PURE__*/React$4.createElement("div", null, /*#__PURE__*/React$4.createElement("div", {
      className: "diff-header"
    }, title), /*#__PURE__*/React$4.createElement("div", {
      className: "diff-header"
    }, title), /*#__PURE__*/React$4.createElement("div", {
      className: "diff-body ui-helper-clearfix"
    }, type === "image" && /*#__PURE__*/React$4.createElement(ImageWidgetDiff, {
      before: before,
      after: after
    }), /*#__PURE__*/React$4.createElement(DiffEntry, {
      entry: diff
    })));
  }
});
_module_$7.exports = WidgetDiff$2;
var _widgetDiffJsx = _module_$7.exports;

/*
Software License Agreement (BSD License)

Copyright (c) 2009-2011, Kevin Decker <kpdecker@gmail.com>

All rights reserved.

Redistribution and use of this software in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above
  copyright notice, this list of conditions and the
  following disclaimer.

* Redistributions in binary form must reproduce the above
  copyright notice, this list of conditions and the
  following disclaimer in the documentation and/or other
  materials provided with the distribution.

* Neither the name of Kevin Decker nor the names of its
  contributors may be used to endorse or promote products
  derived from this software without specific prior
  written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
 * Text diff implementation.
 *
 * This library supports the following APIS:
 * JsDiff.diffChars: Character by character diff
 * JsDiff.diffWords: Word (as defined by \b regex) diff which ignores whitespace
 * JsDiff.diffLines: Line based diff
 *
 * JsDiff.diffCss: Diff targeted at CSS content
 *
 * These methods are based on the implementation proposed in
 * "An O(ND) Difference Algorithm and its Variations" (Myers, 1986).
 * http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.6927
 */
var JsDiff = function () {
  /*jshint maxparams: 5*/
  function clonePath(path) {
    return {
      newPos: path.newPos,
      components: path.components.slice(0)
    };
  }
  function removeEmpty(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }
    return ret;
  }
  function escapeHTML(s) {
    var n = s;
    n = n.replace(/&/g, '&amp;');
    n = n.replace(/</g, '&lt;');
    n = n.replace(/>/g, '&gt;');
    n = n.replace(/"/g, '&quot;');
    return n;
  }
  var Diff = function Diff(ignoreWhitespace) {
    this.ignoreWhitespace = ignoreWhitespace;
  };
  Diff.prototype = {
    diff: function diff(oldString, newString) {
      // Handle the identity case (this is due to unrolling editLength == 0
      if (newString === oldString) {
        return [{
          value: newString
        }];
      }
      if (!newString) {
        return [{
          value: oldString,
          removed: true
        }];
      }
      if (!oldString) {
        return [{
          value: newString,
          added: true
        }];
      }
      newString = this.tokenize(newString);
      oldString = this.tokenize(oldString);
      var newLen = newString.length,
        oldLen = oldString.length;
      var maxEditLength = newLen + oldLen;
      var bestPath = [{
        newPos: -1,
        components: []
      }];

      // Seed editLength = 0
      var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);
      if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
        return bestPath[0].components;
      }
      for (var editLength = 1; editLength <= maxEditLength; editLength++) {
        for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
          var basePath;
          var addPath = bestPath[diagonalPath - 1],
            removePath = bestPath[diagonalPath + 1];
          oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
          if (addPath) {
            // No one else is going to attempt to use this value, clear it
            bestPath[diagonalPath - 1] = undefined;
          }
          var canAdd = addPath && addPath.newPos + 1 < newLen;
          var canRemove = removePath && 0 <= oldPos && oldPos < oldLen;
          if (!canAdd && !canRemove) {
            bestPath[diagonalPath] = undefined;
            continue;
          }

          // Select the diagonal that we want to branch from. We select the prior
          // path whose position in the new string is the farthest from the origin
          // and does not pass the bounds of the diff graph
          if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
            basePath = clonePath(removePath);
            this.pushComponent(basePath.components, oldString[oldPos], undefined, true);
          } else {
            basePath = clonePath(addPath);
            basePath.newPos++;
            this.pushComponent(basePath.components, newString[basePath.newPos], true, undefined);
          }
          var oldPos = this.extractCommon(basePath, newString, oldString, diagonalPath);
          if (basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
            return basePath.components;
          } else {
            bestPath[diagonalPath] = basePath;
          }
        }
      }
    },
    pushComponent: function pushComponent(components, value, added, removed) {
      var last = components[components.length - 1];
      if (last && last.added === added && last.removed === removed) {
        // We need to clone here as the component clone operation is just
        // as shallow array clone
        components[components.length - 1] = {
          value: this.join(last.value, value),
          added: added,
          removed: removed
        };
      } else {
        components.push({
          value: value,
          added: added,
          removed: removed
        });
      }
    },
    extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
      var newLen = newString.length,
        oldLen = oldString.length,
        newPos = basePath.newPos,
        oldPos = newPos - diagonalPath;
      while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
        newPos++;
        oldPos++;
        this.pushComponent(basePath.components, newString[newPos], undefined, undefined);
      }
      basePath.newPos = newPos;
      return oldPos;
    },
    equals: function equals(left, right) {
      var reWhitespace = /\S/;
      if (this.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right)) {
        return true;
      } else {
        return left === right;
      }
    },
    join: function join(left, right) {
      return left + right;
    },
    tokenize: function tokenize(value) {
      return value;
    }
  };
  var CharDiff = new Diff();
  var WordDiff = new Diff(true);
  var WordWithSpaceDiff = new Diff();
  WordDiff.tokenize = WordWithSpaceDiff.tokenize = function (value) {
    return removeEmpty(value.split(/(\s+|\b)/));
  };
  var CssDiff = new Diff(true);
  CssDiff.tokenize = function (value) {
    return removeEmpty(value.split(/([{}:;,]|\s+)/));
  };
  var LineDiff = new Diff();
  LineDiff.tokenize = function (value) {
    var retLines = [],
      lines = value.split(/^/m);
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i],
        lastLine = lines[i - 1];

      // Merge lines that may contain windows new lines
      if (line == '\n' && lastLine && lastLine[lastLine.length - 1] === '\r') {
        retLines[retLines.length - 1] += '\n';
      } else if (line) {
        retLines.push(line);
      }
    }
    return retLines;
  };
  return {
    Diff: Diff,
    diffChars: function diffChars(oldStr, newStr) {
      return CharDiff.diff(oldStr, newStr);
    },
    diffWords: function diffWords(oldStr, newStr) {
      return WordDiff.diff(oldStr, newStr);
    },
    diffWordsWithSpace: function diffWordsWithSpace(oldStr, newStr) {
      return WordWithSpaceDiff.diff(oldStr, newStr);
    },
    diffLines: function diffLines(oldStr, newStr) {
      return LineDiff.diff(oldStr, newStr);
    },
    diffCss: function diffCss(oldStr, newStr) {
      return CssDiff.diff(oldStr, newStr);
    },
    createPatch: function createPatch(fileName, oldStr, newStr, oldHeader, newHeader) {
      var ret = [];
      ret.push('Index: ' + fileName);
      ret.push('===================================================================');
      ret.push('--- ' + fileName + (typeof oldHeader === 'undefined' ? '' : '\t' + oldHeader));
      ret.push('+++ ' + fileName + (typeof newHeader === 'undefined' ? '' : '\t' + newHeader));
      var diff = LineDiff.diff(oldStr, newStr);
      if (!diff[diff.length - 1].value) {
        diff.pop(); // Remove trailing newline add
      }
      diff.push({
        value: '',
        lines: []
      }); // Append an empty value to make cleanup easier

      function contextLines(lines) {
        return lines.map(function (entry) {
          return ' ' + entry;
        });
      }
      function eofNL(curRange, i, current) {
        var last = diff[diff.length - 2],
          isLast = i === diff.length - 2,
          isLastOfType = i === diff.length - 3 && (current.added !== last.added || current.removed !== last.removed);

        // Figure out if this is the last line for the given file and missing NL
        if (!/\n$/.test(current.value) && (isLast || isLastOfType)) {
          curRange.push('\\ No newline at end of file');
        }
      }
      var oldRangeStart = 0,
        newRangeStart = 0,
        curRange = [],
        oldLine = 1,
        newLine = 1;
      for (var i = 0; i < diff.length; i++) {
        var current = diff[i],
          lines = current.lines || current.value.replace(/\n$/, '').split('\n');
        current.lines = lines;
        if (current.added || current.removed) {
          if (!oldRangeStart) {
            var prev = diff[i - 1];
            oldRangeStart = oldLine;
            newRangeStart = newLine;
            if (prev) {
              curRange = contextLines(prev.lines.slice(-4));
              oldRangeStart -= curRange.length;
              newRangeStart -= curRange.length;
            }
          }
          curRange.push.apply(curRange, lines.map(function (entry) {
            return (current.added ? '+' : '-') + entry;
          }));
          eofNL(curRange, i, current);
          if (current.added) {
            newLine += lines.length;
          } else {
            oldLine += lines.length;
          }
        } else {
          if (oldRangeStart) {
            // Close out any changes that have been output (or join overlapping)
            if (lines.length <= 8 && i < diff.length - 2) {
              // Overlapping
              curRange.push.apply(curRange, contextLines(lines));
            } else {
              // end the range and output
              var contextSize = Math.min(lines.length, 4);
              ret.push('@@ -' + oldRangeStart + ',' + (oldLine - oldRangeStart + contextSize) + ' +' + newRangeStart + ',' + (newLine - newRangeStart + contextSize) + ' @@');
              ret.push.apply(ret, curRange);
              ret.push.apply(ret, contextLines(lines.slice(0, contextSize)));
              if (lines.length <= 4) {
                eofNL(ret, i, current);
              }
              oldRangeStart = 0;
              newRangeStart = 0;
              curRange = [];
            }
          }
          oldLine += lines.length;
          newLine += lines.length;
        }
      }
      return ret.join('\n') + '\n';
    },
    applyPatch: function applyPatch(oldStr, uniDiff) {
      var diffstr = uniDiff.split('\n');
      var diff = [];
      var remEOFNL = false,
        addEOFNL = false;
      for (var i = diffstr[0][0] === 'I' ? 4 : 0; i < diffstr.length; i++) {
        if (diffstr[i][0] === '@') {
          var meh = diffstr[i].split(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@/);
          diff.unshift({
            start: meh[3],
            oldlength: meh[2],
            oldlines: [],
            newlength: meh[4],
            newlines: []
          });
        } else if (diffstr[i][0] === '+') {
          diff[0].newlines.push(diffstr[i].substr(1));
        } else if (diffstr[i][0] === '-') {
          diff[0].oldlines.push(diffstr[i].substr(1));
        } else if (diffstr[i][0] === ' ') {
          diff[0].newlines.push(diffstr[i].substr(1));
          diff[0].oldlines.push(diffstr[i].substr(1));
        } else if (diffstr[i][0] === '\\') {
          if (diffstr[i - 1][0] === '+') {
            remEOFNL = true;
          } else if (diffstr[i - 1][0] === '-') {
            addEOFNL = true;
          }
        }
      }
      var str = oldStr.split('\n');
      for (var i = diff.length - 1; i >= 0; i--) {
        var d = diff[i];
        for (var j = 0; j < d.oldlength; j++) {
          if (str[d.start - 1 + j] !== d.oldlines[j]) {
            return false;
          }
        }
        Array.prototype.splice.apply(str, [d.start - 1, +d.oldlength].concat(d.newlines));
      }
      if (remEOFNL) {
        while (!str[str.length - 1]) {
          str.pop();
        }
      } else if (addEOFNL) {
        str.push('');
      }
      return str.join('\n');
    },
    convertChangesToXML: function convertChangesToXML(changes) {
      var ret = [];
      for (var i = 0; i < changes.length; i++) {
        var change = changes[i];
        if (change.added) {
          ret.push('<ins>');
        } else if (change.removed) {
          ret.push('<del>');
        }
        ret.push(escapeHTML(change.value));
        if (change.added) {
          ret.push('</ins>');
        } else if (change.removed) {
          ret.push('</del>');
        }
      }
      return ret.join('');
    },
    // See: http://code.google.com/p/google-diff-match-patch/wiki/API
    convertChangesToDMP: function convertChangesToDMP(changes) {
      var ret = [],
        change;
      for (var i = 0; i < changes.length; i++) {
        change = changes[i];
        ret.push([change.added ? 1 : change.removed ? -1 : 0, change.value]);
      }
      return ret;
    }
  };
}();

var _module_$6 = {
  exports: {}
};
var jsdiff = JsDiff;
var _$5 = _underscore__default["default"];
var statusFor = function statusFor(chunk) {
  if (chunk.added) {
    return "added";
  } else if (chunk.removed) {
    return "removed";
  } else {
    return "unchanged";
  }
};

// Turn a chunk (which contains an array of values and a status)
// into an array of values, each with the same status
var splitUpChunk = chunk => _$5.map(chunk.value, value => {
  return {
    value: value,
    status: statusFor(chunk)
  };
});

// Apply `fn` to every element in `lst` and then concatenate all the results
// http://clojuredocs.org/clojure_core/clojure.core/mapcat
var mapcat = function mapcat(lst, fn) {
  return _$5.flatten(_$5.map(lst, fn), true /* only flatten one level */);
};

// > ArrayDiff.diff([1,2,3], [2,3,4]);
// = [{ "value": [1],
//      "removed": true },
//    { "value": [2, 3] },
//    { "value": [4],
//      "added": true }]
var ArrayDiff = new jsdiff.Diff();
ArrayDiff.tokenize = array => _$5.map(array, elem => [elem]);
// The default is `+` for string concatenation, which doesn't work for array
// concatenation.
ArrayDiff.join = (a, b) => a.concat(b);
// By default jsDiff uses ===
ArrayDiff.equals = _$5.isEqual;

// Take the output of jsdiff's function (which concatenates adjacent entries)
// and make it just one entry per chunk
// > flattenChunks([{ "value": [1],
//                    "removed": true },
//                  { "value": [2, 3] },
//                  { "value": [4],
//                    "added": true }])
// = [{ "value":1, "status":"removed"},
//    { "value":2, "status":"unchanged"},
//    { "value":3, "status":"unchanged"},
//    { "value":4, "status":"added"}]
var flattenChunks = chunks => mapcat(chunks, splitUpChunk);

// Take two arrays and create a diff for them. The result is two arrays of
// objects, one for the things that should be included in a 'before', and one
// for 'after'
var stringArrayDiff$1 = function stringArrayDiff(a, b) {
  var diffResult = ArrayDiff.diff(a, b);
  var flattened = flattenChunks(diffResult);
  return {
    before: _$5.filter(flattened, entry => entry.status !== "added"),
    after: _$5.filter(flattened, entry => entry.status !== "removed")
  };
};
_module_$6.exports = stringArrayDiff$1;
var _stringArrayDiffJsx = _module_$6.exports;

var _module_$5 = {
  exports: {}
};
var _$4 = _underscore__default["default"];

// Split a word-wise diff generated by jsdiff into multiple lines, for the
// purpose of breaking up the diffs into lines, so that modified lines can be
// faintly highlighted

var splitDiff$1 = function splitDiff(diffEntries) {
  var lines = [];
  var currentLine = [];
  _$4.each(diffEntries, entry => {
    var values = entry.value.split("\n");
    _$4.each(values, (value, i) => {
      var isNewline = i > 0;
      if (isNewline) {
        lines.push(currentLine);
        currentLine = [];
      }
      var newEntry = _$4.extend({}, entry, {
        value: value
      });
      currentLine.push(newEntry);
    });
  });
  if (currentLine.length) {
    lines.push(currentLine);
  }
  return lines;
};
_module_$5.exports = splitDiff$1;
var _splitDiffJsx = _module_$5.exports;

var _module_$4 = {
  exports: {}
};
var classNames = _classnames__default["default"];
var React$3 = _react__default["default"];
var _$3 = _underscore__default["default"];
var diff = JsDiff;
var splitDiff = _splitDiffJsx;
var stringArrayDiff = _stringArrayDiffJsx;
var SvgImage = perseus._componentsSvgImageJsx;
var BEFORE = "before";
var AFTER = "after";
var IMAGE_REGEX = /http.*?\.png|web\+graphie[^)]*/g;
var imagesInString = function imagesInString(str) {
  return str.match(IMAGE_REGEX) || [];
};
var classFor = function classFor(entry, ifAdded, ifRemoved) {
  if (entry.added) {
    return ifAdded;
  } else if (entry.removed) {
    return ifRemoved;
  } else {
    return "";
  }
};
var ImageDiffSide = createReactClass({
  displayName: "ImageDiffSide",
  propTypes: {
    images: PropTypes.arrayOf(PropTypes.shape({})).isRequired
  },
  render: function render() {
    return /*#__PURE__*/React$3.createElement("div", null, _$3.map(this.props.images, (entry, index) => {
      var className = classNames({
        "image": true,
        "image-unchanged": entry.status === "unchanged",
        "image-added": entry.status === "added",
        "image-removed": entry.status === "removed"
      });
      return /*#__PURE__*/React$3.createElement("div", {
        key: index
      }, /*#__PURE__*/React$3.createElement("div", {
        className: className
      }, /*#__PURE__*/React$3.createElement(SvgImage, {
        src: entry.value,
        title: entry.value
      })));
    }));
  }
});
var TextDiff$1 = createReactClass({
  displayName: "TextDiff",
  propTypes: {
    after: PropTypes.string,
    before: PropTypes.string,
    title: PropTypes.string.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      after: "",
      before: ""
    };
  },
  getInitialState: function getInitialState() {
    return {
      collapsed: this.props.before === this.props.after
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.setState({
      collapsed: nextProps.before === nextProps.after
    });
  },
  handleExpand: function handleExpand() {
    this.setState({
      collapsed: false
    });
  },
  render: function render() {
    var diffed = diff.diffWords(this.props.before, this.props.after);
    var lines = splitDiff(diffed);
    var beforeImages = imagesInString(this.props.before);
    var afterImages = imagesInString(this.props.after);
    var images = stringArrayDiff(beforeImages, afterImages);
    var renderedLines = _$3.map(lines, line => {
      var contents = {};
      contents.before = _$3.map(line, function (entry, i) {
        return /*#__PURE__*/React$3.createElement("span", {
          key: i,
          className: classFor(entry, "not-present", "removed dark")
        }, entry.value);
      });
      contents.after = _$3.map(line, function (entry, i) {
        return /*#__PURE__*/React$3.createElement("span", {
          key: i,
          className: classFor(entry, "added dark", "not-present")
        }, entry.value);
      });
      return contents;
    });
    var className = classNames({
      "diff-row": true,
      "collapsed": this.state.collapsed
    });
    return /*#__PURE__*/React$3.createElement("div", null, /*#__PURE__*/React$3.createElement("div", {
      className: "diff-header"
    }, this.props.title), /*#__PURE__*/React$3.createElement("div", {
      className: "diff-header"
    }, this.props.title), /*#__PURE__*/React$3.createElement("div", {
      className: "diff-body ui-helper-clearfix"
    }, _$3.map([BEFORE, AFTER], (side, index) => {
      return /*#__PURE__*/React$3.createElement("div", {
        className: "diff-row " + side,
        key: index
      }, !this.state.collapsed && _$3.map(renderedLines, (line, lineNum) => {
        var changed = line[side].length > 1;
        var lineClass = classNames({
          "diff-line": true,
          "added": side === AFTER && changed,
          "removed": side === BEFORE && changed
        });
        return /*#__PURE__*/React$3.createElement("div", {
          className: lineClass,
          key: lineNum
        }, line[side]);
      }), !this.state.collapsed && /*#__PURE__*/React$3.createElement(ImageDiffSide, {
        images: images[side]
      }));
    })), _$3.map([BEFORE, AFTER], (side, index) => {
      return /*#__PURE__*/React$3.createElement("div", {
        className: className + " " + side,
        key: index,
        onClick: this.handleExpand
      }, this.state.collapsed && /*#__PURE__*/React$3.createElement("span", null, /*#__PURE__*/React$3.createElement("span", {
        className: "expand-button"
      }, " ", "[ show unmodified ]")));
    }));
  }
});
_module_$4.exports = TextDiff$1;
var _textDiffJsx = _module_$4.exports;

var _module_$3 = {
  exports: {}
};
/**
 * A side by side diff view for Perseus renderers.
 */

var React$2 = _react__default["default"];
var _$2 = _underscore__default["default"];
var TextDiff = _textDiffJsx;
var WidgetDiff$1 = _widgetDiffJsx;
var Widgets$1 = perseus._widgetsJs;
var rendererProps$1 = PropTypes.shape({
  content: PropTypes.string,
  images: PropTypes.object,
  widgets: PropTypes.object
});

// In diffs, only show the widgetInfo props that can change
var filterWidgetInfo = function filterWidgetInfo(widgetInfo, showAlignmentOptions) {
  var {
    alignment,
    graded,
    options,
    type
  } = widgetInfo || {};
  var filteredWidgetInfo = {
    options
  };

  // Show alignment options iff multiple valid ones exist for this widget
  if (showAlignmentOptions && Widgets$1.getSupportedAlignments(type).length > 1) {
    filteredWidgetInfo.alignment = alignment;
  }
  if (type === "transformer") {
    filteredWidgetInfo.graded = graded;
  }
  if (Widgets$1.supportsStaticMode(type)) {
    filteredWidgetInfo.static = widgetInfo.static || undefined;
  }
  return filteredWidgetInfo;
};
var RendererDiff$2 = createReactClass({
  displayName: "RendererDiff",
  propTypes: {
    // The "after" props of the renderer. Will be displayed on the right.
    after: rendererProps$1,
    // The "before" props of the renderer. Will be displayed on the left.
    before: rendererProps$1,
    // If true, show widget alignment options in the diff.
    showAlignmentOptions: PropTypes.bool,
    // If true, render a horizontal rule after this diff.
    showSeparator: PropTypes.bool,
    // The heading to render above the side by side diff.
    // (In a code review tool this would be the filename.)
    title: PropTypes.string.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      after: {
        content: "",
        images: {},
        widgets: {}
      },
      before: {
        content: "",
        images: {},
        widgets: {}
      },
      showAlignmentOptions: false,
      showSeparator: false
    };
  },
  render: function render() {
    var {
      after,
      before,
      showAlignmentOptions,
      showSeparator,
      title
    } = this.props;
    var textDiff;
    var widgetsDiff;
    if (before.content || after.content) {
      textDiff = /*#__PURE__*/React$2.createElement(TextDiff, {
        before: before.content,
        after: after.content,
        title: title
      });
    }
    var beforeWidgets = Object.keys(before.widgets).filter(widget => before.content.includes(widget));
    var afterWidgets = Object.keys(after.widgets).filter(widget => after.content.includes(widget));
    if (beforeWidgets.length || afterWidgets.length) {
      var widgets = _$2.union(beforeWidgets, afterWidgets);
      widgetsDiff = widgets.map(widget => /*#__PURE__*/React$2.createElement(WidgetDiff$1, {
        before: filterWidgetInfo(before.widgets[widget], showAlignmentOptions),
        after: filterWidgetInfo(after.widgets[widget], showAlignmentOptions),
        title: widget,
        type: (before.widgets[widget] || {}).type || (after.widgets[widget] || {}).type,
        key: widget
      }));
    }
    return /*#__PURE__*/React$2.createElement("div", null, textDiff, widgetsDiff, showSeparator && /*#__PURE__*/React$2.createElement("div", {
      className: "diff-separator"
    }));
  }
});
_module_$3.exports = RendererDiff$2;
var _rendererDiffJsx = _module_$3.exports;

var _module_$2 = {
  exports: {}
};
/**
 * A side by side diff view for Perseus articles.
 */

var React$1 = _react__default["default"];
var _$1 = _underscore__default["default"];
var RendererDiff$1 = _rendererDiffJsx;
var rendererProps = PropTypes.shape({
  content: PropTypes.string,
  images: PropTypes.object,
  widgets: PropTypes.object
});
var ArticleDiff$1 = createReactClass({
  displayName: "ArticleDiff",
  propTypes: {
    // TODO(alex): Check whether we still have any Perseus articles whose
    // top-level json is an object, not an array. If not, simplify here.
    after: PropTypes.oneOfType([rendererProps, PropTypes.arrayOf(rendererProps)]).isRequired,
    before: PropTypes.oneOfType([rendererProps, PropTypes.arrayOf(rendererProps)]).isRequired
  },
  getInitialState: function getInitialState() {
    return this._stateFromProps(this.props);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.setState(this._stateFromProps(nextProps));
  },
  _stateFromProps: function _stateFromProps(props) {
    var {
      before,
      after
    } = props;
    return {
      before: Array.isArray(before) ? before : [before],
      after: Array.isArray(after) ? after : [after]
    };
  },
  render: function render() {
    var {
      before,
      after
    } = this.state;
    var sectionCount = Math.max(before.length, after.length);
    var sections = _$1.times(sectionCount, n => /*#__PURE__*/React$1.createElement(RendererDiff$1, {
      before: n < before.length ? before[n] : undefined,
      after: n < after.length ? after[n] : undefined,
      title: "Section ".concat(n + 1),
      showAlignmentOptions: true,
      showSeparator: n < sectionCount - 1,
      key: n
    }));
    return /*#__PURE__*/React$1.createElement("div", {
      className: "framework-perseus"
    }, sections);
  }
});
_module_$2.exports = ArticleDiff$1;
var _diffsArticleDiffJsx = _module_$2.exports;

var _module_$1 = {
  exports: {}
};
/**
 * A side by side diff view for Perseus exercise items.
 */

var React = _react__default["default"];
var _ = _underscore__default["default"];
var RendererDiff = _rendererDiffJsx;
var WidgetDiff = _widgetDiffJsx;
var itemProps = PropTypes.shape({
  question: PropTypes.shape({}).isRequired,
  answerArea: PropTypes.shape({}).isRequired,
  hints: PropTypes.array.isRequired
});
var ItemDiff$1 = createReactClass({
  displayName: "ItemDiff",
  propTypes: {
    after: itemProps.isRequired,
    before: itemProps.isRequired
  },
  render: function render() {
    var {
      before,
      after
    } = this.props;
    var hintCount = Math.max(before.hints.length, after.hints.length);
    var question = /*#__PURE__*/React.createElement(RendererDiff, {
      before: before.question,
      after: after.question,
      title: "Question",
      showAlignmentOptions: false,
      showSeparator: true
    });
    var extras = /*#__PURE__*/React.createElement(WidgetDiff, {
      before: before.answerArea,
      after: after.answerArea,
      title: "Question extras"
    });
    var hints = _.times(hintCount, function (n) {
      return /*#__PURE__*/React.createElement(RendererDiff, {
        before: n < before.hints.length ? before.hints[n] : undefined,
        after: n < after.hints.length ? after.hints[n] : undefined,
        title: "Hint ".concat(n + 1),
        showAlignmentOptions: false,
        showSeparator: n < hintCount - 1,
        key: n
      });
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "framework-perseus"
    }, question, extras, hints && /*#__PURE__*/React.createElement("div", {
      className: "diff-separator"
    }), hints);
  }
});
_module_$1.exports = ItemDiff$1;
var _diffsItemDiffJsx = _module_$1.exports;

var _module_ = {
  exports: {}
};
var allWidgets = perseus._allWidgetsJs;
var Widgets = perseus._widgetsJs;
var Version = perseus._versionJson;
Widgets.registerMany(allWidgets);
var ItemVersion = Widgets.getVersionVector();
ItemVersion["::renderer::"] = Version.itemDataVersion;
_module_.exports = ItemVersion;
var _itemVersion = _module_.exports;

var Perseus = perseus._perseusJs;
var itemVersion = _itemVersion;
var ItemDiff = _diffsItemDiffJsx;
var ArticleDiff = _diffsArticleDiffJsx;
var StatefulArticleEditor = _statefulArticleEditorJsx;
var StatefulEditorPage = _statefulEditorPageJsx;
var ClassNames = perseus._perseusApiJsx.ClassNames;
var Util = perseus.Util;
var ViewportResizer = _componentsViewportResizerJsx;
var DeviceFramer = _componentsDeviceFramerJsx;
var renderability = _renderabilityJsx;
var accessibility = _a11yJs;
var i18n = _i18nJsx;
var ArticleEditor = _articleEditorJsx;
var Editor = perseus._editorJsx;
var EditorPage = _editorPageJsx;
var IframeContentRenderer = _iframeContentRendererJsx;
var MultiRendererEditor = _multirendererEditorJsx;
var Gorgon = perseus._gorgonGorgonJs;
var JiptHack = perseus._jiptHackJsx;
var editorPerseus = perseus._objectSpread2({
  itemVersion: _itemVersion,
  ItemDiff: _diffsItemDiffJsx,
  ArticleDiff: _diffsArticleDiffJsx,
  StatefulArticleEditor: _statefulArticleEditorJsx,
  StatefulEditorPage: _statefulEditorPageJsx,
  ClassNames: perseus._perseusApiJsx.ClassNames,
  Util: perseus.Util,
  ViewportResizer: _componentsViewportResizerJsx,
  DeviceFramer: _componentsDeviceFramerJsx,
  renderability: _renderabilityJsx,
  accessibility: _a11yJs,
  i18n: _i18nJsx,
  ArticleEditor: _articleEditorJsx,
  Editor: perseus._editorJsx,
  EditorPage: _editorPageJsx,
  IframeContentRenderer: _iframeContentRendererJsx,
  MultiRendererEditor: _multirendererEditorJsx,
  Gorgon: perseus._gorgonGorgonJs,
  JiptHack: perseus._jiptHackJsx
}, Perseus);

exports.ArticleRenderer = perseus.ArticleRenderer;
exports.HintsRenderer = perseus.HintsRenderer;
exports.ItemRenderer = perseus.ItemRenderer;
exports.MultiItems = perseus.MultiItems;
exports.QuestionRenderer = perseus.QuestionRenderer;
exports.Renderer = perseus.Renderer$1;
exports.ServerItemRenderer = perseus.ServerItemRenderer;
exports.apiVersion = perseus.apiVersion;
exports.init = perseus.init;
exports.itemDataVersion = perseus.itemDataVersion;
exports.ArticleDiff = ArticleDiff;
exports.ArticleEditor = ArticleEditor;
exports.ClassNames = ClassNames;
exports.DeviceFramer = DeviceFramer;
exports.Editor = Editor;
exports.EditorPage = EditorPage;
exports.Gorgon = Gorgon;
exports.IframeContentRenderer = IframeContentRenderer;
exports.ItemDiff = ItemDiff;
exports.JiptHack = JiptHack;
exports.MultiRendererEditor = MultiRendererEditor;
exports.StatefulArticleEditor = StatefulArticleEditor;
exports.StatefulEditorPage = StatefulEditorPage;
exports.Util = Util;
exports.ViewportResizer = ViewportResizer;
exports.accessibility = accessibility;
exports["default"] = editorPerseus;
exports.i18n = i18n;
exports.itemVersion = itemVersion;
exports.renderability = renderability;
