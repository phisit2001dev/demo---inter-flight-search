import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[sitSugggestion]',
})
export class SugggestionDirective {
  @Input()
  visibleControl: FormControl;

  @Input()
  hiddenControl: FormControl;

  @Input()
  toUpper: boolean;

  tempValue;
  constructor(private el: ElementRef) {}

  @HostListener('keyup', ['$event'])
  keyup(e: KeyboardEvent) {
    if (e.keyCode !== 13 && this.tempValue != this.visibleControl.value) {
      this.hiddenControl.setValue(null);
    }
  }

  @HostListener('click', ['$event'])
  click(e: KeyboardEvent) {
    this.tempValue = this.visibleControl.value;
  }

  @HostListener('focus', ['$event'])
  focus(e: KeyboardEvent) {
    this.tempValue = this.visibleControl.value;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.tempValue = this.visibleControl.value;
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    this.tempValue = this.visibleControl.value;
  }

  @HostListener('input', ['$event'])
  input(e) {
    if (this.toUpper && e.data) {
      const newKey: string = e.data;
      const text: string = e.target.value;
      if (text.length > 0) {
        e.target.value = `${text.substring(
          0,
          text.length - 1
        )}${newKey.toLocaleUpperCase()}`;
      }
      this.tempValue = this.visibleControl.value;
    }
  }
}
