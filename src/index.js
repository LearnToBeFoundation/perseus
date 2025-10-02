// Demo page index for create-react-app
/*
import React from 'react';
import { createRoot } from 'react-dom/client';
import * as Perseus from './perseus';
//import "./lib/mathquill/mathquill.css";

const itemData = {
    "question": {
        "content": "Testing an expression:\n\nSimplify $(2x + 3)(x - 1)$\n\n[[☃ expression 1]]",
        "images": {},
        "widgets": {
            "expression 1": {
                "type": "expression",
                "alignment": "default",
                "static": false,
                "graded": true,
                "options": {
                    "answerForms": [
                        {
                            "value": "2x^2+x-3",
                            "form": false,
                            "simplify": true,
                            "considered": "correct",
                            "key": 0
                        }
                    ],
                    "buttonSets": [
                        "basic",
                        "prealgebra"
                    ],
                    "functions": [
                        "f",
                        "g",
                        "h"
                    ],
                    "times": false
                },
                "version": {
                    "major": 1,
                    "minor": 0
                }
            }
        }
    },
    "answerArea": {
        "calculator": false,
        "chi2Table": false,
        "periodicTable": false,
        "tTable": false,
        "zTable": false
    },
    "itemDataVersion": {
        "major": 0,
        "minor": 1
    },
    "hints": [
        {
            "replace": false,
            "content": "Hint number !",
            "images": {},
            "widgets": {}
        },
        {
            "replace": false,
            "content": "**Hint number 2!**",
            "images": {},
            "widgets": {}
        }
    ]
}

const styles = {
  container: {
    width: 600,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: "auto",
    marginRight: "auto",
  },
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <div style={styles.container}>
      <Perseus.QuestionRenderer
        item={itemData}
        onAnswer={(guess, score) => console.log("answer attempt:", guess, "with score:", score)}
        onHint={(num, total) => console.log(`hint ${num} taken of ${total} total`)}
      />
    </div>
  </React.StrictMode>
);
*/

import "./demo-perseus";
