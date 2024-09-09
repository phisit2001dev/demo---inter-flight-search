import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SitSpinnerComponent } from './components/sit-spinner/sit-spinner.component';

@NgModule({
  imports: [
    NgxSpinnerModule
  ],
  declarations: [SitSpinnerComponent],
  exports: [SitSpinnerComponent]
})
export class SitSpinnerModule {}
