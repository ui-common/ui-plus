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
