// tslint:disable-next-line:class-name
export class formatter {
  // private static _preg = / |\+|\-|\.|\(|\)/g;
  private static _preg = / |\-|\.|\(|\)/g;
  private static _us_phone_reg = /(\d{3})(\d{3})(\d{4})/;
  public static removePhoneFormat(phone: string): string {
    if (phone) {
      return phone.replace(formatter._preg, '');
    } else {
      return phone;
    }
  }
  public static removeFaxFormat(fax: string): string {
    if (fax) {
      return fax.replace(formatter._preg, '');
    } else {
      return fax;
    }
  }

  public static formatPhone(phoneNumber1): string {
    if (!phoneNumber1) {
      return phoneNumber1;
    }
    // reformat phone number
    // 555 123-4567 or (+1) 555 123-4567
    let formatedPhone = phoneNumber1;
    const phoneNumber = formatter.removePhoneFormat(phoneNumber1);
    if (phoneNumber.length === 10) {
      const USNumber = phoneNumber.match(formatter._us_phone_reg);
      formatedPhone =  `${USNumber[1]} ${USNumber[2]}-${USNumber[3]}`;
    } else if (phoneNumber.length <= 3 && phoneNumber.length > 0) {
      formatedPhone = phoneNumber;
    } else if (phoneNumber.length > 3 && phoneNumber.length < 7) {
      formatedPhone = `${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3, phoneNumber.length)}`;
    } else if (phoneNumber.length >= 7 && phoneNumber.length < 10) {
      formatedPhone = `${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6, phoneNumber.length)}`;
    } else if (phoneNumber.length >= 11) {
      const l = phoneNumber.length;
      formatedPhone = `${phoneNumber.substring(0, l - 7)} ${phoneNumber.substring(l - 7, l - 4)}-${phoneNumber.substring(l - 4, l)}`;
      // formatedPhone = `(+${phoneNumber.charAt(0)}) ${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6, phoneNumber.length - 1)}`;
    }
    return formatedPhone;
  }

  public static formatFax(phoneNumber1): string {
    if (!phoneNumber1) {
      return phoneNumber1;
    }
    // reformat phone number
    // 035-456745 or 02-1234567
    let formatedPhone = phoneNumber1;
    const phoneNumber = formatter.removePhoneFormat(phoneNumber1);
    const l = phoneNumber.length;
    if (l <= 6) {
      formatedPhone = phoneNumber;
    } else {
      if (phoneNumber.substring(0, 2) !== '02') {
        if (l <= 9) {
          formatedPhone = `${phoneNumber.substring(0, l - 6)}-${phoneNumber.substring(l - 6, l)}`;
        } else {
          formatedPhone = `${phoneNumber.substring(0, l - 9)}-${phoneNumber.substring(l - 9, l - 6)}-${phoneNumber.substring(l - 6, l)}`;
        }
      } else {
        if (l <= 9) {
          formatedPhone = `${phoneNumber.substring(0, l - 7)}-${phoneNumber.substring(l - 7, l)}`;
        } else {
          formatedPhone = `${phoneNumber.substring(0, l - 9)}-${phoneNumber.substring(l - 9, l - 7)}-${phoneNumber.substring(l - 7, l)}`;
        }
      }
    }
    return formatedPhone;
  }
}
