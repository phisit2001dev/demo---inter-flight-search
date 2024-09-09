import { Time24HoursDirective } from './../directives/time24-hours.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [Time24HoursDirective],
  exports: [Time24HoursDirective]
})
export class Time24Module { }
