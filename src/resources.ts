export interface DateService {
  parse(value: string, format: string): Date;
}

export interface ResourceService {
  resource(): any;
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
  getLocale(id: string): Locale;
  getLocaleOrDefault(id: string): Locale;
  getZeroCurrencyByLanguage(language: string): void;
  getZeroCurrency(locale: Locale): void;
  formatCurrency(value: any, currencyCode: string, locale: Locale, includingCurrencySymbol?: boolean): string;
  formatInteger(value: any, locale: Locale): string;
  formatNumber(value: number, scale: number, locale: Locale): string;
  format(v: number, format: string, locale: Locale): string;
}

// tslint:disable-next-line:class-name
export class resources {
  static dateService: DateService = null;
  static currencyService: CurrencyService = null;
  static resourceService: ResourceService = null;
  static localeService: LocaleService = null;
}
