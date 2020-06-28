// tslint:disable-next-line:class-name
export class validator {
  private static _emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/i;
  // private static _phoneRegex = /^[1]?[-. ]?(\(?([0-9]{3})\)?)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  // private static _phoneRegex2 = /^[+][1][-. ]?(\(?([0-9]{3})\)?)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  private static _passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  private static _urlReg = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  private static _intReg = /^\d+$/;
  private static _amountReg = /^[0-9]{0,15}(?:\.[0-9]{1,3})?$/; // const regExp = /\d+\.\d+/;
  private static _percentageReg = /^[1-9][0-9]?$|^100$/;
  private static _digitReg = /^\d+$/;
  private static _digitAndDashReg = /^[0-9-]*$/;
  private static _digitAndCharacterReg = /^\w*\d*$/;
  private static _checkNumberReg = /^\d{0,8}$/;
  private static _ipv4Reg = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  private static _ipv6Reg = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
  // For Canada Postal codes do not include the letters D, F, I, O, Q or U, and the first position also does not make use of the letters W or Z.
  private static _caPostCodeRegExp = /^[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy][0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz][ -]?[0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz][0-9]$/;
  private static _usPostCodeReg = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  static phonecodes: any = null;

  static isIPv4(ipv4: string): boolean {
    if (!ipv4 || ipv4.length === 0) {
      return false;
    }
    return validator._ipv4Reg.test(ipv4);
  }
  static isIPv6(ipv6: string): boolean {
    if (!ipv6 || ipv6.length === 0) {
      return false;
    }
    return validator._ipv6Reg.test(ipv6);
  }

  private static isEmpty(str: string): boolean {
    return (!str || str === '');
  }

  static isEmail(email: string): boolean {
    if (!email || email.length === 0) {
      return false;
    }
    return validator._emailReg.test(email);
  }

  static isFax(fax: string): boolean {
    return validator.isPhone(fax);
  }
  static isPhone(phone: string): boolean {
    // const intRegex = /^[1]?([0-9]{3})?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    // Ed. With optional brackets (actually parenthesis) for area code (untested):
    if (!phone || phone.length === 0) {
      return false;
    }
    if (phone.charAt(0) === '+' && validator.phonecodes) {
      const phoneNumber = phone.substring(1);
      if (validator.isDigitOnly(phoneNumber)) {
        for (let degit = 1; degit <= 3; degit++) {
          const countryCode = phoneNumber.substr(0, degit);
          if (countryCode in validator.phonecodes) {
            return true;
          }
        }
        return false;
      } else {
        return false;
      }
    } else {
      // return ValidationUtil._phoneRegex.test(phone) || ValidationUtil._phoneRegex2.test(phone);
      return validator.isDigitOnly(phone);
    }
  }

  static isValidPassword(password: string): boolean {
    return validator._passwordRegex.test(password);
  }

  /*private static _urlReg =/^(ftp|https?):\/\/+(www\.)?([0-9A-Za-z-\\
  .@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?/i;
      static isUrl(url: string): boolean {
        // let RegExp = //i;
        // return RegExp.test(url);
        return new RegExp('^(https?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.)' +
          '?([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?', 'i').test(url);
      },
      private static isUrl(url: string): boolean {
        // let RegExp = //i;
        // return RegExp.test(url);
        return new RegExp('^(https?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.)' +
          '?([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?', 'i').test(url);
    },*/
  static isValidPattern(patternStr: string, modifier: string, value: string): boolean {
    if (!validator.isEmpty(patternStr)) {
      if (!modifier) {
        modifier = 'g';
      }
      const pattern = new RegExp(patternStr, modifier);
      return pattern.test(value);
    } else {
      return false;
    }
  }

  static isUrl(url: string): boolean {
    return validator._urlReg.test(url);
  }

  static isInteger(a): boolean {
    return validator._intReg.test(a);
  }

  static isPercentage(a): boolean {
    return validator._percentageReg.test(a);
  }

  static isTime4(str: string): boolean {
    if (!str || str.length !== 4) {
      return false;
    }
    if (validator.isInteger(str) === false) {
      return false;
    }
    const hours = parseInt(str.substring(0, 2), null);
    const minutes = parseInt(str.substring(2), null);
    if (hours > 24 || minutes > 59) {
      return false;
    } else {
      return true;
    }
  }

  static isValidCode(str: string): boolean {
    return validator._digitAndCharacterReg.test(str);
  }

  static isDashCode(str: string): boolean {
    if (!str || str.length === 0) {
      return false;
    }
    const len = str.length - 1;
    for (let i = 0; i <= len; i++) {
      const chr = str.charAt(i);
      if (!((chr >= '0' && chr <= '9') || (chr >= 'A' && chr <= 'Z') || (chr >= 'a' && chr <= 'z') || chr === '-')) {
        return false;
      }
    }
    return true;
  }

  static isDigitOnly(str: string): boolean {
    if (!str) {
      return false;
    }
    return validator._digitReg.test(str);
  }

  static isDashDigit(stringRoutingNumber): boolean {
    return validator._digitAndDashReg.test(stringRoutingNumber);
  }

  static isCheckNumber(stringCheckNumber): boolean {
    return validator._checkNumberReg.test(stringCheckNumber);
  }

  static isAmountNumber(amountNumber): boolean {
    return validator._amountReg.test(amountNumber);
  }

  static isUSPostalCode(postalCode): boolean {
    return validator._usPostCodeReg.test(postalCode);
  }

  static isCAPostalCode(postalCode): boolean {
    // /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    return validator._caPostCodeRegExp.test(postalCode);
  }
}
