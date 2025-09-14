import _widgetsExpressionEditorJsx from "./widgets/expression-editor.jsx";
import _widgetsExpressionJsx from "./widgets/expression.jsx";
import _widgetsNumericInputEditorJsx from "./widgets/numeric-input-editor.jsx";
import _widgetsNumericInputJsx from "./widgets/numeric-input.jsx";
import _widgetsInputNumberEditorJsx from "./widgets/input-number-editor.jsx";
import _widgetsInputNumberJsx from "./widgets/input-number.jsx";
import _widgetsRadioEditorJsx from "./widgets/radio/editor.jsx";
import _widgetsRadioJsx from "./widgets/radio.jsx";
import _widgetsNumericKeypadJsx from "./widgets/numeric-keypad.jsx";
import _widgetsNumericKeypadEditorJsx from "./widgets/numeric-keypad-editor.jsx";

// TODO(aria): env/build var
const __EDITOR__ = true;

// As new widgets get added here, please also make sure they get added in
// webapp perseus/traversal.py so they can be properly translated.
export default [
  [_widgetsRadioJsx, __EDITOR__ && _widgetsRadioEditorJsx],
  [_widgetsInputNumberJsx, __EDITOR__ && _widgetsInputNumberEditorJsx],
  [_widgetsNumericInputJsx, __EDITOR__ && _widgetsNumericInputEditorJsx],
  [_widgetsExpressionJsx, __EDITOR__ && _widgetsExpressionEditorJsx],
  [_widgetsNumericKeypadJsx, __EDITOR__ && _widgetsNumericKeypadEditorJsx],
];
