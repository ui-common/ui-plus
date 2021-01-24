"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formatter = (function () {
  function formatter() {
  }
  formatter.removePhoneFormat = function (phone) {
    if (phone) {
      return phone.replace(formatter.phone, '');
    }
    else {
      return phone;
    }
  };
  formatter.removeFaxFormat = function (fax) {
    if (fax) {
      return fax.replace(formatter.phone, '');
    }
    else {
      return fax;
    }
  };
  formatter.formatPhone = function (phone) {
    if (!phone) {
      return phone;
    }
    var s = phone;
    var x = formatter.removePhoneFormat(phone);
    if (x.length === 10) {
      var USNumber = x.match(formatter.usPhone);
      s = USNumber[1] + " " + USNumber[2] + "-" + USNumber[3];
    }
    else if (x.length <= 3 && x.length > 0) {
      s = x;
    }
    else if (x.length > 3 && x.length < 7) {
      s = x.substring(0, 3) + " " + x.substring(3, x.length);
    }
    else if (x.length >= 7 && x.length < 10) {
      s = x.substring(0, 3) + " " + x.substring(3, 6) + "-" + x.substring(6, x.length);
    }
    else if (x.length >= 11) {
      var l = x.length;
      s = x.substring(0, l - 7) + " " + x.substring(l - 7, l - 4) + "-" + x.substring(l - 4, l);
    }
    return s;
  };
  formatter.formatFax = function (phone) {
    if (!phone) {
      return phone;
    }
    var s = phone;
    var x = formatter.removePhoneFormat(phone);
    var l = x.length;
    if (l <= 6) {
      s = x;
    }
    else {
      if (x.substring(0, 2) !== '02') {
        if (l <= 9) {
          s = x.substring(0, l - 6) + "-" + x.substring(l - 6, l);
        }
        else {
          s = x.substring(0, l - 9) + "-" + x.substring(l - 9, l - 6) + "-" + x.substring(l - 6, l);
        }
      }
      else {
        if (l <= 9) {
          s = x.substring(0, l - 7) + "-" + x.substring(l - 7, l);
        }
        else {
          s = x.substring(0, l - 9) + "-" + x.substring(l - 9, l - 7) + "-" + x.substring(l - 7, l);
        }
      }
    }
    return s;
  };
  formatter.phone = / |\-|\.|\(|\)/g;
  formatter.usPhone = /(\d{3})(\d{3})(\d{4})/;
  return formatter;
}());
exports.formatter = formatter;
