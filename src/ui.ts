import {setValue, valueOf} from 'reflectx';
import {Locale, resources} from './resources';

const _r1 = / |,|\$|€|£|¥|'|٬|،| /g;
const _r2 = / |\.|\$|€|£|¥|'|٬|،| /g;

export function getValue(ctrl: any, locale?: Locale, currencyCode?: string): string|number|boolean {
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
          const currency = resources.currencyService.getCurrency(c);
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
      } else {
        value = value.replace(_r1, '');
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

export function getLabel(input: any): string {
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
      label = resources.resourceService.value(key);
      input.setAttribute('label', label);
      return label;
    } else {
      return getLabelFromContainer(input);
    }
  } else {
    return getLabelFromContainer(input);
  }
}

function getLabelFromContainer(input: any): string {
  const parent = container(input);
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

export function decodeFromForm(form: any, locale: Locale, currencyCode: string): any {
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
              val = valueOf(obj, name); // val = obj[name];
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
        if (resources.dateService && dateFormat && isDate) {
          try {
            val = resources.dateService.parse(val, dateFormat); // moment(val, dateFormat).toDate();
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
            const currency = resources.currencyService.getCurrency(c);
            if (currency && v.indexOf(currency.currencySymbol) >= 0) {
              v = v.replace(currency.currencySymbol, '');
            }
          }
        }
        if (type === 'number' || ctype === 'currency' || ctype === 'int' || ctype === 'number') {
          if (locale && locale.decimalSeparator !== '.') {
            v = v.replace(_r2, '');
          } else {
            v = v.replace(_r1, '');
          }
          val = (isNaN(v) ? null : parseFloat(v));
        }
        setValue(obj, name, val); // obj[name] = val;
      }
    }
  }
  return obj;
}

export function equalValues(ctrl1: any, ctrl2: any): boolean {
  if (ctrl1.value === ctrl2.value) {
    return true;
  } else {
    return false;
  }
}

export function isEmpty(ctrl: any): boolean {
  if (!ctrl) {
    return true;
  }
  const str = trimText(ctrl.value);
  return (str === '');
}

export function trim(ctrl: any) {
  if (!ctrl) {
    return;
  }
  const str = ctrl.value;
  const str2 = trimText(ctrl.value);
  if (str !== str2) {
    ctrl.value = str2;
  }
}

export function container(ctrl: any): any {
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

export function element(form: any, childName: string): any {
  for (const f of form) {
    if (f.name === childName) {
      return f;
    }
  }
  return null;
}

export function getParentByNodeNameOrDataField(ctrl: any, nodeName: string): any {
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
