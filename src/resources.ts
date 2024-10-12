export interface ResourceService {
  value(key: string, param?: any): string;
  format(f: string, ...args: any[]): string;
}
export interface Currency {
  code?: string;
  symbol: string;
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
export function parseDate(v: string, format?: string): Date | null | undefined {
  if (!format || format.length === 0) {
    format = 'MM/DD/YYYY';
  } else {
    format = format.toUpperCase();
  }
  const dateItems = format.split(/\/|\.| |-/);
  const valueItems = v.split(/\/|\.| |-/);
  let imonth  = dateItems.indexOf('M');
  let iday    = dateItems.indexOf('D');
  let iyear   = dateItems.indexOf('YYYY');
  if (imonth === -1) {
    imonth  = dateItems.indexOf('MM');
  }
  if (iday === -1) {
    iday  = dateItems.indexOf('DD');
  }
  if (iyear === -1) {
    iyear  = dateItems.indexOf('YY');
  }
  const month = parseInt(valueItems[imonth], 10) - 1;
  let year = parseInt(valueItems[iyear], 10);
  if (year < 100) {
    year += 2000;
  }
  const day = parseInt(valueItems[iday], 10);
  return new Date(year, month, day);
}
// tslint:disable-next-line:class-name
export class resources {
  static resource: ResourceService;
  static date?: (value: string, format: string) => Date|null|undefined = parseDate;
  static currency?: (currencyCode: string) => Currency|undefined;

  static label(input: HTMLElement): string {
    if (!input) {
      return '';
    }
    let l = input.getAttribute('data-label');
    if (l) {
      return l;
    } else if (!l || l.length === 0) {
      let key = input.getAttribute('data-resource');
      /*
      if (!key || key.length === 0) {
        key = input.getAttribute('resource-key');
      }*/
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
export function findParent(ele: HTMLElement, className: string): HTMLElement|null {
  let p: HTMLElement|null = ele
  while (true) {
    p = p.parentElement;
    if (!p) {
      return null;
    }
    if (p.classList.contains(className)) {
      return p
    }
  }
}
export function toggleClass(ele: HTMLElement, className: string): boolean {
  if (ele.classList.contains(className)) {
    ele.classList.remove(className);
    return false;
  } else {
    ele.classList.add(className);
    return true;
  }
}
