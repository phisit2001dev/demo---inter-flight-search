import { environment } from './../../../../environments/environment.production';
import {
  Directive,
  HostListener,
  ElementRef,
  Input,
  Injectable,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { NativeDateAdapter } from '@angular/material/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[datePicker]',
})
export class DatePickerDirective implements AfterViewInit, OnDestroy {
  @Input()
  datePicker: any;
  regex: RegExp = new RegExp(/[\d\/]+$/g);
  private destroy$ = new Subject();
  // key codes for special events.
  private specialKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];

  constructor(
    private el: ElementRef,
  ) {}

  ngAfterViewInit(): void {
    // กำหนด maxlength เมื่อไม่ได้มีกำหนดไว้
    if(!this.el.nativeElement.getAttribute('maxlength')){
      this.el.nativeElement.setAttribute('maxlength', environment.dateFormat.length);
    }
    // ตรวจสอบกรณี Backspace แล้วยังอยู่ตำแหน่งและภายในเวลาที่กำหนดจะเติม / ให้อีกครั้ง
    fromEvent(this.el.nativeElement, 'keydown')
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe((e: KeyboardEvent) => {

        if(e.key === 'Backspace'){
          // ใส่ Slash / ให้อัตโนมัติถ้า Cursor อยู่ในตำแหน่งที่กำหนด
          const index = this._getCursorPosition(this.el.nativeElement);
          if(index === 2 || index === 5){
            this.insertSlash(index);
          }
        }
      });
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    const index = this._getCursorPosition(this.el.nativeElement);
    if(this.specialKeys.indexOf(event.key) === -1
      && (index === 2 || index === 3  || index === 5 || index === 6) ) {
        // ใส่ Slash / ให้อัตโนมัติถ้า Cursor อยู่ในตำแหน่งที่กำหนด
        this.insertSlash(index);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    /// Not match regex.
    if (this.specialKeys.indexOf(event.key) === -1 && !String(event.key).match(this.regex)) {
      event.preventDefault();
      return null;
    }
  }

  @HostListener('blur', ['$event'])
  blur(e: KeyboardEvent) {
    // console.log('blur', this.el.nativeElement.value);
    const tmpVal = this.el.nativeElement.value;
    // ถ้า clear value เป็น empty set matDatePicker เป็น Empty ด้วย
    if(!tmpVal){
      const matDatePicker = this.datePicker as MatDatepicker<any>;
      // เพื่อไม่ให้เป็น null (null = invalid format)
      // Update matDatePicker
      matDatePicker.select('');
    }
  }

  /**
   * หา index ที่ cursor อยู่
   * @param element
   */
  private _getCursorPosition(element) {
    const doc = document as any;
    // get cursor position start hightlight
    let startPosition = 0;
    if (doc.selection) {
      // IE Support
      element.focus();
      if (element.createTextRange) {
        const r = doc.selection.createRange().duplicate();
        r.moveEnd('character', element.value.length);
        if (r.text === '') {
          startPosition = element.value.length;
        }
        startPosition = element.value.lastIndexOf(r.text);
      } else {
        startPosition = element.selectionStart;
      }
    } else if (element.selectionStart || element.selectionStart === '0') {
      // Firefox support
      startPosition = element.selectionStart;
    }

    return startPosition;
  }

  /**
   * Insert Slash
   * @param index
   */
  private insertSlash(index){
    const strfirst = this.el.nativeElement.value.substring(0,index);
    const strLast = this.el.nativeElement.value.substring(index,this.el.nativeElement.value.length);
    // console.log('== arrStr ==', strfirst +',/,'+ strLast);
    // เอา Slash เดิมออกแทนด้วย Slash อันใหม่
    this.el.nativeElement.value = (strfirst +'/'+strLast).replace(/\/{2,}/g, '/');
  }

  ngOnDestroy(): void {
    if (this.destroy$) {
      this.destroy$.complete();
    }
  }

}

/*
 For customs datePicker
 */
@Injectable()
export class CustomNativeDateAdapter extends NativeDateAdapter {
  parse(value: any): Date | null {
    // console.log('parse',value)
    // Check format

    if (typeof value === 'string' && environment.dateFormat.length === value.length) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);

      // Validate
      if(this.checkValidateDate(year, month, date, value)){
        return new Date(year, month, date);
      }
    }
    return null;
  }

  format(date: Date, displayFormat: Object): string {
    if (!date) {
      return '';
    }
    if (displayFormat === 'input') {
      const day = date?.getDate();
      const month = date?.getMonth() + 1;
      const year = date?.getFullYear();
      // console.log(this._to2digit(day) + '/' + this._to2digit(month) + '/' + year);
      return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
    }

    return date.toDateString();
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }

  /* Validate
    ตรวจสอบวันที่
    return true = Valid , false = Invalid
  */
  private checkValidateDate(year:any, month:any, date:any, value: any){

    const dateVal = new Date(year, month, date);
    let dateStr = null;
    if(dateVal){
      dateStr = this._to2digit(dateVal.getDate()) + '/' + this._to2digit(dateVal.getMonth()+ 1) + '/' + dateVal.getFullYear();
    }
    // console.log(dateStr,' == '+value);
    return value === dateStr;
  }


}

// For customs format datePicker
export const CUSTOMS_DATE_FORMATS = {
  parse: {
    dateInput: 'input',
  },
  display: {
    dateInput: 'input',
  },
};


