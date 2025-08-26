# Enhanced Radio Widget

A modern, Duolingo-style multiple choice widget for Perseus with support for nested widgets and flexible layouts.

## ✅ Features Implemented

### 🎨 **Modern UI Design**
- **No radio buttons/checkmarks** - Clean box highlighting for selection
- **Blue color scheme** - Light blue background (#DBEAFE) with dark blue border (#2563EB)
- **Smooth animations** - Hover effects with elevation and color transitions
- **Duolingo-style appearance** - Modern, card-based design with rounded corners

### 📐 **Multiple Layout Options**
1. **Vertical Layout** - Traditional stacked choices (default)
2. **Horizontal Layout** - Side-by-side choices with wrapping
3. **2x2 Grid Layout** - Four choices arranged in a 2x2 grid
4. **Responsive Design** - Grid collapses to single column on mobile

### ✅ **Selection Modes**
- **Single Select** - Radio button behavior (default)
- **Multiple Select** - Checkbox behavior for multiple correct answers
- **Proper validation** - Scoring logic for both modes

### 🔧 **Nested Widget Support**
- **Any Perseus Widget** - input-number, dropdown, expression, interactive-graph, etc.
- **Math Expressions** - LaTeX rendering via Perseus markdown
- **Images** - Standard Perseus image handling
- **Rich Content** - HTML, tables, lists, formatted text
- **Mixed Content** - Combinations of all content types

## 📁 Files Created

### Core Widget Files
```
src/widgets/enhanced-radio/
├── widget.jsx              # Main widget component
├── base-enhanced-radio.jsx # Layout and container logic
├── enhanced-choice.jsx     # Individual choice component
└── editor.jsx             # Editor interface
```

### Registration Files
```
src/widgets/
├── enhanced-radio.jsx        # Widget registration
└── enhanced-radio-editor.jsx # Editor registration
```

### Styling
```
stylesheets/exercise-content-package/widgets/
└── enhanced-radio.less      # Widget-specific styles
```

### Test Files
```
├── test-enhanced-radio.html    # Basic UI test
├── test-nested-widgets.html   # Nested content test
└── ENHANCED_RADIO_WIDGET_README.md
```

## 📝 **Markdown Support**

### ✅ **Full Markdown Support**
The enhanced radio widget supports **all Perseus markdown features** through the Renderer component:

#### Text Formatting
- **`**Bold text**`** → **Bold text**
- **`*Italic text*`** → *Italic text*
- **`` `Inline code` ``** → `Inline code`
- **`~~Strikethrough~~`** → ~~Strikethrough~~

#### Structure
- **Lists:** Unordered (`- item`) and ordered (`1. item`)
- **Blockquotes:** `> quoted text`
- **Paragraphs:** Separated by blank lines

#### Advanced Content
- **Math:** `$LaTeX expressions$` → $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$
- **Code blocks:** ` ```language` with syntax highlighting
- **Tables:** Pipe-separated with `| header | header |`
- **Images:** `![alt text](image-url)`

#### Perseus Features
- **Widget placeholders:** `[[☃ widget-type id]]`
- **Mixed content:** Any combination of the above

### Example Choice with Markdown
```javascript
{
  content: `**Question:** Solve $x^2 + 5x + 6 = 0$

*Steps:*
1. Factor the quadratic equation
2. Set each factor equal to zero
3. Solve for x

Enter answer: [[☃ input-number 1]]`,
  widgets: {
    "input-number 1": {
      type: "input-number",
      options: { value: -2, answerType: "integer" }
    }
  },
  correct: true,
  clue: "Factor as **(x+2)(x+3) = 0**, so **x = -2** or **x = -3**"
}
```

## 🚀 Usage

### Basic Widget Data Structure
```javascript
{
  type: "enhanced-radio",
  layout: "vertical",           // "vertical" | "horizontal" | "grid-2x2"
  multipleSelect: false,        // true for checkbox behavior
  choices: [
    {
      content: "Choice text or markdown",
      widgets: {},              // Nested widget definitions
      images: {},               // Image metadata
      correct: true,            // Whether this choice is correct
      clue: "Optional explanation"
    }
    // ... more choices
  ]
}
```

### With Nested Widgets
```javascript
{
  content: "Enter value: [[☃ input-number 1]] and solve: $x^2 + 5x + 6 = 0$",
  widgets: {
    "input-number 1": {
      type: "input-number",
      options: { value: 5, answerType: "number" }
    }
  },
  images: {},
  correct: true,
  clue: "Factor the quadratic equation."
}
```

## 🎯 How Nested Widgets Work

1. **Content Processing** - Each choice's content is passed to Perseus Renderer
2. **Widget Discovery** - Renderer finds widget placeholders like `[[☃ widget-type id]]`
3. **Widget Instantiation** - Nested widgets are created using the widgets object
4. **Markdown Rendering** - Math expressions, formatting, and images are processed
5. **Interactive Elements** - All nested widgets remain fully functional

## 🧪 Testing

### Visual Tests
- Open `test-enhanced-radio.html` to see basic UI and layouts
- Open `test-nested-widgets.html` to see nested content examples
- Open `test-markdown-support.html` to see comprehensive markdown features
- View `markdown-examples.js` for complete usage examples

### Build Test
```bash
npm run build
```

### Integration Test
The widget is registered in `src/extra-widgets.js` and ready for use in Perseus exercises.

## 🔧 Editor Interface

The widget editor provides:
- **Layout Selection** - Dropdown to choose vertical/horizontal/grid
- **Multiple Selection Toggle** - Checkbox to enable multi-select mode
- **Randomize Option** - Checkbox to randomize choice order
- **Choice Editors** - Rich text editors for each choice with widget support
- **Correct/Incorrect Marking** - Checkboxes to mark correct answers
- **Explanation Fields** - Optional rationale/clue editors
- **Add/Delete Choices** - Dynamic choice management

## 🎨 Styling Details

### Color Scheme
- **Default State**: White background, light gray border (#e5e5e5)
- **Hover State**: Light blue background (#DBEAFE), dark blue border (#2563EB)
- **Selected State**: Light blue background (#DBEAFE), dark blue border (#2563EB)
- **Focus State**: Dark blue outline (#2563EB)

### Animations
- **Hover Effect**: Slight elevation with box shadow
- **Transition**: Smooth 0.2s ease-in-out for all state changes
- **Press Effect**: Reduced elevation on mouse down

### Responsive Behavior
- **Mobile**: Grid layout becomes single column
- **Mobile**: Horizontal layout stacks vertically
- **Touch**: Optimized touch targets and interactions

## ✅ Verification Checklist

- [x] No radio buttons or checkmarks visible
- [x] Blue color scheme implemented
- [x] Smooth hover animations working
- [x] All three layouts functional
- [x] Single and multiple select modes
- [x] Nested widget support via Renderer
- [x] Editor interface complete
- [x] Widget registered in Perseus system
- [x] Build system compatibility
- [x] Responsive design
- [x] Test files created

## 🚀 Ready for Production

The enhanced radio widget is fully implemented and ready for use in Perseus exercises. It provides a modern, flexible alternative to the standard radio widget with enhanced UI and support for complex nested content.

### Next Steps
1. Create Perseus exercises using the widget
2. Test in production environment
3. Gather user feedback
4. Iterate on design if needed
