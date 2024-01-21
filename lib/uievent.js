"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validation_core_1 = require("validation-core");
var formatter_1 = require("./formatter");
var resources_1 = require("./resources");
var ui_1 = require("./ui");
var uivalidator_1 = require("./uivalidator");
var uievent = (function () {
  function uievent() {
  }
  uievent.handleMaterialFocus = function (ctrl) {
    setTimeout(function () {
      if (ctrl.nodeName === 'INPUT' || ctrl.nodeName === 'SELECT'
        || ctrl.classList.contains('form-control') || ctrl.classList.contains('field')
        || (ctrl.parentElement && (ctrl.parentElement.classList.contains('form-control') || ctrl.parentElement.classList.contains('field')))) {
        var c = resources_1.resources.container(ctrl);
        var disableHighlightFocus = ctrl.getAttribute('disable-style-on-focus');
        if (c && !c.classList.contains('focused') && !disableHighlightFocus) {
          c.classList.add('focused');
        }
      }
    }, 0);
  };
  uievent.handleMaterialBlur = function (ctrl) {
    setTimeout(function () {
      if (ctrl.nodeName === 'INPUT' || ctrl.nodeName === 'SELECT'
        || ctrl.classList.contains('form-control') || ctrl.classList.contains('field')
        || (ctrl.parentElement && (ctrl.parentElement.classList.contains('form-control') || ctrl.parentElement.classList.contains('field')))) {
        var c = resources_1.resources.container(ctrl);
        if (c) {
          c.classList.remove('focused');
          c.classList.remove('focus');
        }
      }
    }, 0);
  };
  uievent.num1 = / |,|\$|€|£|¥|'|٬|،| /g;
  uievent.num2 = / |\.|\$|€|£|¥|'|٬|،| /g;
  uievent.materialOnFocus = function (event) {
    var ctrl = event.currentTarget;
    if (ctrl.disabled || ctrl.readOnly) {
      return;
    }
    setTimeout(function () {
      if (ctrl.nodeName === 'INPUT' || ctrl.nodeName === 'SELECT'
        || ctrl.classList.contains('form-control') || ctrl.classList.contains('field')
        || (ctrl.parentElement && (ctrl.parentElement.classList.contains('form-control') || ctrl.parentElement.classList.contains('field')))) {
        var c = resources_1.resources.container(ctrl);
        if (c && !c.classList.contains('focused')) {
          c.classList.add('focused');
        }
      }
    }, 0);
  };
  return uievent;
}());
exports.uievent = uievent;
function isULong(value) {
  if (!value || value.length === 0) {
    return false;
  }
  else if (value.indexOf('.') >= 0) {
    return false;
  }
  else if (isNaN(value)) {
    return false;
  }
  else {
    return (value >= 0);
  }
}
function registerEvents(form) {
  var len = form.length;
  for (var i = 0; i < len; i++) {
    var ctrl = form[i];
    if (ctrl.nodeName === 'INPUT' || ctrl.nodeName === 'SELECT') {
      var type = ctrl.getAttribute('type');
      if (type != null) {
        type = type.toLowerCase();
      }
      if (ctrl.nodeName === 'INPUT'
        && (type === 'checkbox'
          || type === 'radio'
          || type === 'submit'
          || type === 'button'
          || type === 'reset')) {
        continue;
      }
      else {
        var parent_1 = ctrl.parentElement;
        var required = ctrl.getAttribute('required');
        if (parent_1) {
          if (parent_1.nodeName === 'LABEL'
            && required != null && required !== undefined && required != 'false'
            && !parent_1.classList.contains('required')) {
            parent_1.classList.add('required');
          }
          else if (parent_1.classList.contains('form-group') || parent_1.classList.contains('field')) {
            var firstChild = parent_1.firstChild;
            if (firstChild && firstChild.nodeName === 'LABEL') {
              if (!firstChild.classList.contains('required')) {
                firstChild.classList.add('required');
              }
            }
          }
        }
        if (ctrl.getAttribute('onblur') === null && ctrl.getAttribute('(blur)') === null) {
          ctrl.onblur = materialOnBlur;
        }
        else {
          console.log('name:' + ctrl.getAttribute('name'));
        }
        if (ctrl.getAttribute('onfocus') === null && ctrl.getAttribute('(focus)') === null) {
          ctrl.onfocus = uievent.materialOnFocus;
        }
        else {
          console.log('name:' + ctrl.getAttribute('name'));
        }
      }
    }
  }
}
exports.registerEvents = registerEvents;
function requiredOnBlur(event) {
  var ctrl = event.currentTarget;
  if (!ctrl || ctrl.readOnly || ctrl.disabled) {
    return;
  }
  setTimeout(function () {
    ui_1.trim(ctrl);
    if (!uivalidator_1.checkRequired(ctrl)) {
      uivalidator_1.removeError(ctrl);
    }
  }, 40);
}
exports.requiredOnBlur = requiredOnBlur;
function checkOnBlur(event, key, check, formatF) {
  var ctrl = event.currentTarget;
  if (!ctrl || ctrl.readOnly || ctrl.disabled) {
    return;
  }
  var value = ctrl.value;
  uivalidator_1.removeError(ctrl);
  setTimeout(function () {
    ui_1.trim(ctrl);
    if (uivalidator_1.checkRequired(ctrl) || uivalidator_1.checkMinLength(ctrl) || uivalidator_1.checkMaxLength(ctrl)) {
      return;
    }
    if (formatF) {
      value = formatF(value);
    }
    if (value.length > 0 && !check(value)) {
      var label = resources_1.resources.label(ctrl);
      var r = resources_1.resources.resource;
      var msg = r.format(r.value(key), label);
      uivalidator_1.addErrorMessage(ctrl, msg);
    }
  }, 40);
}
exports.checkOnBlur = checkOnBlur;
function emailOnBlur(event) {
  checkOnBlur(event, 'error_email', validation_core_1.isEmail);
}
exports.emailOnBlur = emailOnBlur;
function urlOnBlur(event) {
  checkOnBlur(event, 'error_url', validation_core_1.isUrl);
}
exports.urlOnBlur = urlOnBlur;
function phoneOnBlur(event) {
  checkOnBlur(event, 'error_phone', validation_core_1.tel.isPhone, formatter_1.formatter.removePhoneFormat);
}
exports.phoneOnBlur = phoneOnBlur;
function faxOnBlur(event) {
  checkOnBlur(event, 'error_fax', validation_core_1.tel.isFax, formatter_1.formatter.removeFaxFormat);
}
exports.faxOnBlur = faxOnBlur;
function ipv4OnBlur(event) {
  checkOnBlur(event, 'error_ipv4', validation_core_1.isIPv4);
}
exports.ipv4OnBlur = ipv4OnBlur;
function ipv6OnBlur(event) {
  checkOnBlur(event, 'error_ipv6', validation_core_1.isIPv6);
}
exports.ipv6OnBlur = ipv6OnBlur;
function patternOnBlur(event) {
  var ctrl = event.currentTarget;
  if (!ctrl || ctrl.readOnly || ctrl.disabled) {
    return;
  }
  uivalidator_1.removeError(ctrl);
  setTimeout(function () {
    ui_1.trim(ctrl);
    if (uivalidator_1.checkRequired(ctrl)) {
      return;
    }
    var value = ctrl.value;
    if (value.length > 0) {
      var pattern = ctrl.getAttribute('config-pattern');
      var flags = ctrl.getAttribute('config-pattern-flags');
      if (!pattern) {
        pattern = ctrl.getAttribute('pattern');
      }
      if (!flags) {
        flags = ctrl.getAttribute('flags');
      }
      if (!flags) {
        flags = ctrl.getAttribute('pattern-flags');
      }
      if (pattern) {
        var resource_key = ctrl.getAttribute('resource-key') || ctrl.getAttribute('config-pattern-error-key');
        if (resource_key && !validation_core_1.isValidPattern(value, pattern, flags)) {
          var label = resources_1.resources.label(ctrl);
          var r = resources_1.resources.resource;
          var msg = r.format(r.value(resource_key), label);
          uivalidator_1.addErrorMessage(ctrl, msg);
        }
      }
    }
  }, 40);
}
exports.patternOnBlur = patternOnBlur;
function materialOnBlur(event) {
  var ctrl = event.currentTarget;
  uievent.handleMaterialBlur(ctrl);
}
exports.materialOnBlur = materialOnBlur;
function validOnBlur(event) {
  var ctrl = event.currentTarget;
  if (!ctrl || ctrl.readOnly || ctrl.disabled) {
    return;
  }
  uivalidator_1.removeError(ctrl);
}
exports.validOnBlur = validOnBlur;
function validateOnBlur(event, locale) {
  var ctrl = event.currentTarget;
  uievent.handleMaterialBlur(ctrl);
  if (!ctrl || ctrl.readOnly || ctrl.disabled) {
    return;
  }
  setTimeout(function () {
    ui_1.trim(ctrl);
    uivalidator_1.removeError(ctrl);
    uivalidator_1.validateElement(ctrl, locale);
  }, 0);
}
exports.validateOnBlur = validateOnBlur;
function handleNumberFocus(ctrl, v, locale) {
  if (locale && locale.decimalSeparator !== '.') {
    v = v.replace(uievent.num2, '');
  }
  else {
    v = v.replace(uievent.num1, '');
  }
  if (v !== ctrl.value) {
    ctrl.value = v;
  }
}
exports.handleNumberFocus = handleNumberFocus;
function numberOnFocus(event, locale) {
  var ctrl = event.currentTarget;
  uievent.handleMaterialFocus(ctrl);
  if (ctrl.readOnly || ctrl.disabled || ctrl.value.length === 0) {
    return;
  }
  else {
    var v = ctrl.value;
    handleNumberFocus(ctrl, v, locale);
  }
}
exports.numberOnFocus = numberOnFocus;
function numberOnBlur(event, locale) {
  baseNumberOnBlur(event, locale, false, undefined, false);
}
exports.numberOnBlur = numberOnBlur;
function percentageOnFocus(event, locale) {
  var ctrl = event.currentTarget;
  uievent.handleMaterialFocus(ctrl);
  if (ctrl.readOnly || ctrl.disabled || ctrl.value.length === 0) {
    return;
  }
  var v = ctrl.value;
  setTimeout(function () {
    if (locale && locale.decimalSeparator !== '.') {
      v = v.replace(uievent.num2, '');
    }
    else {
      v = v.replace(uievent.num1, '');
    }
    v = v.replace('%', '');
    if (v !== ctrl.value) {
      ctrl.value = v;
    }
  }, 0);
}
exports.percentageOnFocus = percentageOnFocus;
function currencyOnFocus(event, locale, c) {
  var ctrl = event.currentTarget;
  uievent.handleMaterialFocus(ctrl);
  if (ctrl.readOnly || ctrl.disabled || ctrl.value.length === 0) {
    return;
  }
  else {
    var v = ctrl.value;
    if (c && resources_1.resources.currency && c.length > 0) {
      var currency = resources_1.resources.currency(c);
      if (currency) {
        if (v.indexOf(currency.symbol) >= 0) {
          v = v.replace(currency.symbol, '');
        }
        if (currency.code && v.indexOf(currency.code) >= 0) {
          v = v.replace(currency.code, '');
        }
      }
    }
    handleNumberFocus(ctrl, v, locale);
  }
}
exports.currencyOnFocus = currencyOnFocus;
function currencyOnBlur(event, locale, currencyCode, includingCurrencySymbol) {
  baseNumberOnBlur(event, locale, true, currencyCode, includingCurrencySymbol);
}
exports.currencyOnBlur = currencyOnBlur;
function baseNumberOnBlur(event, locale, isCurrency, currencyCode, includingCurrencySymbol) {
  var ctrl = event.currentTarget;
  if (!ctrl || ctrl.readOnly || ctrl.disabled) {
    return;
  }
  materialOnBlur(event);
  uivalidator_1.removeError(ctrl);
  setTimeout(function () {
    ui_1.trim(ctrl);
    var value = ctrl.value;
    var value2 = value;
    var c;
    if (isCurrency) {
      c = ctrl.getAttribute('currency-code');
      if (!c) {
        c = currencyCode;
      }
      if (c && resources_1.resources.currency && c.length > 0) {
        var currency = resources_1.resources.currency(c);
        if (currency && value2.indexOf(currency.symbol) >= 0) {
          value2 = value2.replace(currency.symbol, '');
        }
      }
      if (locale && value2.indexOf(locale.currencySymbol) >= 0) {
        value2 = value2.replace(locale.currencySymbol, '');
      }
    }
    if (locale && locale.decimalSeparator !== '.') {
      value2 = value2.replace(uievent.num2, '');
      if (value2.indexOf(locale.decimalSeparator) >= 0) {
        value2 = value2.replace(locale.decimalSeparator, '.');
      }
    }
    else {
      value2 = value2.replace(uievent.num1, '');
    }
    var label = resources_1.resources.label(ctrl);
    if (uivalidator_1.checkRequired(ctrl, label)) {
      return;
    }
    if (value.length > 0) {
      if (isNaN(value2)) {
        var r = resources_1.resources.resource;
        var msg = r.format(r.value('error_number'), label);
        uivalidator_1.addErrorMessage(ctrl, msg);
        return;
      }
      var n = parseFloat(value2);
      if (validateMinMax(ctrl, n, label, locale)) {
        var r = void 0;
        if (isCurrency) {
          r = formatCurrency(n, locale, c, includingCurrencySymbol);
        }
        else {
          r = formatNumber(ctrl, n, locale);
        }
        if (r !== ctrl.value) {
          ctrl.value = r;
        }
        uivalidator_1.removeError(ctrl);
      }
    }
  }, 40);
}
function formatCurrency(v, locale, currencyCode, includingCurrencySymbol) {
  return formatter_1.formatter.formatCurrency(v, currencyCode, locale, includingCurrencySymbol);
}
function formatNumber(ctrl, v, locale) {
  var numFormat = ctrl.getAttribute('number-format');
  if (numFormat !== null) {
    if (numFormat.indexOf('number') === 0) {
      var strNums = numFormat.split(':');
      if (strNums.length > 0 && isULong(strNums[1])) {
        var scale = parseInt(strNums[1], 10);
        return formatter_1.formatter.formatNumber(v, scale, locale);
      }
      else {
        return '' + v;
      }
    }
    else {
      return formatter_1.formatter.format(v, numFormat, locale);
    }
  }
  else {
    return '' + v;
  }
}
function validateMinMax(ctrl, n, label, locale) {
  var min = ctrl.getAttribute('min');
  var r = resources_1.resources.resource;
  if (min !== null && min.length > 0) {
    min = parseFloat(min);
    if (n < min) {
      var msg = r.format(r.value('error_min'), label, min);
      var maxd = ctrl.getAttribute('max');
      if (maxd && maxd.length > 0) {
        maxd = parseFloat(maxd);
        if (maxd === min) {
          msg = r.format(r.value('error_equal'), label, maxd);
        }
      }
      uivalidator_1.addErrorMessage(ctrl, msg);
      return false;
    }
  }
  var max = ctrl.getAttribute('max');
  if (max !== null && max.length > 0) {
    max = parseFloat(max);
    if (n > max) {
      var msg = r.format(r.value('error_max'), label, max);
      if (min && max === min) {
        msg = r.format(r.value('error_equal'), label, max);
      }
      uivalidator_1.addErrorMessage(ctrl, msg);
      return false;
    }
  }
  var minField = ctrl.getAttribute('min-field');
  if (minField) {
    var form = ctrl.form;
    if (form) {
      var ctrl2 = ui_1.element(form, minField);
      if (ctrl2) {
        var smin2 = ctrl2.value;
        if (locale && locale.decimalSeparator !== '.') {
          smin2 = smin2.replace(uievent.num2, '');
          if (smin2.indexOf(locale.decimalSeparator) >= 0) {
            smin2 = smin2.replace(locale.decimalSeparator, '.');
          }
        }
        else {
          smin2 = smin2.replace(uievent.num1, '');
        }
        if (smin2.length > 0 && !isNaN(smin2)) {
          var min2 = parseFloat(smin2);
          if (n < min2) {
            var minLabel = resources_1.resources.label(ctrl2);
            var msg = r.format(r.value('error_min'), label, minLabel);
            uivalidator_1.addErrorMessage(ctrl, msg);
            return false;
          }
        }
      }
    }
  }
  return true;
}
