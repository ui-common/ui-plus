"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validation_util_1 = require("validation-util");
var formatter_1 = require("./formatter");
var resources_1 = require("./resources");
var ui_1 = require("./ui");
var _r1 = / |,|\$|€|£|¥|'|٬|،| /g;
var _r2 = / |\.|\$|€|£|¥|'|٬|،| /g;
var _r3 = new RegExp('&', 'gi');
var _r4 = new RegExp('>', 'gi');
var _r5 = new RegExp('<', 'gi');
function isValidForm(form, focusFirst, scroll) {
  var valid = true;
  var i = 0;
  var len = form.length;
  for (i = 0; i < len; i++) {
    var ctrl = form[i];
    var parent_1 = ctrl.parentElement;
    if (ctrl.classList.contains('invalid')
      || ctrl.classList.contains('ng-invalid')
      || parent_1.classList.contains('invalid')) {
      if (!focusFirst) {
        focusFirst = true;
      }
      if (ctrl && focusFirst === true) {
        ctrl.focus();
        if (scroll === true) {
          ctrl.scrollIntoView();
        }
      }
      return false;
    }
  }
  return valid;
}
exports.isValidForm = isValidForm;
function validateForm(form, locale, focusFirst, scroll) {
  var valid = true;
  var errorCtrl = null;
  var i = 0;
  var len = form.length;
  for (i = 0; i < len; i++) {
    var ctrl = form[i];
    var type = ctrl.getAttribute('type');
    if (type != null) {
      type = type.toLowerCase();
    }
    if (type === 'checkbox'
      || type === 'radio'
      || type === 'submit'
      || type === 'button'
      || type === 'reset') {
      continue;
    }
    else {
      if (!validateElement(ctrl, locale)) {
        valid = false;
        if (!errorCtrl) {
          errorCtrl = ctrl;
        }
      }
      else {
        removeErrorMessage(ctrl);
      }
    }
  }
  if (!focusFirst) {
    focusFirst = true;
  }
  if (errorCtrl !== null && focusFirst === true) {
    errorCtrl.focus();
    if (scroll === true) {
      errorCtrl.scrollIntoView();
    }
  }
  return valid;
}
exports.validateForm = validateForm;
function showFormError(form, errors, focusFirst) {
  if (!errors || errors.length === 0) {
    return [];
  }
  var errorCtrl = null;
  var errs = [];
  var length = errors.length;
  var len = form.length;
  for (var i = 0; i < length; i++) {
    var hasControl = false;
    for (var j = 0; j < len; j++) {
      var ctrl = form[j];
      var dataField = ctrl.getAttribute('data-field');
      if (dataField === errors[i].field || ctrl.name === errors[i].field) {
        addErrorMessage(ctrl, errors[i].message);
        hasControl = true;
        if (!errorCtrl) {
          errorCtrl = ctrl;
        }
      }
    }
    if (hasControl === false) {
      errs.push(errors[i]);
    }
  }
  if (!focusFirst) {
    focusFirst = true;
  }
  if (errorCtrl !== null && focusFirst === true) {
    errorCtrl.focus();
    errorCtrl.scrollIntoView();
  }
  return errs;
}
exports.showFormError = showFormError;
function validateElements(controls, locale) {
  var valid = true;
  var errorCtrl = null;
  for (var _i = 0, controls_1 = controls; _i < controls_1.length; _i++) {
    var c = controls_1[_i];
    if (!validateElement(c, locale)) {
      valid = false;
      if (!errorCtrl) {
        errorCtrl = c;
      }
    }
    else {
      removeErrorMessage(c);
    }
  }
  if (errorCtrl !== null) {
    errorCtrl.focus();
    errorCtrl.scrollIntoView();
  }
  return valid;
}
exports.validateElements = validateElements;
function checkRequired(ctrl, label) {
  var value = ctrl.value;
  var required = ctrl.getAttribute('config-required');
  if (required == null || required === undefined) {
    required = ctrl.getAttribute('required');
  }
  if (required !== null && required !== 'false') {
    if (value.length === 0) {
      if (!label) {
        label = ui_1.getLabel(ctrl);
      }
      var errorKey = (ctrl.nodeName === 'SELECT' ? 'error_select_required' : 'error_required');
      var r = resources_1.resources.resourceService;
      var s = r.value(errorKey);
      if (!s || s === '') {
        s = r.value('error_required');
      }
      var msg = r.format(s, label);
      addErrorMessage(ctrl, msg);
      return true;
    }
  }
  return false;
}
exports.checkRequired = checkRequired;
function checkMaxLength(ctrl, label) {
  var maxlength = ctrl.getAttribute('maxlength');
  if (maxlength && !isNaN(maxlength)) {
    var value = ctrl.value;
    var imaxlength = parseInt(maxlength, null);
    if (value.length > imaxlength) {
      var r = resources_1.resources.resourceService;
      if (!label || label === '') {
        label = ui_1.getLabel(ctrl);
      }
      var msg = r.format(r.value('error_maxlength'), label, maxlength);
      addErrorMessage(ctrl, msg);
      return true;
    }
  }
  return false;
}
exports.checkMaxLength = checkMaxLength;
function checkMinLength(ctrl, label) {
  var minlength = ctrl.getAttribute('minlength');
  if (minlength !== null && !isNaN(minlength)) {
    var value = ctrl.value;
    var iminlength = parseInt(minlength, null);
    if (value.length < iminlength) {
      var r = resources_1.resources.resourceService;
      if (!label || label === '') {
        label = ui_1.getLabel(ctrl);
      }
      var msg = r.format(r.value('error_minlength'), label, minlength);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
}
exports.checkMinLength = checkMinLength;
function validateElement(ctrl, locale) {
  if (!ctrl) {
    return true;
  }
  if (!ctrl || ctrl.readOnly || ctrl.disabled || ctrl.hidden || ctrl.style.display === 'none') {
    return true;
  }
  var nodeName = ctrl.nodeName;
  if (nodeName === 'INPUT') {
    var type = ctrl.getAttribute('type');
    if (type !== null) {
      nodeName = type.toUpperCase();
    }
  }
  if (nodeName === 'BUTTON'
    || nodeName === 'RESET'
    || nodeName === 'SUBMIT') {
    return true;
  }
  var parent = ui_1.container(ctrl);
  if (parent) {
    if (parent.hidden || parent.style.display === 'none') {
      return true;
    }
    else {
      var p = ui_1.getParentByNodeNameOrDataField(parent, 'SECTION');
      if (p && (p.hidden || p.style.display === 'none')) {
        return true;
      }
    }
  }
  var value = ctrl.value;
  var label = ui_1.getLabel(ctrl);
  if (checkRequired(ctrl, label)) {
    return false;
  }
  if (!value || value === '') {
    return true;
  }
  var r = resources_1.resources.resourceService;
  if (checkMaxLength(ctrl, label)) {
    return false;
  }
  if (checkMinLength(ctrl, label)) {
    return false;
  }
  var minlength = ctrl.getAttribute('minlength');
  if (minlength !== null && !isNaN(minlength)) {
    var iminlength = parseInt(minlength, null);
    if (value.length < iminlength) {
      var msg = r.format(r.value('error_minlength'), label, minlength);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  var ctype = ctrl.getAttribute('type');
  var datatype2 = ctrl.getAttribute('data-type');
  var pattern = ctrl.getAttribute('config-pattern');
  var patternModifier = ctrl.getAttribute('config-pattern-modifier');
  if (pattern == null || pattern === undefined) {
    pattern = ctrl.getAttribute('pattern');
  }
  if (ctype === 'email') {
    datatype2 = 'email';
  }
  else if (ctype === 'url') {
    datatype2 = 'url';
  }
  else if (!datatype2) {
    if (ctype === 'number') {
      datatype2 = 'number';
    }
    else if (ctype === 'date') {
      datatype2 = 'date';
    }
  }
  if (pattern) {
    var resource_key = ctrl.getAttribute('resource-key') || ctrl.getAttribute('config-pattern-error-key');
    if (!validation_util_1.isValidPattern(pattern, patternModifier, value)) {
      var msg = r.format(r.value(resource_key), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  if (datatype2 === 'email') {
    if (value.length > 0 && !validation_util_1.isEmail(value)) {
      var msg = r.format(r.value('error_email'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  else if (datatype2 === 'number' || datatype2 === 'int' || datatype2 === 'currency' || datatype2 === 'string-currency' || datatype2 === 'percentage') {
    if (datatype2 === 'currency' || datatype2 === 'string-currency') {
      var currencyCode = ctrl.getAttribute('currency-code');
      if (!currencyCode && ctrl.form) {
        currencyCode = ctrl.form.getAttribute('currency-code');
      }
      if (currencyCode) {
        var currency = resources_1.resources.currencyService.getCurrency(currencyCode);
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
    if (datatype2 === 'percentage' && value.indexOf('%') >= 0) {
      value = value.replace('%', '');
    }
    if (isNaN(value)) {
      var msg = r.format(r.value('error_number'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
    if (datatype2 === 'int' && !validation_util_1.isDigitOnly(value)) {
      var msg = r.format(r.value('error_number'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
    var n = parseFloat(value);
    var min = ctrl.getAttribute('min');
    if (min !== null && min.length > 0) {
      min = parseFloat(min);
      if (n < min) {
        var msg = r.format(r.value('error_min'), label, min);
        var maxd = ctrl.getAttribute('max');
        if (maxd !== null && maxd.length > 0) {
          maxd = parseFloat(maxd);
          if (maxd === min) {
            msg = r.format(r.value('error_equal'), label, maxd);
          }
        }
        addErrorMessage(ctrl, msg);
        return false;
      }
    }
    var max = ctrl.getAttribute('max');
    if (max !== null && max.length > 0) {
      max = parseFloat(max);
      if (n > max) {
        var msg = r.format(r.value('error_max'), label, max);
        if (!min && max === min) {
          msg = r.format(r.value('error_equal'), label);
        }
        addErrorMessage(ctrl, msg);
        return false;
      }
    }
    var minField = ctrl.getAttribute('min-field');
    if (minField && ctrl.form) {
      var ctrl2 = ui_1.element(ctrl.form, minField);
      if (ctrl2) {
        var smin2 = ctrl2.value;
        if (locale && smin2.indexOf(locale.currencySymbol) >= 0) {
          smin2 = smin2.replace(locale.currencySymbol, '');
        }
        if (locale && locale.decimalSeparator !== '.') {
          smin2 = smin2.replace(_r2, '');
          if (smin2.indexOf(locale.decimalSeparator) >= 0) {
            smin2 = smin2.replace(locale.decimalSeparator, '.');
          }
        }
        else {
          smin2 = smin2.replace(_r1, '');
        }
        if (smin2.length > 0 && !isNaN(smin2)) {
          var min2 = parseFloat(smin2);
          if (n < min2) {
            var minLabel = ui_1.getLabel(ctrl2);
            var msg = r.format(r.value('error_min'), label, minLabel);
            addErrorMessage(ctrl, msg);
            return false;
          }
        }
      }
    }
  }
  else if (resources_1.resources.dateService && datatype2 === 'date' && value !== '') {
    var dateFormat = ctrl.getAttribute('date-format');
    if (!dateFormat || dateFormat.length === 0) {
      dateFormat = ctrl.getAttribute('uib-datepicker-popup');
    }
    if (!dateFormat || dateFormat.length === 0) {
      dateFormat = ctrl.getAttribute('datepicker-popup');
    }
    var date = resources_1.resources.dateService.parse(value, dateFormat);
    if (!date) {
      var msg = r.format(r.value('error_date'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
    else {
      var maxdate = ctrl.getAttribute('max');
      var mindate = ctrl.getAttribute('min');
      if (maxdate !== null || mindate !== null) {
        if (maxdate !== null) {
          var strDate = null;
          var dmaxdate = null;
          if (maxdate.startsWith('\'') || maxdate.startsWith('"')) {
            strDate = maxdate.substring(1, maxdate.length - 1);
            dmaxdate = new Date(strDate);
          }
          if (dmaxdate !== null && date > dmaxdate) {
            var msg = r.format(r.value('error_max_date'), label);
            addErrorMessage(ctrl, msg);
            return false;
          }
        }
        if (mindate !== null) {
          var strDate = null;
          var dmindate = null;
          if (mindate.startsWith('\'') || mindate.startsWith('"')) {
            strDate = mindate.substring(1, mindate.length - 1);
            dmindate = new Date(strDate);
          }
          if (dmindate !== null && date < dmindate) {
            var msg = r.format(r.value('error_min_date'), label);
            addErrorMessage(ctrl, msg);
            return false;
          }
        }
      }
    }
  }
  else if (datatype2 === 'url') {
    if (!validation_util_1.isUrl(value)) {
      var msg = r.format(r.value('error_url'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  else if (datatype2 === 'phone') {
    var phoneStr = formatter_1.formatter.removePhoneFormat(value);
    if (!validation_util_1.tel.isPhone(phoneStr)) {
      var msg = r.format(r.value('error_phone'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  else if (datatype2 === 'fax') {
    var phoneStr = formatter_1.formatter.removeFaxFormat(value);
    if (!validation_util_1.tel.isFax(phoneStr)) {
      var msg = r.format(r.value('error_fax'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  else if (datatype2 === 'code') {
    if (!validation_util_1.isValidCode(value)) {
      var msg = r.format(r.value('error_code'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  else if (datatype2 === 'dash-code') {
    if (!validation_util_1.isDashCode(value)) {
      var msg = r.format(r.value('error_dash_code'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  else if (datatype2 === 'digit') {
    if (!validation_util_1.isDigitOnly(value)) {
      var msg = r.format(r.value('error_digit'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  else if (datatype2 === 'dash-digit') {
    if (!validation_util_1.isDashDigit(value)) {
      var msg = r.format(r.value('error_dash_digit'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  else if (datatype2 === 'routing-number') {
    if (!validation_util_1.isDashDigit(value)) {
      var msg = r.format(r.value('error_routing_number'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  else if (datatype2 === 'check-number') {
    if (!validation_util_1.isCheckNumber(value)) {
      var msg = r.format(r.value('error_check_number'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  else if (datatype2 === 'post-code') {
    var countryCode = ctrl.getAttribute('country-code');
    if (countryCode) {
      countryCode = countryCode.toUpperCase();
      if (countryCode === 'US' || countryCode === 'USA') {
        if (!validation_util_1.isUSPostalCode(value)) {
          var msg = r.format(r.value('error_us_post_code'), label);
          addErrorMessage(ctrl, msg);
          return false;
        }
      }
      else if (countryCode === 'CA' || countryCode === 'CAN') {
        if (!validation_util_1.isCAPostalCode(value)) {
          var msg = r.format(r.value('error_ca_post_code'), label);
          addErrorMessage(ctrl, msg);
          return false;
        }
      }
      else {
        if (!validation_util_1.isDashCode(value)) {
          var msg = r.format(r.value('error_post_code'), label);
          addErrorMessage(ctrl, msg);
          return false;
        }
      }
    }
  }
  else if (datatype2 === 'ipv4') {
    if (!validation_util_1.isIPv4(value)) {
      var msg = r.format(r.value('error_ipv4'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  else if (datatype2 === 'ipv6') {
    if (!validation_util_1.isIPv6(value)) {
      var msg = r.format(r.value('error_ipv6'), label);
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  removeErrorMessage(ctrl);
  return true;
}
exports.validateElement = validateElement;
function setValidControl(ctrl) {
  if (!ctrl.classList.contains('valid')) {
    ctrl.classList.add('valid');
  }
  ctrl.classList.remove('md-input-invalid');
  ctrl.classList.remove('ng-invalid');
  ctrl.classList.remove('invalid');
  ctrl.classList.remove('ng-touched');
  var parent = ui_1.container(ctrl);
  if (parent != null) {
    if (!parent.classList.contains('valid')) {
      parent.classList.add('valid');
    }
    parent.classList.remove('valid');
    parent.classList.remove('invalid');
    parent.classList.remove('md-input-invalid');
    var span = parent.querySelector('.span-error');
    if (span !== null && span !== undefined) {
      parent.removeChild(span);
    }
  }
}
exports.setValidControl = setValidControl;
function addErrorMessage(ctrl, msg) {
  if (!ctrl) {
    return;
  }
  if (!ctrl.classList.contains('invalid')) {
    ctrl.classList.add('invalid');
  }
  if (!ctrl.classList.contains('ng-touched')) {
    ctrl.classList.add('ng-touched');
  }
  var parrent = ui_1.container(ctrl);
  if (parrent === null) {
    return;
  }
  if (parrent.nodeName && parrent.nodeName === 'LABEL' && !parrent.classList.contains('invalid')) {
    parrent.classList.add('invalid');
  }
  else if (parrent.classList.contains('form-group') && !parrent.classList.contains('invalid')) {
    parrent.classList.add('invalid');
  }
  else if (parrent.nodeName === 'MD-INPUT-CONTAINER' && !parrent.classList.contains('md-input-invalid')) {
    parrent.classList.add('md-input-invalid');
  }
  var span = parrent.querySelector('.span-error');
  if (span) {
    if (span.innerHTML !== msg) {
      span.innerHTML = msg;
    }
  }
  else {
    var spanError = document.createElement('span');
    spanError.classList.add('span-error');
    spanError.innerHTML = msg;
    parrent.appendChild(spanError);
  }
}
exports.addErrorMessage = addErrorMessage;
function removeFormError(form) {
  if (form) {
    var len = form.length;
    for (var i = 0; i < len; i++) {
      var ctrl = form[i];
      removeErrorMessage(ctrl);
    }
  }
}
exports.removeFormError = removeFormError;
function removeErrorMessage(ctrl) {
  if (!ctrl) {
    return;
  }
  ctrl.classList.remove('valid');
  ctrl.classList.remove('md-input-invalid');
  ctrl.classList.remove('ng-invalid');
  ctrl.classList.remove('invalid');
  ctrl.classList.remove('ng-touched');
  var parent = ui_1.container(ctrl);
  if (parent != null) {
    parent.classList.remove('valid');
    parent.classList.remove('invalid');
    parent.classList.remove('md-input-invalid');
    var span = parent.querySelector('.span-error');
    if (span !== null && span !== undefined) {
      parent.removeChild(span);
    }
  }
}
exports.removeErrorMessage = removeErrorMessage;
function buildErrorMessage(errors) {
  if (!errors || errors.length === 0) {
    return '';
  }
  var sb = new Array();
  for (var i = 0; i < errors.length; i++) {
    sb.push(escape(errors[i].message));
    if (i < errors.length - 1) {
      sb.push('<br />');
    }
  }
  return sb.join('');
}
exports.buildErrorMessage = buildErrorMessage;
function escape(text) {
  if (text.indexOf('&') >= 0) {
    text = text.replace(_r3, '&amp;');
  }
  if (text.indexOf('>') >= 0) {
    text = text.replace(_r4, '&gt;');
  }
  if (text.indexOf('<') >= 0) {
    text = text.replace(_r5, '&lt;');
  }
  return text;
}
