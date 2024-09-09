import { SitTitleComponent } from './../components/sit-title/sit-title.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [	SitTitleComponent,
   ],
  imports: [
    CommonModule
  ],
  exports: [SitTitleComponent]
})
export class SitTitleModule { }
