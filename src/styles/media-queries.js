import {
    pureXsMax,
    pureSmMin,
    pureSmMax,
    pureMdMin,
    pureMdMax,
    pureLgMin,
    pureLgMax,
    pureXlMin,
} from "./constants.js";

var _module_ = {
    exports: {}
};

var exports = _module_.exports;

_module_.exports = {
    xs: `@media screen and (max-width: ${pureXsMax})`,
    sm: `@media screen and (min-width: ${pureSmMin}) and ` +
        `(max-width: ${pureSmMax})`,
    md: `@media screen and (min-width: ${pureMdMin}) and ` +
        `(max-width: ${pureMdMax})`,
    lg: `@media screen and (min-width: ${pureLgMin}) and ` +
        `(max-width: ${pureLgMax})`,
    xl: `@media screen and (min-width: ${pureXlMin})`,

    smOrSmaller: `@media screen and (max-width: ${pureSmMax})`,
    mdOrSmaller: `@media screen and (max-width: ${pureMdMax})`,
    lgOrSmaller: `@media screen and (max-width: ${pureLgMax})`,

    smOrLarger: `@media screen and (min-width: ${pureSmMin})`,
    mdOrLarger: `@media screen and (min-width: ${pureMdMin})`,
    lgOrLarger: `@media screen and (min-width: ${pureLgMin})`,
};
export default _module_.exports;
