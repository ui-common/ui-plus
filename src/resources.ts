export interface DateService {
  parse(value: string, format: string): Date;
}
export interface ResourceService {
  value(key: string, param?: any): string;
  format(f: string, ...args: any[]): string;
}

export interface Currency {
  currencyCode?: string;
  currencySymbol: string;
  decimalDigits: number;
}
const usd: Currency = {
  currencyCode: 'USD',
  currencySymbol: '$',
  decimalDigits: 2
}
export interface Locale {
  decimalSeparator: string;
  groupSeparator: string;
  currencyCode: string;
  currencySymbol: string;
  currencyPattern: number;
}

export interface CurrencyService {
  getCurrency(currencyCode: string): Currency;
}

export interface LocaleService {
  formatCurrency(value: any, currencyCode: string, locale: Locale, includingCurrencySymbol?: boolean): string;
  formatNumber(value: number, scale: number, locale: Locale): string;
  format(v: number, format: string, locale: Locale): string;
}

export function getLabel(input: HTMLElement): string {
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
      label = resources.resource.value(key);
      input.setAttribute('label', label);
      return label;
    } else {
      return getLabelFromContainer(input);
    }
  } else {
    return getLabelFromContainer(input);
  }
}

function getLabelFromContainer(input: HTMLElement): string {
  const parent = container(input);
  if (parent && parent.nodeName === 'LABEL' && parent.childNodes.length > 0) {
    const first = parent.childNodes[0];
    if (first.nodeType === 3) {
      return first.nodeValue;
    }
  } else if (parent && parent.nodeName !== 'LABEL') {
    if (parent.classList.contains('form-group') || parent.classList.contains('field')) {
      const firstChild = parent.firstChild;
      if (firstChild.nodeName === 'LABEL') {
        return (firstChild as HTMLLabelElement).innerHTML;
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
export function container(ctrl: HTMLElement): HTMLElement {
  const p = ctrl.parentElement;
  if (p.nodeName === 'LABEL' || p.classList.contains('form-group') || p.classList.contains('field')) {
    return p;
  } else {
    const p1 = p.parentElement;
    if (p1.nodeName === 'LABEL' || p1.classList.contains('form-group') || p1.classList.contains('field')) {
      return p1;
    } else {
      const p2 = p1.parentElement;
      if (p2.nodeName === 'LABEL' || p2.classList.contains('form-group') || p2.classList.contains('field')) {
        return p2;
      } else {
        const p3 = p2.parentElement;
        if (p3.nodeName === 'LABEL' || p3.classList.contains('form-group') || p3.classList.contains('field')) {
          return p3;
        } else {
          return null;
        }
      }
    }
  }
}
// tslint:disable-next-line:class-name
export class resources {
  private static _r3 = /,/g;
  static date: DateService;
  static currency: CurrencyService;
  static resource: ResourceService;
  static getLabel(input: HTMLElement): string {
    return getLabel(input);
  }
  static container(ctrl: HTMLElement): HTMLElement {
    return container(ctrl);
  }
  static formatCurrency(value: number, currencyCode: string, locale?: Locale, includingCurrencySymbol?: boolean): string {
    if (!value) {
      return '';
    }
    if (!currencyCode) {
      currencyCode = 'USD';
    }
    let currency: Currency;
    currencyCode = currencyCode.toUpperCase();
    if (resources.currency) {
      currency = resources.currency.getCurrency(currencyCode);
    }
    if (!currency) {
      currency = usd;
    }
    let v: string;
    if (locale) {
      // const scale = (locale.decimalDigits && locale.decimalDigits >= 0 ? locale.decimalDigits : 2);
      const scale = currency.decimalDigits;
      v = _formatNumber(value, scale, locale.decimalSeparator, locale.groupSeparator);
    } else {
      v = _formatNumber(value, currency.decimalDigits, '.', ',');
    }
    if (locale && includingCurrencySymbol) {
      const symbol = (locale.currencyCode === currencyCode ? locale.currencySymbol : currency.currencySymbol);
      switch (locale.currencyPattern) {
        case 0:
          v = symbol + v;
          break;
        case 1:
          v = '' + v + symbol;
          break;
        case 2:
          v = symbol + ' ' + v;
          break;
        case 3:
          v = '' + v + ' ' + symbol;
          break;
        default:
          break;
      }
    }
    return v;
  }
  static formatNumber(value: number, scale: number, locale: Locale): string {
    if (locale) {
      return _formatNumber(value, scale, locale.decimalSeparator, locale.groupSeparator);
    } else {
      return _formatNumber(value, scale, '.', ',');
    }
  }
  static format(v: number, format: string, locale: Locale): string {
    let f = _format(v, format);
    if (locale) {
      if (locale.decimalSeparator !== '.') {
        f = f.replace('.', '|');
        f = f.replace(resources._r3, locale.groupSeparator);
        f = f.replace('|', locale.decimalSeparator);
      } else if (locale.groupSeparator !== ',') {
        f = f.replace(resources._r3, locale.groupSeparator);
      }
      return f;
    } else {
      return f;
    }
  }
}
function _formatNumber(value: number, scale: number, decimalSeparator: string, groupSeparator: string): string {
  if (!value) {
    return '';
  }
  if (!groupSeparator && !decimalSeparator) {
    groupSeparator = ',';
    decimalSeparator = '.';
  }
  const s = (scale === 0 || scale ? value.toFixed(scale) : value.toString());
  const x = s.split('.', 2);
  const y = x[0];
  const arr = [];
  const len = y.length - 1;
  for (let k = 0; k < len; k++) {
    arr.push(y[len - k]);
    if ((k + 1) % 3 === 0) {
      arr.push(groupSeparator);
    }
  }
  arr.push(y[0]);
  if (x.length === 1) {
    return arr.reverse().join('');
  } else {
    return arr.reverse().join('') + decimalSeparator + x[1];
  }
}
function _format(a: any, b: any): string {
  let j: any, e: any, h: any, c: any;
  a = a + '';
  if (a == 0 || a == '0') return '0';
  if (!b || isNaN(+a)) return a;
  a = b.charAt(0) == '-' ? -a : +a, j = a < 0 ? a = -a : 0, e = b.match(/[^\d\-\+#]/g), h = e &&
    e[e.length - 1] || '.', e = e && e[1] && e[0] || ',', b = b.split(h), a = a.toFixed(b[1] && b[1].length),
  a = +a + '', d = b[1] && b[1].lastIndexOf('0'), c = a.split('.');
  if (!c[1] || c[1] && c[1].length <= d) a = (+a).toFixed(d + 1);
  d = b[0].split(e); b[0] = d.join('');
  let f = b[0] && b[0].indexOf('0');
  if (f > -1) for (; c[0].length < b[0].length - f;) c[0] = '0' + c[0];
  else +c[0] == 0 && (c[0] = '');
  a = a.split('.'); a[0] = c[0];
  if (c = d[1] && d[d.length - 1].length) {
    f = '';
    for (var d = a[0], k = d.length % c, g = 0, i = d.length; g < i; g++)
      f += d.charAt(g), !((g - k + 1) % c) && g < i - c && (f += e);
    a[0] = f;
  } a[1] = b[1] && a[1] ? h + a[1] : '';
  return (j ? '-' : '') + a[0] + a[1];
}
