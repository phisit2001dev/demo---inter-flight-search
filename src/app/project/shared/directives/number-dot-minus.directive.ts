import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * Number 0-9
 *
 * . (dot)
 *
 * - (Minus)
 */
@Directive({
  selector: '[number-dot-minus-only]',
  standalone: true
})
export class NumberDotMinusDirective {

  /**
   *  Allow: number - .
   */
  private regex: RegExp = new RegExp(/^[\d-\.]+$/g);

  /**
   *  Allow key codes for special events. Reflect :
   */
  private specialKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];

  constructor(private el: ElementRef) {
  }

  /**
   * When keydown
   * @param event
   * @returns
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    /// Check is not allow specialKeys.
    /// Allow: Ctrl+A, Ctrl+C, Ctrl+V, Command+A
    if (this.specialKeys.indexOf(event.key) !== -1 ||
    ((event.keyCode === 65 || event.keyCode === 86 || event.keyCode === 67 || event.keyCode === 88)
      && (event.ctrlKey === true || event.metaKey === true))) {
      return;
    }

    this.manageCondition(event.key, event);
  }

  /**
   * When paste
   * @param event
   */
  @HostListener('paste', ['$event'])
  blockPaste(event: ClipboardEvent) {
    this.manageCondition(event.clipboardData.getData('text'), event);
  }

  /**
   * Check condition
   * @param data
   * @param event
   */
  private manageCondition(data: string, event: KeyboardEvent | ClipboardEvent) {
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(data);

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

}
