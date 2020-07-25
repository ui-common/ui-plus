"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflectx_1 = require("reflectx");
var resources_1 = require("./resources");
var _r1 = / |,|\$|€|£|¥|'|٬|،| /g;
var _r2 = / |\.|\$|€|£|¥|'|٬|،| /g;
function getValue(ctrl, locale, currencyCode) {
  if (ctrl.type === 'checkbox') {
    var ctrlOnValue = ctrl.getAttribute('data-onValue');
    var ctrlOffValue = ctrl.getAttribute('data-offValue');
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
        if (c) {
          var currency = resources_1.resources.currencyService.getCurrency(c);
          if (currency && value.indexOf(currency.currencySymbol) >= 0) {
            value = value.replace(currency.currencySymbol, '');
          }
        }
      }
      if (locale && value.indexOf(locale.currencySymbol) >= 0) {
        value = value.replace(locale.currencySymbol, '');
      }
      if (locale && locale.decimalSeparator !== '.') {
        value = value.replace(_r2, '');
        if (value.indexOf(locale.decimalSeparator) >= 0) {
          value = value.replace(locale.decimalSeparator, '.');
        }
      }
      else {
        value = value.replace(_r1, '');
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
function getLabel(input) {
  if (!input || input.getAttribute('type') === 'hidden') {
    return '';
  }
  var label = input.getAttribute('label');
  if (label) {
    return label;
  }
  else if (!label || label.length === 0) {
    var key = input.getAttribute('key');
    if (!key || key.length === 0) {
      key = input.getAttribute('resource-key');
    }
    if (key !== null && key.length > 0) {
      label = resources_1.resources.resourceService.value(key);
      input.setAttribute('label', label);
      return label;
    }
    else {
      return getLabelFromContainer(input);
    }
  }
  else {
    return getLabelFromContainer(input);
  }
}
exports.getLabel = getLabel;
function getLabelFromContainer(input) {
  var parent = container(input);
  if (parent && parent.nodeName === 'LABEL' && parent.childNodes.length > 0) {
    var first = parent.childNodes[0];
    if (first.nodeType === 3) {
      return first.nodeValue;
    }
  }
  else if (parent && parent.nodeName !== 'LABEL') {
    if (parent.classList.contains('form-group')) {
      var firstChild = parent.firstChild;
      if (firstChild.nodeName === 'LABEL') {
        return firstChild.innerHTML;
      }
      else {
        return '';
      }
    }
    else {
      var node = parent.parentElement;
      if (node && node.nodeName === 'LABEL' && node.childNodes.length > 0) {
        var first = node.childNodes[0];
        if (first.nodeType === 3) {
          return first.nodeValue;
        }
      }
    }
  }
  return '';
}
function decodeFromForm(form, locale, currencyCode) {
  if (!form) {
    return null;
  }
  var dateFormat = form.getAttribute('date-format');
  var obj = {};
  var _loop_1 = function (ctrl) {
    var name_1 = ctrl.getAttribute('name');
    var id = ctrl.getAttribute('id');
    var val = void 0;
    var isDate = false;
    if (!name_1 || name_1.length === 0) {
      var dataField = ctrl.getAttribute('data-field');
      if (!dataField && ctrl.parentElement.classList.contains('DayPickerInput')) {
        dataField = ctrl.parentElement.parentElement.getAttribute('data-field');
        isDate = true;
      }
      name_1 = dataField;
    }
    if (name_1 != null && name_1.length > 0) {
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
              val = reflectx_1.valueOf(obj, name_1);
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
              if (ctrl.checked === 'checked') {
                val = true;
              }
            }
            break;
          case 'radio':
            if (ctrl.checked === 'checked') {
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
          default:
            val = ctrl.value;
        }
        if (resources_1.resources.dateService && dateFormat && isDate) {
          try {
            val = resources_1.resources.dateService.parse(val, dateFormat);
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
          if (c) {
            var currency = resources_1.resources.currencyService.getCurrency(c);
            if (currency && v.indexOf(currency.currencySymbol) >= 0) {
              v = v.replace(currency.currencySymbol, '');
            }
          }
        }
        if (type === 'number' || ctype === 'currency' || ctype === 'int' || ctype === 'number') {
          if (locale && locale.decimalSeparator !== '.') {
            v = v.replace(_r2, '');
          }
          else {
            v = v.replace(_r1, '');
          }
          val = (isNaN(v) ? null : parseFloat(v));
        }
        reflectx_1.setValue(obj, name_1, val);
      }
    }
  };
  for (var _i = 0, form_1 = form; _i < form_1.length; _i++) {
    var ctrl = form_1[_i];
    _loop_1(ctrl);
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
function container(ctrl) {
  var p = ctrl.parentElement;
  if (p.nodeName === 'LABEL' || p.classList.contains('form-group')) {
    return p;
  }
  else {
    var p1 = p.parentElement;
    if (p.nodeName === 'LABEL' || p1.classList.contains('form-group')) {
      return p1;
    }
    else {
      var p2 = p1.parentElement;
      if (p.nodeName === 'LABEL' || p2.classList.contains('form-group')) {
        return p2;
      }
      else {
        var p3 = p2.parentElement;
        if (p.nodeName === 'LABEL' || p3.classList.contains('form-group')) {
          return p3;
        }
        else {
          return null;
        }
      }
    }
  }
}
exports.container = container;
function element(form, childName) {
  for (var _i = 0, form_2 = form; _i < form_2.length; _i++) {
    var f = form_2[_i];
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
