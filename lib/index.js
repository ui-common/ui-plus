"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./formatter"));
__export(require("./resources"));
__export(require("./ui"));
__export(require("./uivalidator"));
__export(require("./uievent"));
__export(require("./service"));
__export(require("./reflect"));
function removeHtmlTags(s) {
  return (s ? s.replace(/<.*?>/g, '') : '');
}
exports.removeHtmlTags = removeHtmlTags;
function truncateText(text, max) {
  if (!text) {
    return '';
  }
  var m = max || 120;
  return (text.length <= m ? text : text.slice(0, m) + '...');
}
exports.truncateText = truncateText;
function toCamelCase(str, chr, up) {
  var s = chr && chr.length > 0 ? chr : '-';
  var words = str.split(s);
  var v = words.map(function (word, index) {
    if (word.length === 0) {
      return word;
    }
    if (index > 0 || up) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word.charAt(0).toLowerCase() + word.slice(1);
  });
  return v.join('');
}
exports.toCamelCase = toCamelCase;
function kebabToSnackCase(str) {
  if (str.includes("-")) {
    return str.replace(/-/g, "_");
  }
  return str;
}
exports.kebabToSnackCase = kebabToSnackCase;
function snackToKebabCase(str) {
  if (str.includes("_")) {
    return str.replace(/_/g, "-");
  }
  return str;
}
exports.snackToKebabCase = snackToKebabCase;
function camelCaseToNormal(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([a-zA-Z]+)/g, function (_, word) { return word.charAt(0).toUpperCase() + word.slice(1); });
}
exports.camelCaseToNormal = camelCaseToNormal;
exports.mapStringArray = function (arr, names) {
  return arr.map(function (s, i) {
    return i === arr.length - 1 ? names.get(s) : names.get(s) + ", ";
  });
};
