import { Directive, HostListener, ElementRef, EventEmitter, Output, Input, AfterViewInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Directive({
  selector: '[inputPaginator]'
})
export class InputPaginatorDirective implements AfterViewInit {

  @Input() value;
  @Output() valueChange = new EventEmitter();
  constructor(private el: ElementRef) {
    this.el.nativeElement.classList.add('input-Paginator');
    this.el.nativeElement.setAttribute('maxlength','3');
  }

  ngAfterViewInit(): void {
    this.el.nativeElement.closest('mat-form-field').classList.add('mat-input-paginator');
  }

  @HostListener('change', ['$event'])
  change(e) {
    let val = parseInt(e.target.value);
    if (val > -1) {
      let obj: PageEvent = {
        pageIndex: val,
        length: null,
        pageSize: null,
        previousPageIndex: null,
      }
      this.valueChange.emit(obj);
    }
  }

  @HostListener('keydown.enter', ['$event'])
  onKeyEnter(e) {
    let val = parseInt(e.target.value);
    if (val > -1) {
      let obj: PageEvent = {
        pageIndex: val,
        length: null,
        pageSize: null,
        previousPageIndex: null,
      }
      this.valueChange.emit(obj);
      this.el.nativeElement.blur();
    }
  }

  //number only
  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^-?[0-9]+(\[0-9]*){0,1}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];
  private arrowAllow = ['39', 37];
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // console.log(event.keyCode);
    if (this.specialKeys.indexOf(event.key) !== -1 ||
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Command+A
    ((event.keyCode === 65 || event.keyCode === 86 || event.keyCode === 67 || event.keyCode === 88) && (event.ctrlKey === true || event.metaKey === true)))
    {
      return;
    }

    this.manageCondition(event.key, event);
  }

  @HostListener('paste', ['$event'])
  blockPaste(event: ClipboardEvent) {
    this.manageCondition(event.clipboardData.getData('text'), event); // [pongsathorn.p][2020CAAT-275, 2020CAAT-276]
  }

  private manageCondition(data: string, event: KeyboardEvent | ClipboardEvent) {
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(data);

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
