export function valueOf(obj: any, key: string): any {
  const mapper = key.split('.').map(item => {
    return item.replace(/\[/g, '.[').replace(/\[|\]/g, '');
  });
  const reSplit = mapper.join('.').split('.');
  return reSplit.reduce((acc, current, index, source) => {
    const value = getDirectValue(acc, current);
    if (!value) {
      source.splice(1);
    }
    return value;
  }, obj);
}
export function getDirectValue(obj: any, key: string): any {
  if (obj && obj.hasOwnProperty(key)) {
    return obj[key];
  }
  return null;
}
export function setValue(obj: any, key: string, value: any): any {
  let replaceKey = key.replace(/\[/g, '.[').replace(/\.\./g, '.');
  if (replaceKey.indexOf('.') === 0) {
    replaceKey = replaceKey.slice(1, replaceKey.length);
  }
  const keys = replaceKey.split('.');
  let firstKey = keys.shift()
  if (!firstKey) {
    return;
  }
  const isArrayKey = /\[([0-9]+)\]/.test(firstKey);
  if (keys.length > 0) {
    const firstKeyValue = obj[firstKey] || {};
    const returnValue = setValue(firstKeyValue, keys.join('.'), value);
    return setKey(obj, isArrayKey, firstKey, returnValue);
  }
  return setKey(obj, isArrayKey, firstKey, value);
}
const setKey = (_object: any, _isArrayKey: boolean, _key: string, _nextValue: any) => {
  if (_isArrayKey) {
    if (_object.length > _key) {
      _object[_key] = _nextValue;
    } else {
      _object.push(_nextValue);
    }
  } else {
    _object[_key] = _nextValue;
  }
  return _object;
};
