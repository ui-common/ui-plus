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
export interface Locale {
  decimalSeparator: string;
  groupSeparator: string;
  currencyCode: string;
  currencySymbol: string;
  currencyPattern: number;
}
export interface CurrencyService {
  currency(currencyCode: string): Currency;
}
export function label(input: HTMLElement): string {
  return resources.label(input);
}
export function labelFromContainer(input: HTMLElement): string {
  return resources.labelFromContainer(input);
}
export function container(ctrl: HTMLElement): HTMLElement {
  return resources.container(ctrl);
}
// tslint:disable-next-line:class-name
export class resources {
  static date: DateService;
  static currency: CurrencyService;
  static resource: ResourceService;
  static label(input: HTMLElement): string {
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
        return resources.labelFromContainer(input);
      }
    } else {
      return resources.labelFromContainer(input);
    }
  }
  static labelFromContainer(input: HTMLElement): string {
    const parent = resources.container(input);
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
  static container(ctrl: HTMLElement): HTMLElement {
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
          }
        }
      }
    }
    return null;
  }
}
