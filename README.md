# OpenPerseus

OpenPerseus is an open-source community fork of Khan Academy's Perseus
questions/exercises/articles framework, by @ariabuckles, the previous in-house
lead dev on perseus at Khan Academy.

After years of Khan Academy not supporting external use of perseus, and
requests from others to use it themselves, I've been working on restoring
perseus to a state usable by third-parties, thanks to some sponsorship from
@LearnToBeFoundation.

It may be a while until this repo is documented to the extent it deserves.
Feel free to submit an issue if you'd like to get help with something, and I'll
do my best to get to it when I have time!

OpenPerseus is an exercise question editor and renderer. It allows
you to create and display interactive questions.

![screenshot of Perseus](https://s3.amazonaws.com/uploads.hipchat.com/6574/26709/TfZBRXV0nmRH64g/upload.png)

## Live demo

Our test page isn't much yet, but you can check out a
[live demo of it here](http://khan.github.io/perseus/)!

## Getting Started

To get the dev server running locally, try `make server PORT=9000`
which will run the local perseus server on localhost:9000.
Then visit http://localhost:9000/.

To package perseus for distribution, run `make build` and to package a debug-friendly build, run `make debug`.

Both the `build` and the `server` make targets will run `npm install` but you can also run it yourself to install all node dependencies.

## External dependencies

Perseus makes a couple of assumptions about the environment that it's loaded
into. Specifically, it expects the following libraries to be available on the
global `window` object. (If any of them change in a backwards-incompatible way,
you'll likely need to bump the Perseus major version -- see the "Versioning"
section below.)

- `React`
- `_` (underscore)
- `jquery`
- `aphrodite`
- `classnames`

(See `externalVals` in webpack.config.js)

Also, the following global variables are used, if present:

- `Khan` (`warnMathJaxError` & `warnFont`)
- `icu` (a subset of the localeplanet api is depended on, as covered by
  `icu-slim.js` from our fork of localeplanet)
- `MathQuill`
- `Exercises`
- `KhanUtil` (`localeToFixed` & `debugLog`)
- `KaTeX`

(See `src/perseus-env.js` and `src/demo-perseus.js`)

For an example of supplying these dependencies, or to get an npm package
of perseus with these dependencies built-in, see
[perseus-configured](https://github.com/ariabuckles/perseus-configured)

## Versioning

Perseus uses two types of version numbers: the version of the itemData/content
that can be sent to `ItemRenderer`/`Renderer`, and the version of the api
exposed through the `ItemRenderer`/`Renderer` apiOptions prop.  These
are set in `src/version.json`.

### itemData versioning

Item data versioning has two subtypes of versions: a global `itemDataVersion`
for the itemData/content format sent to ItemRenderer/Renderer, and per-widget
version numbers for the `options` sent to each widget. All of these version
numbers exist both in perseus.js and in the itemData saved to the datastore
by the Perseus editor.

Each of these versions consists of a major and minor version number.
A perseus version can render an itemData version iff its global
`itemDataVersion` and each of its widget versions are greater than or equal
to those sent to perseus as itemData. A major version increase will happen
when the saving format of this itemData has changed. Perseus clients should
not need to care about this distinction, but it is important to Perseus'
implementation of backwards-compatibility.

### apiOptions versioning

The version of the `apiOptions` prop sent to `ItemRenderer` or `Renderer`
is stored on `Perseus.apiVersion`. A minor version increase indicates an
optional additional parameter to this interface. A major version increase
indicates a not-backwards-compatible change to this API. A perseus client
should rely on a specific major version of perseus, and should be able to
use any future minor version increase without changes, but not necessarily
previous minor versions. For example, if a client begins using version 1.2,
Perseus api versions 1.3 or 1.4 will work transparently, but Perseus api
versions 1.0, 1.1, 2.0, or 2.2 will not work.

### Mobile versioning

The KA mobile apps are also clients of Perseus, and the way that Perseus is
integrated into the apps requires that we enforce some additional versioning
constraints. For specifics, check out the [Forge page](https://sites.google.com/a/khanacademy.org/forge/for-developers/perseus-versioning).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for a walkthrough of how some
of the Perseus code works and how to extend it.

## License

[MIT License](http://opensource.org/licenses/MIT)
