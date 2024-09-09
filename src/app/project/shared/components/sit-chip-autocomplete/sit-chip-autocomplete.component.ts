import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_FORM_FIELD } from '@angular/material/form-field';
import { BehaviorSubject, debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'sit-chip-autocomplete',
  templateUrl: './sit-chip-autocomplete.component.html',
  styleUrls: ['./sit-chip-autocomplete.component.scss']
})
export class SitChipAutocompleteComponent implements AfterViewInit,OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  destroy$: Subject<any> = new Subject();
  // input
  @Input() type: 'A'|'S';
  @Input('controlChips') controlChips: FormControl;
  @Input('initChipsList') initChipsList: FormControl;
  @Input() readonly = false;
  @Input() displayOption: string;
  @Input() placeholder: string;
  @Input() displayChips: string;
  @Input() valueChange:BehaviorSubject<any> ;
  @Input() debounceTime = 200;
  @Input() maxLength: string | number;
  @Input() listResult: [];
  @Input() ngClass = '';
  // @Input() class;

  // output
  @Output() selectValue = new EventEmitter();
  @Output() removeChip = new EventEmitter();

  // process view
  @ViewChild('directiveInput') DInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipGrid',{read: ElementRef}) matChipGrid: ElementRef;
  @ViewChild(MAT_FORM_FIELD, {static: false, read: ElementRef}) form: ElementRef;
  constructor() {}

  ngAfterViewInit(): void {
    this.detectChipGrid();
    if (this.valueChange) {
      fromEvent(this.DInput.nativeElement, 'input').pipe(takeUntil(this.destroy$),debounceTime(this.debounceTime)).subscribe(v => {
        let val = this.DInput.nativeElement.value;
        if (!val) {
          this.listResult = [];
        }
        this.valueChange.next(val);
      });
    }
  }


  ngOnInit(): void {
    if (!Array.isArray(this.initChipsList.value)) {
      this.initChipsList.setValue([]);
    }
  }

  // add(event: MatChipInputEvent): void {
  //   const value = (event.value || '').trim();

  //   // Add our fruit
  //   if (value) {
  //     this.fruits.push(value);
  //   }

  //   // Clear the input value
  //   event.chipInput!.clear();

  //   this.fruitCtrl.setValue(null);
  // }

  remove(obj, itemIndex): void {
    const index = this.initChipsList.value.indexOf(obj);
    if (index >= 0) {
      this.removeChip.emit({
        value: this.initChipsList.value[index],
        index: itemIndex,
      });
    }
    this.detectChipGrid();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.DInput.nativeElement.value = '';
    this.controlChips.setValue('');
    this.selectValue.emit(event.option.value);
    this.detectChipGrid();
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

  detectChipGrid(){
    setTimeout(() => {
      const ref: Element = this.matChipGrid.nativeElement;
      if (ref?.clientHeight > 40) {
        ref.classList.add('matChipGrid');
      }else{
        ref.classList.remove('matChipGrid');
      }
    }, 0);
  }

  chipAutoOnblur(){
    // clear input case A
    if (this.DInput.nativeElement.value) {
      this.DInput.nativeElement.value = "";
    }
    if (!this.DInput.nativeElement.value) {
      this.controlChips.setValue('');
    }
  }

  chipAutoOnclick(){
    // console.log(this.listResult);
    if (!this.DInput.nativeElement.value) {
      this.listResult = [];
    }
  }

  searchAll(){
    this.listResult = [];
    this.valueChange.next('&_');
    this.DInput.nativeElement.click();
  }
}
