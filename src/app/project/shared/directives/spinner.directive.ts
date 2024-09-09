import { Directive, ElementRef, Input, OnDestroy, AfterViewInit, Output, EventEmitter, HostListener, ɵConsole } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil, Subject } from 'rxjs';
import { DateService } from '@app/project/core/services/date.service';

@Directive({
  selector: '[spinner]',
  standalone: true
})
export class SpinnerDirective {

  @Output() invalidNumber = new EventEmitter();

  constructor(
    private el: ElementRef,
  ) {}

  @HostListener('blur')
  onBlur() {
    if(this.el.nativeElement.max && (parseInt(this.el.nativeElement.value) > parseInt(this.el.nativeElement.max))){
      this.invalidNumber.emit();
      this.el.nativeElement.value = 0;
    }
  }
}
