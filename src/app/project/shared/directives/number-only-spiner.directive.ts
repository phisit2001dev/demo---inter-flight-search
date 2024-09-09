import { FormControl } from '@angular/forms';
// tslint:disable: max-line-length
// tslint:disable: deprecation
import { Directive, HostListener, ElementRef, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Directive({
  selector: '[number-only-spiner]',
  standalone: true
})
export class NumberOnlySpinerDirective implements OnInit  {

  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^-?[0-9]+(\[0-9]*){0,1}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];
  private arrowAllow = ['39', 37];


  //@Input()
  //spinner: FormControl;

  @Input()
  maxData: any;

  //@Output() invalidNumber = new EventEmitter();

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // if(this.el.nativeElement.maxlegth){
    //   this.el.nativeElement.maxlegth = this.el.nativeElement.max.length;
    // }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    //  console.log(event.keyCode);
    if (this.specialKeys.indexOf(event.key) !== -1 ||
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Command+A
    ((event.keyCode === 65 || event.keyCode === 86 || event.keyCode === 67 || event.keyCode === 88) && (event.ctrlKey === true || event.metaKey === true)))
    {
      return;
    }

    if(this.el.nativeElement.value.length >= parseInt(this.el.nativeElement.maxLength)){
      event.preventDefault();
      return;
    }

    this.manageCondition(event.key, event);
  }

 @HostListener('blur')
  onBlur() {
    if(this.el.nativeElement.value != "" && (this.el.nativeElement.value.length !== parseInt(this.el.nativeElement.value).toString().length)){
      this.el.nativeElement.value = parseInt(this.el.nativeElement.value);
    }

    // if(parseInt(this.el.nativeElement.value) > parseInt(this.el.nativeElement.max)){
    //   this.spinner.setValue(this.el.nativeElement.min, { emitEvent: false });
    //   this.invalidNumber.emit();
    // }
 }

  @HostListener('paste', ['$event'])
  blockPaste(event: ClipboardEvent) {
    this.manageCondition(event.clipboardData.getData('text'), event);
  }

  private manageCondition(data: string, event: KeyboardEvent | ClipboardEvent) {
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(data);

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
