import {reflect} from './reflect';
import {ui, Locale} from './ui';
import {uievent} from './uievent';
import {uivalidator, ErrorMessage} from './uivalidator';

export class DefaultUIService {
  setValue(obj: any, key: string, value: any) {
    reflect.setValue(obj, key, value);
  }

  getValue(ctrl: any, locale?: Locale, currencyCode?: string): string|number|boolean {
    return ui.getValue(ctrl, locale, currencyCode);
  }
  getControlFromForm(form: any, childName: string): any {
    return ui.getControlFromForm(form, childName);
  }
  getControlContainer(ctrl: any): any {
    return ui.getControlContainer(ctrl);
  }
  isEmpty(ctrl: any): boolean {
    return ui.isEmpty(ctrl);
  }
  focusFirstControl(form: any): void {
    ui.focusFirstControl(form);
  }
  focusErrorControl(form: any): void {
    ui.focusErrorControl(form);
  }
  bindToForm(form: any, obj: any): void {
    ui.bindToForm(form, obj);
  }
  decodeFromForm(form: any, locale: Locale, currencyCode: string): any {
    return ui.decodeFromForm(form, locale, currencyCode);
  }
  setReadOnlyForm(form: any): void {
    return ui.setReadOnlyForm(form);
  }
  getAllDataFields(form: any): any[] {
    return ui.getAllDataFields(form);
  }

  validateForm(form: any, locale: Locale, focusFirst?: boolean, scroll?: boolean): boolean {
    return uivalidator.validateForm(form, locale, focusFirst, scroll);
  }
  validateControl(ctrl: any, locale: Locale): boolean {
    return uivalidator.validateControl(ctrl, locale);
  }
  validateControls(controls: any, locale: Locale): boolean {
    return uivalidator.validateControls(controls, locale);
  }
  removeFormError(form: any): void {
    uivalidator.removeFormError(form);
  }
  removeErrorMessage(ctrl: any): void {
    uivalidator.removeErrorMessage(ctrl);
  }
  showFormError(form: any, errors: ErrorMessage[], focusFirst?: boolean): ErrorMessage[] {
    return uivalidator.showFormError(form, errors, focusFirst);
  }
  buildErrorMessage(errors: ErrorMessage[]): string {
    return uivalidator.buildErrorMessage(errors);
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
