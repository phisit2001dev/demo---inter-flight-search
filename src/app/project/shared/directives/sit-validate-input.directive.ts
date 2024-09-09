import { SitChipAutocompleteComponent } from './../components/sit-chip-autocomplete/sit-chip-autocomplete.component';
// import { SitAutocompleteComponent } from './../modules/sit-components/components/sit-autocomplete/sit-autocomplete.component';
import { MatInput } from '@angular/material/input';
// import { SitHelperTextComponent } from './../../modules/example/components/sit-helper-text/sit-helper-text.component';
import {
  AfterViewInit,
  ContentChild, ContentChildren, Directive,
  ElementRef,
  Input, OnDestroy, OnInit, Optional, QueryList
} from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepickerToggle } from '@angular/material/datepicker';
import { MAT_FORM_FIELD } from '@angular/material/form-field';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs';
import { SitAutocompleteComponent } from '../components/sit-autocomplete/sit-autocomplete.component';
import { SitHelperTextComponent } from '../components/sit-helper-text/sit-helper-text.component';
import { SitInputFileComponent } from '../components/sit-input-file/sit-input-file.component';

@Directive({
  selector: '[sit-validate-input]',
})
export class SitValidateInputDirective implements OnInit, OnDestroy, AfterViewInit {
  // ↪➜
  // กำหนดชื่อ validate ให้ตรงกับ name ใน resp
  @Input('sit-validate-input') input = '';
  // target ไว้กำหนด element ที่ต้องการแสดง validate จาก api [default เป็น mat-form-field]
  @Input() selector? = 'mat-form-field';
  destroy$: Subject<any> = new Subject();
  @ContentChild(SitHelperTextComponent,{static: true}) helper: SitHelperTextComponent;

  @ContentChild(MAT_FORM_FIELD,{static: true, read: ElementRef}) form: ElementRef;

  @ContentChildren(SitHelperTextComponent,{descendants: true, read: SitHelperTextComponent}) multiHelper = new QueryList<SitHelperTextComponent>();

  @ContentChild(MatInput,{static: true, read: ElementRef}) eleinput: ElementRef;
  // ng-date
  @ContentChild(MatDatepickerToggle,{static: true, read: MatDatepickerToggle}) dateToggle: MatDatepickerToggle<any>;

  // matSelect
  @ContentChild(MatSelect,{static: true, read: MatSelect}) matSelect: MatSelect;

  // auto-com
  @ContentChild(SitAutocompleteComponent,{static: true}) autocomplete: SitAutocompleteComponent;

  @ContentChild(SitChipAutocompleteComponent,{static: true}) chipAutocomplete: SitChipAutocompleteComponent;

  // fileupload
  @ContentChild(SitInputFileComponent,{static: true}) fileUpload: SitInputFileComponent;

  @ContentChild(MatCheckbox,{static: true}) matCheckbox: MatCheckbox;
  @ContentChild(MatRadioGroup,{static: true}) matRadioGroup: MatRadioGroup;

  constructor(@Optional() private eleRef: ElementRef){}

  // store func
  paramActiveFormOnblur = () => this.setFormControlOnblur();

  ngOnDestroy(): void {
    this.matSelect?._elementRef.nativeElement.removeEventListener("blur",this.paramActiveFormOnblur);


    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    // case datepicker
    // if (this.dateToggle) {
    //   this.dateToggle.datepicker.closedStream.pipe(takeUntil(this.destroy$)).subscribe(() =>
    //   {
    //     if (this.form && !this.helper._errorinputMsg) {
    //       this.form.nativeElement.classList.remove('sit-in-valid');
    //       this.helper.update();
    //     }
    //   });
    // }

    if (this.eleinput) {
      this.eleinput.nativeElement.addEventListener("blur", () => {
        if (!this.helper._errorinputMsg) {
          this.helper.setInitFormErrMsg();
          if (this.form) {
            this.form.nativeElement.classList.remove('sit-in-valid');
          }
        }else {
          this.helper.update();
        }
      });
    }

    if (this.chipAutocomplete) {
      this.chipAutocomplete.DInput.nativeElement.addEventListener("blur", () => {
        this.helper._isChip = true;
        if (!this.helper._errorinputMsg) {
          this.helper.setInitFormErrMsg();
          if (this.form) {
            this.form.nativeElement.classList.remove('sit-in-valid');
          }
        }else {
          this.helper.update();
        }
      });
    }

    if (this.matSelect) {
      this.matSelect._elementRef.nativeElement.addEventListener("blur", this.paramActiveFormOnblur);
    }
  }



  /**
   * @description useCase Active matSelect+Formcontrol
   * @memberof SitValidateInputDirective
   */
  setFormControlOnblur(){
    this.helper?.setActiveFormControlOnblur();
  }


  ngOnInit(): void {}

  setInvalidStyleCustom(msg: string) {
    if (this.selector === 'mat-form-field') {
      if (this.autocomplete) {
        this.addClassInvalid(this.autocomplete.form);
      }else if(this.chipAutocomplete){
        this.addClassInvalid(this.chipAutocomplete.form);
      }else if(this.fileUpload){
        this.addClassInvalid(this.fileUpload.formElement);
      }else {
        this.addClassInvalid(this.form);
      }
    }else {
      let ele: Element =  this.eleRef.nativeElement;
      if (ele.nodeName?.toLowerCase() === this.selector?.toLowerCase()) {
        // this node
        ele.classList.add('sit-in-valid','sit-custom-invalid');
      } else {
        ele.querySelector(this.selector)?.classList.add('sit-in-valid','sit-custom-invalid');
      }
      if (this.multiHelper) {
        this.multiHelper.last._errorinputMsg = msg;
        this.multiHelper.last.update();
        return;
      }
    }
    if (this.helper) {
      this.helper._errorinputMsg = msg;
      this.helper.update();
      if (this.helper.control) {
        this.helper.control.markAsTouched();
      }
    }
  }

  setValidStyleCustom() {
    if (this.selector === 'mat-form-field') {
      // console.log(this.form);
      if (this.autocomplete) {
        this.removeClassInvalid(this.autocomplete.form);
      }else if(this.chipAutocomplete){
        this.removeClassInvalid(this.chipAutocomplete.form);
      }else if(this.fileUpload){
        this.removeClassInvalid(this.fileUpload.formElement);
      }else {
        this.removeClassInvalid(this.form);
      }
    }else {
      let ele: Element =  this.eleRef.nativeElement;
      if (ele.nodeName?.toLowerCase() === this.selector?.toLowerCase()) {
        // this node
        ele.classList.remove('sit-in-valid','sit-custom-invalid');
      } else {
        ele.querySelector(this.selector)?.classList.remove('sit-in-valid','sit-custom-invalid');
      }
      if (this.multiHelper.length > 0) {
        this.multiHelper.last._errorinputMsg = "";
        this.multiHelper.last.update();
        return;
      }
    }
    if (this.helper) {
      this.helper._errorinputMsg = "";
      this.helper.update();
    }
  }

  addClassInvalid(element: ElementRef): void {
    element?.nativeElement.classList.add('sit-in-valid');
  }
  removeClassInvalid(element: ElementRef){
    element?.nativeElement.classList.remove('sit-in-valid');
  }

  // setInvalidStyle(msg?: string) {
  //   if (this.helper) {
  //     this.helper._errorinputMsg = msg;
  //     this.helper.update();
  //   }
  //   if (this.form) {
  //     this.form.nativeElement.classList.add('sit-in-valid');
  //     return;
  //   }
  //   if (this.matCheckbox ||this.matRadioGroup) {
  //     this.eleRef.nativeElement.classList.add('sit-in-valid');
  //     return;
  //   }
  // }

  // setvalidStyle() {
  //   if (this.helper) {
  //     this.helper._errorinputMsg = "";
  //     this.helper.update();
  //   }
  //   if (this.form) {
  //     this.form.nativeElement.classList.remove('sit-in-valid');
  //   }
  //   if (this.matCheckbox ||this.matRadioGroup) {
  //     this.eleRef.nativeElement.classList.remove('sit-in-valid');
  //     return;
  //   }
  // }


}
