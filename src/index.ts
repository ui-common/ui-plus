export * from './formatter';
export * from './resources';
export * from './ui';
export * from './uivalidator';
export * from './uievent';
export * from './service';
export * from './reflect';

export function removeHtmlTags(s?: string): string {
  return (s ? s.replace(/<.*?>/g, '') : '');
}
export function truncateText(text: string, max?: number): string {
  if (!text) {
    return '';
  }
  const m = max || 120;
  return (text.length <= m ? text :  text.slice(0, m) + '...');
}
export function toCamelCase(str: string, chr?: string, up?: boolean): string {
  const s = chr && chr.length > 0 ? chr : '-';
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
