// tslint:disable-next-line:class-name
export class formatter {
  // private static _preg = / |\+|\-|\.|\(|\)/g;
  static phone = / |\-|\.|\(|\)/g;
  static usPhone = /(\d{3})(\d{3})(\d{4})/;
  static removePhoneFormat(phone: string): string {
    if (phone) {
      return phone.replace(formatter.phone, '');
    } else {
      return phone;
    }
  }
  static removeFaxFormat(fax: string): string {
    if (fax) {
      return fax.replace(formatter.phone, '');
    } else {
      return fax;
    }
  }

  static formatPhone(phone: string): string {
    if (!phone) {
      return phone;
    }
    // reformat phone number
    // 555 123-4567 or (+1) 555 123-4567
    let s = phone;
    const x = formatter.removePhoneFormat(phone);
    if (x.length === 10) {
      const USNumber = x.match(formatter.usPhone);
      s =  `${USNumber[1]} ${USNumber[2]}-${USNumber[3]}`;
    } else if (x.length <= 3 && x.length > 0) {
      s = x;
    } else if (x.length > 3 && x.length < 7) {
      s = `${x.substring(0, 3)} ${x.substring(3, x.length)}`;
    } else if (x.length >= 7 && x.length < 10) {
      s = `${x.substring(0, 3)} ${x.substring(3, 6)}-${x.substring(6, x.length)}`;
    } else if (x.length >= 11) {
      const l = x.length;
      s = `${x.substring(0, l - 7)} ${x.substring(l - 7, l - 4)}-${x.substring(l - 4, l)}`;
      // formatedPhone = `(+${phoneNumber.charAt(0)}) ${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6, phoneNumber.length - 1)}`;
    }
    return s;
  }

  static formatFax(phone: string): string {
    if (!phone) {
      return phone;
    }
    // reformat phone number
    // 035-456745 or 02-1234567
    let s = phone;
    const x = formatter.removePhoneFormat(phone);
    const l = x.length;
    if (l <= 6) {
      s = x;
    } else {
      if (x.substring(0, 2) !== '02') {
        if (l <= 9) {
          s = `${x.substring(0, l - 6)}-${x.substring(l - 6, l)}`;
        } else {
          s = `${x.substring(0, l - 9)}-${x.substring(l - 9, l - 6)}-${x.substring(l - 6, l)}`;
        }
      } else {
        if (l <= 9) {
          s = `${x.substring(0, l - 7)}-${x.substring(l - 7, l)}`;
        } else {
          s = `${x.substring(0, l - 9)}-${x.substring(l - 9, l - 7)}-${x.substring(l - 7, l)}`;
        }
      }
    }
    return s;
  }
}
