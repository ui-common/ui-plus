export * from './resources';
export * from './formatter';
export * from './reflect';
export * from './formutil';
export * from './ui';
export * from './uivalidator';
export * from './uievent';
export * from './service';

export function fileSizeToString(bs: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bs <= 0) {
    return '0 Bytes';
  }
  const i = Math.floor(Math.log(bs) / Math.log(1024));
  const size = Math.round(bs / Math.pow(1024, i));
  return `${size} ${sizes[i]}`;
}
export function removeHtmlTags(s?: string): string {
  return (s ? s.replace(/<.*?>/g, '') : '');
}
export function truncateText(text: string, max?: number): string {
  const m = max || 100;
  return text ? (text.length <= m ? text : text.slice(0, m) + '...') : '';
}
export function toCamelCase(str: string, chr?: string, up?: boolean): string {
  const s = chr && chr.length > 0 ? chr : '_';
  const words = str.split(s);
  const v = words.map((word, index) => {
    if (word.length === 0) {
      return word;
    }
    if (index > 0 || up) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word.charAt(0).toLowerCase() + word.slice(1);
  });
  return v.join('');
}
export function kebabToSnackCase(s: string): string {
  return s.indexOf("-") >= 0 ? s.replace(/-/g, "_") : s;
}
export function snackToKebabCase(s: string): string {
  return s.indexOf("_") >= 0 ? s.replace(/_/g, "-") : s;
}
export function toURI(s: string): string {
  return s ? encodeURIComponent(s.toLowerCase().replace(/\s+/g, '-')) : ''; // replace space with dash
}
export function camelCaseToNormal(s: string): string {
  return s.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([a-zA-Z]+)/g, (_, word) => word.charAt(0).toUpperCase() + word.slice(1));
}
export const mapStringArray = (arr: string[], names: Map<string, string>) => {
  return arr.map((s: string, i: number) =>
    i === arr.length - 1 ? names.get(s) : `${names.get(s)}, `
  );
}
