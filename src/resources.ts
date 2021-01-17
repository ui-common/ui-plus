export interface DateService {
  parse(value: string, format: string): Date;
}
export interface StringMap {
  [key: string]: string;
}
export interface ResourceService {
  resource(): StringMap;
  value(key: string, param?: any): string;
  format(...args: any[]): string;
}

export interface Currency {
  currencyCode?: string;
  currencySymbol: string;
  decimalDigits: number;
}

export interface Locale {
  id?: string;
  countryCode: string;
  dateFormat: string;
  firstDayOfWeek: number;
  decimalSeparator: string;
  groupSeparator: string;
  decimalDigits: number;
  currencyCode: string;
  currencySymbol: string;
  currencyPattern: number;
  currencySample?: string;
}

export interface CurrencyService {
  getCurrency(currencyCode: string): Currency;
}

export interface LocaleService {
  formatCurrency(value: any, currencyCode: string, locale: Locale, includingCurrencySymbol?: boolean): string;
  formatNumber(value: number, scale: number, locale: Locale): string;
  format(v: number, format: string, locale: Locale): string;
}

// tslint:disable-next-line:class-name
export class resources {
  static dateService: DateService;
  static currencyService: CurrencyService;
  static resourceService: ResourceService;
  static localeService: LocaleService;
}
