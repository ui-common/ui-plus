"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
var validation_core_1 = require("validation-core")
var formatter_1 = require("./formatter")
var resources_1 = require("./resources")
var ui_1 = require("./ui")
var r1 = / |,|\$|€|£|¥|'|٬|،| /g
var r2 = / |\.|\$|€|£|¥|'|٬|،| /g
var r3 = new RegExp("&", "gi")
var r4 = new RegExp(">", "gi")
var r5 = new RegExp("<", "gi")
function isValidForm(form, focusFirst, scroll) {
  var valid = true
  var i = 0
  var len = form.length
  for (i = 0; i < len; i++) {
    var ctrl = form[i]
    var parent_1 = ctrl.parentElement
    if (ctrl.classList.contains("invalid") || ctrl.classList.contains("ng-invalid") || (parent_1 && parent_1.classList.contains("invalid"))) {
      if (!focusFirst) {
        focusFirst = true
      }
      if (ctrl && focusFirst) {
        ctrl.focus()
        if (scroll) {
          ctrl.scrollIntoView()
        }
      }
      return false
    }
  }
  return valid
}
exports.isValidForm = isValidForm
function validateForm(form, locale, focusFirst, scroll, includeReadOnly) {
  if (!form) {
    return true
  }
  var valid = true
  var errorCtrl = null
  var i = 0
  var len = form.length
  for (i = 0; i < len; i++) {
    var ctrl = form[i]
    var type = ctrl.getAttribute("type")
    if (type != null) {
      type = type.toLowerCase()
    }
    if (type === "checkbox" || type === "radio" || type === "submit" || type === "button" || type === "reset") {
      continue
    } else {
      if (!validateElement(ctrl, locale, includeReadOnly)) {
        valid = false
        if (!errorCtrl) {
          errorCtrl = ctrl
        }
      } else {
        removeError(ctrl)
      }
    }
  }
  if (!focusFirst) {
    focusFirst = true
  }
  if (errorCtrl !== null && focusFirst === true) {
    errorCtrl.focus()
    if (scroll === true) {
      errorCtrl.scrollIntoView()
    }
  }
  return valid
}
exports.validateForm = validateForm
function showFormError(form, errors, focusFirst, directParent, includeId) {
  if (!form || !errors || errors.length === 0) {
    return []
  }
  var errorCtrl = null
  var errs = []
  var length = errors.length
  var len = form.length
  for (var i = 0; i < length; i++) {
    var hasControl = false
    for (var j = 0; j < len; j++) {
      var ctrl = form[j]
      var dataField = ctrl.getAttribute("data-field")
      if (dataField === errors[i].field || ctrl.name === errors[i].field) {
        addErrorMessage(ctrl, errors[i].message, directParent)
        hasControl = true
        if (!errorCtrl) {
          errorCtrl = ctrl
        }
      }
    }
    if (hasControl === false) {
      if (includeId) {
        var ctrl = document.getElementById(errors[i].field)
        if (ctrl) {
          addErrorMessage(ctrl, errors[i].message, directParent)
        } else {
          errs.push(errors[i])
        }
      } else {
        errs.push(errors[i])
      }
    }
  }
  if (!focusFirst) {
    focusFirst = true
  }
  if (errorCtrl !== null && focusFirst === true) {
    errorCtrl.focus()
    errorCtrl.scrollIntoView()
  }
  return errs
}
exports.showFormError = showFormError
function validateElements(controls, locale) {
  var valid = true
  var errorCtrl = null
  for (var _i = 0, controls_1 = controls; _i < controls_1.length; _i++) {
    var c = controls_1[_i]
    if (!validateElement(c, locale)) {
      valid = false
      if (!errorCtrl) {
        errorCtrl = c
      }
    } else {
      removeError(c)
    }
  }
  if (errorCtrl !== null) {
    errorCtrl.focus()
    errorCtrl.scrollIntoView()
  }
  return valid
}
exports.validateElements = validateElements
function checkRequired(ctrl, label) {
  var value = ctrl.value
  var required = ctrl.getAttribute("config-required")
  if (required == null || required === undefined) {
    if (ctrl.nodeName === "SELECT") {
      required = ctrl.hasAttribute("required") ? "true" : "false"
    } else {
      required = ctrl.getAttribute("required")
    }
  }
  if (required !== null && required !== "false") {
    if (value.length === 0) {
      if (!label) {
        label = resources_1.resources.label(ctrl)
      }
      var errorKey = ctrl.nodeName === "SELECT" ? "error_select_required" : "error_required"
      var r = resources_1.resources.resource
      var s = r.value(errorKey)
      if (!s || s === "") {
        s = r.value("error_required")
      }
      var msg = r.format(s, label)
      addErrorMessage(ctrl, msg)
      return true
    }
  }
  return false
}
exports.checkRequired = checkRequired
function checkMaxLength(ctrl, label) {
  var maxlength = ctrl.getAttribute("maxlength")
  if (maxlength && !isNaN(maxlength)) {
    var value = ctrl.value
    var imaxlength = parseInt(maxlength, 10)
    if (value.length > imaxlength) {
      var r = resources_1.resources.resource
      if (!label || label === "") {
        label = resources_1.resources.label(ctrl)
      }
      var msg = r.format(r.value("error_maxlength"), label, maxlength)
      addErrorMessage(ctrl, msg)
      return true
    }
  }
  return false
}
exports.checkMaxLength = checkMaxLength
function checkMinLength(ctrl, label) {
  var minlength = ctrl.getAttribute("minlength")
  if (minlength !== null && !isNaN(minlength)) {
    var value = ctrl.value
    var iminlength = parseInt(minlength, 10)
    if (value.length < iminlength) {
      var r = resources_1.resources.resource
      if (!label || label === "") {
        label = resources_1.resources.label(ctrl)
      }
      var msg = r.format(r.value("error_minlength"), label, minlength)
      addErrorMessage(ctrl, msg)
      return true
    }
  }
  return false
}
exports.checkMinLength = checkMinLength
function validateElement(ctrl, locale, includeReadOnly) {
  if (!ctrl) {
    return true
  }
  if (!ctrl || (ctrl.readOnly && includeReadOnly === false) || ctrl.disabled || ctrl.hidden || ctrl.style.display === "none") {
    return true
  }
  var nodeName = ctrl.nodeName
  if (nodeName === "INPUT") {
    var type = ctrl.getAttribute("type")
    if (type !== null) {
      nodeName = type.toUpperCase()
    }
  }
  if (ctrl.tagName === "SELECT") {
    nodeName = "SELECT"
  }
  if (nodeName === "BUTTON" || nodeName === "RESET" || nodeName === "SUBMIT") {
    return true
  }
  var parent = resources_1.resources.container(ctrl)
  if (parent) {
    if (parent.hidden || parent.style.display === "none") {
      return true
    } else {
      var p = ui_1.getParentByNodeNameOrDataField(parent, "SECTION")
      if (p && (p.hidden || p.style.display === "none")) {
        return true
      }
    }
  }
  var value = ctrl.value
  var l = resources_1.resources.label(ctrl)
  if (checkRequired(ctrl, l)) {
    return false
  }
  if (!value || value === "") {
    return true
  }
  var r = resources_1.resources.resource
  if (checkMaxLength(ctrl, l)) {
    return false
  }
  if (checkMinLength(ctrl, l)) {
    return false
  }
  var minlength = ctrl.getAttribute("minlength")
  if (minlength !== null && !isNaN(minlength)) {
    var iminlength = parseInt(minlength, 10)
    if (value.length < iminlength) {
      var msg = r.format(r.value("error_minlength"), l, minlength)
      addErrorMessage(ctrl, msg)
      return false
    }
  }
  var ctype = ctrl.getAttribute("type")
  if (ctype) {
    ctype = ctype.toLowerCase()
  }
  var datatype2 = ctrl.getAttribute("data-type")
  var pattern = ctrl.getAttribute("config-pattern")
  if (!pattern) {
    pattern = ctrl.getAttribute("pattern")
  }
  if (ctype === "email") {
    datatype2 = "email"
  } else if (ctype === "url") {
    datatype2 = "url"
  } else if (!datatype2) {
    if (ctype === "number") {
      datatype2 = "number"
    } else if (ctype === "date" || ctype === "datetime-local") {
      datatype2 = "date"
    }
  }
  if (pattern) {
    var flags = ctrl.getAttribute("config-pattern-flags")
    if (!flags) {
      flags = ctrl.getAttribute("flags")
    }
    if (!flags) {
      flags = ctrl.getAttribute("pattern-flags")
    }
    if (!validation_core_1.isValidPattern(value, pattern, flags)) {
      var resource_key = ctrl.getAttribute("resource-key") || ctrl.getAttribute("config-pattern-error-key")
      if (resource_key) {
        var msg = r.format(r.value(resource_key), l)
        addErrorMessage(ctrl, msg)
      } else {
        addErrorMessage(ctrl, "Pattern error")
      }
      return false
    }
  }
  if (datatype2 === "email") {
    if (value.length > 0 && !validation_core_1.isEmail(value)) {
      var msg = r.format(r.value("error_email"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "number" || datatype2 === "int" || datatype2 === "currency" || datatype2 === "string-currency" || datatype2 === "percentage") {
    if (datatype2 === "currency" || datatype2 === "string-currency") {
      var currencyCode = ctrl.getAttribute("currency-code")
      if (!currencyCode && ctrl.form) {
        currencyCode = ctrl.form.getAttribute("currency-code")
      }
      if (currencyCode && resources_1.resources.currency && currencyCode.length > 0) {
        var currency = resources_1.resources.currency(currencyCode)
        if (currency && value.indexOf(currency.symbol) >= 0) {
          value = value.replace(currency.symbol, "")
        }
      }
    }
    if (locale && value.indexOf(locale.currencySymbol) >= 0) {
      value = value.replace(locale.currencySymbol, "")
    }
    if (locale && locale.decimalSeparator !== ".") {
      value = value.replace(r2, "")
      if (value.indexOf(locale.decimalSeparator) >= 0) {
        value = value.replace(locale.decimalSeparator, ".")
      }
    } else {
      value = value.replace(r1, "")
    }
    if (datatype2 === "percentage" && value.indexOf("%") >= 0) {
      value = value.replace("%", "")
    }
    if (isNaN(value)) {
      var msg = r.format(r.value("error_number"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
    if (datatype2 === "int" && !validation_core_1.isDigitOnly(value)) {
      var msg = r.format(r.value("error_number"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
    var n = parseFloat(value)
    var smin = ctrl.getAttribute("min")
    var min = void 0
    if (smin !== null && smin.length > 0) {
      min = parseFloat(smin)
      if (n < min) {
        var msg = r.format(r.value("error_min"), l, min)
        var smaxd = ctrl.getAttribute("max")
        if (smaxd !== null && smaxd.length > 0) {
          var maxd = parseFloat(smaxd)
          if (maxd === min) {
            msg = r.format(r.value("error_equal"), l, maxd)
          }
        }
        addErrorMessage(ctrl, msg)
        return false
      }
    }
    var smax = ctrl.getAttribute("max")
    if (smax !== null && smax.length > 0) {
      var max = parseFloat(smax)
      if (n > max) {
        var msg = r.format(r.value("error_max"), l, max)
        if (!min && max === min) {
          msg = r.format(r.value("error_equal"), l)
        }
        addErrorMessage(ctrl, msg)
        return false
      }
    }
    var minField = ctrl.getAttribute("min-field")
    if (minField && ctrl.form) {
      var ctrl2 = ui_1.element(ctrl.form, minField)
      if (ctrl2) {
        var smin2 = ctrl2.value
        if (locale && smin2.indexOf(locale.currencySymbol) >= 0) {
          smin2 = smin2.replace(locale.currencySymbol, "")
        }
        if (locale && locale.decimalSeparator !== ".") {
          smin2 = smin2.replace(r2, "")
          if (smin2.indexOf(locale.decimalSeparator) >= 0) {
            smin2 = smin2.replace(locale.decimalSeparator, ".")
          }
        } else {
          smin2 = smin2.replace(r1, "")
        }
        if (smin2.length > 0 && !isNaN(smin2)) {
          var min2 = parseFloat(smin2)
          if (n < min2) {
            var minLabel = resources_1.resources.label(ctrl2)
            var msg = r.format(r.value("error_min"), l, minLabel)
            addErrorMessage(ctrl, msg)
            return false
          }
        }
      }
    }
  } else if (ctype === "date" || ctype === "datetime-local") {
    var v = new Date(ctrl.value)
    if (!isNaN(v.getTime())) {
      var smin = ctrl.getAttribute("min")
      if (smin && smin.length > 0) {
        if (smin === "now") {
          var d = new Date()
          if (v < d) {
            var msg = r.format(r.value("error_from_now"), l)
            addErrorMessage(ctrl, msg)
            return false
          }
        } else if (smin === "tomorrow") {
          var d = addDays(trimTime(new Date()), 1)
          if (v < d) {
            var msg = r.format(r.value("error_from_tomorrow"), l)
            addErrorMessage(ctrl, msg)
            return false
          }
        } else {
          var d = new Date(smin)
          if (!isNaN(d.getTime())) {
            if (v < d) {
              var v2 = formatLongDateTime(d, "YYYY-MM-DD")
              var msg = r.format(r.value("error_from"), l, v2)
              addErrorMessage(ctrl, msg)
              return false
            }
          }
        }
      }
      var smax = ctrl.getAttribute("max")
      if (smax && smax.length > 0) {
        if (smax === "now") {
          var d = new Date()
          if (v > d) {
            var msg = r.format(r.value("error_after_now"), l)
            addErrorMessage(ctrl, msg)
            return false
          }
        } else if (smax === "tomorrow") {
          var d = addDays(trimTime(new Date()), 1)
          if (v > d) {
            var msg = r.format(r.value("error_after_tomorrow"), l)
            addErrorMessage(ctrl, msg)
            return false
          }
        } else {
          var d = new Date(smax)
          if (!isNaN(d.getTime())) {
            if (v > d) {
              var v2 = formatLongDateTime(d, "YYYY-MM-DD")
              var msg = r.format(r.value("error_after"), l, v2)
              addErrorMessage(ctrl, msg)
              return false
            }
          }
        }
      }
      var minField = ctrl.getAttribute("min-field")
      if (minField && ctrl.form) {
        var ctrl2 = ui_1.element(ctrl.form, minField)
        if (ctrl2 && ctrl2.value.length > 0) {
          var mi_1 = new Date(ctrl2.value)
          if (v < mi_1) {
            var minLabel = resources_1.resources.label(ctrl2)
            var msg = r.format(r.value("error_min"), l, minLabel)
            addErrorMessage(ctrl, msg)
            return false
          }
        }
      }
      var afterField = ctrl.getAttribute("after-field")
      if (afterField && ctrl.form) {
        var ctrl2 = ui_1.element(ctrl.form, afterField)
        if (ctrl2 && ctrl2.value.length > 0) {
          var mi_2 = new Date(ctrl2.value)
          if (v <= mi_2) {
            var minLabel = resources_1.resources.label(ctrl2)
            var msg = r.format(r.value("error_after"), l, minLabel)
            addErrorMessage(ctrl, msg)
            return false
          }
        }
      }
    }
  } else if (resources_1.resources.date && datatype2 === "date" && value !== "") {
    var dateFormat = ctrl.getAttribute("date-format")
    if (!dateFormat || dateFormat.length === 0) {
      dateFormat = ctrl.getAttribute("uib-datepicker-popup")
    }
    if (!dateFormat || dateFormat.length === 0) {
      dateFormat = ctrl.getAttribute("datepicker-popup")
    }
    if (!dateFormat) {
      dateFormat = "MM/DD/YYYY"
    }
    var dt = resources_1.resources.date(value, dateFormat)
    if (!dt) {
      var msg = r.format(r.value("error_date"), l)
      addErrorMessage(ctrl, msg)
      return false
    } else {
      var maxdate = ctrl.getAttribute("max")
      var mindate = ctrl.getAttribute("min")
      if (maxdate !== null || mindate !== null) {
        if (maxdate !== null) {
          var dmaxdate = void 0
          if (maxdate.startsWith("'") || maxdate.startsWith('"')) {
            var strDate = maxdate.substring(1, maxdate.length - 1)
            dmaxdate = new Date(strDate)
          }
          if (dmaxdate && dt > dmaxdate) {
            var msg = r.format(r.value("error_max_date"), l)
            addErrorMessage(ctrl, msg)
            return false
          }
        }
        if (mindate !== null) {
          var dmindate = void 0
          if (mindate.startsWith("'") || mindate.startsWith('"')) {
            var strDate = mindate.substring(1, mindate.length - 1)
            dmindate = new Date(strDate)
          }
          if (dmindate && dt < dmindate) {
            var msg = r.format(r.value("error_min_date"), l)
            addErrorMessage(ctrl, msg)
            return false
          }
        }
      }
    }
  } else if (datatype2 === "url") {
    if (!validation_core_1.isUrl(value)) {
      var msg = r.format(r.value("error_url"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "phone") {
    var phoneStr = formatter_1.formatter.removePhoneFormat(value)
    if (!validation_core_1.tel.isPhone(phoneStr)) {
      var msg = r.format(r.value("error_phone"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "fax") {
    var phoneStr = formatter_1.formatter.removeFaxFormat(value)
    if (!validation_core_1.tel.isFax(phoneStr)) {
      var msg = r.format(r.value("error_fax"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "code") {
    if (!validation_core_1.isValidCode(value)) {
      var msg = r.format(r.value("error_code"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "dash-code") {
    if (!validation_core_1.isDashCode(value)) {
      var msg = r.format(r.value("error_dash_code"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "digit") {
    if (!validation_core_1.isDigitOnly(value)) {
      var msg = r.format(r.value("error_digit"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "dash-digit") {
    if (!validation_core_1.isDashDigit(value)) {
      var msg = r.format(r.value("error_dash_digit"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "routing-number") {
    if (!validation_core_1.isDashDigit(value)) {
      var msg = r.format(r.value("error_routing_number"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "check-number") {
    if (!validation_core_1.isCheckNumber(value)) {
      var msg = r.format(r.value("error_check_number"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "post-code") {
    var countryCode = ctrl.getAttribute("country-code")
    if (countryCode) {
      countryCode = countryCode.toUpperCase()
      if (countryCode === "US" || countryCode === "USA") {
        if (!validation_core_1.isUSPostalCode(value)) {
          var msg = r.format(r.value("error_us_post_code"), l)
          addErrorMessage(ctrl, msg)
          return false
        }
      } else if (countryCode === "CA" || countryCode === "CAN") {
        if (!validation_core_1.isCAPostalCode(value)) {
          var msg = r.format(r.value("error_ca_post_code"), l)
          addErrorMessage(ctrl, msg)
          return false
        }
      } else {
        if (!validation_core_1.isDashCode(value)) {
          var msg = r.format(r.value("error_post_code"), l)
          addErrorMessage(ctrl, msg)
          return false
        }
      }
    }
  } else if (datatype2 === "ipv4") {
    if (!validation_core_1.isIPv4(value)) {
      var msg = r.format(r.value("error_ipv4"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "ipv6") {
    if (!validation_core_1.isIPv6(value)) {
      var msg = r.format(r.value("error_ipv6"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  }
  removeError(ctrl)
  return true
}
exports.validateElement = validateElement
function setValidControl(ctrl) {
  if (!ctrl.classList.contains("valid")) {
    ctrl.classList.add("valid")
  }
  ctrl.classList.remove("md-input-invalid")
  ctrl.classList.remove("ng-invalid")
  ctrl.classList.remove("invalid")
  ctrl.classList.remove("ng-touched")
  var parent = resources_1.resources.container(ctrl)
  if (parent != null) {
    if (!parent.classList.contains("valid")) {
      parent.classList.add("valid")
    }
    parent.classList.remove("valid")
    parent.classList.remove("invalid")
    parent.classList.remove("md-input-invalid")
    var span = parent.querySelector(".span-error")
    if (span !== null && span !== undefined) {
      parent.removeChild(span)
    }
  }
}
exports.setValidControl = setValidControl
function addError(form, name, msg, directParent) {
  var len = form.length
  for (var i = 0; i < len; i++) {
    var ctrl = form[i]
    var nameAttr = ctrl.getAttribute("name")
    var idAttr = ctrl.getAttribute("id")
    var dataAttr = ctrl.getAttribute("data-field")
    if (name && (nameAttr === name || idAttr === name || dataAttr === name)) {
      addErrorMessage(ctrl, msg, directParent)
      return true
    }
  }
  return false
}
exports.addError = addError
function removeErr(form, name, directParent) {
  var len = form.length
  for (var i = 0; i < len; i++) {
    var ctrl = form[i]
    var nameAttr = ctrl.getAttribute("name")
    var idAttr = ctrl.getAttribute("id")
    var dataAttr = ctrl.getAttribute("data-field")
    if (name && (nameAttr === name || idAttr === name || dataAttr === "name")) {
      removeError(ctrl, directParent)
      return true
    }
  }
  return false
}
exports.removeErr = removeErr
function addErrorMessage(ctrl, msg, directParent) {
  if (!ctrl) {
    return
  }
  if (!msg) {
    msg = "Error"
  }
  if (!ctrl.classList.contains("invalid")) {
    ctrl.classList.add("invalid")
  }
  if (!ctrl.classList.contains("ng-touched")) {
    ctrl.classList.add("ng-touched")
  }
  var parent = directParent ? ctrl.parentElement : resources_1.resources.container(ctrl)
  if (parent === null) {
    return
  }
  if (parent.nodeName && parent.nodeName === "LABEL" && !parent.classList.contains("invalid")) {
    parent.classList.add("invalid")
  } else if ((parent.classList.contains("form-group") || parent.classList.contains("field")) && !parent.classList.contains("invalid")) {
    parent.classList.add("invalid")
  } else if (parent.nodeName === "MD-INPUT-CONTAINER" && !parent.classList.contains("md-input-invalid")) {
    parent.classList.add("md-input-invalid")
  }
  var span = parent.querySelector(".span-error")
  if (span) {
    if (span.innerHTML !== msg) {
      span.innerHTML = msg
    }
  } else {
    var spanError = document.createElement("span")
    spanError.classList.add("span-error")
    spanError.innerHTML = msg
    parent.appendChild(spanError)
  }
}
exports.addErrorMessage = addErrorMessage
function removeFormError(form) {
  if (form) {
    var len = form.length
    for (var i = 0; i < len; i++) {
      var ctrl = form[i]
      removeError(ctrl)
    }
  }
}
exports.removeFormError = removeFormError
exports.removeErrors = function (ids) {
  if (!ids) return
  if (Array.isArray(ids)) {
    ids.forEach(function (id) {
      var ctrls = document.getElementsByName(id)
      if (ctrls.length > 0) {
        var ctrl = ctrls[0]
        if (ctrl) {
          removeError(ctrl)
        }
      } else {
        var ctrlId = document.getElementById(id)
        if (ctrlId) {
          removeError(ctrlId)
        }
      }
    })
  } else {
    var ctrls = document.getElementsByName(ids)
    if (ctrls.length > 0) {
      var ctrl = ctrls[0]
      if (ctrl) {
        removeError(ctrl)
      }
    } else {
      var ctrlId = document.getElementById(ids)
      if (ctrlId) {
        removeError(ctrlId)
      }
    }
  }
}
function removeError(ctrl, directParent) {
  if (!ctrl) {
    return
  }
  ctrl.classList.remove("valid")
  ctrl.classList.remove("md-input-invalid")
  ctrl.classList.remove("ng-invalid")
  ctrl.classList.remove("invalid")
  ctrl.classList.remove("ng-touched")
  var parent = directParent ? ctrl.parentElement : resources_1.resources.container(ctrl)
  if (parent != null) {
    parent.classList.remove("valid")
    parent.classList.remove("invalid")
    parent.classList.remove("md-input-invalid")
    var span = parent.querySelector(".span-error")
    if (span !== null && span !== undefined) {
      parent.removeChild(span)
    }
  }
}
exports.removeError = removeError
function buildErrorMessage(errors) {
  if (!errors || errors.length === 0) {
    return ""
  }
  var sb = new Array()
  for (var i = 0; i < errors.length; i++) {
    sb.push(escape(errors[i].message))
    if (i < errors.length - 1) {
      sb.push("<br />")
    }
  }
  return sb.join("")
}
exports.buildErrorMessage = buildErrorMessage
function escape(text) {
  if (!text) {
    return ""
  }
  if (text.indexOf("&") >= 0) {
    text = text.replace(r3, "&amp;")
  }
  if (text.indexOf(">") >= 0) {
    text = text.replace(r4, "&gt;")
  }
  if (text.indexOf("<") >= 0) {
    text = text.replace(r5, "&lt;")
  }
  return text
}
exports.escape = escape
function trimTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
exports.trimTime = trimTime
function trimMinutes(d) {
  var t = new Date(d)
  t.setMinutes(0)
  t.setSeconds(0)
  t.setMilliseconds(0)
  return t
}
exports.trimMinutes = trimMinutes
function addYears(date, n) {
  var newDate = new Date(date)
  newDate.setFullYear(newDate.getFullYear() + n)
  return newDate
}
exports.addYears = addYears
function addMonths(date, n) {
  var newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + n)
  return newDate
}
exports.addMonths = addMonths
function addHours(date, n) {
  var newDate = new Date(date)
  newDate.setHours(newDate.getHours() + n)
  return newDate
}
exports.addHours = addHours
function addDays(d, n) {
  var newDate = new Date(d)
  newDate.setDate(newDate.getDate() + n)
  return newDate
}
exports.addDays = addDays
function addSeconds(d, n) {
  var newDate = new Date(d)
  newDate.setSeconds(newDate.getSeconds() + n)
  return newDate
}
exports.addSeconds = addSeconds
function createDate(s) {
  return s.length === 0 ? undefined : new Date(s)
}
exports.createDate = createDate
function formatDate(d, dateFormat, full, upper) {
  if (!d) {
    return ""
  }
  var format = dateFormat && dateFormat.length > 0 ? dateFormat : "M/D/YYYY"
  if (upper) {
    format = format.toUpperCase()
  }
  var arr = ["", "", ""]
  var items = format.split(/\/|\.| |-/)
  var iday = items.indexOf("D")
  var im = items.indexOf("M")
  var iyear = items.indexOf("YYYY")
  var fm = full ? full : false
  var fd = full ? full : false
  var fy = true
  if (iday === -1) {
    iday = items.indexOf("DD")
    fd = true
  }
  if (im === -1) {
    im = items.indexOf("MM")
    fm = true
  }
  if (iyear === -1) {
    iyear = items.indexOf("YY")
    fy = full ? full : false
  }
  arr[iday] = getD(d.getDate(), fd)
  arr[im] = getD(d.getMonth() + 1, fm)
  arr[iyear] = getYear(d.getFullYear(), fy)
  var s = detectSeparator(format)
  var e = detectLastSeparator(format)
  var l = items.length === 4 ? format[format.length - 1] : ""
  return arr[0] + s + arr[1] + e + arr[2] + l
}
exports.formatDate = formatDate
function detectSeparator(format) {
  var len = format.length
  for (var i = 0; i < len; i++) {
    var c = format[i]
    if (!((c >= "A" && c <= "Z") || (c >= "a" && c <= "z"))) {
      return c
    }
  }
  return "/"
}
function detectLastSeparator(format) {
  var len = format.length - 3
  for (var i = len; i > -0; i--) {
    var c = format[i]
    if (!((c >= "A" && c <= "Z") || (c >= "a" && c <= "z"))) {
      return c
    }
  }
  return "/"
}
function getYear(y, full) {
  if (full || (y <= 99 && y >= -99)) {
    return y.toString()
  }
  var s = y.toString()
  return s.substring(s.length - 2)
}
exports.getYear = getYear
function getD(n, fu) {
  return fu ? pad(n) : n.toString()
}
function datetimeToString(date) {
  if (!date || date === "") {
    return undefined
  }
  var d2 = typeof date !== "string" ? date : new Date(date)
  var year = d2.getFullYear()
  var month = pad(d2.getMonth() + 1)
  var day = pad(d2.getDate())
  var hours = pad(d2.getHours())
  var minutes = pad(d2.getMinutes())
  var seconds = pad(d2.getSeconds())
  return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds
}
exports.datetimeToString = datetimeToString
function formatDateTime(date, dateFormat, full, upper) {
  if (!date) {
    return ""
  }
  var sd = formatDate(date, dateFormat, full, upper)
  if (sd.length === 0) {
    return sd
  }
  return sd + " " + formatTime(date)
}
exports.formatDateTime = formatDateTime
function formatLongDateTime(date, dateFormat, full, upper) {
  if (!date) {
    return ""
  }
  var sd = formatDate(date, dateFormat, full, upper)
  if (sd.length === 0) {
    return sd
  }
  return sd + " " + formatLongTime(date)
}
exports.formatLongDateTime = formatLongDateTime
function formatFullDateTime(date, dateFormat, s, full, upper) {
  if (!date) {
    return ""
  }
  var sd = formatDate(date, dateFormat, full, upper)
  if (sd.length === 0) {
    return sd
  }
  return sd + " " + formatFullTime(date, s)
}
exports.formatFullDateTime = formatFullDateTime
function formatTime(d) {
  return pad(d.getHours()) + ":" + pad(d.getMinutes())
}
exports.formatTime = formatTime
function formatLongTime(d) {
  return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds())
}
exports.formatLongTime = formatLongTime
function formatFullTime(d, s) {
  var se = s && s.length > 0 ? s : "."
  return formatLongTime(d) + se + pad3(d.getMilliseconds())
}
exports.formatFullTime = formatFullTime
function dateToString(d, milli) {
  var s = "" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds())
  if (milli) {
    return s + pad3(d.getMilliseconds())
  }
  return s
}
exports.dateToString = dateToString
function pad(n) {
  return n < 10 ? "0" + n : n.toString()
}
function pad3(n) {
  if (n >= 100) {
    return n.toString()
  }
  return n < 10 ? "00" + n : "0" + n.toString()
}
var mi = 1000
var mu = 60000
var hr = 3600000
function diffHours(d1, d2) {
  if (!d1 || !d2) {
    return undefined
  }
  var d = Math.abs(d1.getTime() - d2.getTime())
  var ho = Math.floor(d / hr)
  var m = Math.floor((d % hr) / mu)
  var s = Math.floor((d % mu) / mi)
  var l = Math.floor(((d % hr) % mu) % mi)
  var dh = {
    hours: ho,
    minutes: m,
    seconds: s,
    milliseconds: l,
  }
  return dh
}
exports.diffHours = diffHours
function formatDiffHours(h, m, s) {
  var d = h.hours + ":" + pad(h.minutes) + ":" + pad(h.seconds)
  if (m) {
    var se = s && s.length > 0 ? s : "."
    return d + se + pad3(h.milliseconds)
  }
  return d
}
exports.formatDiffHours = formatDiffHours
function diffHoursToString(d1, d2, m, s) {
  var d = diffHours(d1, d2)
  if (!d) {
    return ""
  }
  return formatDiffHours(d, m, s)
}
exports.diffHoursToString = diffHoursToString
