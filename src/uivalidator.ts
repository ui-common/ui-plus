import {
  isCAPostalCode,
  isCheckNumber,
  isDashCode,
  isDashDigit,
  isDigitOnly,
  isEmail,
  isIPv4,
  isIPv6,
  isUrl,
  isUSPostalCode,
  isValidCode,
  isValidPattern,
  tel,
} from "validation-core"
import { formatter } from "./formatter"
import { Locale, resources } from "./resources"
import { element, getParentByNodeNameOrDataField } from "./ui"

export interface ErrorMessage {
  field: string
  code: string
  message?: string
}
const r1 = / |,|\$|€|£|¥|'|٬|،| /g
const r2 = / |\.|\$|€|£|¥|'|٬|،| /g
const r3 = new RegExp("&", "gi")
const r4 = new RegExp(">", "gi")
const r5 = new RegExp("<", "gi")

export function isValidForm(form: HTMLFormElement, focusFirst?: boolean, scroll?: boolean): boolean {
  const valid = true
  let i = 0
  const len = form.length
  for (i = 0; i < len; i++) {
    const ctrl = form[i] as HTMLInputElement
    const parent = ctrl.parentElement
    if (ctrl.classList.contains("invalid") || ctrl.classList.contains("ng-invalid") || (parent && parent.classList.contains("invalid"))) {
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
export function validateForm(form?: HTMLFormElement, locale?: Locale, focusFirst?: boolean, scroll?: boolean, includeReadOnly?: boolean): boolean {
  if (!form) {
    return true
  }
  let valid = true
  let errorCtrl: HTMLInputElement | null = null
  let i = 0
  const len = form.length
  for (i = 0; i < len; i++) {
    const ctrl = form[i] as HTMLInputElement
    let type = ctrl.getAttribute("type")
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
export function showFormError(
  form?: HTMLFormElement,
  errors?: ErrorMessage[],
  focusFirst?: boolean,
  directParent?: boolean,
  includeId?: boolean,
): ErrorMessage[] {
  if (!form || !errors || errors.length === 0) {
    return []
  }
  let errorCtrl: HTMLInputElement | null = null
  const errs: ErrorMessage[] = []
  const length = errors.length
  const len = form.length

  for (let i = 0; i < length; i++) {
    let hasControl = false
    for (let j = 0; j < len; j++) {
      const ctrl = form[j] as HTMLInputElement
      const dataField = ctrl.getAttribute("data-field")
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
        const ctrl = document.getElementById(errors[i].field)
        if (ctrl) {
          addErrorMessage(ctrl as HTMLInputElement, errors[i].message, directParent)
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
export function validateElements(controls: HTMLInputElement[], locale?: Locale): boolean {
  let valid = true
  let errorCtrl: HTMLInputElement | null = null
  for (const c of controls) {
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
export function checkRequired(ctrl: HTMLInputElement, label?: string): boolean {
  const value = ctrl.value
  let required = ctrl.getAttribute("config-required")
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
        label = resources.label(ctrl)
      }
      const errorKey = ctrl.nodeName === "SELECT" ? "error_select_required" : "error_required"
      const r = resources.resource
      let s = r.value(errorKey)
      if (!s || s === "") {
        s = r.value("error_required")
      }
      const msg = r.format(s, label)
      addErrorMessage(ctrl, msg)
      return true
    }
  }
  return false
}
export function checkMaxLength(ctrl: HTMLInputElement, label?: string): boolean {
  const maxlength = ctrl.getAttribute("maxlength")
  if (maxlength && !isNaN(maxlength as any)) {
    const value = ctrl.value
    const imaxlength = parseInt(maxlength, 10)
    if (value.length > imaxlength) {
      const r = resources.resource
      if (!label || label === "") {
        label = resources.label(ctrl)
      }
      const msg = r.format(r.value("error_maxlength"), label, maxlength)
      addErrorMessage(ctrl, msg)
      return true
    }
  }
  return false
}

export function checkMinLength(ctrl: HTMLInputElement, label?: string): boolean {
  const minlength = ctrl.getAttribute("minlength")
  if (minlength !== null && !isNaN(minlength as any)) {
    const value = ctrl.value
    const iminlength = parseInt(minlength, 10)
    if (value.length < iminlength) {
      const r = resources.resource
      if (!label || label === "") {
        label = resources.label(ctrl)
      }
      const msg = r.format(r.value("error_minlength"), label, minlength)
      addErrorMessage(ctrl, msg)
      return true
    }
  }
  return false
}
export function validateElement(ctrl: HTMLInputElement, locale?: Locale, includeReadOnly?: boolean): boolean {
  if (!ctrl) {
    return true
  }

  if (!ctrl || (ctrl.readOnly && includeReadOnly === false) || ctrl.disabled || ctrl.hidden || ctrl.style.display === "none") {
    return true
  }
  let nodeName = ctrl.nodeName
  if (nodeName === "INPUT") {
    const type = ctrl.getAttribute("type")
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

  const parent = resources.container(ctrl)
  if (parent) {
    if (parent.hidden || parent.style.display === "none") {
      return true
    } else {
      const p = getParentByNodeNameOrDataField(parent, "SECTION")
      if (p && (p.hidden || p.style.display === "none")) {
        return true
      }
    }
  }

  let value = ctrl.value

  const l = resources.label(ctrl)
  if (checkRequired(ctrl, l)) {
    return false
  }

  if (!value || value === "") {
    return true
  }
  const r = resources.resource
  if (checkMaxLength(ctrl, l)) {
    return false
  }
  if (checkMinLength(ctrl, l)) {
    return false
  }
  const minlength = ctrl.getAttribute("minlength")
  if (minlength !== null && !isNaN(minlength as any)) {
    const iminlength = parseInt(minlength, 10)
    if (value.length < iminlength) {
      const msg = r.format(r.value("error_minlength"), l, minlength)
      addErrorMessage(ctrl, msg)
      return false
    }
  }
  let ctype = ctrl.getAttribute("type")
  if (ctype) {
    ctype = ctype.toLowerCase()
  }
  let datatype2 = ctrl.getAttribute("data-type")
  let pattern = ctrl.getAttribute("config-pattern")
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
    let flags = ctrl.getAttribute("config-pattern-flags")
    if (!flags) {
      flags = ctrl.getAttribute("flags")
    }
    if (!flags) {
      flags = ctrl.getAttribute("pattern-flags")
    }
    if (!isValidPattern(value, pattern, flags)) {
      const resource_key = ctrl.getAttribute("resource-key") || ctrl.getAttribute("config-pattern-error-key")
      if (resource_key) {
        const msg = r.format(r.value(resource_key), l)
        addErrorMessage(ctrl, msg)
      } else {
        addErrorMessage(ctrl, "Pattern error")
      }
      return false
    }
  }
  if (datatype2 === "email") {
    if (value.length > 0 && !isEmail(value)) {
      const msg = r.format(r.value("error_email"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "number" || datatype2 === "int" || datatype2 === "currency" || datatype2 === "string-currency" || datatype2 === "percentage") {
    if (datatype2 === "currency" || datatype2 === "string-currency") {
      let currencyCode = ctrl.getAttribute("currency-code")
      if (!currencyCode && ctrl.form) {
        currencyCode = ctrl.form.getAttribute("currency-code")
      }
      if (currencyCode && resources.currency && currencyCode.length > 0) {
        const currency = resources.currency(currencyCode)
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
    if (isNaN(value as any)) {
      const msg = r.format(r.value("error_number"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
    if (datatype2 === "int" && !isDigitOnly(value)) {
      const msg = r.format(r.value("error_number"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
    const n = parseFloat(value)
    const smin = ctrl.getAttribute("min")
    let min: number | undefined
    if (smin !== null && smin.length > 0) {
      min = parseFloat(smin)
      if (n < min) {
        let msg = r.format(r.value("error_min"), l, min)
        const smaxd = ctrl.getAttribute("max")
        if (smaxd !== null && smaxd.length > 0) {
          const maxd = parseFloat(smaxd)
          if (maxd === min) {
            msg = r.format(r.value("error_equal"), l, maxd)
          }
        }
        addErrorMessage(ctrl, msg)
        return false
      }
    }
    const smax = ctrl.getAttribute("max")
    if (smax !== null && smax.length > 0) {
      const max = parseFloat(smax)
      if (n > max) {
        let msg = r.format(r.value("error_max"), l, max)
        if (!min && max === min) {
          msg = r.format(r.value("error_equal"), l)
        }
        addErrorMessage(ctrl, msg)
        return false
      }
    }
    const minField = ctrl.getAttribute("min-field")
    if (minField && ctrl.form) {
      const ctrl2 = element(ctrl.form, minField)
      if (ctrl2) {
        let smin2 = ctrl2.value // const smin2 = ctrl2.value.replace(UIValidationUtil._nreg, '');
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
        if (smin2.length > 0 && !isNaN(smin2 as any)) {
          const min2 = parseFloat(smin2)
          if (n < min2) {
            const minLabel = resources.label(ctrl2)
            const msg = r.format(r.value("error_min"), l, minLabel)
            addErrorMessage(ctrl, msg)
            return false
          }
        }
      }
    }
  } else if (ctype === "date" || ctype === "datetime-local") {
    const v = new Date(ctrl.value)
    if (!isNaN(v.getTime())) {
      const smin = ctrl.getAttribute("min")
      if (smin && smin.length > 0) {
        if (smin === "now") {
          const d = new Date()
          if (v < d) {
            const msg = r.format(r.value("error_from_now"), l)
            addErrorMessage(ctrl, msg)
            return false
          }
        } else if (smin === "tomorrow") {
          const d = addDays(trimTime(new Date()), 1)
          if (v < d) {
            const msg = r.format(r.value("error_from_tomorrow"), l)
            addErrorMessage(ctrl, msg)
            return false
          }
        } else {
          const d = new Date(smin)
          if (!isNaN(d.getTime())) {
            if (v < d) {
              const v2 = formatLongDateTime(d, "YYYY-MM-DD")
              const msg = r.format(r.value("error_from"), l, v2)
              addErrorMessage(ctrl, msg)
              return false
            }
          }
        }
      }
      const smax = ctrl.getAttribute("max")
      if (smax && smax.length > 0) {
        if (smax === "now") {
          const d = new Date()
          if (v > d) {
            const msg = r.format(r.value("error_after_now"), l)
            addErrorMessage(ctrl, msg)
            return false
          }
        } else if (smax === "tomorrow") {
          const d = addDays(trimTime(new Date()), 1)
          if (v > d) {
            const msg = r.format(r.value("error_after_tomorrow"), l)
            addErrorMessage(ctrl, msg)
            return false
          }
        } else {
          const d = new Date(smax)
          if (!isNaN(d.getTime())) {
            if (v > d) {
              const v2 = formatLongDateTime(d, "YYYY-MM-DD")
              const msg = r.format(r.value("error_after"), l, v2)
              addErrorMessage(ctrl, msg)
              return false
            }
          }
        }
      }
      const minField = ctrl.getAttribute("min-field")
      if (minField && ctrl.form) {
        const ctrl2 = element(ctrl.form, minField)
        if (ctrl2 && ctrl2.value.length > 0) {
          const mi = new Date(ctrl2.value)
          if (v < mi) {
            const minLabel = resources.label(ctrl2)
            const msg = r.format(r.value("error_min"), l, minLabel)
            addErrorMessage(ctrl, msg)
            return false
          }
        }
      }
      const afterField = ctrl.getAttribute("after-field")
      if (afterField && ctrl.form) {
        const ctrl2 = element(ctrl.form, afterField)
        if (ctrl2 && ctrl2.value.length > 0) {
          const mi = new Date(ctrl2.value)
          if (v <= mi) {
            const minLabel = resources.label(ctrl2)
            const msg = r.format(r.value("error_after"), l, minLabel)
            addErrorMessage(ctrl, msg)
            return false
          }
        }
      }
    }
  } else if (resources.date && datatype2 === "date" && value !== "") {
    let dateFormat: string | null = ctrl.getAttribute("date-format")
    if (!dateFormat || dateFormat.length === 0) {
      dateFormat = ctrl.getAttribute("uib-datepicker-popup")
    }
    if (!dateFormat || dateFormat.length === 0) {
      dateFormat = ctrl.getAttribute("datepicker-popup")
    } /*
    if (!dateFormat || dateFormat.length === 0) {
      dateFormat = 'MM/DD/YYYY';
    }*/
    // const isDate = moment(value, dateFormat.toUpperCase(), true).isValid(); // DateUtil.isDate(value, dateFormat);
    if (!dateFormat) {
      dateFormat = "MM/DD/YYYY"
    }
    const dt = resources.date(value, dateFormat) // moment(value, dateFormat).toDate(); // DateUtil.parse(value, dateFormat);
    if (!dt) {
      // (isDate === false) {
      const msg = r.format(r.value("error_date"), l)
      addErrorMessage(ctrl, msg)
      return false
    } else {
      const maxdate = ctrl.getAttribute("max")
      const mindate = ctrl.getAttribute("min")
      if (maxdate !== null || mindate !== null) {
        if (maxdate !== null) {
          let dmaxdate: Date | undefined
          if (maxdate.startsWith("'") || maxdate.startsWith('"')) {
            const strDate = maxdate.substring(1, maxdate.length - 1)
            dmaxdate = new Date(strDate) // DateUtil.parse(strDate, 'yyyy-MM-dd');
          }
          if (dmaxdate && dt > dmaxdate) {
            const msg = r.format(r.value("error_max_date"), l)
            addErrorMessage(ctrl, msg)
            return false
          }
        }
        if (mindate !== null) {
          let dmindate: Date | undefined
          if (mindate.startsWith("'") || mindate.startsWith('"')) {
            const strDate = mindate.substring(1, mindate.length - 1)
            dmindate = new Date(strDate) // DateUtil.parse(strDate, 'yyyy-MM-dd');
          }
          if (dmindate && dt < dmindate) {
            const msg = r.format(r.value("error_min_date"), l)
            addErrorMessage(ctrl, msg)
            return false
          }
        }
      }
    }
  } else if (datatype2 === "url") {
    if (!isUrl(value)) {
      const msg = r.format(r.value("error_url"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "phone") {
    const phoneStr = formatter.removePhoneFormat(value)
    if (!tel.isPhone(phoneStr)) {
      const msg = r.format(r.value("error_phone"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "fax") {
    const phoneStr = formatter.removeFaxFormat(value)
    if (!tel.isFax(phoneStr)) {
      const msg = r.format(r.value("error_fax"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "code") {
    if (!isValidCode(value)) {
      const msg = r.format(r.value("error_code"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "dash-code") {
    if (!isDashCode(value)) {
      const msg = r.format(r.value("error_dash_code"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "digit") {
    if (!isDigitOnly(value)) {
      const msg = r.format(r.value("error_digit"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "dash-digit") {
    if (!isDashDigit(value)) {
      const msg = r.format(r.value("error_dash_digit"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "routing-number") {
    // business-tax-id
    if (!isDashDigit(value)) {
      const msg = r.format(r.value("error_routing_number"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "check-number") {
    if (!isCheckNumber(value)) {
      const msg = r.format(r.value("error_check_number"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "post-code") {
    let countryCode = ctrl.getAttribute("country-code")
    if (countryCode) {
      countryCode = countryCode.toUpperCase()
      if (countryCode === "US" || countryCode === "USA") {
        if (!isUSPostalCode(value)) {
          const msg = r.format(r.value("error_us_post_code"), l)
          addErrorMessage(ctrl, msg)
          return false
        }
      } else if (countryCode === "CA" || countryCode === "CAN") {
        if (!isCAPostalCode(value)) {
          const msg = r.format(r.value("error_ca_post_code"), l)
          addErrorMessage(ctrl, msg)
          return false
        }
      } else {
        if (!isDashCode(value)) {
          const msg = r.format(r.value("error_post_code"), l)
          addErrorMessage(ctrl, msg)
          return false
        }
      }
    }
  } else if (datatype2 === "ipv4") {
    if (!isIPv4(value)) {
      const msg = r.format(r.value("error_ipv4"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  } else if (datatype2 === "ipv6") {
    if (!isIPv6(value)) {
      const msg = r.format(r.value("error_ipv6"), l)
      addErrorMessage(ctrl, msg)
      return false
    }
  }
  removeError(ctrl)
  return true
}
export function setValidControl(ctrl: HTMLInputElement): void {
  if (!ctrl.classList.contains("valid")) {
    ctrl.classList.add("valid")
  }
  ctrl.classList.remove("md-input-invalid")
  ctrl.classList.remove("ng-invalid")
  ctrl.classList.remove("invalid")
  ctrl.classList.remove("ng-touched")

  const parent = resources.container(ctrl)
  if (parent != null) {
    if (!parent.classList.contains("valid")) {
      parent.classList.add("valid")
    }
    parent.classList.remove("valid")
    parent.classList.remove("invalid")
    parent.classList.remove("md-input-invalid")
    const span = parent.querySelector(".span-error")
    if (span !== null && span !== undefined) {
      parent.removeChild(span)
    }
  }
}
export function addError(form: HTMLFormElement, name: string, msg: string, directParent?: boolean): boolean {
  const len = form.length
  for (let i = 0; i < len; i++) {
    const ctrl = form[i] as HTMLInputElement
    const nameAttr = ctrl.getAttribute("name")
    const idAttr = ctrl.getAttribute("id")
    const dataAttr = ctrl.getAttribute("data-field")
    if (name && (nameAttr === name || idAttr === name || dataAttr === name)) {
      addErrorMessage(ctrl, msg, directParent)
      return true
    }
  }
  return false
}
export function removeErr(form: HTMLFormElement, name: string, directParent?: boolean): boolean {
  const len = form.length
  for (let i = 0; i < len; i++) {
    const ctrl = form[i] as HTMLInputElement
    const nameAttr = ctrl.getAttribute("name")
    const idAttr = ctrl.getAttribute("id")
    const dataAttr = ctrl.getAttribute("data-field")
    if (name && (nameAttr === name || idAttr === name || dataAttr === "name")) {
      removeError(ctrl, directParent)
      return true
    }
  }
  return false
}
export function addErrorMessage(ctrl: HTMLInputElement, msg?: string, directParent?: boolean): void {
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
  const parent = directParent ? ctrl.parentElement : resources.container(ctrl)
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

  const span = parent.querySelector(".span-error")

  if (span) {
    if (span.innerHTML !== msg) {
      span.innerHTML = msg
    }
  } else {
    const spanError = document.createElement("span")
    spanError.classList.add("span-error")
    spanError.innerHTML = msg
    parent.appendChild(spanError)
  }
}

export function removeFormError(form: HTMLFormElement): void {
  if (form) {
    const len = form.length
    for (let i = 0; i < len; i++) {
      const ctrl = form[i] as HTMLInputElement
      removeError(ctrl)
    }
  }
}
export const removeErrors = (ids?: string | string[]) => {
  if (!ids) return
  if (Array.isArray(ids)) {
    ids.forEach((id) => {
      const ctrls = document.getElementsByName(id)
      if (ctrls.length > 0) {
        const ctrl = ctrls[0] as HTMLInputElement
        if (ctrl) {
          removeError(ctrl)
        }
      } else {
        const ctrlId = document.getElementById(id) as HTMLInputElement
        if (ctrlId) {
          removeError(ctrlId)
        }
      }
    })
  } else {
    const ctrls = document.getElementsByName(ids)
    if (ctrls.length > 0) {
      const ctrl = ctrls[0] as HTMLInputElement
      if (ctrl) {
        removeError(ctrl)
      }
    } else {
      const ctrlId = document.getElementById(ids) as HTMLInputElement
      if (ctrlId) {
        removeError(ctrlId)
      }
    }
  }
}
export function removeError(ctrl: HTMLInputElement, directParent?: boolean): void {
  if (!ctrl) {
    return
  }
  ctrl.classList.remove("valid")
  ctrl.classList.remove("md-input-invalid")
  ctrl.classList.remove("ng-invalid")
  ctrl.classList.remove("invalid")
  ctrl.classList.remove("ng-touched")

  const parent = directParent ? ctrl.parentElement : resources.container(ctrl)
  if (parent != null) {
    parent.classList.remove("valid")
    parent.classList.remove("invalid")
    parent.classList.remove("md-input-invalid")
    const span = parent.querySelector(".span-error")
    if (span !== null && span !== undefined) {
      parent.removeChild(span)
    }
  }
}

export function buildErrorMessage(errors: ErrorMessage[]): string {
  if (!errors || errors.length === 0) {
    return ""
  }
  const sb = new Array()
  for (let i = 0; i < errors.length; i++) {
    sb.push(escape(errors[i].message))
    if (i < errors.length - 1) {
      sb.push("<br />")
    }
  }
  return sb.join("")
}

export function escape(text?: string): string {
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

export function trimTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
export function trimMinutes(d: Date | string): Date {
  const t = new Date(d)
  t.setMinutes(0)
  t.setSeconds(0)
  t.setMilliseconds(0)
  return t
}
export function addYears(date: Date, n: number) {
  const newDate = new Date(date)
  newDate.setFullYear(newDate.getFullYear() + n)
  return newDate
}
export function addMonths(date: Date, n: number) {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + n)
  return newDate
}
export function addHours(date: Date, n: number) {
  const newDate = new Date(date)
  newDate.setHours(newDate.getHours() + n)
  return newDate
}
export function addDays(d: Date, n: number): Date {
  const newDate = new Date(d)
  newDate.setDate(newDate.getDate() + n)
  return newDate
}
export function addSeconds(d: Date, n: number): Date {
  const newDate = new Date(d)
  newDate.setSeconds(newDate.getSeconds() + n)
  return newDate
}
export function createDate(s: string): Date | undefined {
  return s.length === 0 ? undefined : new Date(s)
}
export function formatDate(d: Date | null | undefined, dateFormat?: string, full?: boolean, upper?: boolean): string {
  if (!d) {
    return ""
  }
  let format = dateFormat && dateFormat.length > 0 ? dateFormat : "M/D/YYYY"
  if (upper) {
    format = format.toUpperCase()
  }
  let arr = ["", "", ""]
  const items = format.split(/\/|\.| |-/)
  let iday = items.indexOf("D")
  let im = items.indexOf("M")
  let iyear = items.indexOf("YYYY")
  let fm = full ? full : false
  let fd = full ? full : false
  let fy = true
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
  const s = detectSeparator(format)
  const e = detectLastSeparator(format)
  const l = items.length === 4 ? format[format.length - 1] : ""
  return arr[0] + s + arr[1] + e + arr[2] + l
}
function detectSeparator(format: string): string {
  const len = format.length
  for (let i = 0; i < len; i++) {
    const c = format[i]
    if (!((c >= "A" && c <= "Z") || (c >= "a" && c <= "z"))) {
      return c
    }
  }
  return "/"
}
function detectLastSeparator(format: string): string {
  const len = format.length - 3
  for (let i = len; i > -0; i--) {
    const c = format[i]
    if (!((c >= "A" && c <= "Z") || (c >= "a" && c <= "z"))) {
      return c
    }
  }
  return "/"
}
export function getYear(y: number, full?: boolean): string {
  if (full || (y <= 99 && y >= -99)) {
    return y.toString()
  }
  const s = y.toString()
  return s.substring(s.length - 2)
}
function getD(n: number, fu: boolean): string {
  return fu ? pad(n) : n.toString()
}
export function datetimeToString(date?: Date | string): string | undefined {
  if (!date || date === "") {
    return undefined
  }
  const d2 = typeof date !== "string" ? date : new Date(date)
  const year = d2.getFullYear()
  const month = pad(d2.getMonth() + 1)
  const day = pad(d2.getDate())
  const hours = pad(d2.getHours())
  const minutes = pad(d2.getMinutes())
  const seconds = pad(d2.getSeconds())
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}
export function formatDateTime(date: Date | null | undefined, dateFormat?: string, full?: boolean, upper?: boolean): string {
  if (!date) {
    return ""
  }
  const sd = formatDate(date, dateFormat, full, upper)
  if (sd.length === 0) {
    return sd
  }
  return sd + " " + formatTime(date)
}
export function formatLongDateTime(date: Date | null | undefined, dateFormat?: string, full?: boolean, upper?: boolean): string {
  if (!date) {
    return ""
  }
  const sd = formatDate(date, dateFormat, full, upper)
  if (sd.length === 0) {
    return sd
  }
  return sd + " " + formatLongTime(date)
}
export function formatFullDateTime(date: Date | null | undefined, dateFormat?: string, s?: string, full?: boolean, upper?: boolean): string {
  if (!date) {
    return ""
  }
  const sd = formatDate(date, dateFormat, full, upper)
  if (sd.length === 0) {
    return sd
  }
  return sd + " " + formatFullTime(date, s)
}
export function formatTime(d: Date): string {
  return pad(d.getHours()) + ":" + pad(d.getMinutes())
}
export function formatLongTime(d: Date): string {
  return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds())
}
export function formatFullTime(d: Date, s?: string): string {
  const se = s && s.length > 0 ? s : "."
  return formatLongTime(d) + se + pad3(d.getMilliseconds())
}
export function dateToString(d: Date, milli?: boolean): string {
  const s = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  if (milli) {
    return s + pad3(d.getMilliseconds())
  }
  return s
}
function pad(n: number): string {
  return n < 10 ? "0" + n : n.toString()
}
function pad3(n: number): string {
  if (n >= 100) {
    return n.toString()
  }
  return n < 10 ? "00" + n : "0" + n.toString()
}
export interface Hour {
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}
const mi = 1000
const mu = 60000
const hr = 3600000
export function diffHours(d1: Date, d2: Date): Hour | undefined {
  if (!d1 || !d2) {
    return undefined
  }
  const d = Math.abs(d1.getTime() - d2.getTime())
  const ho = Math.floor(d / hr)
  const m = Math.floor((d % hr) / mu)
  const s = Math.floor((d % mu) / mi)
  const l = Math.floor(((d % hr) % mu) % mi)
  const dh: Hour = {
    hours: ho,
    minutes: m,
    seconds: s,
    milliseconds: l,
  }
  return dh
}
export function formatDiffHours(h: Hour, m?: boolean, s?: string): string {
  const d = `${h.hours}:${pad(h.minutes)}:${pad(h.seconds)}`
  if (m) {
    const se = s && s.length > 0 ? s : "."
    return d + se + pad3(h.milliseconds)
  }
  return d
}
export function diffHoursToString(d1: Date, d2: Date, m?: boolean, s?: string): string {
  const d = diffHours(d1, d2)
  if (!d) {
    return ""
  }
  return formatDiffHours(d, m, s)
}
