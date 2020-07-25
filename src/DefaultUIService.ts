import {Locale} from './resources';
import {decodeFromForm, getValue} from './ui';
import {uievent} from './uievent';
import {buildErrorMessage, ErrorMessage, removeErrorMessage, removeFormError, showFormError, validateForm} from './uivalidator';

export class DefaultUIService {
  getValue(ctrl: any, locale?: Locale, currencyCode?: string): string|number|boolean {
    return getValue(ctrl, locale, currencyCode);
  }
  decodeFromForm(form: any, locale: Locale, currencyCode: string): any {
    return decodeFromForm(form, locale, currencyCode);
  }

  validateForm(form: any, locale: Locale, focusFirst?: boolean, scroll?: boolean): boolean {
    return validateForm(form, locale, focusFirst, scroll);
  }
  removeFormError(form: any): void {
    removeFormError(form);
  }
  removeErrorMessage(ctrl: any): void {
    removeErrorMessage(ctrl);
  }
  showFormError(form: any, errors: ErrorMessage[], focusFirst?: boolean): ErrorMessage[] {
    return showFormError(form, errors, focusFirst);
  }
  buildErrorMessage(errors: ErrorMessage[]): string {
    return buildErrorMessage(errors);
  }

  initMaterial(form: any): void {
    uievent.initMaterial(form);
  }
  numberOnFocus(event: any, locale: Locale): void {
    uievent.numberOnFocus(event, locale);
  }
  numberOnBlur(event: any, locale: Locale): void {
    uievent.numberOnBlur(event, locale);
  }
  percentageOnFocus(event: any, locale: Locale): void {
    uievent.percentageOnFocus(event, locale);
  }
  currencyOnFocus(event: any, locale: Locale, currencyCode: string): void {
    uievent.currencyOnFocus(event, locale, currencyCode);
  }
  currencyOnBlur(event: any, locale: Locale, currencyCode: string, includingCurrencySymbol: boolean): void {
    uievent.currencyOnBlur(event, locale, currencyCode, includingCurrencySymbol);
  }
  emailOnBlur(event: any): void {
    uievent.emailOnBlur(event);
  }
  urlOnBlur(event: any): void {
    uievent.urlOnBlur(event);
  }
  phoneOnBlur(event: any): void {
    uievent.phoneOnBlur(event);
  }
  faxOnBlur(event: any): void {
    uievent.faxOnBlur(event);
  }
  requiredOnBlur(event: any): void {
    uievent.requiredOnBlur(event);
  }
  patternOnBlur(event: any): void {
    uievent.patternOnBlur(event);
  }
}
