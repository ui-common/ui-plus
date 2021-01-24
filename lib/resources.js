"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var usd = {
  currencyCode: 'USD',
  currencySymbol: '$',
  decimalDigits: 2
};
function getLabel(input) {
  if (!input || input.getAttribute('type') === 'hidden') {
    return '';
  }
  var label = input.getAttribute('label');
  if (label) {
    return label;
  }
  else if (!label || label.length === 0) {
    var key = input.getAttribute('key');
    if (!key || key.length === 0) {
      key = input.getAttribute('resource-key');
    }
    if (key !== null && key.length > 0) {
      label = resources.resource.value(key);
      input.setAttribute('label', label);
      return label;
    }
    else {
      return getLabelFromContainer(input);
    }
  }
  else {
    return getLabelFromContainer(input);
  }
}
exports.getLabel = getLabel;
function getLabelFromContainer(input) {
  var parent = container(input);
  if (parent && parent.nodeName === 'LABEL' && parent.childNodes.length > 0) {
    var first = parent.childNodes[0];
    if (first.nodeType === 3) {
      return first.nodeValue;
    }
  }
  else if (parent && parent.nodeName !== 'LABEL') {
    if (parent.classList.contains('form-group') || parent.classList.contains('field')) {
      var firstChild = parent.firstChild;
      if (firstChild.nodeName === 'LABEL') {
        return firstChild.innerHTML;
      }
      else {
        return '';
      }
    }
    else {
      var node = parent.parentElement;
      if (node && node.nodeName === 'LABEL' && node.childNodes.length > 0) {
        var first = node.childNodes[0];
        if (first.nodeType === 3) {
          return first.nodeValue;
        }
      }
    }
  }
  return '';
}
function container(ctrl) {
  var p = ctrl.parentElement;
  if (p.nodeName === 'LABEL' || p.classList.contains('form-group') || p.classList.contains('field')) {
    return p;
  }
  else {
    var p1 = p.parentElement;
    if (p1.nodeName === 'LABEL' || p1.classList.contains('form-group') || p1.classList.contains('field')) {
      return p1;
    }
    else {
      var p2 = p1.parentElement;
      if (p2.nodeName === 'LABEL' || p2.classList.contains('form-group') || p2.classList.contains('field')) {
        return p2;
      }
      else {
        var p3 = p2.parentElement;
        if (p3.nodeName === 'LABEL' || p3.classList.contains('form-group') || p3.classList.contains('field')) {
          return p3;
        }
        else {
          return null;
        }
      }
    }
  }
}
exports.container = container;
var resources = (function () {
  function resources() {
  }
  resources.getLabel = function (input) {
    return getLabel(input);
  };
  resources.container = function (ctrl) {
    return container(ctrl);
  };
  resources.formatCurrency = function (value, currencyCode, locale, includingCurrencySymbol) {
    if (!value) {
      return '';
    }
    if (!currencyCode) {
      currencyCode = 'USD';
    }
    var currency;
    currencyCode = currencyCode.toUpperCase();
    if (resources.currency) {
      currency = resources.currency.getCurrency(currencyCode);
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
      v = _formatNumber(value, currency.decimalDigits, '.', ',');
    }
    if (locale && includingCurrencySymbol) {
      var symbol = (locale.currencyCode === currencyCode ? locale.currencySymbol : currency.currencySymbol);
      switch (locale.currencyPattern) {
        case 0:
          v = symbol + v;
          break;
        case 1:
          v = '' + v + symbol;
          break;
        case 2:
          v = symbol + ' ' + v;
          break;
        case 3:
          v = '' + v + ' ' + symbol;
          break;
        default:
          break;
      }
    }
    return v;
  };
  resources.formatNumber = function (value, scale, locale) {
    if (locale) {
      return _formatNumber(value, scale, locale.decimalSeparator, locale.groupSeparator);
    }
    else {
      return _formatNumber(value, scale, '.', ',');
    }
  };
  resources.format = function (v, format, locale) {
    var f = _format(v, format);
    if (locale) {
      if (locale.decimalSeparator !== '.') {
        f = f.replace('.', '|');
        f = f.replace(resources._r3, locale.groupSeparator);
        f = f.replace('|', locale.decimalSeparator);
      }
      else if (locale.groupSeparator !== ',') {
        f = f.replace(resources._r3, locale.groupSeparator);
      }
      return f;
    }
    else {
      return f;
    }
  };
  resources._r3 = /,/g;
  return resources;
}());
exports.resources = resources;
function _formatNumber(value, scale, decimalSeparator, groupSeparator) {
  if (!value) {
    return '';
  }
  if (!groupSeparator && !decimalSeparator) {
    groupSeparator = ',';
    decimalSeparator = '.';
  }
  var s = (scale === 0 || scale ? value.toFixed(scale) : value.toString());
  var x = s.split('.', 2);
  var y = x[0];
  var arr = [];
  var len = y.length - 1;
  for (var k = 0; k < len; k++) {
    arr.push(y[len - k]);
    if ((k + 1) % 3 === 0) {
      arr.push(groupSeparator);
    }
  }
  arr.push(y[0]);
  if (x.length === 1) {
    return arr.reverse().join('');
  }
  else {
    return arr.reverse().join('') + decimalSeparator + x[1];
  }
}
function _format(a, b) {
  var j, e, h, c;
  a = a + '';
  if (a == 0 || a == '0')
    return '0';
  if (!b || isNaN(+a))
    return a;
  a = b.charAt(0) == '-' ? -a : +a, j = a < 0 ? a = -a : 0, e = b.match(/[^\d\-\+#]/g), h = e &&
    e[e.length - 1] || '.', e = e && e[1] && e[0] || ',', b = b.split(h), a = a.toFixed(b[1] && b[1].length),
    a = +a + '', d = b[1] && b[1].lastIndexOf('0'), c = a.split('.');
  if (!c[1] || c[1] && c[1].length <= d)
    a = (+a).toFixed(d + 1);
  d = b[0].split(e);
  b[0] = d.join('');
  var f = b[0] && b[0].indexOf('0');
  if (f > -1)
    for (; c[0].length < b[0].length - f;)
      c[0] = '0' + c[0];
  else
    +c[0] == 0 && (c[0] = '');
  a = a.split('.');
  a[0] = c[0];
  if (c = d[1] && d[d.length - 1].length) {
    f = '';
    for (var d = a[0], k = d.length % c, g = 0, i = d.length; g < i; g++)
      f += d.charAt(g), !((g - k + 1) % c) && g < i - c && (f += e);
    a[0] = f;
  }
  a[1] = b[1] && a[1] ? h + a[1] : '';
  return (j ? '-' : '') + a[0] + a[1];
}
