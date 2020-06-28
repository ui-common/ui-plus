import {reflect} from './reflect';

export interface DateService {
  parse(value: string, format: string): Date;
}

export interface ResourceService {
  resource(): any;
  value(key: string, param?: any): string;
  format(...args: any[]): string;
}

export interface Currency {
  currencyCode?: string;
  currencySymbol: string;
  decimalDigits: number;
}

export interface Locale {
  id?: string;
  countryCode: string;
  dateFormat: string;
  firstDayOfWeek: number;
  decimalSeparator: string;
  groupSeparator: string;
  decimalDigits: number;
  currencyCode: string;
  currencySymbol: string;
  currencyPattern: number;
  currencySample?: string;
}

export interface CurrencyService {
  getCurrency(currencyCode: string): Currency;
}

export interface LocaleService {
  getLocale(id: string): Locale;
  getLocaleOrDefault(id: string): Locale;
  getZeroCurrencyByLanguage(language: string): void;
  getZeroCurrency(locale: Locale): void;
  formatCurrency(value: any, currencyCode: string, locale: Locale, includingCurrencySymbol?: boolean): string;
  formatInteger(value: any, locale: Locale): string;
  formatNumber(value: number, scale: number, locale: Locale): string;
  format(v: number, format: string, locale: Locale): string;
}

// tslint:disable-next-line:class-name
export class ui {
  private static _r1 = / |,|\$|€|£|¥|'|٬|،| /g;
  private static _r2 = / |\.|\$|€|£|¥|'|٬|،| /g;
  private static _dateService: DateService = null;
  private static _currencyService: CurrencyService = null;
  private static _resourceService: ResourceService = null;
  static setDateService(dateService: DateService): void  {
    ui._dateService = dateService;
  }
  static setCurrencyService(currencyService: CurrencyService): void  {
    ui._currencyService = currencyService;
  }
  static setResourceService(resourceService: ResourceService): void  {
    ui._resourceService = resourceService;
  }
  static getValue(ctrl: any, locale?: Locale, currencyCode?: string): string|number|boolean {
    if (ctrl.type === 'checkbox') {
      const ctrlOnValue = ctrl.getAttribute('data-onValue');
      const ctrlOffValue = ctrl.getAttribute('data-offValue');
      if (ctrlOnValue && ctrlOffValue) {
        const onValue = ctrlOnValue ? ctrlOnValue : true;
        const offValue = ctrlOffValue ? ctrlOffValue : false;
        return ctrl.checked === true ? onValue : offValue;
      } else {
        return ctrl.checked === true;
      }
    } else {
      let type = ctrl.getAttribute('data-type');
      if (!type) {
        const t = ctrl.getAttribute('type');
        if (t === 'number') {
          type = 'number';
        }
      }
      let value = ctrl.value;
      if (type === 'number' || type === 'int' || type === 'currency' || type === 'string-currency' || type === 'percentage') {
        if (type === 'currency' || type === 'string-currency') {
          let c = ctrl.getAttribute('currency-code');
          if (!c) {
            if (currencyCode) {
              c = currencyCode;
            } else if (ctrl.form) {
              c = ctrl.form.getAttribute('currency-code');
            }
          }
          if (c) {
            const currency = ui._currencyService.getCurrency(c);
            if (currency && value.indexOf(currency.currencySymbol) >= 0) {
              value = value.replace(currency.currencySymbol, '');
            }
          }
        }
        if (locale && value.indexOf(locale.currencySymbol) >= 0) {
          value = value.replace(locale.currencySymbol, '');
        }
        if (locale && locale.decimalSeparator !== '.') {
          value = value.replace(ui._r2, '');
          if (value.indexOf(locale.decimalSeparator) >= 0) {
            value = value.replace(locale.decimalSeparator, '.');
          }
        } else {
          value = value.replace(ui._r1, '');
        }
        if (type === 'percentage' && value.indexOf('%') >= 0) {
          value = value.replace('%', '');
        }
        return (isNaN(value) ? parseFloat(value) : null);
      } else {
        return value;
      }
    }
  }

  static getLabel(input: any) {
    if (!input || input.getAttribute('type') === 'hidden') {
      return '';
    }
    let label = input.getAttribute('label');
    if (label) {
      return label;
    } else if (!label || label.length === 0) {
      let key = input.getAttribute('key');
      if (!key || key.length === 0) {
        key = input.getAttribute('resource-key');
      }
      if (key !== null && key.length > 0) {
        label = ui._resourceService.value(key);
        input.setAttribute('label', label);
        return label;
      } else {
        return ui.getLabelFromContainer(input);
      }
    } else {
      return ui.getLabelFromContainer(input);
    }
  }

  private static getLabelFromContainer(input: any) {
    const parent = ui.getControlContainer(input);
    if (parent && parent.nodeName === 'LABEL' && parent.childNodes.length > 0) {
      const first = parent.childNodes[0];
      if (first.nodeType === 3) {
        return first.nodeValue;
      }
    } else if (parent && parent.nodeName !== 'LABEL') {
      if (parent.classList.contains('form-group')) {
        const firstChild = parent.firstChild;
        if (firstChild.nodeName === 'LABEL') {
          return firstChild.innerHTML;
        } else {
          return '';
        }
      } else {
        const node = parent.parentElement;
        if (node && node.nodeName === 'LABEL' && node.childNodes.length > 0) {
          const first = node.childNodes[0];
          if (first.nodeType === 3) {
            return first.nodeValue;
          }
        }
      }
    }
    return '';
  }

  static bindToForm(form: any, obj: any): void {
    for (const f of form) {
      let ctrl = f;
      if (ctrl.name !== null && ctrl.name !== '') {
        let v = obj[ctrl.name];
        if (v === undefined || v === null) {
          v = null;
        }
        ctrl = v;
      }
    }
  }

  static decodeFromForm(form: any, locale: Locale, currencyCode: string): any {
    if (!form) {
      return null;
    }
    const dateFormat = form.getAttribute('date-format');
    const obj = {};
    for (const ctrl of form) {
      let name = ctrl.getAttribute('name');
      const id = ctrl.getAttribute('id');
      let val: any;
      let isDate = false;
      if (!name || name.length === 0) {
        let dataField = ctrl.getAttribute('data-field');
        if (!dataField && ctrl.parentElement.classList.contains('DayPickerInput')) {
          dataField = ctrl.parentElement.parentElement.getAttribute('data-field');
          isDate = true;
        }
        name = dataField;
      }
      if (name != null && name.length > 0) {
        let nodeName = ctrl.nodeName;
        const type = ctrl.getAttribute('type');
        if (nodeName === 'INPUT' && type !== null) {
          nodeName = type.toUpperCase();
        }
        if (nodeName !== 'BUTTON'
          && nodeName !== 'RESET'
          && nodeName !== 'SUBMIT') {
          switch (type) {
            case 'checkbox':
              if (id && name !== id) {
                // obj[name] = !obj[name] ? [] : obj[name];
                val = reflect.valueOf(obj, name); // val = obj[name];
                if (!val) {
                  val = [];
                }
                if (ctrl.checked) {
                  val.push(ctrl.value);
                  // obj[name].push(ctrl.value);
                } else {
                  // tslint:disable-next-line: triple-equals
                  val = val.filter(item => item != ctrl.value);
                }
              } else {
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
                  val = new Date(ctrl.value); // DateUtil.parse(ctrl.value, 'YYYY-MM-DD');
                } catch (err) {
                  val = null;
                }
              } else {
                val = null;
              }
              break;
            default:
              val = ctrl.value;
          }
          if (ui._dateService && dateFormat && isDate) {
            try {
              val = ui._dateService.parse(val, dateFormat); // moment(val, dateFormat).toDate();
            } catch (err) {
              val = null;
            }
          }
          const ctype = ctrl.getAttribute('data-type');
          let v: any = ctrl.value;
          let c;
          if (ctype === 'currency') {
            c = ctrl.getAttribute('currency-code');
            if (!c) {
              c = currencyCode;
            }
            if (c) {
              const currency = ui._currencyService.getCurrency(c);
              if (currency && v.indexOf(currency.currencySymbol) >= 0) {
                v = v.replace(currency.currencySymbol, '');
              }
            }
          }
          if (type === 'number' || ctype === 'currency' || ctype === 'int' || ctype === 'number') {
            if (locale && locale.decimalSeparator !== '.') {
              v = v.replace(ui._r2, '');
            } else {
              v = v.replace(ui._r1, '');
            }
            val = (isNaN(v) ? null : parseFloat(v));
          }
          reflect.setValue(obj, name, val); // obj[name] = val;
        }
      }
    }
    return obj;
  }
  static setReadOnlyForm(form: any) {
    if (!form) {
      return;
    }
    for (const ctrl of form) {
      const name = ctrl.getAttribute('name');
      if (name != null && name.length > 0 && name !== 'btnBack') {
        let nodeName = ctrl.nodeName;
        const type = ctrl.getAttribute('type');
        if (nodeName === 'INPUT' && type !== null) {
          nodeName = type.toUpperCase();
        }
        if (nodeName !== 'BUTTON'
          && nodeName !== 'RESET'
          && nodeName !== 'SUBMIT'
          && nodeName !== 'SELECT') {
          switch (type) {
            case 'checkbox':
              ctrl.disabled = true;
              break;
            case 'radio':
              ctrl.disabled = true;
              break;
            default:
              ctrl.readOnly = true;
          }
        } else {
          ctrl.disabled = true;
        }
      }
    }
  }
  static equalsValue(ctrl1: any, ctrl2: any) {
    if (ctrl1 === ctrl2) {
      return true;
    } else {
      return false;
    }
  }

  static isEmpty(ctrl: any): boolean {
    if (!ctrl) {
      return true;
    }
    const str = ui.trimText(ctrl.value);
    return (str === '');
  }

  static trim(ctrl: any) {
    if (!ctrl) {
      return;
    }
    const str = ctrl.value;
    const str2 = ui.trimText(ctrl.value);
    if (str !== str2) {
      ctrl.value = str2;
    }
  }

  static focusFirstControl(form: any): void {
    let i = 0;
    const len = form.length;
    for (i = 0; i < len; i++) {
      const ctrl = form[i];
      if (!(ctrl.readOnly || ctrl.disabled)) {
        let nodeName = ctrl.nodeName;
        const type = ctrl.getAttribute('type');
        if (nodeName === 'INPUT' && type !== null) {
          nodeName = type.toUpperCase();
        }
        if (nodeName !== 'BUTTON'
          && nodeName !== 'RESET'
          && nodeName !== 'SUBMIT'
          && nodeName !== 'CHECKBOX'
          && nodeName !== 'RADIO') {
          ctrl.focus();
          ctrl.scrollIntoView();
          try {
            ctrl.setSelectionRange(0, ctrl.value.length);
          } catch (error) {
          }
          return;
        }
      }
    }
  }

  static focusErrorControl(form: any): void {
    const len = form.length;
    for (let i = 0; i < len; i++) {
      const ctrl = form[i];
      const parent = ctrl.parentElement;
      if (ctrl.classList.contains('invalid')
        || ctrl.classList.contains('.ng-invalid')
        || parent.classList.contains('invalid')) {
        ctrl.focus();
        ctrl.scrollIntoView();
        return;
      }
    }
  }

  static getControlContainer(ctrl: any): any {
    const p = ctrl.parentElement;
    if (p.nodeName === 'LABEL' || p.classList.contains('form-group')) {
      return p;
    } else {
      const p1 = p.parentElement;
      if (p.nodeName === 'LABEL' || p1.classList.contains('form-group')) {
        return p1;
      } else {
        const p2 = p1.parentElement;
        if (p.nodeName === 'LABEL' || p2.classList.contains('form-group')) {
          return p2;
        } else {
          const p3 = p2.parentElement;
          if (p.nodeName === 'LABEL' || p3.classList.contains('form-group')) {
            return p3;
          } else {
            return null;
          }
        }
      }
    }
  }

  static getControlFromForm(form: any, childName: string): any {
    for (const f of form) {
      if (f.name === childName) {
        return f;
      }
    }
    return null;
  }

  static getControlsFromForm(form: any, childNames: string[]): any[] {
    const outputs = [];
    for (const f of form) {
      for (const child of childNames) {
        if (child === f.name) {
          outputs.push(f);  
        }
      }
    }
    return outputs;
  }

  static getParentByClass(ctrl: any, className: string) {
    if (!ctrl) {
      return null;
    }
    let tmp = ctrl;
    while (true) {
      const parent = tmp.parentElement;
      if (!parent) {
        return null;
      }
      if (parent.classList.contains(className)) {
        return parent;
      } else {
        tmp = parent;
      }
      if (tmp.nodeName === 'BODY') {
        return null;
      }
    }
  }

  static getParentByNodeNameOrDataField(ctrl: any, nodeName: string) {
    if (!ctrl) {
      return null;
    }
    let tmp = ctrl;
    while (true) {
      const parent = tmp.parentElement;
      if (!parent) {
        return null;
      }
      if (parent.nodeName === nodeName || parent.getAttribute('data-field') != null) {
        return parent;
      } else {
        tmp = parent;
      }
      if (tmp.nodeName === 'BODY') {
        return null;
      }
    }
  }

  static getAllDataFields(form: any): any[] {
    let results = [];
    const attributeValue = form.getAttribute('data-field');
    if (attributeValue && attributeValue.length > 0) {
      results.push(form);
    }
    const childNodes = form.childNodes;
    if (childNodes.length > 0) {
      for (const childNode of childNodes) {
        if (childNode.nodeType === Node.ELEMENT_NODE) {
          results = results.concat(ui.getAllDataFields(childNode));
        }
      }
    }
    return results;
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
}
