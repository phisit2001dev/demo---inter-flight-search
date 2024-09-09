import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserGroupRoutingModule } from './user-group-routing.module';
import { UserGroupSearchComponent } from './pages/user-group-search/user-group-search.component';
import { UserGroupCriteriaComponent } from './components/user-group-criteria/user-group-criteria.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { OwnTranslateLoader } from '@app/project/shared/own-translate-loader';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SitlabelModule } from '@app/project/shared/module/sit-label.module';
import { SitValidateModule } from '@app/project/shared/module/sit-validate.module';
import { SitButtonModule } from '@app/project/shared/module/sit-button.module';
import { UserGroupInfoTableComponent } from './components/user-group-info-table/user-group-info-table.component';
import { ActiveStatusPipe } from '@app/project/shared/pipes/active-status.pipe';
import { UserGroupAddEditViewComponent } from './pages/user-group-add-edit-view/user-group-add-edit-view.component';
import { UserGroupInfoComponent } from './components/user-group-info/user-group-info.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PermissionInfoTableModule } from '../user-management-shared/module/permission-info-table-module';
import { LockStatusPipe } from '@app/project/shared/pipes/lock-status.pipe';
import { SitTransactionComponent } from '@app/project/shared/components/sit-transaction/sit-transaction.component';
import { PermissionUserTableModule } from '../user-management-shared/module/permission-user-table.module';
import { AccessibleAirportTableModule } from '../user-management-shared/module/accessible-airport-table.module';
import { SitTableSortModule } from '@app/project/shared/module/sit-tableSort.module';
import { SitPaginatorModule } from '@app/project/shared/module/sit-paginator.module';
import { SitButtonIconModule } from '@app/project/shared/module/sit-button-icon.module';
import { EnterSearchDirective } from '@app/project/shared/directives/enterSearch.directive';
import { SitTitleModule } from '@app/project/shared/directives/sit-title.module';

export function createTranslateLoader(http: HttpClient) {
  return new OwnTranslateLoader(http, [
    { prefix: 'assets/bundle/png-iapi/user-management/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    UserGroupSearchComponent,
    UserGroupCriteriaComponent,
    UserGroupInfoTableComponent,
    UserGroupAddEditViewComponent,
    UserGroupInfoComponent
  ],
  imports: [
    CommonModule,
    UserGroupRoutingModule,
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
    SitlabelModule,
    SitValidateModule,
    SitButtonModule,
    SitTransactionComponent,
    SitTableSortModule,
    SitPaginatorModule,
    SitButtonIconModule,
    SitTitleModule,
    EnterSearchDirective,
    ActiveStatusPipe,
    LockStatusPipe,
    PermissionInfoTableModule,
    PermissionUserTableModule,
    AccessibleAirportTableModule
  ]
})
export class UserGroupModule { }
