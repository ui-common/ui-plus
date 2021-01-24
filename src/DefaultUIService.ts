import {Locale} from './resources';
import {decodeFromForm, getValue} from './ui';
import {initMaterial, numberOnFocus, numberOnBlur, percentageOnFocus, currencyOnFocus, requiredOnBlur, emailOnBlur, urlOnBlur, patternOnBlur, phoneOnBlur, faxOnBlur, currencyOnBlur} from './uievent';
import {buildErrorMessage, ErrorMessage, removeErrorMessage, removeFormError, showFormError, validateForm} from './uivalidator';

export class DefaultUIService {
  getValue(ctrl: HTMLInputElement, locale?: Locale, currencyCode?: string): string|number|boolean {
    return getValue(ctrl, locale, currencyCode);
  }
  decodeFromForm(form: HTMLFormElement, locale: Locale, currencyCode: string): any {
    return decodeFromForm(form, locale, currencyCode);
  }

  validateForm(form: HTMLFormElement, locale: Locale, focusFirst?: boolean, scroll?: boolean): boolean {
    return validateForm(form, locale, focusFirst, scroll);
  }
  removeFormError(form: HTMLFormElement): void {
    removeFormError(form);
  }
  removeErrorMessage(ctrl: HTMLInputElement): void {
    removeErrorMessage(ctrl);
  }
  showFormError(form: HTMLFormElement, errors: ErrorMessage[], focusFirst?: boolean): ErrorMessage[] {
    return showFormError(form, errors, focusFirst);
  }
  buildErrorMessage(errors: ErrorMessage[]): string {
    return buildErrorMessage(errors);
  }

  initMaterial(form: HTMLFormElement): void {
    initMaterial(form);
  }
  numberOnFocus(event: Event, locale: Locale): void {
    numberOnFocus(event, locale);
  }
  numberOnBlur(event: Event, locale: Locale): void {
    numberOnBlur(event, locale);
  }
  percentageOnFocus(event: Event, locale: Locale): void {
    percentageOnFocus(event, locale);
  }
  currencyOnFocus(event: Event, locale: Locale, currencyCode: string): void {
    currencyOnFocus(event, locale, currencyCode);
  }
  currencyOnBlur(event: Event, locale: Locale, currencyCode: string, includingCurrencySymbol: boolean): void {
    currencyOnBlur(event, locale, currencyCode, includingCurrencySymbol);
  }
  emailOnBlur(event: Event): void {
    emailOnBlur(event);
  }
  urlOnBlur(event: Event): void {
    urlOnBlur(event);
  }
  phoneOnBlur(event: Event): void {
    phoneOnBlur(event);
  }
  faxOnBlur(event: Event): void {
    faxOnBlur(event);
  }
  requiredOnBlur(event: Event): void {
    requiredOnBlur(event);
  }
  patternOnBlur(event: Event): void {
    patternOnBlur(event);
  }
}
