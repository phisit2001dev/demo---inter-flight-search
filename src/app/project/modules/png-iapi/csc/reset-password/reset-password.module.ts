import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './page/reset-password/reset-password.component';
import { HttpClient } from '@angular/common/http';
import { OwnTranslateLoader } from '@app/project/shared/own-translate-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SitlabelModule } from '@app/project/shared/module/sit-label.module';
import { SitButtonModule } from '@app/project/shared/module/sit-button.module';
import { SitValidateModule } from '@app/project/shared/module/sit-validate.module';
import { SitInputFileModule } from '@app/project/shared/module/sit-input-file.module';
import { SitPasswordValidationModule } from '@app/project/shared/module/sit-password-validation.module';
import { MatSelectModule } from '@angular/material/select';

export function createTranslateLoader(http: HttpClient) {
  return new OwnTranslateLoader(http, [
    { prefix: 'assets/bundle/png-iapi/csc/reset-password/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    ResetPasswordRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    // Meterial Module
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,

    // Sit Module
    SitlabelModule,
    SitButtonModule,
    SitValidateModule,
    SitInputFileModule,
    SitPasswordValidationModule,

    TranslateModule.forChild({
      loader: [
        {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      ],
      isolate: true,
    }),
  ]
})
export class ResetPasswordModule { }
