import {Currency, Locale, resources} from './resources';

const usd: Currency = {
  code: 'USD',
  symbol: '$',
  decimalDigits: 2
};
const r3 = /,/g;
export function removePhoneFormat(phone: string): string {
  return formatter.removePhoneFormat(phone);
}
export function removeFaxFormat(fax: string): string {
  return formatter.removeFaxFormat(fax);
}
export function formatPhone(phone?: string|null): string {
  return formatter.formatPhone(phone);
}
export function formatFax(fax?: string|null): string {
  return formatter.formatFax(fax);
}
export function formatCurrency(value?: number|null, currencyCode?: string, locale?: Locale, includingCurrencySymbol?: boolean): string {
  return formatter.formatCurrency(value, currencyCode, locale, includingCurrencySymbol);
}
export function formatNumber(value?: number|null, scale?: number, locale?: Locale): string {
  return formatter.formatNumber(value, scale, locale);
}
export function format(v?: number|null, fmt?: string, locale?: Locale): string {
  return formatter.format(v, fmt, locale);
}
// tslint:disable-next-line:class-name
export class formatter {
  // private static _preg = / |\+|\-|\.|\(|\)/g;
  static phone = / |\-|\.|\(|\)/g;
  static usPhone = /(\d{3})(\d{3})(\d{4})/;
  static removePhoneFormat(phone: string): string {
    if (phone) {
      return phone.replace(formatter.phone, '');
    } else {
      return phone;
    }
  }
  static removeFaxFormat(fax: string): string {
    if (fax) {
      return fax.replace(formatter.phone, '');
    } else {
      return fax;
    }
  }
  static formatPhone(phone?: string|null): string {
    if (!phone) {
      return '';
    }
    // reformat phone number
    // 555 123-4567 or (+1) 555 123-4567
    let s = phone;
    const x = formatter.removePhoneFormat(phone);
    if (x.length === 10) {
      const USNumber = x.match(formatter.usPhone);
      if (USNumber != null) {
        s =  `${USNumber[1]} ${USNumber[2]}-${USNumber[3]}`;
      }
    } else if (x.length <= 3 && x.length > 0) {
      s = x;
    } else if (x.length > 3 && x.length < 7) {
      s = `${x.substring(0, 3)} ${x.substring(3, x.length)}`;
    } else if (x.length >= 7 && x.length < 10) {
      s = `${x.substring(0, 3)} ${x.substring(3, 6)}-${x.substring(6, x.length)}`;
    } else if (x.length >= 11) {
      const l = x.length;
      s = `${x.substring(0, l - 7)} ${x.substring(l - 7, l - 4)}-${x.substring(l - 4, l)}`;
      // formatedPhone = `(+${phoneNumber.charAt(0)}) ${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6, phoneNumber.length - 1)}`;
    }
    return s;
  }
  static formatFax(fax?: string|null): string {
    if (!fax) {
      return '';
    }
    // reformat phone number
    // 035-456745 or 02-1234567
    let s = fax;
    const x = formatter.removePhoneFormat(fax);
    const l = x.length;
    if (l <= 6) {
      s = x;
    } else {
      if (x.substring(0, 2) !== '02') {
        if (l <= 9) {
          s = `${x.substring(0, l - 6)}-${x.substring(l - 6, l)}`;
        } else {
          s = `${x.substring(0, l - 9)}-${x.substring(l - 9, l - 6)}-${x.substring(l - 6, l)}`;
        }
      } else {
        if (l <= 9) {
          s = `${x.substring(0, l - 7)}-${x.substring(l - 7, l)}`;
        } else {
          s = `${x.substring(0, l - 9)}-${x.substring(l - 9, l - 7)}-${x.substring(l - 7, l)}`;
        }
      }
    }
    return s;
  }
  static formatCurrency(value?: number|null, currencyCode?: string|null, locale?: Locale, includingCurrencySymbol?: boolean): string {
    if (value === undefined || value == null) {
      return '';
    }
    if (!currencyCode) {
      currencyCode = 'USD';
    }
    let currency: Currency|undefined;
    currencyCode = currencyCode.toUpperCase();
    if (resources.currency) {
      currency = resources.currency(currencyCode);
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
      const symbol = (locale.currencyCode === currencyCode ? locale.currencySymbol : currency.symbol);
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
  static formatNumber(v?: number|null, scale?: number, locale?: Locale): string {
    if (v === undefined || v == null) {
      return '';
    }
    if (locale) {
      return _formatNumber(v, scale, locale.decimalSeparator, locale.groupSeparator);
    } else {
      return _formatNumber(v, scale, '.', ',');
    }
  }
  static format(v?: number|null, fmt?: string, locale?: Locale): string {
    if (v === undefined || v == null) {
      return '';
    }
    if (!fmt) {
      fmt = '#,###.00';
    }
    let f = _format(v, fmt);
    if (locale) {
      if (locale.decimalSeparator !== '.') {
        f = f.replace('.', '|');
        f = f.replace(r3, locale.groupSeparator);
        f = f.replace('|', locale.decimalSeparator);
      } else if (locale.groupSeparator !== ',') {
        f = f.replace(r3, locale.groupSeparator);
      }
      return f;
    } else {
      return f;
    }
  }
}
function _formatNumber(v: number, scale?: number, d?: string, g?: string): string {
  if (!v) {
    return '';
  }
  if (!d && !g) {
    g = ',';
    d = '.';
  } else if (!g) {
    g = (d === ',' ? '.' : ',');
  }
  const s = (scale === 0 || scale ? v.toFixed(scale) : v.toString());
  const x = s.split('.', 2);
  const y = x[0];
  const arr: string[] = [];
  const len = y.length - 1;
  for (let k = 0; k < len; k++) {
    arr.push(y[len - k]);
    if ((k + 1) % 3 === 0) {
      arr.push(g);
    }
  }
  arr.push(y[0]);
  if (x.length === 1) {
    return arr.reverse().join('');
  } else {
    return arr.reverse().join('') + d + x[1];
  }
}
/* tslint:disable */
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
