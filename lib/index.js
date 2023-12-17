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
function toCamelCase(str) {
  var words = str.split('.');
  var v = words.map(function (word, index) {
    if (index === 0) {
      return word;
    }
    else {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
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
function formatDate(d, dateFormat, upper) {
  if (!d) {
    return '';
  }
  var format = dateFormat && dateFormat.length > 0 ? dateFormat : 'M/D/YYYY';
  if (upper) {
    format = format.toUpperCase();
  }
  var valueItems = ['', '', ''];
  var dateItems = format.split(/\/|\.| |-/);
  var imonth = dateItems.indexOf('M');
  var iday = dateItems.indexOf('D');
  var iyear = dateItems.indexOf('YYYY');
  var fu = false;
  if (imonth === -1) {
    imonth = dateItems.indexOf('MM');
    fu = true;
  }
  if (iday === -1) {
    iday = dateItems.indexOf('DD');
    fu = true;
  }
  if (iyear === -1) {
    iyear = dateItems.indexOf('YY');
  }
  valueItems[iday] = getD(d.getDay(), fu);
  valueItems[imonth] = getD(d.getMonth() + 1, fu);
  valueItems[iyear] = d.getFullYear().toString();
  var s = detectSeparator(format);
  return valueItems.join(s);
}
exports.formatDate = formatDate;
function detectSeparator(format) {
  var len = format.length;
  for (var i = 0; i < len; i++) {
    var c = format[i];
    if (!((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z'))) {
      return c;
    }
  }
  return '/';
}
function getD(n, fu) {
  return fu ? pad(n) : n.toString();
}
function formatDateTime(date, dateFormat) {
  if (!date) {
    return "";
  }
  var sd = formatDate(date, dateFormat);
  if (sd.length === 0) {
    return sd;
  }
  return sd + " " + formatTime(date);
}
exports.formatDateTime = formatDateTime;
function formatLongDateTime(date, dateFormat) {
  if (!date) {
    return "";
  }
  var sd = formatDate(date, dateFormat);
  if (sd.length === 0) {
    return sd;
  }
  return sd + " " + formatLongTime(date);
}
exports.formatLongDateTime = formatLongDateTime;
function formatTime(d) {
  return pad(d.getHours()) + ":" + pad(d.getMinutes());
}
exports.formatTime = formatTime;
function formatLongTime(d) {
  return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
}
exports.formatLongTime = formatLongTime;
function pad(n) {
  return n < 10 ? '0' + n : n.toString();
}
