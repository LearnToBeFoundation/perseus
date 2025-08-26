import * as fs from 'fs';
import * as path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import { visualizer } from 'rollup-plugin-visualizer';

const pwd = path.resolve('.');
const localModules = fs.readdirSync('src/node_modules')
    .map(filename => filename.replace(/\.js$/, ''));

export default {
  input: [
    'src/perseus.js', 
    'src/editor-perseus.js'
  ],
  external: (filepath) => 
    {
        // TODO(aria): I'm not sure why the paths we're given here are so complex
        // Would be nice to simplify this.

        if (filepath.startsWith('/')) {
            filepath = './' + path.relative(pwd, filepath);
        }
        filepath = filepath.replace(/^\.\/node_modules\//, '');

        // bundle all requested css into one css file
        if (filepath.endsWith('.css')) {
            return false;
        }

        // bundle all local files
        if (filepath.startsWith('.')) {
            return false;
        }

        // bundle local modules from src/node_modules
        if (localModules.includes(filepath.split('/')[0])) {
            return false;
        }

        // bundle babel runtime
        if (filepath.startsWith('@babel/')) {
            return false
        }

        // normal? dependency
        return true;
    },
  output: {
    dir: '.',
    //file: 'perseus.js',
    format: 'cjs',
  },
  plugins: [
    json(),
    resolve(),
    commonjs(),
    image(),
    babel({ babelHelpers: 'bundled' }),
    postcss({ extract: 'perseus.css' }),
    visualizer({ filename: 'rollup-stats.html' }),
  ],
};
