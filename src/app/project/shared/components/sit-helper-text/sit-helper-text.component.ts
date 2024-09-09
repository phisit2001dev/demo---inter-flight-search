import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'sit-helper',
  templateUrl: './sit-helper-text.component.html',
  styleUrls: ['./sit-helper-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SitHelperTextComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() control: FormControl = null;
  @Input() hint: string;
  _isChip = false;
  _errorinputMsg = '';
  showMsg = false;
  destroy$: Subject<any> = new Subject();

  constructor(
    private cdf: ChangeDetectorRef
  ) { }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    if (this.control) {
      this.control.statusChanges.pipe(takeUntil(this.destroy$)).subscribe((stat) => {
        this._errorinputMsg = this.control.errors?.message;
        this.update();
      })
    }
  }

  update(){
    if (this.control) {
      this.updateWithMarkAsTouched();
    }
    this.cdf.markForCheck();
  }

  updateAndClear(){
    if (this.control) {
      this.updateWithMarkAsTouched()
    }
    this._errorinputMsg = null;
    this.cdf.markForCheck();
  }

  // update case custom validate
  updateWithMarkAsTouched(){
    if (!this.control?.validator && !this.control?.touched) {
      this.control.markAsTouched();
    }
  }

  setInitFormErrMsg(){
    if (this.control) {
      this.updateWithMarkAsTouched();
    }
    if (this.control?.errors) {
      this._errorinputMsg = this.control.errors?.message
      this.cdf.markForCheck();
    }
  }


    /**
   *
   * @description updateOnBlur FormControl validate sit-helper
   * @memberof SitValidateInputDirective
   */
    setActiveFormControlOnblur(){
      if (this.control) {
        this.control.markAsTouched();
      }
      if (this.control?.errors) {
        this._errorinputMsg = this.control.errors?.message
        this.cdf.markForCheck();
      }
    }
}
