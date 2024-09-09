import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirCarrierRoutingModule } from './air-carrier-routing.module';
import { AirCarrierSearchComponent } from './pages/air-carrier-search/air-carrier-search.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { OwnTranslateLoader } from '@app/project/shared/own-translate-loader';
import { AirCarrierCriteriaComponent } from './components/air-carrier-criteria/air-carrier-criteria.component';
import { AirCarrierTableComponent } from './components/air-carrier-table/air-carrier-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {ReactiveFormsModule } from '@angular/forms';
import {MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SitAutocompleteModule } from '@app/project/shared/module/sit-autocomplete.module';
import { SitButtonIconModule } from '@app/project/shared/module/sit-button-icon.module';
import { SitButtonModule } from '@app/project/shared/module/sit-button.module';
import { SitlabelModule } from '@app/project/shared/module/sit-label.module';
import { SitPaginatorModule } from '@app/project/shared/module/sit-paginator.module';
import { SitTableSortModule } from '@app/project/shared/module/sit-tableSort.module';
import { SitValidateModule } from '@app/project/shared/module/sit-validate.module';
import { ActiveStatusPipe } from '@app/project/shared/pipes/active-status.pipe';
import { MatRadioModule } from '@angular/material/radio';
import { InputEnglishDirective } from '@app/project/shared/directives/input-english.directive';
import { SitTransactionComponent } from "../../../../shared/components/sit-transaction/sit-transaction.component";
import { AirCarrirerAddEditComponent } from './pages/air-carrirer-add-edit/air-carrirer-add-edit.component';
export function createTranslateLoader(http: HttpClient) {
  return new OwnTranslateLoader(http, [
    { prefix: 'assets/bundle/png-iapi/master-data/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    AirCarrierSearchComponent,
    AirCarrierCriteriaComponent,
    AirCarrierTableComponent,
    AirCarrirerAddEditComponent,

  ],
  imports: [
    CommonModule,
    MatRadioModule,
    HttpClientModule,
    AirCarrierRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    SitlabelModule,
    SitButtonModule,
    SitAutocompleteModule,
    SitTableSortModule,
    SitPaginatorModule,
    SitButtonIconModule,
    SitValidateModule,
    //Pipe
    ActiveStatusPipe,
    //directive
    InputEnglishDirective,
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
    SitTransactionComponent
]
})
export class AirCarrierModule { }
