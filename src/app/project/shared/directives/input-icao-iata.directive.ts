import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[sit-input-icao-iata]',
  standalone: true
})
export class InputIcaoIataDirective {
  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^[A-Z0-9]+$/);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

  constructor(private el: ElementRef) {}

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

    if (next && !String(next.toUpperCase()).match(this.regex)) {
      event.preventDefault();
    }
  }
}
