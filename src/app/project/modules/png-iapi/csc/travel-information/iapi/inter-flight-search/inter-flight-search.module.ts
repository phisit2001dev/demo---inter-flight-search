import { SitPaginatorModule } from './../../../../../../shared/module/sit-paginator.module';
import { SitTableSortModule } from './../../../../../../shared/module/sit-tableSort.module';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePickerModule } from '@app/project/shared/module/date-picker.module';
import { SitButtonIconModule } from '@app/project/shared/module/sit-button-icon.module';
import { OwnTranslateLoader } from '@app/project/shared/own-translate-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DateFromToSpinnerDirective } from './../../../../../../shared/directives/date-from-to-spinner.directive';
import { NumberOnlySpinerDirective } from './../../../../../../shared/directives/number-only-spiner.directive';
import { SitAutocompleteModule } from './../../../../../../shared/module/sit-autocomplete.module';
import { SitButtonModule } from './../../../../../../shared/module/sit-button.module';
import { SitlabelModule } from './../../../../../../shared/module/sit-label.module';
import { SitValidateModule } from './../../../../../../shared/module/sit-validate.module';
import { Time24Module } from './../../../../../../shared/module/time-24.module';
import { BlacklistStatusPipe } from './../../../../../../shared/pipes/blacklist-status.pipe';
import { NoEntryStatusPipe } from './../../../../../../shared/pipes/no-entry-status.pipe';
import { NotOkToBoardStatusPipe } from './../../../../../../shared/pipes/not-ok-to-board-status.pipe';
import { RiskStatusPipe } from './../../../../../../shared/pipes/risk-status.pipe';
import { InterFlightSearchCriteriaComponent } from './components/inter-flight-search-criteria/inter-flight-search-criteria.component';
import { InterFlightSearchTableComponent } from './components/inter-flight-search-table/inter-flight-search-table.component';
import { InterFlightSearchRoutingModule } from './inter-flight-search-routing.module';
import { InterFlightSearchComponent } from './pages/inter-flight-search/inter-flight-search.component';


export function createTranslateLoader(http: HttpClient) {
  return new OwnTranslateLoader(http, [
    { prefix: 'assets/bundle/png-iapi/csc/travel-information/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    InterFlightSearchComponent,
    InterFlightSearchCriteriaComponent,
    InterFlightSearchTableComponent
  ],
  imports: [
    CommonModule,
    InterFlightSearchRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    
    SitlabelModule,
    SitButtonModule,
    SitAutocompleteModule,
    SitValidateModule,
    SitTableSortModule,
    SitPaginatorModule,
    SitButtonIconModule,
    SitValidateModule,
    DatePickerModule,
    Time24Module,
    //Pipe
    NotOkToBoardStatusPipe, 
    NoEntryStatusPipe,
    BlacklistStatusPipe,
    RiskStatusPipe,
    //directive
    NumberOnlySpinerDirective,
    DateFromToSpinnerDirective,
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
export class InterFlightSearchModule { }
