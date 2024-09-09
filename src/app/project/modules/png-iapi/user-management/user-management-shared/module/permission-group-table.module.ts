import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { OwnTranslateLoader } from '@app/project/shared/own-translate-loader';
import { PermissionGroupTableComponent } from '../components/permission-group-table/permission-group-table.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActiveStatusPipe } from '@app/project/shared/pipes/active-status.pipe';
import { SitlabelModule } from '@app/project/shared/module/sit-label.module';
import { PermissionGroupDialogComponent } from '../components/permission-group-dialog/permission-group-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { SitTitleModule } from '@app/project/shared/directives/sit-title.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { SitValidateModule } from '@app/project/shared/module/sit-validate.module';
import { EnterSearchDirective } from '@app/project/shared/directives/enterSearch.directive';

export function createTranslateLoader(http: HttpClient) {
  return new OwnTranslateLoader(http, [
    { prefix: 'assets/bundle/png-iapi/user-management/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [PermissionGroupTableComponent, PermissionGroupDialogComponent],
  imports: [
    CommonModule,
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
    ActiveStatusPipe,
    EnterSearchDirective,
    SitlabelModule,
    SitValidateModule,
    SitTitleModule
  ],
  exports: [
    PermissionGroupTableComponent,
    PermissionGroupDialogComponent
  ]
})
export class PermissionGroupTableModule { }
