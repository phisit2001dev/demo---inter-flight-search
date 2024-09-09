import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OwnTranslateLoader } from '@app/project/shared/own-translate-loader';
import { AuditLogRoutingModule } from './audit-log-routing.module';
import { AuditLogSearchComponent } from './pages/audit-log-search/audit-log-search.component';
import { AuditLogCriteriaComponent } from './components/audit-log-criteria/audit-log-criteria.component';
import { AuditLogTableComponent } from './components/audit-log-table/audit-log-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputEnglishDirective } from '@app/project/shared/directives/input-english.directive';
import { SitButtonIconModule } from '@app/project/shared/module/sit-button-icon.module';
import { SitButtonModule } from '@app/project/shared/module/sit-button.module';
import { SitlabelModule } from '@app/project/shared/module/sit-label.module';
import { SitPaginatorModule } from '@app/project/shared/module/sit-paginator.module';
import { SitTableSortModule } from '@app/project/shared/module/sit-tableSort.module';
import { SitValidateModule } from '@app/project/shared/module/sit-validate.module';
import { Time24Module } from '@app/project/shared/module/time-24.module';
import { DatePickerModule } from '@app/project/shared/module/date-picker.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateFromToSpinnerDirective } from '@app/project/shared/directives/date-from-to-spinner.directive';
import { NumberOnlySpinerDirective } from '@app/project/shared/directives/number-only-spiner.directive';
import { DialogViewComponent } from './components/dialog-view/dialog-view.component';
import { InputUsernameDirective } from '@app/project/shared/directives/input-username.directive';

export function createTranslateLoader(http: HttpClient) {
  return new OwnTranslateLoader(http, [
    { prefix: 'assets/bundle/png-iapi/user-management/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    AuditLogSearchComponent,
    AuditLogCriteriaComponent,
    AuditLogTableComponent,
    DialogViewComponent,
  
  ],
  imports: [
    CommonModule,
    AuditLogRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,

    //sit
    SitlabelModule,
    SitButtonModule,
    SitTableSortModule,
    SitPaginatorModule,
    SitButtonIconModule,
    SitValidateModule,
  //directive
    InputEnglishDirective,
    DatePickerModule,
    Time24Module,
    NumberOnlySpinerDirective,
    DateFromToSpinnerDirective,
    InputUsernameDirective,
    
    TranslateModule.forChild({
      loader: [
        {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      ],
      isolate: true,
    })
  ]
})
export class AuditLogModule { }
