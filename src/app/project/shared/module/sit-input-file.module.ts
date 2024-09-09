import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitInputFileComponent } from '../components/sit-input-file/sit-input-file.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SitInputFileComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressBarModule,
    TranslateModule,
    MatButtonModule,
  ],
  exports: [
    SitInputFileComponent
  ]
})
export class SitInputFileModule { }
