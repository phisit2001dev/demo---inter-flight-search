import { MAT_FORM_FIELD } from '@angular/material/form-field';
import { ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'sit-autocomplete',
  templateUrl: './sit-autocomplete.component.html',
  styleUrls: ['./sit-autocomplete.component.scss'],
})
export class SitAutocompleteComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(public formBuilder: FormBuilder) { }
  // tslint:disable-next-line: variable-name
  form_A: FormGroup;
  // tslint:disable-next-line: variable-name
  form_S: FormGroup;
  // tslint:disable-next-line: variable-name
  formChips: FormGroup;
  term;
  // chips config
  selectable = true;
  removable = true;
  lastselect = [];
  resetOption;
  separatorKeysCodes = [ENTER];
  fieldChipsHeight;
  @Input() listResult = [];
  @Input() maxLength: string | number;
  // @Input() type: 'A' | 'S' | 'CA' | 'CS';
  @Input() type: 'A' | 'S';
  // tslint:disable-next-line: no-input-rename
  @Input('controlChips') controlChips: FormControl;
  // tslint:disable-next-line: no-input-rename
  @Input('initChipsList') initChipsList: FormControl;
  // tslint:disable-next-line: no-input-rename
  @Input('controlValue') controlValue: FormControl = new FormControl();
  // tslint:disable-next-line: no-input-rename
  @Input('controlKey') controlKey: FormControl = new FormControl();
  @Input() displayChips: string;
  @Input() displayOption: string;
  @Input() appearance: 'legacy' | 'standard' | 'fill' | 'outline' = null;
  @Input() readonly = false;
  @Input() placeholder: string;
  @Input() outlineLabel: string;
  @Output() selectValue = new EventEmitter();
  @Output() removeChip = new EventEmitter();
  @Output() suggestionsBlur = new EventEmitter();
  @Output() autocompleteBlur = new EventEmitter();
  @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;
  @ViewChild('fieldChips') fieldChips: HTMLElement;
  @ViewChild('directiveInput') DInput: ElementRef;
  @ViewChild(MAT_FORM_FIELD, {static: false, read: ElementRef}) form: ElementRef;

  @Output() autocompleteEmitter = new EventEmitter();
  destroy$: Subject<any> = new Subject();
  // valueChange: Subject<any> = new Subject();
  @Input() valueChange:BehaviorSubject<any> ;
  @Input() debounceTime = 200;

  @Input() rowIndex: number; // ใช้สำหรับส่งค่า table row index เพื่อจับ form control relation ที่ต้องการ
  @Input() rowValueChange: BehaviorSubject<any> ; // ใช้สำหรับส่งค่า table row index ที่ส่งมาเพิ่ม

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  ngOnInit(): void {
    // console.log(this.form);
    switch (this.type) {
      case 'A':
        this.initFormAutoComplete();
        break;
      case 'S':
        this.initFormSuggestions();
        break;
      // case 'CA':
      //   this.initFormChipsAutoComplete();
      //   break;
      // case 'CS':
      //   this.initFormChipsAutoComplete();
      //   break;
    }
  }
  ngAfterViewInit(): void {
    //
    if (this.valueChange) {
      fromEvent(this.DInput.nativeElement, 'input').pipe(takeUntil(this.destroy$),debounceTime(this.debounceTime)).subscribe(v => {
        this.term = '';
        let val = this.DInput.nativeElement.value;
        if (!val) {
          this.listResult = [];
        }
        this.valueChange.next(val);
        this.term = val;
      });
    }

    if (this.rowValueChange) {
      fromEvent(this.DInput.nativeElement, 'input').pipe(takeUntil(this.destroy$),debounceTime(this.debounceTime)).subscribe(v => {
        this.term = '';
        let val = this.DInput.nativeElement.value;
        if (!val) {
          this.listResult = [];
        }
        this.rowValueChange.next({term: val, index: this.rowIndex});
        this.term = val;
      });
    }
  }
  // ######################################## AutoComplete #################################
  initFormAutoComplete() {
    this.form_A = this.formBuilder.group({
      key: [''],
      value: [''],
    });
  }

  autoCompleteSelect(e) {
    // console.log(e.option.value);
    this.resetOption = e.option.value;
    this.controlValue.setValue(e.option.value.value);
    this.controlKey.setValue(e.option.value.key);
    this.selectValue.emit(e.option.value);
    this.listResult = [];
  }

  autoCompleteOnblur(e){
    // not Onblur with mat-select && no key value
    if (!this.controlKey.value && this.resetOption) {
      // const reset = {};
      // for (const key in this.resetOption) {
      //   reset[key] = null;
      // }
      // // this.selectValue.emit(reset);
      // this.resetOption = null;
    } else {
      if (!this.controlKey.value) {
        this.autocompleteBlur.emit({key: null , value: null});
      }
    }
  }




  autoCompleteOnfocus(e){
    // ลบ listResult เก่าถ้าไม่มี key
    if (!this.controlKey.value && this.listResult) {
      this.listResult = [];
    }
  }
  // ######################################## Suggestions #################################
  initFormSuggestions() {
    this.form_S = this.formBuilder.group({
      key: [''],
      value: [''],
    });
  }
  suggestionsSelect(e) {
    this.resetOption = e.option.value;
    this.controlValue.setValue(e.option.value.value);
    this.controlKey.setValue(e.option.value.key);
    this.selectValue.emit(e.option.value);
  }
  suggestionsOnblur(e) {
    if (!this.controlValue.value) {
      // กรณี blur แล้วไม่มี Value จะลบ key ออก
      this.controlKey.setValue(null);
    }
    // emit ส่ง listResult ให้หน้าหลักสำหรับเงื่อนไขต่างๆ (กรณี suggestions มีมากกว่า key และ value )
    this.suggestionsBlur.emit(this.listResult);
  }
  suggestionsOnfocus(e){
    // ลบ listResult เก่าถ้าไม่มี key
    if (!this.controlKey.value && this.listResult) {
      this.listResult = [];
    }
  }
  // ######################################## Chips AutoComplete && Chips Suggestions #################################
  initFormChipsAutoComplete() {
    this.formChips = this.formBuilder.group({
      key: [''],
      value: [''],
    });
  }
  removeChips(obj, itemIndex) {
    const index = this.initChipsList.value.indexOf(obj);
    if (index >= 0) {
      this.removeChip.emit({
        value: this.initChipsList.value[index],
        index: itemIndex,
      });
    }
  }
  clearTxtInput(e) {
    this.chipsInput.nativeElement.value = '';
    this.controlChips.setValue('');
  }
  blurChipSugggestion(e) {
    const inputVal = this.chipsInput.nativeElement.value;
    /*เมื่อ blur ที่ ChipSugggestion ถ้ามี ข้อความค้างใน input
      และไม่ใช่การ blur จาก mat-option จะ emit เพื่อให้เป้น Chip*/
    if (inputVal) {
      if (e.relatedTarget === null) {
        this.chipsInput.nativeElement.value = '';
        this.controlChips.setValue('');
        this.selectValue.emit({ value: inputVal, key: null });
      }
      if (e.relatedTarget) {
        if ((e.relatedTarget as Element).tagName !== 'MAT-OPTION') {
          this.chipsInput.nativeElement.value = '';
          this.controlChips.setValue('');
          this.selectValue.emit({ value: inputVal, key: null });
        }
      }
    }
  }
  addChips(e) {
    if (e.value) {
      this.selectValue.emit({ value: e.value, key: null });
      this.chipsInput.nativeElement.value = '';
      // if (this.type === 'CS') {
      //   this.controlChips.setValue('');
      // }
    }
  }
  focusInput() {
    this.chipsInput.nativeElement.focus();
  }
  selectChips(e) {
    this.chipsInput.nativeElement.value = '';
    this.controlChips.setValue('');
    this.selectValue.emit(e.option.value);
  }
  Checkinit(sel) {
    if (!this.initChipsList.value) {
      this.initChipsList.setValue([]);
    }
    if (sel === 'class') {
      return (!this.initChipsList.value.length ? false : true);
    } else {
      return (this.initChipsList.value.length ? false : true);
    }
  }
  getPlaceholder(){
    if (!this.readonly && this.placeholder) {
      return this.placeholder;
    }
  }
  canDeleteChip() {
    if (this.readonly) {
      return false;
    }else{
      return true;
    }
  }
  display(option){
    let defaultOption = option.value;
    if (this.displayOption && option) {
      const showDisplay = option[this.displayOption];
      if (showDisplay) {
        defaultOption = showDisplay;
      }
    }
    return defaultOption;
  }

}
