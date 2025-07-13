"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var resources_1 = require("./resources");
var r1 = / |,|\$|€|£|¥|'|٬|،| /g;
var r2 = / |\.|\$|€|£|¥|'|٬|،| /g;
function getValue(ctrl, locale, currencyCode) {
  if (ctrl.type === "checkbox") {
    var ctrlOnValue = ctrl.getAttribute("data-on-value");
    var ctrlOffValue = ctrl.getAttribute("data-off-value");
    if (ctrlOnValue && ctrlOffValue) {
      var onValue = ctrlOnValue ? ctrlOnValue : true;
      var offValue = ctrlOffValue ? ctrlOffValue : false;
      return ctrl.checked === true ? onValue : offValue;
    }
    else {
      return ctrl.checked === true;
    }
  }
  else {
    var type = ctrl.getAttribute("data-type");
    if (!type) {
      var t = ctrl.getAttribute("type");
      if (t === "number") {
        type = "number";
      }
    }
    var value = ctrl.value;
    if (type === "number" || type === "int" || type === "currency" || type === "string-currency" || type === "percentage") {
      if (type === "currency" || type === "string-currency") {
        var c = ctrl.getAttribute("currency-code");
        if (!c) {
          if (currencyCode) {
            c = currencyCode;
          }
          else if (ctrl.form) {
            c = ctrl.form.getAttribute("currency-code");
          }
        }
        if (c && resources_1.resources.currency && c.length > 0) {
          var currency = resources_1.resources.currency(c);
          if (currency && value.indexOf(currency.symbol) >= 0) {
            value = value.replace(currency.symbol, "");
          }
        }
      }
      if (locale && value.indexOf(locale.currencySymbol) >= 0) {
        value = value.replace(locale.currencySymbol, "");
      }
      if (locale && locale.decimalSeparator !== ".") {
        value = value.replace(r2, "");
        if (value.indexOf(locale.decimalSeparator) >= 0) {
          value = value.replace(locale.decimalSeparator, ".");
        }
      }
      else {
        value = value.replace(r1, "");
      }
      if (type === "percentage" && value.indexOf("%") >= 0) {
        value = value.replace("%", "");
      }
      return isNaN(value) ? parseFloat(value) : null;
    }
    else {
      return value;
    }
  }
}
exports.getValue = getValue;
function equalValues(ctrl1, ctrl2) {
  if (ctrl1.value === ctrl2.value) {
    return true;
  }
  else {
    return false;
  }
}
exports.equalValues = equalValues;
function isEmpty(ctrl) {
  if (!ctrl) {
    return true;
  }
  var str = trimText(ctrl.value);
  return str === "";
}
exports.isEmpty = isEmpty;
function trim(ctrl) {
  if (!ctrl) {
    return;
  }
  var str = ctrl.value;
  var str2 = trimText(ctrl.value);
  if (str !== str2) {
    ctrl.value = str2;
  }
}
exports.trim = trim;
function element(form, childName) {
  var len = form.length;
  for (var i = 0; i < len; i++) {
    var f = form[i];
    if (f.name === childName) {
      return f;
    }
  }
  return null;
}
exports.element = element;
function getParentByNodeNameOrDataField(ctrl, nodeName) {
  if (!ctrl) {
    return null;
  }
  var tmp = ctrl;
  while (true) {
    var parent_1 = tmp.parentElement;
    if (!parent_1) {
      return null;
    }
    if (parent_1.nodeName === nodeName || parent_1.getAttribute("data-field") != null) {
      return parent_1;
    }
    else {
      tmp = parent_1;
    }
    if (tmp.nodeName === "BODY") {
      return null;
    }
  }
}
exports.getParentByNodeNameOrDataField = getParentByNodeNameOrDataField;
function trimText(s) {
  if (!s) {
    return s;
  }
  s = s.trim();
  var i = s.length - 1;
  while (i >= 0 && (s.charAt(i) === " " || s.charAt(i) === "\t" || s.charAt(i) === "\r" || s.charAt(i) === "\n")) {
    i--;
  }
  s = s.substring(0, i + 1);
  i = 0;
  while (i < s.length && (s.charAt(i) === " " || s.charAt(i) === "\t" || s.charAt(i) === "\r" || s.charAt(i) === "\n")) {
    i++;
  }
  return s.substring(i);
}
