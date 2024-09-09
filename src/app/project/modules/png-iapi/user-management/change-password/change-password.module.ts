import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { OwnTranslateLoader } from '@app/project/shared/own-translate-loader';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SitlabelModule } from '@app/project/shared/module/sit-label.module';
import { SitButtonModule } from '@app/project/shared/module/sit-button.module';
import { SitValidateModule } from '@app/project/shared/module/sit-validate.module';
import { SitInputFileModule } from '@app/project/shared/module/sit-input-file.module';
import { SitPasswordValidationModule } from '@app/project/shared/module/sit-password-validation.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { UserForgotPasswordComponent } from './pages/user-forgot-password/user-forgot-password.component';
import { PageSuccessComponent } from './pages/page-success/page-success.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';


export function createTranslateLoader(http: HttpClient) {
  return new OwnTranslateLoader(http, [
    { prefix: 'assets/bundle/png-iapi/user-management/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    ChangePasswordComponent,
    UserForgotPasswordComponent,
    PageSuccessComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    // Meterial Module
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,

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
export class ChangePasswordModule { }
