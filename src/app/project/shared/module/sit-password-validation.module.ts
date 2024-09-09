import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SitPasswordValidationComponent } from '../components/sit-password-validation/sit-password-validation.component';
import { ValidateFormStatusPipe } from '../components/sit-password-validation/pipe/validate-form-status.pipe';
import { ValidateFormIconPipe } from '../components/sit-password-validation/pipe/validate-form-icon.pipe';
@NgModule({
  declarations: [SitPasswordValidationComponent ],
  imports: [
    CommonModule,
    MatIconModule,
    ValidateFormStatusPipe,
    ValidateFormIconPipe
  ],
  exports: [SitPasswordValidationComponent]
})
export class SitPasswordValidationModule { }
