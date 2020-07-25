"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validation_util_1 = require("validation-util");
var formatter_1 = require("./formatter");
var resources_1 = require("./resources");
var ui_1 = require("./ui");
var uivalidator_1 = require("./uivalidator");
var uievent = (function () {
  function uievent() {}
  uievent.isULong = function (value) {
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
      if (value >= 0) {
        return true;
      }
      else {
        return false;
      }
    }
  };
  uievent.handleMaterialFocus = function (ctrl) {
    setTimeout(function () {
      if (ctrl.nodeName === 'INPUT' || ctrl.nodeName === 'SELECT'
        || ctrl.classList.contains('form-control')
        || ctrl.parentElement.classList.contains('form-control')) {
        var c = ui_1.container(ctrl);
        var disableHighlightFocus = ctrl.getAttribute('disable-style-on-focus');
        if (c && !c.classList.contains('focused') && !disableHighlightFocus) {
          c.classList.add('focused');
        }
      }
    }, 0);
  };
  uievent.initMaterial = function (form) {
    for (var _i = 0, form_1 = form; _i < form_1.length; _i++) {
      var ctrl = form_1[_i];
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
          if (parent_1 && parent_1.nodeName === 'LABEL'
            && required != null && required !== undefined && required != 'false'
            && !parent_1.classList.contains('required')) {
            parent_1.classList.add('required');
          }
          else if (parent_1.classList.contains('form-group')) {
            var firstChild = parent_1.firstChild;
            if (firstChild.nodeName === 'LABEL') {
              if (!firstChild.classList.contains('required')) {
                firstChild.classList.add('required');
              }
            }
          }
          if (ctrl.getAttribute('onblur') === null && ctrl.getAttribute('(blur)') === null) {
            ctrl.onblur = uievent.materialOnBlur;
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
  };
  uievent.handleMaterialBlur = function (ctrl) {
    setTimeout(function () {
      if (ctrl.nodeName === 'INPUT' || ctrl.nodeName === 'SELECT'
        || ctrl.classList.contains('form-control')
        || ctrl.parentElement.classList.contains('form-control')) {
        var c = ui_1.container(ctrl);
        if (c) {
          c.classList.remove('focused');
        }
      }
    }, 0);
  };
  uievent.numberOnFocus = function (event, locale) {
    var ctrl = event.target;
    uievent.handleMaterialFocus(ctrl);
    if (ctrl.readOnly || ctrl.disabled || ctrl.value.length === 0) {
      return;
    }
    else {
      var v = ctrl.value;
      uievent.handleNumFocus(ctrl, v, locale);
    }
  };
  uievent.handleNumFocus = function (ctrl, v, locale) {
    if (locale && locale.decimalSeparator !== '.') {
      v = v.replace(uievent._r2, '');
    }
    else {
      v = v.replace(uievent._r1, '');
    }
    if (v !== ctrl.value) {
      ctrl.value = v;
    }
  };
  uievent.currencyOnFocus = function (event, locale, currencyCode) {
    var ctrl = event.target;
    uievent.handleMaterialFocus(ctrl);
    if (ctrl.readOnly || ctrl.disabled || ctrl.value.length === 0) {
      return;
    }
    else {
      var v = ctrl.value;
      var c = ctrl.getAttribute('currency-code');
      if (!c) {
        c = currencyCode;
      }
      if (c) {
        var currency = resources_1.resources.currencyService.getCurrency(c);
        if (currency) {
          if (v.indexOf(currency.currencySymbol) >= 0) {
            v = v.replace(currency.currencySymbol, '');
          }
          if (v.indexOf(currency.currencyCode) >= 0) {
            v = v.replace(currency.currencyCode, '');
          }
        }
      }
      uievent.handleNumFocus(ctrl, v, locale);
    }
  };
  uievent.percentageOnFocus = function (event, locale) {
    var ctrl = event.currentTarget;
    uievent.handleMaterialFocus(ctrl);
    if (ctrl.readOnly || ctrl.disabled || ctrl.value.length === 0) {
      return;
    }
    var v = ctrl.value;
    setTimeout(function () {
      if (locale && locale.decimalSeparator !== '.') {
        v = v.replace(uievent._r2, '');
      }
      else {
        v = v.replace(uievent._r1, '');
      }
      v = v.replace('%', '');
      if (v !== ctrl.value) {
        ctrl.value = v;
      }
    }, 0);
  };
  uievent._formatCurrency = function (v, locale, currencyCode, includingCurrencySymbol) {
    return resources_1.resources.localeService.formatCurrency(v, currencyCode, locale, includingCurrencySymbol);
  };
  uievent.validOnBlur = function (event) {
    var ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    uivalidator_1.removeErrorMessage(ctrl);
  };
  uievent.requiredOnBlur = function (event) {
    var ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    setTimeout(function () {
      ui_1.trim(ctrl);
      if (!uivalidator_1.checkRequired(ctrl)) {
        uivalidator_1.removeErrorMessage(ctrl);
      }
    }, 40);
  };
  uievent.emailOnBlur = function (event) {
    uievent.checkOnBlur(event, 'error_email', validation_util_1.isEmail);
  };
  uievent.urlOnBlur = function (event) {
    uievent.checkOnBlur(event, 'error_url', validation_util_1.isUrl);
  };
  uievent.ipv4OnBlur = function (event) {
    uievent.checkOnBlur(event, 'error_ipv4', validation_util_1.isIPv4);
  };
  uievent.ipv6OnBlur = function (event) {
    uievent.checkOnBlur(event, 'error_ipv6', validation_util_1.isIPv6);
  };
  uievent.phoneOnBlur = function (event) {
    uievent.checkOnBlur(event, 'error_phone', validation_util_1.tel.isPhone, formatter_1.formatter.removePhoneFormat);
  };
  uievent.faxOnBlur = function (event) {
    uievent.checkOnBlur(event, 'error_fax', validation_util_1.tel.isFax, formatter_1.formatter.removeFaxFormat);
  };
  uievent.checkOnBlur = function (event, key, check, formatF) {
    var ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    var value = ctrl.value;
    uivalidator_1.removeErrorMessage(ctrl);
    setTimeout(function () {
      ui_1.trim(ctrl);
      if (uivalidator_1.checkRequired(ctrl) || uivalidator_1.checkMinLength(ctrl) || uivalidator_1.checkMaxLength(ctrl)) {
        return;
      }
      if (formatF) {
        value = formatF(value);
      }
      if (value.length > 0 && !check(value)) {
        var label = ui_1.getLabel(ctrl);
        var r = resources_1.resources.resourceService;
        var msg = r.format(r.value(key), label);
        uivalidator_1.addErrorMessage(ctrl, msg);
      }
    }, 40);
  };
  uievent.patternOnBlur = function (event) {
    var ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    uivalidator_1.removeErrorMessage(ctrl);
    setTimeout(function () {
      ui_1.trim(ctrl);
      if (uivalidator_1.checkRequired(ctrl)) {
        return;
      }
      var value = ctrl.value;
      if (value.length > 0) {
        var pattern = ctrl.getAttribute('config-pattern');
        var patternModifier = ctrl.getAttribute('config-pattern-modifier');
        if (pattern == null || pattern === undefined) {
          pattern = ctrl.getAttribute('pattern');
        }
        if (pattern) {
          var resource_key = ctrl.getAttribute('resource-key') || ctrl.getAttribute('config-pattern-error-key');
          if (!validation_util_1.isValidPattern(pattern, patternModifier, value)) {
            var label = ui_1.getLabel(ctrl);
            var r = resources_1.resources.resourceService;
            var msg = r.format(r.value(resource_key), label);
            uivalidator_1.addErrorMessage(ctrl, msg);
          }
        }
      }
    }, 40);
  };
  uievent.numberOnBlur = function (event, locale) {
    uievent._baseNumberOnBlur(event, locale, false, null, false);
  };
  uievent._formatNumber = function (ctrl, v, locale) {
    var numFormat = ctrl.getAttribute('number-format');
    if (numFormat !== null) {
      if (numFormat.indexOf('number') === 0) {
        var strNums = numFormat.split(':');
        if (strNums.length > 0 && uievent.isULong(strNums[1])) {
          var scale = parseInt(strNums[1], null);
          return resources_1.resources.localeService.formatNumber(v, scale, locale);
        }
        else {
          return v;
        }
      }
      else {
        return resources_1.resources.localeService.format(v, numFormat, locale);
      }
    }
    else {
      return v;
    }
  };
  uievent.currencyOnBlur = function (event, locale, currencyCode, includingCurrencySymbol) {
    uievent._baseNumberOnBlur(event, locale, true, currencyCode, includingCurrencySymbol);
  };
  uievent._baseNumberOnBlur = function (event, locale, isCurrency, currencyCode, includingCurrencySymbol) {
    var ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    this.materialOnBlur(event);
    uivalidator_1.removeErrorMessage(ctrl);
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
        if (c) {
          var currency = resources_1.resources.currencyService.getCurrency(c);
          if (currency && value2.indexOf(currency.currencySymbol) >= 0) {
            value2 = value2.replace(currency.currencySymbol, '');
          }
        }
        if (locale && value2.indexOf(locale.currencySymbol) >= 0) {
          value2 = value2.replace(locale.currencySymbol, '');
        }
      }
      if (locale && locale.decimalSeparator !== '.') {
        value2 = value2.replace(uievent._r2, '');
        if (value2.indexOf(locale.decimalSeparator) >= 0) {
          value2 = value2.replace(locale.decimalSeparator, '.');
        }
      }
      else {
        value2 = value2.replace(uievent._r1, '');
      }
      var label = ui_1.getLabel(ctrl);
      if (uivalidator_1.checkRequired(ctrl, label)) {
        return;
      }
      if (value.length > 0) {
        if (isNaN(value2)) {
          var r = resources_1.resources.resourceService;
          var msg = r.format(r.value('error_number'), label);
          uivalidator_1.addErrorMessage(ctrl, msg);
          return;
        }
        var n = parseFloat(value2);
        if (uievent.validateMinMax(ctrl, n, label, locale)) {
          var r = void 0;
          if (isCurrency) {
            r = uievent._formatCurrency(n, locale, c, includingCurrencySymbol);
          }
          else {
            r = uievent._formatNumber(ctrl, n, locale);
          }
          if (r !== ctrl.value) {
            ctrl.value = r;
          }
          uivalidator_1.removeErrorMessage(ctrl);
        }
      }
    }, 40);
  };
  uievent.validateMinMax = function (ctrl, n, label, locale) {
    var min = ctrl.getAttribute('min');
    var r = resources_1.resources.resourceService;
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
            smin2 = smin2.replace(uievent._r2, '');
            if (smin2.indexOf(locale.decimalSeparator) >= 0) {
              smin2 = smin2.replace(locale.decimalSeparator, '.');
            }
          }
          else {
            smin2 = smin2.replace(uievent._r1, '');
          }
          if (smin2.length > 0 && !isNaN(smin2)) {
            var min2 = parseFloat(smin2);
            if (n < min2) {
              var minLabel = ui_1.getLabel(ctrl2);
              var msg = r.format(r.value('error_min'), label, minLabel);
              uivalidator_1.addErrorMessage(ctrl, msg);
              return false;
            }
          }
        }
      }
    }
    return true;
  };
  uievent.validateOnBlur = function (event, locale) {
    var ctrl = event.currentTarget;
    uievent.handleMaterialBlur(event);
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    setTimeout(function () {
      ui_1.trim(ctrl);
      uivalidator_1.removeErrorMessage(ctrl);
      uivalidator_1.validateElement(ctrl, locale);
    }, 0);
  };
  uievent._r1 = / |,|\$|€|£|¥|'|٬|،| /g;
  uievent._r2 = / |\.|\$|€|£|¥|'|٬|،| /g;
  uievent.materialOnFocus = function (event) {
    var ctrl = event.currentTarget;
    if (ctrl.disable || ctrl.readOnly) {
      return;
    }
    setTimeout(function () {
      if (ctrl.nodeName === 'INPUT' || ctrl.nodeName === 'SELECT'
        || ctrl.classList.contains('form-control')
        || ctrl.parentElement.classList.contains('form-control')) {
        var c = ui_1.container(ctrl);
        if (c && !c.classList.contains('focused')) {
          c.classList.add('focused');
        }
      }
    }, 0);
  };
  uievent.materialOnBlur = function (event) {
    var ctrl = event.currentTarget;
    uievent.handleMaterialBlur(ctrl);
  };
  return uievent;
}());
exports.uievent = uievent;
