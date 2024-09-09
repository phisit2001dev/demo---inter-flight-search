import { TranslateModule } from '@ngx-translate/core';
import { SitButtonComponent } from './../components/sit-button/sit-button.component';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SitButtonComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule
  ],
  exports: [
    SitButtonComponent
  ]
})
export class SitButtonModule { }
