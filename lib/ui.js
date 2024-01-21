"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflect_1 = require("./reflect");
var resources_1 = require("./resources");
var r1 = / |,|\$|€|£|¥|'|٬|،| /g;
var r2 = / |\.|\$|€|£|¥|'|٬|،| /g;
function getValue(ctrl, locale, currencyCode) {
  if (ctrl.type === 'checkbox') {
    var ctrlOnValue = ctrl.getAttribute('data-on-value');
    var ctrlOffValue = ctrl.getAttribute('data-off-value');
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
    var type = ctrl.getAttribute('data-type');
    if (!type) {
      var t = ctrl.getAttribute('type');
      if (t === 'number') {
        type = 'number';
      }
    }
    var value = ctrl.value;
    if (type === 'number' || type === 'int' || type === 'currency' || type === 'string-currency' || type === 'percentage') {
      if (type === 'currency' || type === 'string-currency') {
        var c = ctrl.getAttribute('currency-code');
        if (!c) {
          if (currencyCode) {
            c = currencyCode;
          }
          else if (ctrl.form) {
            c = ctrl.form.getAttribute('currency-code');
          }
        }
        if (c && resources_1.resources.currency && c.length > 0) {
          var currency = resources_1.resources.currency(c);
          if (currency && value.indexOf(currency.symbol) >= 0) {
            value = value.replace(currency.symbol, '');
          }
        }
      }
      if (locale && value.indexOf(locale.currencySymbol) >= 0) {
        value = value.replace(locale.currencySymbol, '');
      }
      if (locale && locale.decimalSeparator !== '.') {
        value = value.replace(r2, '');
        if (value.indexOf(locale.decimalSeparator) >= 0) {
          value = value.replace(locale.decimalSeparator, '.');
        }
      }
      else {
        value = value.replace(r1, '');
      }
      if (type === 'percentage' && value.indexOf('%') >= 0) {
        value = value.replace('%', '');
      }
      return (isNaN(value) ? parseFloat(value) : null);
    }
    else {
      return value;
    }
  }
}
exports.getValue = getValue;
function decodeFromForm(form, locale, currencyCode) {
  if (!form) {
    return null;
  }
  var dateFormat = form.getAttribute('date-format');
  var obj = {};
  var len = form.length;
  var _loop_1 = function (i) {
    var ctrl = form[i];
    var name_1 = ctrl.getAttribute('name');
    var id = ctrl.getAttribute('id');
    var val = void 0;
    var isDate = false;
    if (!name_1 || name_1 === '') {
      var dataField = ctrl.getAttribute('data-field');
      if (!dataField && ctrl.parentElement && ctrl.parentElement.classList.contains('DayPickerInput')) {
        if (ctrl.parentElement.parentElement) {
          dataField = ctrl.parentElement.parentElement.getAttribute('data-field');
          isDate = true;
        }
      }
      name_1 = dataField;
    }
    if (name_1 != null && name_1 !== '') {
      var nodeName = ctrl.nodeName;
      var type = ctrl.getAttribute('type');
      if (nodeName === 'INPUT' && type !== null) {
        nodeName = type.toUpperCase();
      }
      if (nodeName !== 'BUTTON'
        && nodeName !== 'RESET'
        && nodeName !== 'SUBMIT') {
        switch (type) {
          case 'checkbox':
            if (id && name_1 !== id) {
              val = reflect_1.valueOf(obj, name_1);
              if (!val) {
                val = [];
              }
              if (ctrl.checked) {
                val.push(ctrl.value);
              }
              else {
                val = val.filter(function (item) { return item != ctrl.value; });
              }
            }
            else {
              var c0 = ctrl.checked;
              if (c0 || c0 === 'checked') {
                val = true;
              }
            }
            break;
          case 'radio':
            var cv = ctrl.checked;
            if (cv || cv === 'checked') {
              val = ctrl.value;
            }
            break;
          case 'date':
            if (ctrl.value.length === 10) {
              try {
                val = new Date(ctrl.value);
              }
              catch (err) {
                val = null;
              }
            }
            else {
              val = null;
            }
            break;
          case 'datetime-local':
            if (ctrl.value.length > 0) {
              try {
                val = new Date(ctrl.value).toISOString();
              }
              catch (err) {
                val = null;
              }
            }
            else {
              val = null;
            }
            break;
          default:
            val = ctrl.value;
        }
        if (resources_1.resources.date && dateFormat && isDate) {
          try {
            val = resources_1.resources.date(val, dateFormat);
          }
          catch (err) {
            val = null;
          }
        }
        var ctype = ctrl.getAttribute('data-type');
        var v = ctrl.value;
        var c = void 0;
        if (ctype === 'currency') {
          c = ctrl.getAttribute('currency-code');
          if (!c) {
            c = currencyCode;
          }
          if (c && resources_1.resources.currency && c.length > 0) {
            var currency = resources_1.resources.currency(c);
            if (currency && v.indexOf(currency.symbol) >= 0) {
              v = v.replace(currency.symbol, '');
            }
          }
        }
        if (type === 'number' || ctype === 'currency' || ctype === 'int' || ctype === 'number') {
          if (locale && locale.decimalSeparator !== '.') {
            v = v.replace(r2, '');
          }
          else {
            v = v.replace(r1, '');
          }
          val = (isNaN(v) ? null : parseFloat(v));
        }
        reflect_1.setValue(obj, name_1, val);
      }
    }
  };
  for (var i = 0; i < len; i++) {
    _loop_1(i);
  }
  return obj;
}
exports.decodeFromForm = decodeFromForm;
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
  return (str === '');
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
    if (parent_1.nodeName === nodeName || parent_1.getAttribute('data-field') != null) {
      return parent_1;
    }
    else {
      tmp = parent_1;
    }
    if (tmp.nodeName === 'BODY') {
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
  while (i >= 0 && (s.charAt(i) === ' ' || s.charAt(i) === '\t' || s.charAt(i) === '\r' || s.charAt(i) === '\n')) {
    i--;
  }
  s = s.substring(0, i + 1);
  i = 0;
  while (i < s.length && (s.charAt(i) === ' ' || s.charAt(i) === '\t' || s.charAt(i) === '\r' || s.charAt(i) === '\n')) {
    i++;
  }
  return s.substring(i);
}
