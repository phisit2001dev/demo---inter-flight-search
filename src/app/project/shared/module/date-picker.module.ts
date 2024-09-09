import { DatePickerDirective } from './../directives/date-picker.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
  declarations: [DatePickerDirective],
  imports: [
    CommonModule,
    MatDatepickerModule,

  ],
  exports: [DatePickerDirective, MatDatepickerModule]
})
export class DatePickerModule { }
