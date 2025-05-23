"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var resources_1 = require("./resources");
var usd = {
  code: "USD",
  symbol: "$",
  decimalDigits: 2,
};
var r3 = /,/g;
function removePhoneFormat(phone) {
  return formatter.removePhoneFormat(phone);
}
exports.removePhoneFormat = removePhoneFormat;
function removeFaxFormat(fax) {
  return formatter.removeFaxFormat(fax);
}
exports.removeFaxFormat = removeFaxFormat;
function formatPhone(phone) {
  return formatter.formatPhone(phone);
}
exports.formatPhone = formatPhone;
function formatFax(fax) {
  return formatter.formatFax(fax);
}
exports.formatFax = formatFax;
function formatCurrency(value, currencyCode, locale, includingCurrencySymbol) {
  return formatter.formatCurrency(value, currencyCode, locale, includingCurrencySymbol);
}
exports.formatCurrency = formatCurrency;
function formatNumber(value, scale, locale) {
  return formatter.formatNumber(value, scale, locale);
}
exports.formatNumber = formatNumber;
function format(v, fmt, locale) {
  return formatter.format(v, fmt, locale);
}
exports.format = format;
var formatter = (function () {
  function formatter() {
  }
  formatter.removePhoneFormat = function (phone) {
    if (phone) {
      return phone.replace(formatter.phone, "");
    }
    else {
      return phone;
    }
  };
  formatter.removeFaxFormat = function (fax) {
    if (fax) {
      return fax.replace(formatter.phone, "");
    }
    else {
      return fax;
    }
  };
  formatter.formatPhone = function (phone) {
    if (!phone) {
      return "";
    }
    var s = phone;
    var x = formatter.removePhoneFormat(phone);
    if (x.length === 10) {
      var USNumber = x.match(formatter.usPhone);
      if (USNumber != null) {
        s = USNumber[1] + " " + USNumber[2] + "-" + USNumber[3];
      }
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
  formatter.formatFax = function (fax) {
    if (!fax) {
      return "";
    }
    var s = fax;
    var x = formatter.removePhoneFormat(fax);
    var l = x.length;
    if (l <= 6) {
      s = x;
    }
    else {
      if (x.substring(0, 2) !== "02") {
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
  formatter.formatCurrency = function (value, currencyCode, locale, includingCurrencySymbol) {
    if (value === undefined || value == null) {
      return "";
    }
    if (!currencyCode) {
      currencyCode = "USD";
    }
    var currency;
    currencyCode = currencyCode.toUpperCase();
    if (resources_1.resources.currency) {
      currency = resources_1.resources.currency(currencyCode);
    }
    if (!currency) {
      currency = usd;
    }
    var v;
    if (locale) {
      var scale = currency.decimalDigits;
      v = _formatNumber(value, scale, locale.decimalSeparator, locale.groupSeparator);
    }
    else {
      v = _formatNumber(value, currency.decimalDigits, ".", ",");
    }
    if (locale && includingCurrencySymbol) {
      var symbol = locale.currencyCode === currencyCode ? locale.currencySymbol : currency.symbol;
      switch (locale.currencyPattern) {
        case 0:
          v = symbol + v;
          break;
        case 1:
          v = "" + v + symbol;
          break;
        case 2:
          v = symbol + " " + v;
          break;
        case 3:
          v = "" + v + " " + symbol;
          break;
        default:
          break;
      }
    }
    return v;
  };
  formatter.formatNumber = function (v, scale, locale) {
    if (v === undefined || v == null) {
      return "";
    }
    if (locale) {
      return _formatNumber(v, scale, locale.decimalSeparator, locale.groupSeparator);
    }
    else {
      return _formatNumber(v, scale, ".", ",");
    }
  };
  formatter.format = function (v, fmt, locale) {
    if (v === undefined || v == null) {
      return "";
    }
    if (!fmt) {
      fmt = "#,###.00";
    }
    var f = _format(v, fmt);
    if (locale) {
      if (locale.decimalSeparator !== ".") {
        f = f.replace(".", "|");
        f = f.replace(r3, locale.groupSeparator);
        f = f.replace("|", locale.decimalSeparator);
      }
      else if (locale.groupSeparator !== ",") {
        f = f.replace(r3, locale.groupSeparator);
      }
      return f;
    }
    else {
      return f;
    }
  };
  formatter.phone = / |\-|\.|\(|\)/g;
  formatter.usPhone = /(\d{3})(\d{3})(\d{4})/;
  return formatter;
}());
exports.formatter = formatter;
function _formatNumber(v, scale, d, g) {
  if (!v) {
    return "";
  }
  if (!d && !g) {
    g = ",";
    d = ".";
  }
  else if (!g) {
    g = d === "," ? "." : ",";
  }
  var s = scale === 0 || scale ? v.toFixed(scale) : v.toString();
  var x = s.split(".", 2);
  var y = x[0];
  var arr = [];
  var len = y.length - 1;
  for (var k = 0; k < len; k++) {
    arr.push(y[len - k]);
    if ((k + 1) % 3 === 0) {
      arr.push(g);
    }
  }
  arr.push(y[0]);
  if (x.length === 1) {
    return arr.reverse().join("");
  }
  else {
    return arr.reverse().join("") + d + x[1];
  }
}
function _format(a, b) {
  var j, e, h, c;
  a = a + "";
  if (a == 0 || a == "0")
    return "0";
  if (!b || isNaN(+a))
    return a;
  (a = b.charAt(0) == "-" ? -a : +a),
    (j = a < 0 ? (a = -a) : 0),
    (e = b.match(/[^\d\-\+#]/g)),
    (h = (e && e[e.length - 1]) || "."),
    (e = (e && e[1] && e[0]) || ","),
    (b = b.split(h)),
    (a = a.toFixed(b[1] && b[1].length)),
    (a = +a + ""),
    (d = b[1] && b[1].lastIndexOf("0")),
    (c = a.split("."));
  if (!c[1] || (c[1] && c[1].length <= d))
    a = (+a).toFixed(d + 1);
  d = b[0].split(e);
  b[0] = d.join("");
  var f = b[0] && b[0].indexOf("0");
  if (f > -1)
    for (; c[0].length < b[0].length - f;)
      c[0] = "0" + c[0];
  else
    +c[0] == 0 && (c[0] = "");
  a = a.split(".");
  a[0] = c[0];
  if ((c = d[1] && d[d.length - 1].length)) {
    f = "";
    for (var d = a[0], k = d.length % c, g = 0, i = d.length; g < i; g++)
      (f += d.charAt(g)), !((g - k + 1) % c) && g < i - c && (f += e);
    a[0] = f;
  }
  a[1] = b[1] && a[1] ? h + a[1] : "";
  return (j ? "-" : "") + a[0] + a[1];
}
