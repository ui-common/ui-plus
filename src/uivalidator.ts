import {formatter} from './formatter';
import {DateService, ResourceService, ui, CurrencyService, Locale} from './ui';
import {validator} from './validator';

export interface ErrorMessage {
  field: string;
  code: string;
  message?: string;
}
// tslint:disable-next-line:class-name
export class uivalidator {
  private static _r1 = / |,|\$|€|£|¥|'|٬|،| /g;
  private static _r2 = / |\.|\$|€|£|¥|'|٬|،| /g;
  private static _r3 = new RegExp('&', 'gi');
  private static _r4 = new RegExp('>', 'gi');
  private static _r5 = new RegExp('<', 'gi');
  private static _dateService: DateService = null;
  private static _currencyService: CurrencyService = null;
  private static _resourceService: ResourceService = null;
  static setDateService(dateService: DateService): void  {
    ui.setDateService(dateService);
    uivalidator._dateService = dateService;
  }
  static setCurrencyService(currencyService: CurrencyService): void  {
    uivalidator._currencyService = currencyService;
  }
  static setResourceService(resourceService: ResourceService): void  {
    uivalidator._resourceService = resourceService;
  }

  static isValidForm(form, focusFirst = null, scroll = null) {
    const valid = true;
    let i = 0;
    const len = form.length;
    for (i = 0; i < len; i++) {
      const ctrl = form[i];
      const parent = ctrl.parentElement;
      if (ctrl.classList.contains('invalid')
        || ctrl.classList.contains('ng-invalid')
        || parent.classList.contains('invalid')) {
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

  static validateForm(form: any, locale: Locale, focusFirst?: boolean, scroll?: boolean): boolean {
    let valid = true;
    let errorCtrl = null;
    let i = 0;
    const len = form.length;
    for (i = 0; i < len; i++) {
      const ctrl = form[i];
      let type = ctrl.getAttribute('type');
      if (type != null) {
        type = type.toLowerCase();
      }
      if (type === 'checkbox'
        || type === 'radio'
        || type === 'submit'
        || type === 'button'
        || type === 'reset') {
        continue;
      } else {
        if (!uivalidator.validateControl(ctrl, locale)) {
          valid = false;
          if (!errorCtrl) {
            errorCtrl = ctrl;
          }
        } else {
          uivalidator.removeErrorMessage(ctrl);
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

  static showFormError(form: any, errors: ErrorMessage[], focusFirst?: boolean): ErrorMessage[] {
    if (!errors || errors.length === 0) {
      return [];
    }
    let errorCtrl = null;
    const errs = [];
    const length = errors.length;
    const len = form.length;

    for (let i = 0; i < length; i++) {
      let hasControl = false;
      for (let j = 0; j < len; j++) {
        const ctrl = form[j];
        const dataField = ctrl.getAttribute('data-field');
        if (dataField === errors[i].field || ctrl.name === errors[i].field) {
          uivalidator.addErrorMessage(ctrl, errors[i].message);
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

  static validateControls(controls: any, locale: Locale): boolean {
    let valid = true;
    let errorCtrl = null;
    for (const c of controls) {
      if (!uivalidator.validateControl(c, locale)) {
        valid = false;
        if (!errorCtrl) {
          errorCtrl = c;
        }
      } else {
        uivalidator.removeErrorMessage(c);
      }
    }
    if (errorCtrl !== null) {
      errorCtrl.focus();
      errorCtrl.scrollIntoView();
    }
    return valid;
  }
  static checkRequired(ctrl: any, label?: string): boolean {
    const value = ctrl.value;
    let required = ctrl.getAttribute('config-required');
    if (required == null || required === undefined) {
      required = ctrl.getAttribute('required');
    }
    if (required !== null && required !== 'false') {
      if (value.length === 0) {
        if (!label) {
          label = ui.getLabel(ctrl);
        }
        const errorKey = (ctrl.nodeName === 'SELECT' ? 'error_select_required' : 'error_required');
        const r = uivalidator._resourceService;
        let s = r.value(errorKey);
        if (!s || s === '') {
          s = r.value('error_required');
        }
        const msg = r.format(s, label);
        uivalidator.addErrorMessage(ctrl, msg);
        return true;
      }
    }
    return false;
  }
  static checkMaxLength(ctrl: any, label?: string): boolean {
    const maxlength = ctrl.getAttribute('maxlength');
    if (maxlength && !isNaN(maxlength)) {
      const value = ctrl.value;
      const imaxlength = parseInt(maxlength, null);
      if (value.length > imaxlength) {
        const r = uivalidator._resourceService;
        if (!label || label === '') {
          label = ui.getLabel(ctrl);
        }
        const msg = r.format(r.value('error_maxlength'), label, maxlength);
        uivalidator.addErrorMessage(ctrl, msg);
        return true;
      }
    }
    return false;
  }
  static checkMinLength(ctrl: any, label?: string): boolean {
    const minlength = ctrl.getAttribute('minlength');
    if (minlength !== null && !isNaN(minlength)) {
      const value = ctrl.value;
      const iminlength = parseInt(minlength, null);
      if (value.length < iminlength) {
        const r = uivalidator._resourceService;
        if (!label || label === '') {
          label = ui.getLabel(ctrl);
        }
        const msg = r.format(r.value('error_minlength'), label, minlength);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
    }
  }
  static validateControl(ctrl: any, locale: Locale): boolean {
    if (!ctrl) {
      return true;
    }

    if (!ctrl || ctrl.readOnly || ctrl.disabled || ctrl.hidden || ctrl.style.display === 'none') {
      return true;
    }
    let nodeName = ctrl.nodeName;
    if (nodeName === 'INPUT') {
      const type = ctrl.getAttribute('type');
      if (type !== null) {
        nodeName = type.toUpperCase();
      }
    }
    if (nodeName === 'BUTTON'
      || nodeName === 'RESET'
      || nodeName === 'SUBMIT') {
      return true;
    }

    const parent: any = ui.getControlContainer(ctrl);
    if (parent) {
      if (parent.hidden || parent.style.display === 'none') {
        return true;
      } else {
        const p = ui.getParentByNodeNameOrDataField(parent, 'SECTION');
        if (p && (p.hidden || p.style.display === 'none')) {
          return true;
        }
      }
    }

    let value = ctrl.value;

    const label = ui.getLabel(ctrl);
    if (uivalidator.checkRequired(ctrl, label)) {
      return false;
    }

    if (!value || value === '') {
      return true;
    }
    const r = uivalidator._resourceService;
    if (uivalidator.checkMaxLength(ctrl, label)) {
      return false;
    }
    if (uivalidator.checkMinLength(ctrl, label)) {
      return false;
    }
    const minlength = ctrl.getAttribute('minlength');
    if (minlength !== null && !isNaN(minlength)) {
      const iminlength = parseInt(minlength, null);
      if (value.length < iminlength) {
        const msg = r.format(r.value('error_minlength'), label, minlength);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
    }
    const ctype = ctrl.getAttribute('type');
    let datatype2 = ctrl.getAttribute('data-type');
    let pattern = ctrl.getAttribute('config-pattern');
    const patternModifier = ctrl.getAttribute('config-pattern-modifier');
    if (pattern == null || pattern === undefined) {
      pattern = ctrl.getAttribute('pattern');
    }
    if (ctype === 'email') {
      datatype2 = 'email';
    } else if (ctype === 'url') {
      datatype2 = 'url';
    } else if (!datatype2) {
      if (ctype === 'number') {
        datatype2 = 'number';
      } else if (ctype === 'date') {
        datatype2 = 'date';
      }
    }

    if (pattern) {
      const resource_key = ctrl.getAttribute('resource-key') || ctrl.getAttribute('config-pattern-error-key');
      if (!validator.isValidPattern(pattern, patternModifier, value)) {
        const msg = r.format(r.value(resource_key), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
    }
    if (datatype2 === 'email') {
      if (value.length > 0 && !validator.isEmail(value)) {
        const msg = r.format(r.value('error_email'), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
    } else if (datatype2 === 'number' || datatype2 === 'int' || datatype2 === 'currency' || datatype2 === 'string-currency' || datatype2 === 'percentage') {
      if (datatype2 === 'currency' || datatype2 === 'string-currency') {
        let currencyCode = ctrl.getAttribute('currency-code');
        if (!currencyCode && ctrl.form) {
          currencyCode = ctrl.form.getAttribute('currency-code');
        }
        if (currencyCode) {
          const currency = uivalidator._currencyService.getCurrency(currencyCode);
          if (currency && value.indexOf(currency.currencySymbol) >= 0) {
            value = value.replace(currency.currencySymbol, '');
          }
        }
      }
      if (locale && value.indexOf(locale.currencySymbol) >= 0) {
        value = value.replace(locale.currencySymbol, '');
      }
      if (locale && locale.decimalSeparator !== '.') {
        value = value.replace(uivalidator._r2, '');
        if (value.indexOf(locale.decimalSeparator) >= 0) {
          value = value.replace(locale.decimalSeparator, '.');
        }
      } else {
        value = value.replace(uivalidator._r1, '');
      }
      if (datatype2 === 'percentage' && value.indexOf('%') >= 0) {
        value = value.replace('%', '');
      }
      if (isNaN(value)) {
        const msg = r.format(r.value('error_number'), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
      if (datatype2 === 'int' && !validator.isInteger(value)) {
        const msg = r.format(r.value('error_number'), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
      const n = parseFloat(value);
      let min = ctrl.getAttribute('min');
      if (min !== null && min.length > 0) {
        min = parseFloat(min);
        if (n < min) {
          let msg = r.format(r.value('error_min'), label, min);
          let maxd = ctrl.getAttribute('max');
          if (maxd !== null && maxd.length > 0) {
            maxd = parseFloat(maxd);
            if (maxd === min) {
              msg = r.format(r.value('error_equal'), label, maxd);
            }
          }
          uivalidator.addErrorMessage(ctrl, msg);
          return false;
        }
      }
      let max = ctrl.getAttribute('max');
      if (max !== null && max.length > 0) {
        max = parseFloat(max);
        if (n > max) {
          let msg = r.format(r.value('error_max'), label, max);
          if (!min && max === min) {
            msg = r.format(r.value('error_equal'), label);
          }
          uivalidator.addErrorMessage(ctrl, msg);
          return false;
        }
      }
      const minField = ctrl.getAttribute('min-field');
      if (minField && ctrl.form) {
        const ctrl2 = ui.getControlFromForm(ctrl.form, minField);
        if (ctrl2) {
          let smin2 = ctrl2.value; // const smin2 = ctrl2.value.replace(UIValidationUtil._nreg, '');
          if (locale && smin2.indexOf(locale.currencySymbol) >= 0) {
            smin2 = smin2.replace(locale.currencySymbol, '');
          }
          if (locale && locale.decimalSeparator !== '.') {
            smin2 = smin2.replace(uivalidator._r2, '');
            if (smin2.indexOf(locale.decimalSeparator) >= 0) {
              smin2 = smin2.replace(locale.decimalSeparator, '.');
            }
          } else {
            smin2 = smin2.replace(uivalidator._r1, '');
          }
          if (smin2.length > 0 && !isNaN(smin2)) {
            const min2 = parseFloat(smin2);
            if (n < min2) {
              const minLabel = ui.getLabel(ctrl2);
              const msg = r.format(r.value('error_min'), label, minLabel);
              uivalidator.addErrorMessage(ctrl, msg);
              return false;
            }
          }
        }
      }
    } else if (uivalidator._dateService && datatype2 === 'date' && value !== '') {
      let dateFormat: string = ctrl.getAttribute('date-format');
      if (!dateFormat || dateFormat.length === 0) {
        dateFormat = ctrl.getAttribute('uib-datepicker-popup');
      }
      if (!dateFormat || dateFormat.length === 0) {
        dateFormat = ctrl.getAttribute('datepicker-popup');
      }/*
      if (!dateFormat || dateFormat.length === 0) {
        dateFormat = 'MM/DD/YYYY';
      }*/
      // const isDate = moment(value, dateFormat.toUpperCase(), true).isValid(); // DateUtil.isDate(value, dateFormat);
      const date = uivalidator._dateService.parse(value, dateFormat); // moment(value, dateFormat).toDate(); // DateUtil.parse(value, dateFormat);
      if (!date) { // (isDate === false) {
        const msg = r.format(r.value('error_date'), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      } else {
        const maxdate = ctrl.getAttribute('max');
        const mindate = ctrl.getAttribute('min');
        if (maxdate !== null || mindate !== null) {
          if (maxdate !== null) {
            let strDate = null;
            let dmaxdate: Date = null;
            if (maxdate.startsWith('\'') || maxdate.startsWith('"')) {
              strDate = maxdate.substring(1, maxdate.length - 1);
              dmaxdate = new Date(strDate); // DateUtil.parse(strDate, 'yyyy-MM-dd');
            }
            if (dmaxdate !== null && date > dmaxdate) {
              const msg = r.format(r.value('error_max_date'), label);
              uivalidator.addErrorMessage(ctrl, msg);
              return false;
            }
          }
          if (mindate !== null) {
            let strDate = null;
            let dmindate = null;
            if (mindate.startsWith('\'') || mindate.startsWith('"')) {
              strDate = mindate.substring(1, mindate.length - 1);
              dmindate = new Date(strDate); // DateUtil.parse(strDate, 'yyyy-MM-dd');
            }
            if (dmindate !== null && date < dmindate) {
              const msg = r.format(r.value('error_min_date'), label);
              uivalidator.addErrorMessage(ctrl, msg);
              return false;
            }
          }
        }
      }
    } else if (datatype2 === 'url') {
      if (!validator.isUrl(value)) {
        const msg = r.format(r.value('error_url'), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
    } else if (datatype2 === 'phone') {
      const phoneStr = formatter.removePhoneFormat(value);
      if (!validator.isPhone(phoneStr)) {
        const msg = r.format(r.value('error_phone'), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
    } else if (datatype2 === 'code') {
      if (!validator.isValidCode(value)) {
        const msg = r.format(r.value('error_code'), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
    } else if (datatype2 === 'dash-code') {
      if (!validator.isDashCode(value)) {
        const msg = r.format(r.value('error_dash_code'), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
    } else if (datatype2 === 'digit') {
      if (!validator.isDigitOnly(value)) {
        const msg = r.format(r.value('error_digit'), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
    } else if (datatype2 === 'dash-digit') {
      if (!validator.isDashDigit(value)) {
        const msg = r.format(r.value('error_dash_digit'), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
    } else if (datatype2 === 'routing-number') { // business-tax-id
      if (!validator.isDashDigit(value)) {
        const msg = r.format(r.value('error_routing_number'), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
    } else if (datatype2 === 'check-number') {
      if (!validator.isCheckNumber(value)) {
        const msg = r.format(r.value('error_check_number'), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
    } else if (datatype2 === 'post-code') {
      let countryCode = ctrl.getAttribute('country-code');
      if (countryCode) {
        countryCode = countryCode.toUpperCase();
        if (countryCode === 'US' || countryCode === 'USA') {
          if (!validator.isUSPostalCode(value)) {
            const msg = r.format(r.value('error_us_post_code'), label);
            uivalidator.addErrorMessage(ctrl, msg);
            return false;
          }
        } else if (countryCode === 'CA' || countryCode === 'CAN') {
          if (!validator.isCAPostalCode(value)) {
            const msg = r.format(r.value('error_ca_post_code'), label);
            uivalidator.addErrorMessage(ctrl, msg);
            return false;
          }
        } else {
          if (!validator.isDashCode(value)) {
            const msg = r.format(r.value('error_post_code'), label);
            uivalidator.addErrorMessage(ctrl, msg);
            return false;
          }
        }
      }
    } else if (datatype2 === 'ipv4') {
      if (!validator.isIPv4(value)) {
        const msg = r.format(r.value('error_ipv4'), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
    } else if (datatype2 === 'ipv6') {
      if (!validator.isIPv6(value)) {
        const msg = r.format(r.value('error_ipv6'), label);
        uivalidator.addErrorMessage(ctrl, msg);
        return false;
      }
    }
    uivalidator.removeErrorMessage(ctrl);
    return true;
  }

  static setValidControl(ctrl: any) {
    if (!ctrl.classList.contains('valid')) {
      ctrl.classList.add('valid');
    }
    ctrl.classList.remove('md-input-invalid');
    ctrl.classList.remove('ng-invalid');
    ctrl.classList.remove('invalid');
    ctrl.classList.remove('ng-touched');

    const parent = ui.getControlContainer(ctrl);
    if (parent != null) {
      if (!parent.classList.contains('valid')) {
        parent.classList.add('valid');
      }
      parent.classList.remove('valid');
      parent.classList.remove('invalid');
      parent.classList.remove('md-input-invalid');
      const span = parent.querySelector('.span-error');
      if (span !== null && span !== undefined) {
        parent.removeChild(span);
      }
    }
  }

  static addErrorMessage(ctrl, msg) {
    if (!ctrl) {
      return;
    }

    if (!ctrl.classList.contains('invalid')) {
      ctrl.classList.add('invalid');
    }
    if (!ctrl.classList.contains('ng-touched')) {
      ctrl.classList.add('ng-touched');
    }
    const parrent: any = ui.getControlContainer(ctrl);
    if (parrent === null) {
      return;
    }
    if (parrent.nodeName && parrent.nodeName === 'LABEL' && !parrent.classList.contains('invalid')) {
      parrent.classList.add('invalid');
    } else if (parrent.classList.contains('form-group') && !parrent.classList.contains('invalid')) {
      parrent.classList.add('invalid');
    } else if (parrent.nodeName === 'MD-INPUT-CONTAINER' && !parrent.classList.contains('md-input-invalid')) {
      parrent.classList.add('md-input-invalid');
    }

    const span = parrent.querySelector('.span-error');

    if (span) {
      if (span.innerHTML !== msg) {
        span.innerHTML = msg;
      }
    } else {
      const spanError = document.createElement('span');
      spanError.classList.add('span-error');
      spanError.innerHTML = msg;
      parrent.appendChild(spanError);
    }
  }

  static removeFormError(form: any): void {
    if (form) {
      const len = form.length;
      for (let i = 0; i < len; i++) {
        const ctrl = form[i];
        uivalidator.removeErrorMessage(ctrl);
      }
    }
  }

  static removeErrorMessage(ctrl): void {
    if (!ctrl) {
      return;
    }
    ctrl.classList.remove('valid');
    ctrl.classList.remove('md-input-invalid');
    ctrl.classList.remove('ng-invalid');
    ctrl.classList.remove('invalid');
    ctrl.classList.remove('ng-touched');

    const parent = ui.getControlContainer(ctrl);
    if (parent != null) {
      parent.classList.remove('valid');
      parent.classList.remove('invalid');
      parent.classList.remove('md-input-invalid');
      const span = parent.querySelector('.span-error');
      if (span !== null && span !== undefined) {
        parent.removeChild(span);
      }
    }
  }

  static buildErrorMessage(errors: ErrorMessage[]): string {
    if (!errors || errors.length === 0) {
      return '';
    }
    const sb = new Array();
    for (let i = 0; i < errors.length; i++) {
      sb.push(uivalidator.escape(errors[i].message));
      if (i < errors.length - 1) {
        sb.push('<br />');
      }
    }
    return sb.join('');
  }
  private static escape(text: string): string {
    if (text.indexOf('&') >= 0) {
      text = text.replace(uivalidator._r3, '&amp;');
    }
    if (text.indexOf('>') >= 0) {
      text = text.replace(uivalidator._r4, '&gt;');
    }
    if (text.indexOf('<') >= 0) {
      text = text.replace(uivalidator._r5, '&lt;');
    }
    return text;
  }
}
