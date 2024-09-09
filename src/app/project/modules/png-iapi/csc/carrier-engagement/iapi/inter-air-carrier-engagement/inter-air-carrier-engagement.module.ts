import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { OwnTranslateLoader } from './../../../../../../shared/own-translate-loader';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterAirCarrierEngagementRoutingModule } from './inter-air-carrier-engagement-routing.module';
import { InterAirCarrierEngagementSearchComponent } from './pages/inter-air-carrier-engagement-search/inter-air-carrier-engagement-search.component';
import { CarrierEngagementCriteriaComponent } from './component/carrier-engagement-criteria/carrier-engagement-criteria.component';
import { CarrierEngagementTableComponent } from './component/carrier-engagement-table/carrier-engagement-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { SitlabelModule } from '@app/project/shared/module/sit-label.module';
import { SitButtonModule } from '@app/project/shared/module/sit-button.module';
import { SitAutocompleteModule } from '@app/project/shared/module/sit-autocomplete.module';
import { SitValidateModule } from '@app/project/shared/module/sit-validate.module';
import { SitButtonIconModule } from '@app/project/shared/module/sit-button-icon.module';
import { SitPaginatorModule } from '@app/project/shared/module/sit-paginator.module';
import { SitTableSortModule } from '@app/project/shared/module/sit-tableSort.module';
import { MatInputModule } from '@angular/material/input';
import { InterAirCarrierEngagementAddEditViewComponent } from './pages/inter-air-carrier-engagement-add-edit-view/inter-air-carrier-engagement-add-edit-view.component';
import { CarrierEngagementAddEditViewCriteriaComponent } from './component/carrier-engagement-add-edit-view-criteria/carrier-engagement-add-edit-view-criteria.component';
import { UpdateRemarkTableComponent } from './component/update-remark-table/update-remark-table.component';
import { AddRemarkDialogComponent } from './component/add-remark-dialog/add-remark-dialog.component';
import { Time24Module } from '@app/project/shared/module/time-24.module';
import { DatePickerModule } from '@app/project/shared/module/date-picker.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SitInputFileModule } from '@app/project/shared/module/sit-input-file.module';

export function createTranslateLoader(http: HttpClient) {
  return new OwnTranslateLoader(http, [
    { prefix: 'assets/bundle/png-iapi/csc/carrier-engagement/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    InterAirCarrierEngagementSearchComponent,
    CarrierEngagementCriteriaComponent,
    CarrierEngagementTableComponent,
    InterAirCarrierEngagementAddEditViewComponent,
    CarrierEngagementAddEditViewCriteriaComponent,
    UpdateRemarkTableComponent,
    AddRemarkDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule,
    Time24Module,

    // Meterial Module
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDialogModule,
    MatToolbarModule,
    

    // Sit Module
    SitlabelModule,
    SitButtonModule,
    SitAutocompleteModule,
    SitValidateModule,
    SitButtonIconModule,
    SitPaginatorModule,
    SitTableSortModule,
    SitInputFileModule,
    
    
    InterAirCarrierEngagementRoutingModule,
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
export class InterAirCarrierEngagementModule { }
