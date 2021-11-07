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
export function label(input: HTMLElement): string {
  return resources.label(input);
}
export function labelFromContainer(input: HTMLElement): string {
  return resources.labelFromContainer(input);
}
export function container(ctrl: HTMLElement): HTMLElement|null {
  return resources.container(ctrl);
}
// tslint:disable-next-line:class-name
export class resources {
  static resource: ResourceService;
  static date?: (value: string, format: string) => Date;
  static currency?: (currencyCode: string) => Currency;

  static label(input: HTMLElement): string {
    if (!input || input.getAttribute('type') === 'hidden') {
      return '';
    }
    let l = input.getAttribute('label');
    if (l) {
      return l;
    } else if (!l || l.length === 0) {
      let key = input.getAttribute('key');
      if (!key || key.length === 0) {
        key = input.getAttribute('resource-key');
      }
      if (key !== null && key.length > 0) {
        l = resources.resource.value(key);
        input.setAttribute('label', l);
        return l;
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
        return first.nodeValue ? first.nodeValue : '';
      }
    } else if (parent && parent.nodeName !== 'LABEL') {
      if (parent.classList.contains('form-group') || parent.classList.contains('field')) {
        const firstChild = parent.firstChild;
        if (firstChild && firstChild.nodeName === 'LABEL') {
          return (firstChild as HTMLLabelElement).innerHTML;
        } else {
          return '';
        }
      } else {
        const node = parent.parentElement;
        if (node && node.nodeName === 'LABEL' && node.childNodes.length > 0) {
          const first = node.childNodes[0];
          if (first.nodeType === 3) {
            return first.nodeValue ? first.nodeValue : '';
          }
        }
      }
    }
    return '';
  }
  static container(ctrl: HTMLElement): HTMLElement|null {
    const p = ctrl.parentElement;
    if (!p) {
      return null;
    }
    if (p.nodeName === 'LABEL' || p.classList.contains('form-group') || p.classList.contains('field')) {
      return p;
    } else {
      const p1 = p.parentElement;
      if (!p1) {
        return null;
      }
      if (p1.nodeName === 'LABEL' || p1.classList.contains('form-group') || p1.classList.contains('field')) {
        return p1;
      } else {
        const p2 = p1.parentElement;
        if (!p2) {
          return null;
        }
        if (p2.nodeName === 'LABEL' || p2.classList.contains('form-group') || p2.classList.contains('field')) {
          return p2;
        } else {
          const p3 = p2.parentElement;
          if (!p3) {
            return null;
          }
          if (p3.nodeName === 'LABEL' || p3.classList.contains('form-group') || p3.classList.contains('field')) {
            return p3;
          }
        }
      }
    }
    return null;
  }
}
