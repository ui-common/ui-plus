// tslint:disable-next-line:class-name
export class reflect {
  private static getDirectValue = (object, key) => {
    if (object && object.hasOwnProperty(key)) {
      return object[key];
    }
    return null;
  }

  static valueOf = (obj, key: string) => {
    const mapper = key.split('.').map(item => {
      return item.replace(/\[/g, '.[').replace(/\[|\]/g, '');
    });
    const reSplit = mapper.join('.').split('.');
    return reSplit.reduce((acc, current, index, source) => {
      const value = reflect.getDirectValue(acc, current);
      if (!value) {
        source.splice(1);
      }
      return value;
    }, obj);
  }

  static setValue(obj: any, key: string, value: any) {
    let replaceKey = key.replace(/\[/g, '.[').replace(/\.\./g, '.');
    if (replaceKey.indexOf('.') === 0) {
      replaceKey = replaceKey.slice(1, replaceKey.length);
    }
    const keys = replaceKey.split('.');
    let firstKey;
    firstKey = keys.shift();
    const isArrayKey = /\[([0-9]+)\]/.test(firstKey);
    // let copy;
    // if (isArrayKey && (Array.isArray(obj) || (obj === undefined || obj === null))) {
    //   copy = obj ? [...obj] : [];
    //   firstKey = parseInt(firstKey.replace(/\[|\]/, ''), 2);
    // } else if (!isArrayKey && (!Array.isArray(obj) || (obj === undefined || obj === null))) {
    //   copy = obj ? Object.assign({}, obj) : {};
    // } else {
    //   throw new Error('Object type not match keyPath: ' + key);
    // }

    const setKey = (_object, _isArrayKey, _key, _nextValue) => {
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

    if (keys.length > 0) {
      const firstKeyValue = obj[firstKey] || {};
      const returnValue = reflect.setValue(firstKeyValue, keys.join('.'), value);
      return setKey(obj, isArrayKey, firstKey, returnValue);
    }
    return setKey(obj, isArrayKey, firstKey, value);
  }
}


