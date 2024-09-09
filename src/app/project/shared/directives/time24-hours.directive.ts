import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[time24-hours]',
})
export class Time24HoursDirective implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<any>();

  // key codes for special events.
  // private specialKeys = ['Backspace', 'Delete',];
  private specialKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];
  regex: RegExp = new RegExp(/[\d\:]+$/g);

  constructor(
    private el: ElementRef,
  ) {}

  ngAfterViewInit(): void {
    // กำหนด maxlength เมื่อไม่ได้มีกำหนดไว้
    if(!this.el.nativeElement.getAttribute('maxlength')){
      this.el.nativeElement.setAttribute('maxlength', '5');
    }

    // ตรวจสอบกรณี Backspace แล้วยังอยู่ตำแหน่งและภายในเวลาที่กำหนดจะเติม : ให้อีกครั้ง
    fromEvent(this.el.nativeElement, 'keydown')
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe((e: KeyboardEvent) => {
        if(e.key === 'Backspace'){
          // ใส่ colon : ให้อัตโนมัติถ้า Cursor อยู่ในตำแหน่งที่กำหนด
          const index = this._getCursorPosition(this.el.nativeElement);
          if(index === 2){
            this.insertColon(index);
          }
        }
      });
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    const index = this._getCursorPosition(this.el.nativeElement);

    if( this.specialKeys.indexOf(event.key) === -1
      && (index === 2 || index === 3) ) {
        // ใส่ : ให้อัตโนมัติถ้า Cursor อยู่ในตำแหน่งที่กำหนด
        this.insertColon(index);
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
   * Insert Colon
   * @param index
   */
   private insertColon(index){
    const strfirst = this.el.nativeElement.value.substring(0,index);
    const strLast = this.el.nativeElement.value.substring(index,this.el.nativeElement.value.length);
    // console.log('== arrStr ==', strfirst +',:,'+ strLast);
    // เอา Colon : เดิมออกแทนด้วย Colon อันใหม่
    //this.el.nativeElement.value = ''
    this.el.nativeElement.value = (strfirst +':'+strLast).replace(/:{2,}/g, ':');
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (this.destroy$) {
      this.destroy$.complete();
    }
  }


}
