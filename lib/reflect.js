"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function valueOf(obj, key) {
  var mapper = key.split('.').map(function (item) {
    return item.replace(/\[/g, '.[').replace(/\[|\]/g, '');
  });
  var reSplit = mapper.join('.').split('.');
  return reSplit.reduce(function (acc, current, index, source) {
    var value = getDirectValue(acc, current);
    if (!value) {
      source.splice(1);
    }
    return value;
  }, obj);
}
exports.valueOf = valueOf;
function getDirectValue(obj, key) {
  if (obj && obj.hasOwnProperty(key)) {
    return obj[key];
  }
  return null;
}
exports.getDirectValue = getDirectValue;
function setValue(obj, key, value) {
  var replaceKey = key.replace(/\[/g, '.[').replace(/\.\./g, '.');
  if (replaceKey.indexOf('.') === 0) {
    replaceKey = replaceKey.slice(1, replaceKey.length);
  }
  var keys = replaceKey.split('.');
  var firstKey = keys.shift();
  if (!firstKey) {
    return;
  }
  var isArrayKey = /\[([0-9]+)\]/.test(firstKey);
  if (keys.length > 0) {
    var firstKeyValue = obj[firstKey] || {};
    var returnValue = setValue(firstKeyValue, keys.join('.'), value);
    return setKey(obj, isArrayKey, firstKey, returnValue);
  }
  return setKey(obj, isArrayKey, firstKey, value);
}
exports.setValue = setValue;
var setKey = function (_object, _isArrayKey, _key, _nextValue) {
  if (_isArrayKey) {
    if (_object.length > _key) {
      _object[_key] = _nextValue;
    }
    else {
      _object.push(_nextValue);
    }
  }
  else {
    _object[_key] = _nextValue;
  }
  return _object;
};
