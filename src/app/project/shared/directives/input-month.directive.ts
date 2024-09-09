// tslint:disable: max-line-length
// tslint:disable: deprecation
import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[input-month]',
  standalone: true
})
export class InputMonthDirective {
  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^-?[0-9]+(\[0-9]*){0,1}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];
  private arrowAllow = ['39', 37];

  constructor(private el: ElementRef) {
    // console.log('NumberOnlyDirective');
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
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
    this.manageCondition(event.clipboardData.getData('text'), event);
  }

  private manageCondition(data: string, event: KeyboardEvent | ClipboardEvent) {
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(data);

    if (next && !String(next).match(this.regex) || next.length > 2 || Number(next) > 12) {
      event.preventDefault();
    }
  }
}
