import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnTranslateLoader } from '@app/project/shared/own-translate-loader';
import { HttpClient } from '@angular/common/http';
import { PermissionUserDialogComponent } from '../components/permission-user-dialog/permission-user-dialog.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PermissionUserTableComponent } from '../components/permission-user-table/permission-user-table.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LockStatusPipe } from '@app/project/shared/pipes/lock-status.pipe';
import { ActiveStatusPipe } from '@app/project/shared/pipes/active-status.pipe';
import { MatCardModule } from '@angular/material/card';
import { SitlabelModule } from '@app/project/shared/module/sit-label.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SitValidateModule } from '@app/project/shared/module/sit-validate.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SitTitleModule } from '@app/project/shared/directives/sit-title.module';
import { EnterSearchDirective } from '@app/project/shared/directives/enterSearch.directive';

export function createTranslateLoader(http: HttpClient) {
  return new OwnTranslateLoader(http, [
    { prefix: 'assets/bundle/png-iapi/user-managements/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [PermissionUserTableComponent, PermissionUserDialogComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: [
        {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        },
      ],
      isolate: true,
    }),
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    LockStatusPipe,
    ActiveStatusPipe,
    EnterSearchDirective,
    SitlabelModule,
    SitValidateModule,
    SitTitleModule
  ],
  exports: [
    PermissionUserTableComponent,
    PermissionUserDialogComponent
  ]
})
export class PermissionUserTableModule { }
