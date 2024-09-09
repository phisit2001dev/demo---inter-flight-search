import { OwnTranslateLoader } from './../../../../shared/own-translate-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { SitlabelModule } from './../../../../shared/module/sit-label.module';
import { SitValidateModule } from './../../../../shared/module/sit-validate.module';
import { SitButtonModule } from './../../../../shared/module/sit-button.module';
import { UserRoutingModule } from './user-routing.module';
import { UserSearchComponent } from './pages/user-search/user-search.component';
import { UserCriteriaComponent } from './components/user-criteria/user-criteria.component';
import { MatSelectModule } from '@angular/material/select';
import { UserInfoTableComponent } from './components/user-info-table/user-info-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActiveStatusPipe } from '@app/project/shared/pipes/active-status.pipe';
import { LockStatusPipe } from '@app/project/shared/pipes/lock-status.pipe';
import { UserAddEditViewComponent } from './pages/user-add-edit-view/user-add-edit-view.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { DatePickerModule } from '@app/project/shared/module/date-picker.module';
import { SitAutocompleteModule } from '@app/project/shared/module/sit-autocomplete.module';
import { MatTabsModule } from '@angular/material/tabs';
import { PermissionInfoTableModule} from '../user-management-shared/module/permission-info-table-module';
import { SitTransactionComponent } from '@app/project/shared/components/sit-transaction/sit-transaction.component';
import { PermissionGroupTableModule } from '../user-management-shared/module/permission-group-table.module';
import { SitTableSortModule } from '@app/project/shared/module/sit-tableSort.module';
import { SitPaginatorModule } from '@app/project/shared/module/sit-paginator.module';
import { SitButtonIconModule } from '@app/project/shared/module/sit-button-icon.module';
import { SitTitleModule } from '@app/project/shared/directives/sit-title.module';
import { DateFromToSpinnerDirective } from '@app/project/shared/directives/date-from-to-spinner.directive';
import { EnterSearchDirective } from '@app/project/shared/directives/enterSearch.directive';
import { InputUsernameDirective } from '@app/project/shared/directives/input-username.directive';
import { InputEnglishDirective } from '@app/project/shared/directives/input-english.directive';

export function createTranslateLoader(http: HttpClient) {
  return new OwnTranslateLoader(http, [
    { prefix: 'assets/bundle/png-iapi/user-management/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    UserSearchComponent,
    UserCriteriaComponent,
    UserInfoTableComponent,
    UserAddEditViewComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
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
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatTabsModule,
    DatePickerModule,
    SitlabelModule,
    SitValidateModule,
    SitButtonModule,
    SitAutocompleteModule,
    SitTransactionComponent,
    SitTableSortModule,
    SitPaginatorModule,
    SitButtonIconModule,
    SitTitleModule,
    DateFromToSpinnerDirective,
    EnterSearchDirective,
    InputUsernameDirective,
    InputEnglishDirective,
    ActiveStatusPipe,
    LockStatusPipe,
    PermissionInfoTableModule,
    PermissionGroupTableModule,

  ]
})
export class UserModule { }
