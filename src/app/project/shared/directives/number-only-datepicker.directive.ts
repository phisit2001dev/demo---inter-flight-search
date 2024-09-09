import { Directive, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[number-only-datepicker]',
  standalone: true
})
export class NumberOnlyDatepickerDirective {
  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^-?[0-9/]+(\[0-9]*){0,1}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];

  @Input() spinner: FormControl;

  @Output()
  invalidNumber = new EventEmitter<boolean>();

  constructor(
    private el: ElementRef,
    private snackbar: SnackbarService
    ) {
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

    this.manageCondition(event.key, event);
  }

  @HostListener('blur')
  onBlur() {
    // ตรวจสอบ value เมื่อ blur ถ้ามากกว่า max จะเคลียร์เป็น min พร้อมแสดง snackbar
    if(parseInt(this.el.nativeElement.value) > this.el.nativeElement.max){
      //this.snackbar.open(this.msgDesc, 'W');
      //this.el.nativeElement.value = this.el.nativeElement.min;
      this.spinner.setValue(this.el.nativeElement.min);
      this.invalidNumber.emit(null);
    }
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
