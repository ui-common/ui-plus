"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./resources"));
__export(require("./formatter"));
__export(require("./reflect"));
__export(require("./formutil"));
__export(require("./ui"));
__export(require("./uivalidator"));
__export(require("./uievent"));
__export(require("./service"));
function fileSizeToString(bs) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bs <= 0) {
    return '0 Bytes';
  }
  var i = Math.floor(Math.log(bs) / Math.log(1024));
  var size = Math.round(bs / Math.pow(1024, i));
  return size + " " + sizes[i];
}
exports.fileSizeToString = fileSizeToString;
function removeHtmlTags(s) {
  return (s ? s.replace(/<.*?>/g, '') : '');
}
exports.removeHtmlTags = removeHtmlTags;
function truncateText(text, max) {
  var m = max || 100;
  return text ? (text.length <= m ? text : text.slice(0, m) + '...') : '';
}
exports.truncateText = truncateText;
function toCamelCase(str, chr, up) {
  var s = chr && chr.length > 0 ? chr : '_';
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
function kebabToSnackCase(s) {
  return s.indexOf("-") >= 0 ? s.replace(/-/g, "_") : s;
}
exports.kebabToSnackCase = kebabToSnackCase;
function snackToKebabCase(s) {
  return s.indexOf("_") >= 0 ? s.replace(/_/g, "-") : s;
}
exports.snackToKebabCase = snackToKebabCase;
function toURI(s) {
  return s ? encodeURIComponent(s.toLowerCase().replace(/\s+/g, '-')) : '';
}
exports.toURI = toURI;
function camelCaseToNormal(s) {
  return s.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([a-zA-Z]+)/g, function (_, word) { return word.charAt(0).toUpperCase() + word.slice(1); });
}
exports.camelCaseToNormal = camelCaseToNormal;
exports.mapStringArray = function (arr, names) {
  return arr.map(function (s, i) {
    return i === arr.length - 1 ? names.get(s) : names.get(s) + ", ";
  });
};
