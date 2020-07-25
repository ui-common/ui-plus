"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formatter = (function () {
  function formatter() {}
  formatter.removePhoneFormat = function (phone) {
    if (phone) {
      return phone.replace(formatter._preg, '');
    }
    else {
      return phone;
    }
  };
  formatter.removeFaxFormat = function (fax) {
    if (fax) {
      return fax.replace(formatter._preg, '');
    }
    else {
      return fax;
    }
  };
  formatter.formatPhone = function (phoneNumber1) {
    if (!phoneNumber1) {
      return phoneNumber1;
    }
    var formatedPhone = phoneNumber1;
    var phoneNumber = formatter.removePhoneFormat(phoneNumber1);
    if (phoneNumber.length === 10) {
      var USNumber = phoneNumber.match(formatter._us_phone_reg);
      formatedPhone = USNumber[1] + " " + USNumber[2] + "-" + USNumber[3];
    }
    else if (phoneNumber.length <= 3 && phoneNumber.length > 0) {
      formatedPhone = phoneNumber;
    }
    else if (phoneNumber.length > 3 && phoneNumber.length < 7) {
      formatedPhone = phoneNumber.substring(0, 3) + " " + phoneNumber.substring(3, phoneNumber.length);
    }
    else if (phoneNumber.length >= 7 && phoneNumber.length < 10) {
      formatedPhone = phoneNumber.substring(0, 3) + " " + phoneNumber.substring(3, 6) + "-" + phoneNumber.substring(6, phoneNumber.length);
    }
    else if (phoneNumber.length >= 11) {
      var l = phoneNumber.length;
      formatedPhone = phoneNumber.substring(0, l - 7) + " " + phoneNumber.substring(l - 7, l - 4) + "-" + phoneNumber.substring(l - 4, l);
    }
    return formatedPhone;
  };
  formatter.formatFax = function (phoneNumber1) {
    if (!phoneNumber1) {
      return phoneNumber1;
    }
    var formatedPhone = phoneNumber1;
    var phoneNumber = formatter.removePhoneFormat(phoneNumber1);
    var l = phoneNumber.length;
    if (l <= 6) {
      formatedPhone = phoneNumber;
    }
    else {
      if (phoneNumber.substring(0, 2) !== '02') {
        if (l <= 9) {
          formatedPhone = phoneNumber.substring(0, l - 6) + "-" + phoneNumber.substring(l - 6, l);
        }
        else {
          formatedPhone = phoneNumber.substring(0, l - 9) + "-" + phoneNumber.substring(l - 9, l - 6) + "-" + phoneNumber.substring(l - 6, l);
        }
      }
      else {
        if (l <= 9) {
          formatedPhone = phoneNumber.substring(0, l - 7) + "-" + phoneNumber.substring(l - 7, l);
        }
        else {
          formatedPhone = phoneNumber.substring(0, l - 9) + "-" + phoneNumber.substring(l - 9, l - 7) + "-" + phoneNumber.substring(l - 7, l);
        }
      }
    }
    return formatedPhone;
  };
  formatter._preg = / |\-|\.|\(|\)/g;
  formatter._us_phone_reg = /(\d{3})(\d{3})(\d{4})/;
  return formatter;
}());
exports.formatter = formatter;
