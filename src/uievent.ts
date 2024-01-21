import {isEmail, isIPv4, isIPv6, isUrl, isValidPattern, tel} from 'validation-core';
import {formatter} from './formatter';
import {Locale, resources} from './resources';
import {element, trim} from './ui';
import {addErrorMessage, checkMaxLength, checkMinLength, checkRequired, removeError, validateElement} from './uivalidator';

// tslint:disable-next-line:class-name
export class uievent {
  // private static _ddreg = /\d/;
  static num1 = / |,|\$|€|£|¥|'|٬|،| /g;
  static num2 = / |\.|\$|€|£|¥|'|٬|،| /g;

  static materialOnFocus = (event: Event|any) => {
    const ctrl = event.currentTarget as HTMLInputElement;
    if (ctrl.disabled || ctrl.readOnly) {
      return;
    }
    setTimeout(() => {
      if (ctrl.nodeName === 'INPUT' || ctrl.nodeName === 'SELECT'
        || ctrl.classList.contains('form-control') || ctrl.classList.contains('field')
        || (ctrl.parentElement && (ctrl.parentElement.classList.contains('form-control') || ctrl.parentElement.classList.contains('field')))) {
        const c = resources.container(ctrl);
        if (c && !c.classList.contains('focused')) {
          c.classList.add('focused');
        }
      }
    }, 0);
  }

  static handleMaterialFocus(ctrl: HTMLInputElement) {
    setTimeout(() => {
      if (ctrl.nodeName === 'INPUT' || ctrl.nodeName === 'SELECT'
        || ctrl.classList.contains('form-control') || ctrl.classList.contains('field')
        || (ctrl.parentElement && (ctrl.parentElement.classList.contains('form-control') || ctrl.parentElement.classList.contains('field')))) {
        const c = resources.container(ctrl);
        const disableHighlightFocus = ctrl.getAttribute('disable-style-on-focus');
        if (c && !c.classList.contains('focused') && !disableHighlightFocus) {
          c.classList.add('focused');
        }
      }
    }, 0);
  }
  static handleMaterialBlur(ctrl: HTMLInputElement): void {
    setTimeout(() => {
      if (ctrl.nodeName === 'INPUT' || ctrl.nodeName === 'SELECT'
        || ctrl.classList.contains('form-control') || ctrl.classList.contains('field')
        || (ctrl.parentElement && (ctrl.parentElement.classList.contains('form-control') || ctrl.parentElement.classList.contains('field')))) {
        const c = resources.container(ctrl);
        if (c) {
          c.classList.remove('focused');
          c.classList.remove('focus');
        }
      }
    }, 0);
  }
}

function isULong(value: any): boolean {
  if (!value || value.length === 0) {
    return false;
  } else if (value.indexOf('.') >= 0) {
    return false;
  } else if (isNaN(value)) {
    return false;
  } else {
    return (value >= 0);
  }
}
export function registerEvents(form: HTMLFormElement): void {
  const len = form.length;
  for (let i = 0; i < len; i++) {
    const ctrl = form[i] as HTMLInputElement;
    if (ctrl.nodeName === 'INPUT' || ctrl.nodeName === 'SELECT') {
      let type = ctrl.getAttribute('type');
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
      } else {
        const parent = ctrl.parentElement;
        const required = ctrl.getAttribute('required');
        if (parent) {
          if (parent.nodeName === 'LABEL'
              // tslint:disable-next-line:triple-equals
              && required != null && required !== undefined && required != 'false'
              && !parent.classList.contains('required')) {
            parent.classList.add('required');
          } else if (parent.classList.contains('form-group') || parent.classList.contains('field')) {
            const firstChild = parent.firstChild;
            if (firstChild && firstChild.nodeName === 'LABEL') {
              if (!(firstChild as HTMLLabelElement).classList.contains('required')) {
                (firstChild as HTMLLabelElement).classList.add('required');
              }
            }
          }
        }
        if (ctrl.getAttribute('onblur') === null && ctrl.getAttribute('(blur)') === null) {
          ctrl.onblur = materialOnBlur;
        } else {
          console.log('name:' + ctrl.getAttribute('name'));
        }
        if (ctrl.getAttribute('onfocus') === null && ctrl.getAttribute('(focus)') === null) {
          ctrl.onfocus = uievent.materialOnFocus;
        } else {
          console.log('name:' + ctrl.getAttribute('name'));
        }
      }
    }
  }
}
export function requiredOnBlur(event: Event|any): void {
  const ctrl = event.currentTarget as HTMLInputElement;
  if (!ctrl || ctrl.readOnly || ctrl.disabled) {
    return;
  }
  setTimeout(() => {
    trim(ctrl);
    if (!checkRequired(ctrl)) {
      removeError(ctrl);
    }
  }, 40);
}
export function checkOnBlur(event: Event|any, key: string, check: any, formatF?: (m0: string) => string): void {
  const ctrl = event.currentTarget as HTMLInputElement;
  if (!ctrl || ctrl.readOnly || ctrl.disabled) {
    return;
  }
  let value = ctrl.value;
  removeError(ctrl);
  setTimeout(() => {
    trim(ctrl);
    if (checkRequired(ctrl) || checkMinLength(ctrl) || checkMaxLength(ctrl)) {
      return;
    }
    if (formatF) {
      value = formatF(value);
    }
    if (value.length > 0 && !check(value)) {
      const label = resources.label(ctrl);
      const r = resources.resource;
      const msg = r.format(r.value(key), label);
      addErrorMessage(ctrl, msg);
    }
  }, 40);
}
/**
 * Check required by attribute, then check if this input is an valid email.
 */
export function emailOnBlur(event: Event|any): void {
  checkOnBlur(event, 'error_email', isEmail);
}
export function urlOnBlur(event: Event|any): void {
  checkOnBlur(event, 'error_url', isUrl);
}
export function phoneOnBlur(event: Event|any): void {
  checkOnBlur(event, 'error_phone', tel.isPhone, formatter.removePhoneFormat);
}
export function faxOnBlur(event: Event|any): void {
  checkOnBlur(event, 'error_fax', tel.isFax, formatter.removeFaxFormat);
}
export function ipv4OnBlur(event: Event|any): void {
  checkOnBlur(event, 'error_ipv4', isIPv4);
}
export function ipv6OnBlur(event: Event|any): void {
  checkOnBlur(event, 'error_ipv6', isIPv6);
}
export function patternOnBlur(event: Event|any): void {
  const ctrl = event.currentTarget as HTMLInputElement;
  if (!ctrl || ctrl.readOnly || ctrl.disabled) {
    return;
  }
  removeError(ctrl);
  setTimeout(() => {
    trim(ctrl);
    if (checkRequired(ctrl)) {
      return;
    }
    const value = ctrl.value;
    if (value.length > 0) {
      let pattern = ctrl.getAttribute('config-pattern');
      let flags = ctrl.getAttribute('config-pattern-flags');
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
        const resource_key = ctrl.getAttribute('resource-key') || ctrl.getAttribute('config-pattern-error-key');
        if (resource_key && !isValidPattern(value, pattern, flags)) {
          const label = resources.label(ctrl);
          const r = resources.resource;
          const msg = r.format(r.value(resource_key), label);
          addErrorMessage(ctrl, msg);
        }
      }
    }
  }, 40);
}
export function materialOnBlur(event: Event|any): void {
  const ctrl = event.currentTarget as HTMLInputElement;
  uievent.handleMaterialBlur(ctrl);
}
export function validOnBlur(event: Event|any): void {
  const ctrl = event.currentTarget as HTMLInputElement;
  if (!ctrl || ctrl.readOnly || ctrl.disabled) {
    return;
  }
  removeError(ctrl);
}
export function validateOnBlur(event: Event|any, locale?: Locale): void {
  const ctrl = event.currentTarget as HTMLInputElement;
  uievent.handleMaterialBlur(ctrl);
  if (!ctrl || ctrl.readOnly || ctrl.disabled) {
    return;
  }
  setTimeout(() => {
    trim(ctrl);
    removeError(ctrl);
    validateElement(ctrl, locale);
  }, 0);
}
export function handleNumberFocus(ctrl: HTMLInputElement, v: string, locale: Locale): void {
  if (locale && locale.decimalSeparator !== '.') {
    v = v.replace(uievent.num2, '');
  } else {
    v = v.replace(uievent.num1, '');
  }
  if (v !== ctrl.value) {
    ctrl.value = v;
  }
}
export function numberOnFocus(event: Event|any, locale: Locale): void {
  const ctrl = event.currentTarget as HTMLInputElement;
  uievent.handleMaterialFocus(ctrl);
  if (ctrl.readOnly || ctrl.disabled || ctrl.value.length === 0) {
    return;
  } else {
    const v = ctrl.value;
    handleNumberFocus(ctrl, v, locale);
  }
}
export function numberOnBlur(event: Event|any, locale: Locale) {
  baseNumberOnBlur(event, locale, false, undefined, false);
}
export function percentageOnFocus(event: Event|any, locale: Locale) {
  const ctrl = event.currentTarget as HTMLInputElement;
  uievent.handleMaterialFocus(ctrl);
  if (ctrl.readOnly || ctrl.disabled || ctrl.value.length === 0) {
    return;
  }
  let v = ctrl.value;
  setTimeout(() => {
    if (locale && locale.decimalSeparator !== '.') {
      v = v.replace(uievent.num2, '');
    } else {
      v = v.replace(uievent.num1, '');
    }
    v = v.replace('%', '');
    if (v !== ctrl.value) {
      ctrl.value = v;
    }
  }, 0);
}
export function currencyOnFocus(event: Event|any, locale: Locale, c?: string): void {
  const ctrl = event.currentTarget as HTMLInputElement;
  uievent.handleMaterialFocus(ctrl);
  if (ctrl.readOnly || ctrl.disabled || ctrl.value.length === 0) {
    return;
  } else {
    let v = ctrl.value;
    if (c && resources.currency && c.length > 0) {
      const currency = resources.currency(c);
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
export function currencyOnBlur(event: Event|any, locale: Locale, currencyCode?: string, includingCurrencySymbol?: boolean): void {
  baseNumberOnBlur(event, locale, true, currencyCode, includingCurrencySymbol);
}
function baseNumberOnBlur(event: Event|any, locale: Locale, isCurrency: boolean, currencyCode?: string, includingCurrencySymbol?: boolean) {
  const ctrl = event.currentTarget as HTMLInputElement;
  if (!ctrl || ctrl.readOnly || ctrl.disabled) {
    return;
  }
  materialOnBlur(event);
  removeError(ctrl);
  setTimeout(() => {
    trim(ctrl);
    const value = ctrl.value;
    let value2 = value;
    let c: string|null|undefined;
    if (isCurrency) {
      c = ctrl.getAttribute('currency-code');
      if (!c) {
        c = currencyCode;
      }
      if (c && resources.currency && c.length > 0) {
        const currency = resources.currency(c);
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
    } else {
      value2 = value2.replace(uievent.num1, '');
    }
    const label = resources.label(ctrl);
    if (checkRequired(ctrl, label)) {
      return;
    }
    if (value.length > 0) {
      if (isNaN(value2 as any)) {
        const r = resources.resource;
        const msg = r.format(r.value('error_number'), label);
        addErrorMessage(ctrl, msg);
        return;
      }
      const n = parseFloat(value2);
      if (validateMinMax(ctrl, n, label, locale)) {
        let r: any;
        if (isCurrency) {
          r = formatCurrency(n, locale, c, includingCurrencySymbol);
        } else {
          r = formatNumber(ctrl, n, locale);
        }
        if (r !== ctrl.value) {
          ctrl.value = r;
        }
        removeError(ctrl);
      }
    }
  }, 40);
}
function formatCurrency(v: number, locale: Locale, currencyCode?: string|null, includingCurrencySymbol?: boolean): string {
  return formatter.formatCurrency(v, currencyCode, locale, includingCurrencySymbol);
}
function formatNumber(ctrl: HTMLInputElement, v: number, locale?: Locale): string {
  const numFormat = ctrl.getAttribute('number-format');
  if (numFormat !== null) {
    if (numFormat.indexOf('number') === 0) {
      const strNums = numFormat.split(':');
      if (strNums.length > 0 && isULong(strNums[1])) {
        const scale = parseInt(strNums[1], 10);
        return formatter.formatNumber(v, scale, locale);
      } else {
        return '' + v;
      }
    } else {
      return formatter.format(v, numFormat, locale);
    }
  } else {
    return '' + v;
  }
}
function validateMinMax(ctrl: any, n: number, label: string, locale: Locale): boolean {
  let min = ctrl.getAttribute('min');
  const r = resources.resource;
  if (min !== null && min.length > 0) {
    min = parseFloat(min);
    if (n < min) {
      let msg = r.format(r.value('error_min'), label, min);
      let maxd = ctrl.getAttribute('max');
      if (maxd && maxd.length > 0) {
        maxd = parseFloat(maxd);
        if (maxd === min) {
          msg = r.format(r.value('error_equal'), label, maxd);
        }
      }
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  let max = ctrl.getAttribute('max');
  if (max !== null && max.length > 0) {
    max = parseFloat(max);
    if (n > max) {
      let msg = r.format(r.value('error_max'), label, max);
      if (min && max === min) {
        msg = r.format(r.value('error_equal'), label, max);
      }
      addErrorMessage(ctrl, msg);
      return false;
    }
  }
  const minField = ctrl.getAttribute('min-field');
  if (minField) {
    const form = ctrl.form;
    if (form) {
      const ctrl2 = element(form, minField);
      if (ctrl2) {
        let smin2 = ctrl2.value; // const smin2 = ctrl2.value.replace(this._nreg, '');
        if (locale && locale.decimalSeparator !== '.') {
          smin2 = smin2.replace(uievent.num2, '');
          if (smin2.indexOf(locale.decimalSeparator) >= 0) {
            smin2 = smin2.replace(locale.decimalSeparator, '.');
          }
        } else {
          smin2  = smin2 .replace(uievent.num1, '');
        }
        if (smin2.length > 0 && !isNaN(smin2 as any)) {
          const min2 = parseFloat(smin2);
          if (n < min2) {
            const minLabel = resources.label(ctrl2);
            const msg = r.format(r.value('error_min'), label, minLabel);
            addErrorMessage(ctrl, msg);
            return false;
          }
        }
      }
    }
  }
  return true;
}
