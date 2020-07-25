"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ui_1 = require("./ui");
var uievent_1 = require("./uievent");
var uivalidator_1 = require("./uivalidator");
var DefaultUIService = (function () {
  function DefaultUIService() {}
  DefaultUIService.prototype.getValue = function (ctrl, locale, currencyCode) {
    return ui_1.getValue(ctrl, locale, currencyCode);
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
  DefaultUIService.prototype.removeErrorMessage = function (ctrl) {
    uivalidator_1.removeErrorMessage(ctrl);
  };
  DefaultUIService.prototype.showFormError = function (form, errors, focusFirst) {
    return uivalidator_1.showFormError(form, errors, focusFirst);
  };
  DefaultUIService.prototype.buildErrorMessage = function (errors) {
    return uivalidator_1.buildErrorMessage(errors);
  };
  DefaultUIService.prototype.initMaterial = function (form) {
    uievent_1.uievent.initMaterial(form);
  };
  DefaultUIService.prototype.numberOnFocus = function (event, locale) {
    uievent_1.uievent.numberOnFocus(event, locale);
  };
  DefaultUIService.prototype.numberOnBlur = function (event, locale) {
    uievent_1.uievent.numberOnBlur(event, locale);
  };
  DefaultUIService.prototype.percentageOnFocus = function (event, locale) {
    uievent_1.uievent.percentageOnFocus(event, locale);
  };
  DefaultUIService.prototype.currencyOnFocus = function (event, locale, currencyCode) {
    uievent_1.uievent.currencyOnFocus(event, locale, currencyCode);
  };
  DefaultUIService.prototype.currencyOnBlur = function (event, locale, currencyCode, includingCurrencySymbol) {
    uievent_1.uievent.currencyOnBlur(event, locale, currencyCode, includingCurrencySymbol);
  };
  DefaultUIService.prototype.emailOnBlur = function (event) {
    uievent_1.uievent.emailOnBlur(event);
  };
  DefaultUIService.prototype.urlOnBlur = function (event) {
    uievent_1.uievent.urlOnBlur(event);
  };
  DefaultUIService.prototype.phoneOnBlur = function (event) {
    uievent_1.uievent.phoneOnBlur(event);
  };
  DefaultUIService.prototype.faxOnBlur = function (event) {
    uievent_1.uievent.faxOnBlur(event);
  };
  DefaultUIService.prototype.requiredOnBlur = function (event) {
    uievent_1.uievent.requiredOnBlur(event);
  };
  DefaultUIService.prototype.patternOnBlur = function (event) {
    uievent_1.uievent.patternOnBlur(event);
  };
  return DefaultUIService;
}());
exports.DefaultUIService = DefaultUIService;
