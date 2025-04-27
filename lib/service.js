"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ui_1 = require("./ui");
var uievent_1 = require("./uievent");
var uivalidator_1 = require("./uivalidator");
var UIService = (function () {
  function UIService() {
  }
  UIService.prototype.getValue = function (el, locale, currencyCode) {
    return ui_1.getValue(el, locale, currencyCode);
  };
  UIService.prototype.decodeFromForm = function (form, locale, currencyCode) {
    return ui_1.decodeFromForm(form, locale, currencyCode);
  };
  UIService.prototype.validateForm = function (form, locale, focusFirst, scroll) {
    return uivalidator_1.validateForm(form, locale, focusFirst, scroll);
  };
  UIService.prototype.removeFormError = function (form) {
    uivalidator_1.removeFormError(form);
  };
  UIService.prototype.removeError = function (el) {
    uivalidator_1.removeError(el);
  };
  UIService.prototype.showFormError = function (form, errors, focusFirst) {
    return uivalidator_1.showFormError(form, errors, focusFirst);
  };
  UIService.prototype.buildErrorMessage = function (errors) {
    return uivalidator_1.buildErrorMessage(errors);
  };
  UIService.prototype.registerEvents = function (form) {
    uievent_1.registerEvents(form);
  };
  UIService.prototype.numberOnFocus = function (event, locale) {
    uievent_1.numberOnFocus(event, locale);
  };
  UIService.prototype.numberOnBlur = function (event, locale) {
    uievent_1.numberOnBlur(event, locale);
  };
  UIService.prototype.percentageOnFocus = function (event, locale) {
    uievent_1.percentageOnFocus(event, locale);
  };
  UIService.prototype.currencyOnFocus = function (event, locale, currencyCode) {
    uievent_1.currencyOnFocus(event, locale, currencyCode);
  };
  UIService.prototype.currencyOnBlur = function (event, locale, currencyCode, includingCurrencySymbol) {
    uievent_1.currencyOnBlur(event, locale, currencyCode, includingCurrencySymbol);
  };
  UIService.prototype.emailOnBlur = function (event) {
    uievent_1.emailOnBlur(event);
  };
  UIService.prototype.urlOnBlur = function (event) {
    uievent_1.urlOnBlur(event);
  };
  UIService.prototype.phoneOnBlur = function (event) {
    uievent_1.phoneOnBlur(event);
  };
  UIService.prototype.faxOnBlur = function (event) {
    uievent_1.faxOnBlur(event);
  };
  UIService.prototype.requiredOnBlur = function (event) {
    uievent_1.requiredOnBlur(event);
  };
  UIService.prototype.patternOnBlur = function (event) {
    uievent_1.patternOnBlur(event);
  };
  return UIService;
}());
exports.UIService = UIService;
