import _versionJson from "./version.json";
import _widgetsJs from "./widgets.js";
import _allWidgetsJs from "./all-widgets.js";

var _module_ = {
  exports: {}
};

var exports = _module_.exports;
const allWidgets = _allWidgetsJs;
const Widgets = _widgetsJs;
const Version = _versionJson;

Widgets.registerMany(allWidgets);

const ItemVersion = Widgets.getVersionVector();
ItemVersion["::renderer::"] = Version.itemDataVersion;

_module_.exports = ItemVersion;
export default _module_.exports;
