import { GenerateRowNoPipe } from './../pipes/generateRowNo.pipe';
import { InputPaginatorDirective } from './../directives/input-paginator.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPageIndexPipe } from '../pipes/mat-page-index.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [ InputPaginatorDirective,GenerateRowNoPipe,MatPageIndexPipe],
  exports: [ InputPaginatorDirective,GenerateRowNoPipe,MatPageIndexPipe],
})
export class SitPaginatorModule { }
