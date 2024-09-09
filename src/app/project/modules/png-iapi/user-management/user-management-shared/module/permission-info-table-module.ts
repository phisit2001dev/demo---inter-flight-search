import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionInfoTableComponent } from '../components/permission-info-table/permission-info-table.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { OwnTranslateLoader } from '@app/project/shared/own-translate-loader';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { PermissionTreeDialogComponent } from '../components/permission-tree-dialog/permission-tree-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SitlabelModule } from '@app/project/shared/module/sit-label.module';
import { SitTitleModule } from '@app/project/shared/directives/sit-title.module';

export function createTranslateLoader(http: HttpClient) {
  return new OwnTranslateLoader(http, [
    { prefix: 'assets/bundle/png-iapi/user-management/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [ PermissionInfoTableComponent, PermissionTreeDialogComponent ],
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
    MatTreeModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    SitlabelModule,
    SitTitleModule
  ],
  exports: [
    PermissionInfoTableComponent,
    PermissionTreeDialogComponent
  ]
})
export class PermissionInfoTableModule { }
