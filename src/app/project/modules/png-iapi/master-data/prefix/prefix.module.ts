import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrefixRoutingModule } from './prefix-routing.module';
import { PrefixSearchComponent } from './pages/prefix-search/prefix-search.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SitButtonIconModule } from '@app/project/shared/module/sit-button-icon.module';
import { SitButtonModule } from '@app/project/shared/module/sit-button.module';
import { SitlabelModule } from '@app/project/shared/module/sit-label.module';
import { SitValidateModule } from '@app/project/shared/module/sit-validate.module';
import { ActiveStatusPipe } from '@app/project/shared/pipes/active-status.pipe';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { SitTransactionComponent } from '@app/project/shared/components/sit-transaction/sit-transaction.component';
import { PrefixCriteriaComponent } from './components/prefix-criteria/prefix-criteria.component';
import { PrefixTableComponent } from './components/prefix-table/prefix-table.component';
import { PrefixAddComponent } from './pages/prefix-add/prefix-add.component';
import { PrefixEditComponent } from './pages/prefix-edit/prefix-edit.component';
import { SitTableSortModule } from '@app/project/shared/module/sit-tableSort.module';
import { SitPaginatorModule } from '@app/project/shared/module/sit-paginator.module';
import { EnterSearchDirective } from '@app/project/shared/directives/enterSearch.directive';
import { OwnTranslateLoader } from '@app/project/shared/own-translate-loader';

export function createTranslateLoader(http: HttpClient) {
  return new OwnTranslateLoader(http, [
    { prefix: 'assets/bundle/png-iapi/master-data/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    PrefixSearchComponent,
    PrefixCriteriaComponent,
    PrefixTableComponent,
    PrefixAddComponent,
    PrefixEditComponent
  ],
  imports: [
    CommonModule,
    PrefixRoutingModule,
    HttpClientModule,

    /// Sit Component
    SitTransactionComponent,

    /// Sit
    SitlabelModule,
    SitValidateModule,
    SitButtonModule,
    ActiveStatusPipe,
    SitButtonIconModule,
    SitTableSortModule,
    SitPaginatorModule,
    EnterSearchDirective,

    /// Material
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,

    /// Translate
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
export class PrefixModule { }
