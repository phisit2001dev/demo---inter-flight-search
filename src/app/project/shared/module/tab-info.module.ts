import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SitTabInfomationComponent } from '../components/tab-infomation/tab-infomation.component';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SitTabInfomationComponent],
  imports:[
    CommonModule,
    TranslateModule,
    MatButtonModule
  ],
  exports: [SitTabInfomationComponent]
})
export class TabInfomationModule { }
