export * from './formatter';
export * from './resources';
export * from './ui';
export * from './uivalidator';
export * from './uievent';
export * from './service';
export * from './reflect';

export function toCamelCase(str: string): string {
  const words = str.split('.');
  const v = words.map((word, index) => {
    if (index === 0) {
      return word;
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  });
  return v.join('');
}
export function kebabToSnackCase(str: string): string {
  if (str.includes("-")) {
    return str.replace(/-/g, "_");
  }
  return str;
}
export function snackToKebabCase(str: string): string {
  if (str.includes("_")) {
    return str.replace(/_/g, "-");
  }
  return str;
}
export function camelCaseToNormal(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([a-zA-Z]+)/g, (_, word) => word.charAt(0).toUpperCase() + word.slice(1));
}
export const mapStringArray = (arr: string[], names: Map<string, string>) => {
  return arr.map((s: string, i: number) =>
    i === arr.length - 1 ? names.get(s) : `${names.get(s)}, `
  );
}
export function formatDate(d: Date | null | undefined, dateFormat?: string, upper?: boolean): string {
  if (!d) {
    return '';
  }
  let format = dateFormat && dateFormat.length > 0 ? dateFormat : 'M/D/YYYY';
  if (upper) {
    format = format.toUpperCase();
  }
  let valueItems = ['', '', ''];
  const dateItems = format.split(/\/|\.| |-/);
  let imonth  = dateItems.indexOf('M');
  let iday    = dateItems.indexOf('D');
  let iyear   = dateItems.indexOf('YYYY');
  let fu = false;
  if (imonth === -1) {
    imonth  = dateItems.indexOf('MM');
    fu = true;
  }
  if (iday === -1) {
    iday  = dateItems.indexOf('DD');
    fu = true;
  }
  if (iyear === -1) {
    iyear  = dateItems.indexOf('YY');
  }
  valueItems[iday] = getD(d.getDay(), fu);
  valueItems[imonth] = getD(d.getMonth() + 1, fu);
  valueItems[iyear] = d.getFullYear().toString();
  const s = detectSeparator(format);
  return valueItems.join(s);
}
function detectSeparator(format: string): string {
  const len = format.length;
  for (let i = 0; i < len; i++) {
    const c = format[i];
    if (!((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z'))) {
      return c;
    }
  }
  return '/';
}
function getD(n: number, fu: boolean): string {
  return fu ? pad(n) : n.toString();
}
export function formatDateTime(date: Date | null | undefined, dateFormat?: string): string {
  if (!date) {
    return "";
  }
  const sd = formatDate(date, dateFormat);
  if (sd.length === 0) {
    return sd;
  }
  return sd + " " + formatTime(date);
}
export function formatLongDateTime(date: Date | null | undefined, dateFormat?: string): string {
  if (!date) {
    return "";
  }
  const sd = formatDate(date, dateFormat);
  if (sd.length === 0) {
    return sd;
  }
  return sd + " " + formatLongTime(date);
}
export function formatTime(d: Date): string {
  return pad(d.getHours()) + ":" + pad(d.getMinutes());
}
export function formatLongTime(d: Date): string {
  return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
}
function pad(n: number): string {
  return n < 10 ? '0' + n : n.toString();
}
