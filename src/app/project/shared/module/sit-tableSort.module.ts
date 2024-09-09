import { MultiplesortDirective } from './../directives/multiple-sort.directive';
import { InitMatsortPipe } from './../pipes/init-matsort.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  imports: [
    CommonModule,
    MatSortModule
  ],
  declarations: [InitMatsortPipe,MultiplesortDirective],
  exports: [MatSortModule,InitMatsortPipe,MultiplesortDirective]
})
export class SitTableSortModule { }
