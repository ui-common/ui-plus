import {isEmail, isIPv4, isIPv6, isUrl, isValidPattern, tel} from 'validation-util';
import {formatter} from './formatter';
import {Locale, resources} from './resources';
import {container, element, getLabel, trim} from './ui';
import {addErrorMessage, checkMaxLength, checkMinLength, checkRequired, removeErrorMessage, validateElement} from './uivalidator';

// tslint:disable-next-line:class-name
export class uievent {
  // private static _ddreg = /\d/;
  private static _r1 = / |,|\$|€|£|¥|'|٬|،| /g;
  private static _r2 = / |\.|\$|€|£|¥|'|٬|،| /g;
/*
  static digitAndSlashOnKeyPress(e: any) {
    const keychar = e.key;
    const value = e.currentTarget.value;
    if (UIEventUtil._ddreg.test(keychar)) {
      e.currentTarget.value = value + e.key;
    } else if (e.which === 8) {
      e.currentTarget.value = value.substring(0, value.length - 1);
    }
  }
*/
  private static isULong(value: any): boolean {
    if (!value || value.length === 0) {
      return false;
    } else if (value.indexOf('.') >= 0) {
      return false;
    } else if (isNaN(value)) {
      return false;
    } else {
      if (value >= 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  static materialOnFocus = (event: any) => {
    const ctrl = event.currentTarget;
    if (ctrl.disable || ctrl.readOnly) {
      return;
    }
    setTimeout(() => {
      if (ctrl.nodeName === 'INPUT' || ctrl.nodeName === 'SELECT'
        || ctrl.classList.contains('form-control')
        || ctrl.parentElement.classList.contains('form-control')) {
        const c = container(ctrl);
        if (c && !c.classList.contains('focused')) {
          c.classList.add('focused');
        }
      }
    }, 0);
  }

  static handleMaterialFocus(ctrl: any) {
    setTimeout(() => {
      if (ctrl.nodeName === 'INPUT' || ctrl.nodeName === 'SELECT'
        || ctrl.classList.contains('form-control')
        || ctrl.parentElement.classList.contains('form-control')) {
        const c = container(ctrl);
        const disableHighlightFocus = ctrl.getAttribute('disable-style-on-focus');
        if (c && !c.classList.contains('focused') && !disableHighlightFocus) {
          c.classList.add('focused');
        }
      }
    }, 0);
  }

  static initMaterial(form: HTMLFormElement): void {
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
          if (parent && parent.nodeName === 'LABEL'
              // tslint:disable-next-line:triple-equals
              && required != null && required !== undefined && required != 'false'
              && !parent.classList.contains('required')) {
            parent.classList.add('required');
          } else if (parent.classList.contains('form-group')) {
            const firstChild = parent.firstChild;
            if (firstChild.nodeName === 'LABEL') {
              if (!(firstChild as HTMLLabelElement).classList.contains('required')) {
                (firstChild as HTMLLabelElement).classList.add('required');
              }
            }
          }
          if (ctrl.getAttribute('onblur') === null && ctrl.getAttribute('(blur)') === null) {
            ctrl.onblur = uievent.materialOnBlur;
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

  static materialOnBlur = (event: any) => {
    const ctrl = event.currentTarget;
    uievent.handleMaterialBlur(ctrl);
  }

  static handleMaterialBlur(ctrl: any) {
    setTimeout(() => {
      if (ctrl.nodeName === 'INPUT' || ctrl.nodeName === 'SELECT'
        || ctrl.classList.contains('form-control')
        || ctrl.parentElement.classList.contains('form-control')) {
        const c = container(ctrl);
        if (c) {
          c.classList.remove('focused');
        }
      }
    }, 0);
  }

  static numberOnFocus(event: any, locale: Locale) {
    const ctrl = event.target;
    uievent.handleMaterialFocus(ctrl);
    if (ctrl.readOnly || ctrl.disabled || ctrl.value.length === 0) {
      return;
    } else {
      const v = ctrl.value;
      uievent.handleNumFocus(ctrl, v, locale);
    }
  }
  private static handleNumFocus(ctrl: any, v: any, locale: Locale) {
    if (locale && locale.decimalSeparator !== '.') {
      v = v.replace(uievent._r2, '');
    } else {
      v = v.replace(uievent._r1, '');
    }
    if (v !== ctrl.value) {
      ctrl.value = v;
    }
  }
  static currencyOnFocus(event: any, locale: Locale, currencyCode: string) {
    const ctrl = event.target;
    uievent.handleMaterialFocus(ctrl);
    if (ctrl.readOnly || ctrl.disabled || ctrl.value.length === 0) {
      return;
    } else {
      let v = ctrl.value;
      let c = ctrl.getAttribute('currency-code');
      if (!c) {
        c = currencyCode;
      }
      if (c) {
        const currency = resources.currencyService.getCurrency(c);
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
  }
  static percentageOnFocus(event: any, locale: Locale) {
    const ctrl = event.currentTarget;
    uievent.handleMaterialFocus(ctrl);
    if (ctrl.readOnly || ctrl.disabled || ctrl.value.length === 0) {
      return;
    }
    let v = ctrl.value;
    setTimeout(() => {
      if (locale && locale.decimalSeparator !== '.') {
        v = v.replace(uievent._r2, '');
      } else {
        v = v.replace(uievent._r1, '');
      }
      v = v.replace('%', '');
      if (v !== ctrl.value) {
        ctrl.value = v;
      }
    }, 0);
  }

  private static _formatCurrency(v: any, locale: Locale, currencyCode, includingCurrencySymbol: boolean): string {
    return resources.localeService.formatCurrency(v, currencyCode, locale, includingCurrencySymbol);
  }

  static validOnBlur(event: any) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    removeErrorMessage(ctrl);
  }
  /*
  static requiredOnBlur(event: any) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    UIValidationUtil.removeErrorMessage(ctrl);
    setTimeout(() => {
      UIUtil.trim(ctrl);
      const value = ctrl.value;
      if (value.length === 0) {
        const label = UIUtil.getLabel(ctrl);
        const r = UIEventUtil._resourceService;
        const msg = r.format(r.getString('error_required'), label);
        UIValidationUtil.addErrorMessage(ctrl, msg);
      } else {
        UIValidationUtil.removeErrorMessage(ctrl);
      }
    }, 40);
  }
  */
  static requiredOnBlur(event: any) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    setTimeout(() => {
      trim(ctrl);
      if (!checkRequired(ctrl)) {
        removeErrorMessage(ctrl);
      }
    }, 40);
  }
  /**
   * Check required by attribute, then check if this input is an valid email.
   */
  static emailOnBlur(event: any) {
    uievent.checkOnBlur(event, 'error_email', isEmail);
  }
  static urlOnBlur(event: any) {
    uievent.checkOnBlur(event, 'error_url', isUrl);
  }
  static ipv4OnBlur(event: any) {
    uievent.checkOnBlur(event, 'error_ipv4', isIPv4);
  }
  static ipv6OnBlur(event: any) {
    uievent.checkOnBlur(event, 'error_ipv6', isIPv6);
  }
  static phoneOnBlur(event: any) {
    uievent.checkOnBlur(event, 'error_phone', tel.isPhone, formatter.removePhoneFormat);
  }
  static faxOnBlur(event: any) {
    uievent.checkOnBlur(event, 'error_fax', tel.isFax, formatter.removeFaxFormat);
  }
  static checkOnBlur(event: any, key: string, check: any, formatF?: any) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    let value = ctrl.value;
    removeErrorMessage(ctrl);
    setTimeout(() => {
      trim(ctrl);
      if (checkRequired(ctrl) || checkMinLength(ctrl) || checkMaxLength(ctrl)) {
        return;
      }
      if (formatF) {
        value = formatF(value);
      }
      if (value.length > 0 && !check(value)) {
        const label = getLabel(ctrl);
        const r = resources.resourceService;
        const msg = r.format(r.value(key), label);
        addErrorMessage(ctrl, msg);
      }
    }, 40);
  }
  /**
   * Check required by attribute, then check if this input is an valid email.
   */
  static patternOnBlur(event: any) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    removeErrorMessage(ctrl);
    setTimeout(() => {
      trim(ctrl);
      if (checkRequired(ctrl)) {
        return;
      }
      const value = ctrl.value;
      if (value.length > 0) {
        let pattern = ctrl.getAttribute('config-pattern');
        const patternModifier = ctrl.getAttribute('config-pattern-modifier');
        if (pattern == null || pattern === undefined) {
          pattern = ctrl.getAttribute('pattern');
        }
        if (pattern) {
          const resource_key = ctrl.getAttribute('resource-key') || ctrl.getAttribute('config-pattern-error-key');
          if (!isValidPattern(pattern, patternModifier, value)) {
            const label = getLabel(ctrl);
            const r = resources.resourceService;
            const msg = r.format(r.value(resource_key), label);
            addErrorMessage(ctrl, msg);
          }
        }
      }
    }, 40);
  }
  static numberOnBlur(event: any, locale: Locale) {
    uievent._baseNumberOnBlur(event, locale, false, null, false);
  }

  private static _formatNumber(ctrl: any, v: any, locale: Locale): string {
    const numFormat = ctrl.getAttribute('number-format');
    if (numFormat !== null) {
      if (numFormat.indexOf('number') === 0) {
        const strNums = numFormat.split(':');
        if (strNums.length > 0 && uievent.isULong(strNums[1])) {
          const scale = parseInt(strNums[1], null);
          return resources.localeService.formatNumber(v, scale, locale);
        } else {
          return v;
        }
      } else {
        return resources.localeService.format(v, numFormat, locale);
      }
    } else {
      return v;
    }
  }

  static currencyOnBlur(event: any, locale: Locale, currencyCode: string, includingCurrencySymbol: boolean) {
    uievent._baseNumberOnBlur(event, locale, true, currencyCode, includingCurrencySymbol);
  }

  private static _baseNumberOnBlur(event: any, locale: Locale, isCurrency: boolean, currencyCode: string, includingCurrencySymbol: boolean) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    this.materialOnBlur(event);
    removeErrorMessage(ctrl);
    setTimeout(() => {
      trim(ctrl);
      const value = ctrl.value;
      let value2 = value;
      let c;
      if (isCurrency) {
        c = ctrl.getAttribute('currency-code');
        if (!c) {
          c = currencyCode;
        }
        if (c) {
          const currency = resources.currencyService.getCurrency(c);
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
      } else {
        value2 = value2.replace(uievent._r1, '');
      }
      const label = getLabel(ctrl);
      if (checkRequired(ctrl, label)) {
        return;
      }
      if (value.length > 0) {
        if (isNaN(value2)) {
          const r = resources.resourceService;
          const msg = r.format(r.value('error_number'), label);
          addErrorMessage(ctrl, msg);
          return;
        }
        const n = parseFloat(value2);
        if (uievent.validateMinMax(ctrl, n, label, locale)) {
          let r: any;
          if (isCurrency) {
            r = uievent._formatCurrency(n, locale, c, includingCurrencySymbol);
          } else {
            r = uievent._formatNumber(ctrl, n, locale);
          }
          if (r !== ctrl.value) {
            ctrl.value = r;
          }
          removeErrorMessage(ctrl);
        }
      }
    }, 40);
  }

  private static validateMinMax(ctrl: any, n: number, label: string, locale: Locale): boolean {
    let min = ctrl.getAttribute('min');
    const r = resources.resourceService;
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
            smin2 = smin2.replace(uievent._r2, '');
            if (smin2.indexOf(locale.decimalSeparator) >= 0) {
              smin2 = smin2.replace(locale.decimalSeparator, '.');
            }
          } else {
            smin2  = smin2 .replace(uievent._r1, '');
          }
          if (smin2.length > 0 && !isNaN(smin2 as any)) {
            const min2 = parseFloat(smin2);
            if (n < min2) {
              const minLabel = getLabel(ctrl2);
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
  static validateOnBlur(event: any, locale: Locale) {
    const ctrl = event.currentTarget;
    uievent.handleMaterialBlur(event);
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    setTimeout(() => {
      trim(ctrl);
      removeErrorMessage(ctrl);
      validateElement(ctrl, locale);
    }, 0);
  }
/*
  static dateOnBlur(event: any) {
    const ctrl = event.currentTarget;
    uievent.handleMaterialBlur(event);
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    setTimeout(() => {
      uivalidator.removeErrorMessage(ctrl);
      const v = ctrl.value;
      const v2 = uievent.reformatDate(ctrl);
      if (v2 !== '' && v2 !== v) {
        ctrl.value = v2;
      }
    }, 0);
  }

  private static reformatDate(ctrl): string {
    let str = ctrl.value;
    if (str.length === 0 || uievent.trimText(str) === '') {
      return '';
    }

    let dateFormat = ctrl.getAttribute('date-format');

    if (!dateFormat || dateFormat.length === 0) {
      dateFormat = ctrl.getAttribute('uib-datepicker-popup');
    }
    if (!dateFormat || dateFormat.length === 0) {
      dateFormat = ctrl.getAttribute('datepicker-popup');
    }
    if (!dateFormat || dateFormat.length === 0) {
      return '';
    }
    dateFormat = dateFormat.toUpperCase();
    if (dateFormat.indexOf('MMM') >= 0) {
      return '';
    }
    const monthIndex = dateFormat.indexOf('MM');
    const dayIndex = dateFormat.indexOf('DD');
    const yearIndex = dateFormat.indexOf('YY');
    if (monthIndex < 0 || dayIndex < 0 || yearIndex < 0) {
      return '';
    }
    let chr = '/';
    if (dateFormat.indexOf('/') >= 0) {
      chr = '/';
    } else if (dateFormat.indexOf('-') >= 0) {
      chr = '-';
    } else if (dateFormat.indexOf('.') >= 0) {
      chr = '.';
    } else {
      return '';
    }

    if (str.indexOf('/') < 0 && str.indexOf('-') < 0 && str.indexOf('.') < 0) {
      if (str.length === 6) {
        str = '' + str.substring(0, 2) + '/' + str.substring(2, 4) + '/' + str.substring(4, 6);
      } else if (str.length === 8) {
        if (yearIndex < monthIndex && yearIndex < dayIndex) {
          str = '' + str.substring(0, 4) + '/' + str.substring(4, 6) + '/' + str.substring(6, 8);
        } else if (yearIndex > monthIndex && yearIndex > dayIndex) {
          str = '' + str.substring(0, 2) + '/' + str.substring(2, 4) + '/' + str.substring(4, 8);
        } else {
          str = '' + str.substring(0, 2) + '/' + str.substring(2, 6) + '/' + str.substring(6, 8);
        }
      } else {
        return '';
      }
    }

    str = str.replace(uievent._dreg, '/');

    const date_split = str.split('/');

    if (date_split.length !== 3) {
      return '';
    }

    let str2 = date_split[2];
    let str1 = date_split[1];
    let str0 = date_split[0];

    if (str0.length === 1) {
      str0 = '0' + str0;
    } else if (str0.length === 0) {
      str0 = '01';
    }
    if (str1.length === 1) {
      str1 = '0' + str1;
    } else if (str1.length === 0) {
      str1 = '01';
    }
    if (str2.length === 1) {
      str2 = '0' + str2;
    } else if (str2.length === 0) {
      str2 = '01';
    }
    if (yearIndex > monthIndex && yearIndex > dayIndex) {
      if (str2.length === 2) {
        str2 = '20' + str2;
      } else if (str2.length === 3) {
        str2 = '2' + str2;
      }
      if (str0.length > 3) {
        str0 = str0.substring(0, 2);
      }
      if (str1.length > 3) {
        str1 = str1.substring(0, 2);
      }
    } else if (yearIndex < monthIndex && yearIndex < dayIndex) {
      if (str0.length === 2) {
        str0 = '20' + str0;
      } else if (str2.length === 3) {
        str0 = '2' + str0;
      }
      if (str1.length > 3) {
        str1 = str1.substring(0, 2);
      }
      if (str2.length > 3) {
        str2 = str2.substring(0, 2);
      }
    } else {
      if (str1.length === 2) {
        str1 = '20' + str1;
      } else if (str2.length === 3) {
        str1 = '2' + str1;
      }
      if (str0.length > 3) {
        str0 = str0.substring(0, 2);
      }
      if (str2.length > 3) {
        str2 = str2.substring(0, 2);
      }
    }

    if (isNaN(str0) || isNaN(str1) || isNaN(str2)) {
      return '';
    }
    const strDate = '' + str0 + chr + str1 + chr + str2;

    const day = parseInt(strDate.substring(dayIndex, dayIndex + 2), 10);
    const month = parseInt(strDate.substring(monthIndex, monthIndex + 2), 10);
    const year = parseInt(strDate.substring(yearIndex, yearIndex + 4), 10);

    const date = new Date(year, month - 1, day);

    if (date.getDate() !== day
      || date.getMonth() !== (month - 1)
      || date.getFullYear() !== year) {
      return '';
    } else {
      return strDate;
    }
  }
  private static trimText(s: string) {
    if (s === null || s === undefined) {
      return;
    }
    s = s.trim();
    let i = s.length - 1;
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
  */
}
