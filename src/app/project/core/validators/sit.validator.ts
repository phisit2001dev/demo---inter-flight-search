import { SelectionModel } from '@angular/cdk/collections';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Injectable } from '@angular/core';

enum MsgError {
  REQUIRE = 'This field is required.',
  INVALID_FORMAT = 'Invalid format.'
}

/**
 * Version: 20180712.0953
 */
@Injectable()
export class SITValidators {
  /**
   * ตรวจสอบค่าว่าง
   * @param control
   */
  static isRequire(control: AbstractControl): ValidationErrors | null {
    const isEmpty = Validators.required(control);

    let noLength = false;
    if (typeof control.value === 'string') {
      noLength = control.value.trim().length === 0;
    } else if (control.value != null && typeof Array.isArray(control.value)) {
      noLength = control.value.length === 0;
    }

    if (isEmpty || noLength) {
      return SITValidators.generateInvalidReturnValue(MsgError.REQUIRE);
    }

    return null;
  }

  /**
   * ตรวจสอบค่าว่าง
   * @param control
   */
  static isRequireChip(control: AbstractControl): ValidationErrors | null {
    // const isEmpty = Validators.required(control);

    // let noLength = false;
    // if (typeof control.value === 'string') {
    //   noLength = control.value.trim().length === 0;
    // } else if (control.value != null && typeof Array.isArray(control.value)) {
    //   noLength = control.value.length === 0;
    // }

    // if (isEmpty || noLength) {
    //   return SITValidators.generateInvalidReturnValue('This field is required.');
    // }

    return null;
  }

  static isRequireCheckbox(control: AbstractControl): ValidationErrors | null {
    const isEmpty = Validators.required(control);

    if (isEmpty) {
      return SITValidators.generateInvalidReturnValue(MsgError.REQUIRE);
    }

    if (!control.value) {
      return SITValidators.generateInvalidReturnValue(MsgError.REQUIRE);

    }

    return null;
  }

    /**
   * Validate for Mat-Datepicker
   */
  static is_DatePicker(): ValidatorFn {
    // dateMaskInput:HTMLInputElement
    return (control: AbstractControl): ValidationErrors | null => {
      const dateValue = control.value as string;
      // ทำเมื่อ change แล้ว
      // เพื่อกันตอน submit กรณีที่ค่าถูก default มาเป็น null และไม่มีการ required จะได้ไม่ติด Invalid date format
      if (control.dirty) {
        const isEmpty = SITValidators.isRequire(control);
        // ถ้า dateValue เป็น empty
        if (isEmpty && dateValue !== null) {
          // ไม่มีการกรอกข้อมูลมา ไม่ต้องทำอะไร
          return null;
        }

        // ถ้าเป็น null เกิดจากระบุ date ไม่ครบ
        if (dateValue === null) {
          // console.log("Invalid date format")
          return SITValidators.generateInvalidReturnValue(
            MsgError.INVALID_FORMAT
          );
        }
      }

      return null;
    };
  }

  static isTime(timeFormat?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isEmpty = SITValidators.isRequire(control);
      if (isEmpty) {
        // ไม่มีการกรอกข้อมูลมา ไม่ต้องทำอะไร
        return null;
      }

      const timeValue = control.value.replace(/\s/g, '') as string;
      if (timeValue.length !== 5) {
        return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
      }

      const timeValueArray = timeValue.split(':');
      if (timeValueArray.length !== 2) {
        return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
      }

      const hour = timeValueArray[0] as any;
      if (isNaN(hour)) {
        return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
      }

      const minute = timeValueArray[1] as any;
      if (isNaN(minute)) {
        return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
      }

      let maxHour = 23;
      if (timeFormat === 'HH:MM') {
        maxHour = 11;
      } else if (timeFormat === 'HH24:MM') {
        maxHour = 23;
      }

      const hourNumber = hour as number;
      if (hourNumber < 0 || hourNumber > maxHour) {
        return SITValidators.generateInvalidReturnValue(
          MsgError.INVALID_FORMAT
        );
      }

      const minuteNumber = minute as number;
      if (minuteNumber < 0 || minuteNumber > 59) {
        return SITValidators.generateInvalidReturnValue(
          MsgError.INVALID_FORMAT
        );
      }

      return null;
    };
  }

  /**
   * Check format email.
   *
   * Ex: test@example.com
   * หรือ john.doe123@gmail.com
   * หรือ user123@example
   * หรือ user123@testmail.co.th, user123@gmail.com
   *
   * @param control
   * @returns
   */
  static isEmail(control: AbstractControl): ValidationErrors | null {
    // ตรวจสอบค่าว่าเป็นค่าว่างหรือไม่? ถ้าใช่ให้คืนค่า null
    if (SITValidators.isRequire(control)) {
      return null;
    }

    // แยกค่าใน control โดยใช้เครื่องหมายจุลภาคเป็นตัวคั่นเพื่อสร้างรายการของที่อยู่อีเมล
    const emailList: string[] = String(control.value).split(',');

    // รูปแบบที่ใช้ตรวจสอบความถูกต้องของอีเมลมาตรฐาน อ้างอิง Regex มาจากของ Angular
    const regexStandard: RegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    // ตรวจสอบข้อมูลอีเมลตามรูปแบบที่กำหนดไว้
    const validateEmail = (email: string): boolean => email.trim().length === 0 || !regexStandard.test(email.trim());
    const isInvalid = emailList.some(validateEmail);

    // หากพบข้อมูลอีเมลไม่ถูกต้องจะส่งข้อความกลับเป็น "Invalid format."
    if (isInvalid) {
      return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
    }

    // หากทุกที่อยู่อีเมลถูกต้องทั้งหมด ให้คืนค่า null เพื่อแสดงว่าการตรวจสอบผ่าน
    return null;
  }

  static isSingleEmail(control: AbstractControl): ValidationErrors | null {
    // ตรวจสอบค่าว่าเป็นค่าว่างหรือไม่? ถ้าใช่ให้คืนค่า null
    if (SITValidators.isRequire(control)) {
      return null;
    }

    // แยกค่าใน control โดยใช้เครื่องหมายจุลภาคเป็นตัวคั่นเพื่อสร้างรายการของที่อยู่อีเมล
    const emailList: string[] = [ control.value ];

    // รูปแบบที่ใช้ตรวจสอบความถูกต้องของอีเมลมาตรฐาน อ้างอิง Regex มาจากของ Angular
    const regexStandard: RegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    // ตรวจสอบข้อมูลอีเมลตามรูปแบบที่กำหนดไว้
    const validateEmail = (email: string): boolean => email.trim().length === 0 || !regexStandard.test(email.trim());
    const isInvalid = emailList.some(validateEmail);

    // หากพบข้อมูลอีเมลไม่ถูกต้องจะส่งข้อความกลับเป็น "Invalid format."
    if (isInvalid) {
      return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
    }

    // หากทุกที่อยู่อีเมลถูกต้องทั้งหมด ให้คืนค่า null เพื่อแสดงว่าการตรวจสอบผ่าน
    return null;
  }
  /**
   * Check format TimeZone Offset And add digit auto.
   *
   * ตัวเลขไม่เกิน 2 หลักและมีจุดทศนิยม 2 ตำแหน่ง และอาจมีเครื่องหมาย -, .
   *
   * Ex: 07.00, -07.00
   */
  static isTimeZoneOffset(control: AbstractControl): ValidationErrors | null {
    const isEmpty = SITValidators.isRequire(control);

    /// Check empty value
    if (!isEmpty) {
      const regex: RegExp = new RegExp(/^-?\d{1,2}(\.\d{1,2})?$/g);

      /// Not match regex.
      if (!String(control.value).match(regex)) {
        return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);

      /// Add digit
      } else {
        let arrValue = control.value.split(".");

        // xx.x + 0
        if (arrValue.length == 2 && arrValue[1].length == 1) {
          control.setValue(control.value + "0", { emitEvent: false});
        }

        // xx + .00
        if (arrValue.length == 1) {
          control.setValue(control.value + ".00", { emitEvent: false});
        }
      }
    }

    return null;
  }

  /**
   * Check format Latitude, Longitude and add digit
   *
   * ตัวเลขไม่เกิน 3 หลักและมีจุดทศนิยม 6 ตำแหน่ง และมีค่าบวก หรือค่าติดลบ
   *
   * Ex: 13.693062, -13.693062
   */
  static isLatLon(control: AbstractControl): ValidationErrors | null {
    const isEmpty = SITValidators.isRequire(control);

    /// Check empty value
    if (!isEmpty) {
      const regex: RegExp = new RegExp(/^-?\d{1,3}(\.\d{1,6})?$/g);

      /// Not match regex.
      if (!String(control.value).match(regex)) {
        return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);

      /// Add digit
      } else {
        let arrValue = control.value.split(".");

        // xx + .000000
        if (arrValue.length == 1) {
          control.setValue(control.value + ".000000");
        }

        // xx. + 0
        if (arrValue.length == 2 && arrValue[1].length < 6) {
          let digit = "";

          for (let i = 0; i < (6 - arrValue[1].length); i++) {
            digit = digit + "0";
          }

          control.setValue(control.value + digit);
        }
      }
    }

    return null;
  }

  static generateInvalidReturnValue(msg: string): ValidationErrors {
    return {
      message: msg,
      invalid: true,
    };
  }

  /**
   * Check pattern phone and plus(+).
   *
   * @param control
   * @returns
   */
  static isPhone(control: AbstractControl): ValidationErrors | null {
    const isEmpty = SITValidators.isRequire(control);
    if (isEmpty) {
      return null;
    }

    // กรอกตัวเลข กับ เครื่องหมาย "+"
    const regex: RegExp = new RegExp(/^[0-9+]+$/g);
    const isPattern = regex.test(control.value);
    if (!isPattern) {
      return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
    }

    return null;
  }

  /**
   * Check pattern eng[a-z,A-Z].
   *
   * @param control
   * @returns
   */
  static isEngOnly(control: AbstractControl): ValidationErrors | null {
    const isEmpty = SITValidators.isRequire(control);
    if (isEmpty) {
      return null;
    }

    // กรอกภาษาอังกฤษเท่านั้น
    const regex: RegExp = new RegExp(/^[a-zA-Z]+$/);
    const isEng = regex.test(control.value);
    if (!isEng) {
      return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
    }

    return null;
  }

  /**
   * Check pattern a-z,A-Z,0-9
   *
   * @param control
   * @returns
   */
  static isEngNumber(control: AbstractControl): ValidationErrors | null {
    const isEmpty = SITValidators.isRequire(control);
    if (isEmpty) {
      return null;
    }

    // กรอกภาษาอังกฤษ กับ ตัวเลข
    const regex: RegExp = new RegExp(/^[a-zA-Z0-9]+$/);
    const isPattern = regex.test(control.value);
    if (!isPattern) {
      return SITValidators.generateInvalidReturnValue('Invalid alphabet pattern.');
    }

    return null;
  }

  /**
   * ตรวจสอบ input password
   * @param min จำนวนที่สามารถกรอกอย่างน้อยที่สุด
   * @param max จำนวนที่สามารถกรอกมากที่สุด
   * @param upper ตรวจสอบ กรณี ตัวอักษรภาษาอังฤษพิมพ์ใหญ่
   * @param lower ตรวจสอบ กรณี ตัวอักษรภาษาอังฤษพิมพ์เล็ก
   * @param digit ตรวจสอบ กรณี เป็นตัวเลข
   * @param spacial ตรวจสอบ กรณี ตัวอังษรพิเศษ
   * @returns
   */
  static isFormatPassword(
    min: number
    , max: number
    , upper: boolean = false
    , lower: boolean = false
    , digit: boolean = false
    , spacial: boolean = false): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      const isRequire = SITValidators.isRequire(control);
      if (isRequire) {
        return null;
      }

      const pw: string = control.value;

      // check length
      if(pw.length < min || pw.length > max) {
        return SITValidators.generateInvalidReturnValue(`at least ${min} to ${max} characters long`);
      }

      // check upper case
      if(upper && !pw.match(/[A-Z]+/g)) {
        return SITValidators.generateInvalidReturnValue('at least one upper case letter (A to Z)');
      }

      // check lower case
      if(lower && !pw.match(/[a-z]+/g)) {
        return SITValidators.generateInvalidReturnValue('at least one lower case letter (a to z)');
      }

      // check digit case
      if(digit && !pw.match(/[0-9]+/g)) {
        return SITValidators.generateInvalidReturnValue('at least one digit (0 to 9)');
      }

      // check spacial case
      if(spacial && !pw.match(/[!@#$%^&*?+_()[\]||]+/g)) {
        return SITValidators.generateInvalidReturnValue('at least one punctuation character (!@#$% etc)');
      }

      return null;
    };

  }

  /*
   * ตรวจสอบ require และ ต้องการระบุ msg
   * @param control
   */
  static isRequireCustomMsg(msg: string): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

      const isEmpty = Validators.required(control);

      let noLength = false;
      if (typeof control.value === 'string') {
        noLength = control.value.trim().length === 0;
      } else if (control.value != null && typeof Array.isArray(control.value)) {
        noLength = control.value.length === 0;
      }

      if (isEmpty || noLength) {
        return SITValidators.generateInvalidReturnValue(msg);
      }

      return null;
    }
  }

  /**
   * ตรวจสอบ maxDays
   * @param control
   */
  static isMaxDays(day: number): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

      const isMaxDays = Validators.max(day)(control);
      if (isMaxDays) {
        return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
      }

      return null;
    }
  }

  /**
   * Check pattern 0-9
   *
   * @param control
   * @returns
   */
  static isNumberOnly(control: AbstractControl): ValidationErrors | null {
    const isEmpty = SITValidators.isRequire(control);
    if (isEmpty) {
      return null;
    }

    // กรอกตัวเลขเท่านั้น
    const regex: RegExp = new RegExp(/^[0-9]+$/);
    const isValid = regex.test(control.value);
    if (!isValid) {
      return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
    }

    return null;
  }

  /**
   * Check pattern: 1.space 2.' 3.eng 4.-
   *
   * @param control
   * @returns
   */
  static isName(control: AbstractControl): ValidationErrors | null {
    const isEmpty = SITValidators.isRequire(control);
    if (isEmpty) {
      return null;
    }

    // ตรวจสอบ
    const regex: RegExp = new RegExp(/^[a-zA-Z'\s-]+$/);
    const isValid = regex.test(control.value);
    if (!isValid) {
      return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
    }

    return null;
  }

  static isDate(control: AbstractControl): ValidationErrors  | null {
    const isEmpty = SITValidators.isRequire(control);
    if (isEmpty) {
      return null;
    }

    const regex = /^(0|0?[1-9]|[1-2]\d|3[0-1])$/;
    const isValid = regex.test(control.value);
    if (!isValid) {
      return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
    }

    if (control.value.length !== 2) {
      return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
    }

    return null;
  }

  static isMonth(control: AbstractControl): ValidationErrors  | null {
    const isEmpty = SITValidators.isRequire(control);
    if (isEmpty) {
      return null;
    }

    const regex = /^([0-1]|0[1-9]|1[0-2])$/;
    const isValid = regex.test(control.value);
    if (!isValid) {
      return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
    }

    if (control.value.length !== 2) {
      return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
    }

    return null;
  }

  static isYear(control: AbstractControl): ValidationErrors  | null {
    const isEmpty = SITValidators.isRequire(control);
    if (isEmpty) {
      return null;
    }

    const regex = /^\d+$/;
    const isValid = regex.test(control.value);
    if (!isValid) {
      return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
    }

    if (control.value.length !== 4) {
      return SITValidators.generateInvalidReturnValue(MsgError.INVALID_FORMAT);
    }

    return null;
  }

  /** SitPasswordValidationComponent */
  static passwordValidation(listregExp?): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      let invalid = [];
      if (listregExp?.length > 0) {
        const valControl:string = control.value;
        listregExp.forEach((lst,index) => {
          let regex = new RegExp(lst);
          if (valControl && !regex.test(valControl)) {
            invalid.push({index: index, invalid: !regex.test(valControl)})
          }
        })
        if (invalid?.length > 0) {
          return this.generateInvalidReturnValueArray('', invalid);
        }
      }
      return null;
    }
  }

  static generateInvalidReturnValueArray(msg?: string, data?: any): ValidationErrors {
    return {
      message: msg,
      invalid: true,
      data: data
    };
  }
}
