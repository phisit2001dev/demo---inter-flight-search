import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({selector: '[monthInput]', standalone: true})
export class MonthInputDirective {
  private readonly regex = /^([0-1]|0[1-9]|1[0-2])$/;
  private readonly allowedKeys: string[] = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];

  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  private validateInput(data: string, event: Event) {
    if (!this.regex.test(data)) {
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    this.validateInput(this.elementRef.nativeElement.value.concat(event.key), event);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || window['clipboardData'];
    const pastedData = clipboardData?.getData('text') || '';
    this.validateInput(this.elementRef.nativeElement.value.concat(pastedData), event)
  }
}
