// Enhanced Radio Widget - Markdown Examples
// This file shows exactly how to use markdown in the enhanced radio widget

const markdownExamples = {
    // Example 1: Basic text formatting
    textFormatting: {
        type: "enhanced-radio",
        layout: "vertical",
        multipleSelect: false,
        choices: [
            {
                content: "**Bold text** and *italic text* with `inline code`",
                widgets: {},
                images: {},
                correct: true,
                clue: "This choice demonstrates **bold**, *italic*, and `code` formatting."
            },
            {
                content: "~~Strikethrough text~~ and normal text",
                widgets: {},
                images: {},
                correct: false,
                clue: "This shows ~~strikethrough~~ formatting."
            },
            {
                content: "Just plain text without any formatting",
                widgets: {},
                images: {},
                correct: false,
                clue: "No special formatting here."
            }
        ]
    },

    // Example 2: Lists and structure
    listsAndStructure: {
        type: "enhanced-radio",
        layout: "vertical",
        multipleSelect: false,
        choices: [
            {
                content: `**Unordered list:**
- First item
- Second item  
- Third item`,
                widgets: {},
                images: {},
                correct: false,
                clue: "This is an unordered (bulleted) list."
            },
            {
                content: `**Ordered list:**
1. First step
2. Second step
3. Third step`,
                widgets: {},
                images: {},
                correct: true,
                clue: "This is an ordered (numbered) list."
            },
            {
                content: `> This is a blockquote
> 
> It can span multiple lines
> and is great for highlighting important information`,
                widgets: {},
                images: {},
                correct: false,
                clue: "Blockquotes are useful for emphasis or citations."
            }
        ]
    },

    // Example 3: Math expressions
    mathExpressions: {
        type: "enhanced-radio",
        layout: "vertical",
        multipleSelect: false,
        choices: [
            {
                content: "The quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$",
                widgets: {},
                images: {},
                correct: true,
                clue: "This is the standard quadratic formula in LaTeX."
            },
            {
                content: "Linear equation: $y = mx + b$ where $m$ is slope and $b$ is y-intercept",
                widgets: {},
                images: {},
                correct: false,
                clue: "This represents a linear function."
            },
            {
                content: "Pythagorean theorem: $a^2 + b^2 = c^2$",
                widgets: {},
                images: {},
                correct: false,
                clue: "This is the famous Pythagorean theorem."
            }
        ]
    },

    // Example 4: Code blocks
    codeBlocks: {
        type: "enhanced-radio",
        layout: "vertical",
        multipleSelect: false,
        choices: [
            {
                content: `**JavaScript function:**
\`\`\`javascript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}
\`\`\``,
                widgets: {},
                images: {},
                correct: true,
                clue: "This is a recursive implementation of the Fibonacci sequence."
            },
            {
                content: `**Python function:**
\`\`\`python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n-1)
\`\`\``,
                widgets: {},
                images: {},
                correct: false,
                clue: "This calculates factorial using recursion."
            },
            {
                content: "Use the `Math.sqrt()` function to calculate square roots in JavaScript.",
                widgets: {},
                images: {},
                correct: false,
                clue: "This shows inline code formatting."
            }
        ]
    },

    // Example 5: Tables
    tables: {
        type: "enhanced-radio",
        layout: "vertical",
        multipleSelect: false,
        choices: [
            {
                content: `**Data comparison:**

| Language | Paradigm | Year |
|----------|----------|------|
| JavaScript | Multi-paradigm | 1995 |
| Python | Multi-paradigm | 1991 |
| Java | Object-oriented | 1995 |`,
                widgets: {},
                images: {},
                correct: true,
                clue: "This table compares programming languages."
            },
            {
                content: `**Simple table:**

| x | f(x) |
|---|------|
| 1 | 2    |
| 2 | 4    |
| 3 | 6    |`,
                widgets: {},
                images: {},
                correct: false,
                clue: "This shows a function table for f(x) = 2x."
            }
        ]
    },

    // Example 6: Mixed content with widgets
    mixedContentWithWidgets: {
        type: "enhanced-radio",
        layout: "vertical",
        multipleSelect: false,
        choices: [
            {
                content: `**Solve the equation:** $x^2 + 5x + 6 = 0$

*Steps:*
1. Factor the quadratic
2. Set each factor to zero
3. Solve for x

Enter your answer: [[☃ input-number 1]]`,
                widgets: {
                    "input-number 1": {
                        type: "input-number",
                        options: {
                            value: -2,
                            answerType: "integer"
                        }
                    }
                },
                images: {},
                correct: true,
                clue: "Factor as (x+2)(x+3) = 0, so x = -2 or x = -3."
            },
            {
                content: `**Choose the correct graph:**

![Parabola](web+graphie://ka-perseus-images/parabola.png)

This represents a **quadratic function** of the form $y = ax^2 + bx + c$.`,
                widgets: {},
                images: {
                    "web+graphie://ka-perseus-images/parabola.png": {
                        width: 300,
                        height: 200
                    }
                },
                correct: false,
                clue: "This shows a parabola opening upward."
            },
            {
                content: `**Interactive element:**

Drag the point to see how the function changes: [[☃ interactive-graph 1]]

> The graph shows $f(x) = x^2$`,
                widgets: {
                    "interactive-graph 1": {
                        type: "interactive-graph",
                        options: {
                            graph: {
                                type: "function"
                            }
                        }
                    }
                },
                images: {},
                correct: false,
                clue: "This is an interactive graph widget."
            }
        ]
    },

    // Example 7: Complex formatting
    complexFormatting: {
        type: "enhanced-radio",
        layout: "horizontal",
        multipleSelect: true,
        choices: [
            {
                content: `**Definition:** A *prime number* is:

> A natural number greater than 1 that has no positive divisors other than 1 and itself.

**Examples:** 2, 3, 5, 7, 11, 13...

**Formula check:** $n$ is prime if $\\gcd(n, k) = 1$ for all $1 < k < n$`,
                widgets: {},
                images: {},
                correct: true,
                clue: "This correctly defines prime numbers with examples and mathematical notation."
            },
            {
                content: `**Algorithm:**

\`\`\`python
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True
\`\`\`

*Time complexity:* $O(\\sqrt{n})$`,
                widgets: {},
                images: {},
                correct: true,
                clue: "This is an efficient primality test algorithm."
            },
            {
                content: `**Properties:**

- All primes except 2 are odd
- The sum of two primes can be composite
- There are infinitely many primes *(Euclid's theorem)*

**Note:** 1 is ~~not~~ considered prime by modern definition.`,
                widgets: {},
                images: {},
                correct: false,
                clue: "While these facts are true, this choice has some formatting issues."
            }
        ]
    }
};

// Usage examples for Perseus exercises
const usageExamples = {
    // How to create a choice with markdown
    createChoice: function(markdownContent, isCorrect = false, explanation = "") {
        return {
            content: markdownContent,
            widgets: {},
            images: {},
            correct: isCorrect,
            clue: explanation
        };
    },

    // How to create a choice with widgets
    createChoiceWithWidget: function(markdownContent, widgetDefinitions, isCorrect = false) {
        return {
            content: markdownContent,
            widgets: widgetDefinitions,
            images: {},
            correct: isCorrect
        };
    },

    // How to create a choice with images
    createChoiceWithImage: function(markdownContent, imageDefinitions, isCorrect = false) {
        return {
            content: markdownContent,
            widgets: {},
            images: imageDefinitions,
            correct: isCorrect
        };
    }
};

// Export for use in Perseus
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        markdownExamples,
        usageExamples
    };
}

// Browser testing
if (typeof window !== 'undefined') {
    window.markdownExamples = markdownExamples;
    window.usageExamples = usageExamples;
    
    console.log("Enhanced Radio Markdown Examples loaded");
    console.log("Available examples:", Object.keys(markdownExamples));
}
