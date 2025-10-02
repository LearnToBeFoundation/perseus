import { createRoot } from 'react-dom/client';
import * as Perseus from './perseus';
import Util from './util';
import _articleDiffDemoJsx from "./article-diff-demo.jsx";
import _itemDiffDemoJsx from "./item-diff-demo.jsx";
import _multirendererDemoJsx from "./multirenderer-demo.jsx";
import _articleDemoJsx from "./article-demo.jsx";
import _rendererDemoJsx from "./renderer-demo.jsx";
import _editorDemoJsx from "./editor-demo.jsx";
import _editorPerseusJs from "./editor-perseus.js";
import _perseusEnvJs from "./perseus-env.js";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;
/**
 * Loads the Perseus demo pages
 *
 * This file initializes the Khan globals and mounts Demo pages
 * to demonstrate and develop the Perseus application
 */

_perseusEnvJs;

window.Khan = {
    Util: KhanUtil,
    error: function() {},
    query: {debug: ""},
    imageBase: "/images/",
};

const EditorDemo = _editorDemoJsx;
const RendererDemo = _rendererDemoJsx;
const ArticleDemo = _articleDemoJsx;
const MultirendererDemo = _multirendererDemoJsx;
const ItemDiffDemo = _itemDiffDemoJsx;
const ArticleDiffDemo = _articleDiffDemoJsx;

const query = Util.parseQueryString(window.location.hash.substring(1));
const question = query.content && JSON.parse(query.content);
const problemNum = Math.floor(Math.random() * 100);

// React router v20XX
const path = window.location.search.substring(1);
const routes = {
    // The value is spread across a React.createElement call
    renderer: [RendererDemo, {question, problemNum}],
    article: [ArticleDemo, {content: question}],
    multirenderer: [MultirendererDemo, {item: question}],
    "item-diff": [ItemDiffDemo, {}],
    "article-diff": [ArticleDiffDemo, {}],
    "": [EditorDemo, {question, problemNum}],
};

Perseus.init({skipMathJax: true, loadExtraWidgets: true})
    .then(function() {
        const container = document.getElementById("root");
        const root = createRoot(container);
        root.render(
            React.createElement(...(routes[path] || routes[""]))
        );
    })
    .then(
        function() {},
        function(err) {
            console.error(err); // @Nolint
        }
    );
export default _module_.exports;
