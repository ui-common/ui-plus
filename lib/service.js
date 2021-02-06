"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ui_1 = require("./ui");
var uievent_1 = require("./uievent");
var uivalidator_1 = require("./uivalidator");
var DefaultUIService = (function () {
  function DefaultUIService() {
  }
  DefaultUIService.prototype.getValue = function (el, locale, currencyCode) {
    return ui_1.getValue(el, locale, currencyCode);
  };
  DefaultUIService.prototype.decodeFromForm = function (form, locale, currencyCode) {
    return ui_1.decodeFromForm(form, locale, currencyCode);
  };
  DefaultUIService.prototype.validateForm = function (form, locale, focusFirst, scroll) {
    return uivalidator_1.validateForm(form, locale, focusFirst, scroll);
  };
  DefaultUIService.prototype.removeFormError = function (form) {
    uivalidator_1.removeFormError(form);
  };
  DefaultUIService.prototype.removeError = function (el) {
    uivalidator_1.removeError(el);
  };
  DefaultUIService.prototype.showFormError = function (form, errors, focusFirst) {
    return uivalidator_1.showFormError(form, errors, focusFirst);
  };
  DefaultUIService.prototype.buildErrorMessage = function (errors) {
    return uivalidator_1.buildErrorMessage(errors);
  };
  DefaultUIService.prototype.registerEvents = function (form) {
    uievent_1.registerEvents(form);
  };
  DefaultUIService.prototype.numberOnFocus = function (event, locale) {
    uievent_1.numberOnFocus(event, locale);
  };
  DefaultUIService.prototype.numberOnBlur = function (event, locale) {
    uievent_1.numberOnBlur(event, locale);
  };
  DefaultUIService.prototype.percentageOnFocus = function (event, locale) {
    uievent_1.percentageOnFocus(event, locale);
  };
  DefaultUIService.prototype.currencyOnFocus = function (event, locale, currencyCode) {
    uievent_1.currencyOnFocus(event, locale, currencyCode);
  };
  DefaultUIService.prototype.currencyOnBlur = function (event, locale, currencyCode, includingCurrencySymbol) {
    uievent_1.currencyOnBlur(event, locale, currencyCode, includingCurrencySymbol);
  };
  DefaultUIService.prototype.emailOnBlur = function (event) {
    uievent_1.emailOnBlur(event);
  };
  DefaultUIService.prototype.urlOnBlur = function (event) {
    uievent_1.urlOnBlur(event);
  };
  DefaultUIService.prototype.phoneOnBlur = function (event) {
    uievent_1.phoneOnBlur(event);
  };
  DefaultUIService.prototype.faxOnBlur = function (event) {
    uievent_1.faxOnBlur(event);
  };
  DefaultUIService.prototype.requiredOnBlur = function (event) {
    uievent_1.requiredOnBlur(event);
  };
  DefaultUIService.prototype.patternOnBlur = function (event) {
    uievent_1.patternOnBlur(event);
  };
  return DefaultUIService;
}());
exports.DefaultUIService = DefaultUIService;
