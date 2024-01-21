import {setValue, valueOf} from './reflect';
import {Locale, resources} from './resources';

const r1 = / |,|\$|€|£|¥|'|٬|،| /g;
const r2 = / |\.|\$|€|£|¥|'|٬|،| /g;

export function getValue(ctrl: HTMLInputElement, locale?: Locale, currencyCode?: string): string|number|boolean|null {
  if (ctrl.type === 'checkbox') {
    const ctrlOnValue = ctrl.getAttribute('data-on-value');
    const ctrlOffValue = ctrl.getAttribute('data-off-value');
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
        if (c && resources.currency && c.length > 0) {
          const currency = resources.currency(c);
          if (currency && value.indexOf(currency.symbol) >= 0) {
            value = value.replace(currency.symbol, '');
          }
        }
      }
      if (locale && value.indexOf(locale.currencySymbol) >= 0) {
        value = value.replace(locale.currencySymbol, '');
      }
      if (locale && locale.decimalSeparator !== '.') {
        value = value.replace(r2, '');
        if (value.indexOf(locale.decimalSeparator) >= 0) {
          value = value.replace(locale.decimalSeparator, '.');
        }
      } else {
        value = value.replace(r1, '');
      }
      if (type === 'percentage' && value.indexOf('%') >= 0) {
        value = value.replace('%', '');
      }
      return (isNaN(value as any) ? parseFloat(value) : null);
    } else {
      return value;
    }
  }
}

export function decodeFromForm(form: HTMLFormElement, locale?: Locale, currencyCode?: string|null): any {
  if (!form) {
    return null;
  }
  const dateFormat = form.getAttribute('date-format');
  const obj = {};
  const len = form.length;
  for (let i = 0; i < len; i++) {
    const ctrl = form[i] as HTMLInputElement;
    let name = ctrl.getAttribute('name');
    const id = ctrl.getAttribute('id');
    let val: any;
    let isDate = false;
    if (!name || name === '') {
      let dataField = ctrl.getAttribute('data-field');
      if (!dataField && ctrl.parentElement && ctrl.parentElement.classList.contains('DayPickerInput')) {
        if (ctrl.parentElement.parentElement) {
          dataField = ctrl.parentElement.parentElement.getAttribute('data-field');
          isDate = true;
        }
      }
      name = dataField;
    }
    if (name != null && name !== '') {
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
              val = valueOf(obj, name); // val = obj[name];
              if (!val) {
                val = [];
              }
              if (ctrl.checked) {
                val.push(ctrl.value);
                // obj[name].push(ctrl.value);
              } else {
                // tslint:disable-next-line: triple-equals
                val = val.filter((item: string) => item != ctrl.value);
              }
            } else {
              const c0 = ctrl.checked as any;
              if (c0 || c0 === 'checked') {
                val = true;
              }
            }
            break;
          case 'radio':
            const cv = ctrl.checked as any;
            if (cv || cv === 'checked') {
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
          case 'datetime-local':
            if (ctrl.value.length > 0) {
              try {
                val = new Date(ctrl.value).toISOString(); // DateUtil.parse(ctrl.value, 'YYYY-MM-DD');
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
        if (resources.date && dateFormat && isDate) {
          try {
            val = resources.date(val, dateFormat); // moment(val, dateFormat).toDate();
          } catch (err) {
            val = null;
          }
        }
        const ctype = ctrl.getAttribute('data-type');
        let v: any = ctrl.value;
        let c: string|null|undefined;
        if (ctype === 'currency') {
          c = ctrl.getAttribute('currency-code');
          if (!c) {
            c = currencyCode;
          }
          if (c && resources.currency && c.length > 0) {
            const currency = resources.currency(c);
            if (currency && v.indexOf(currency.symbol) >= 0) {
              v = v.replace(currency.symbol, '');
            }
          }
        }
        if (type === 'number' || ctype === 'currency' || ctype === 'int' || ctype === 'number') {
          if (locale && locale.decimalSeparator !== '.') {
            v = v.replace(r2, '');
          } else {
            v = v.replace(r1, '');
          }
          val = (isNaN(v) ? null : parseFloat(v));
        }
        setValue(obj, name, val); // obj[name] = val;
      }
    }
  }
  return obj;
}

export function equalValues(ctrl1: HTMLInputElement, ctrl2: HTMLInputElement): boolean {
  if (ctrl1.value === ctrl2.value) {
    return true;
  } else {
    return false;
  }
}

export function isEmpty(ctrl: HTMLInputElement): boolean {
  if (!ctrl) {
    return true;
  }
  const str = trimText(ctrl.value);
  return (str === '');
}

export function trim(ctrl: HTMLInputElement): void {
  if (!ctrl) {
    return;
  }
  const str = ctrl.value;
  const str2 = trimText(ctrl.value);
  if (str !== str2) {
    ctrl.value = str2;
  }
}

export function element(form: HTMLFormElement, childName: string): HTMLInputElement|null {
  const len = form.length;
  for (let i = 0; i < len; i++) {
    const f = form[i] as HTMLInputElement;
    if (f.name === childName) {
      return f;
    }
  }
  return null;
}

export function getParentByNodeNameOrDataField(ctrl: HTMLElement, nodeName: string): HTMLElement|null {
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

function trimText(s: string): string {
  if (!s) {
    return s;
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
