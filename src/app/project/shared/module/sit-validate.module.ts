import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SitValidateInputDirective } from '@app/project/shared/directives/sit-validate-input.directive';
import { SitHelperTextComponent } from './../components/sit-helper-text/sit-helper-text.component';

@NgModule({
  declarations: [SitValidateInputDirective,SitHelperTextComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  exports: [
    SitValidateInputDirective,
    SitHelperTextComponent
  ]
})
export class SitValidateModule {}
