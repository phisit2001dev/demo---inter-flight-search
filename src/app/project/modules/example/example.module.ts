import { A11yModule } from '@angular/cdk/a11y';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SitButtonIconModule } from '@app/project/shared/module/sit-button-icon.module';
import { SitTableSortModule } from '@app/project/shared/module/sit-tableSort.module';
import { Time24Module } from '@app/project/shared/module/time-24.module';
import { OwnTranslateLoader } from '@app/project/shared/own-translate-loader';
import { LockStatusPipe } from '@app/project/shared/pipes/lock-status.pipe';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SitlabelModule } from '../../shared/module/sit-label.module';
import { NumberOnlyDirective } from './../../shared/directives/number-only.directive';
import { SitTitleModule } from './../../shared/directives/sit-title.module';
import { DatePickerModule } from './../../shared/module/date-picker.module';
import { SitAutocompleteModule } from './../../shared/module/sit-autocomplete.module';
import { SitButtonModule } from './../../shared/module/sit-button.module';
import { SitPaginatorModule } from './../../shared/module/sit-paginator.module';
import { SitValidateModule } from './../../shared/module/sit-validate.module';
import { ActiveStatusPipe } from './../../shared/pipes/active-status.pipe';
import { AirportCriteriaComponent } from './component/airport-criteria/airport-criteria.component';
import { AirportTableComponent } from './component/airport-table/airport-table.component';
import { DemoValidateComponent } from './component/demo-validate/demo-validate.component';
import { ThemeDisableComponent } from './component/theme-disable/theme-disable.component';
import { ExampleRoutingModule } from './example-routing.module';
import { DemoPageAddAirportComponent } from './page/demo-page-add-airport/demo-page-add-airport.component';
import { DemoPageInitAirportComponent } from './page/demo-page-init-airport/demo-page-init-airport.component';
import { DemoPageValidateComponent } from './page/demo-page-validate/demo-page-validate.component';
import { TestComponentComponent } from './page/test-component/test-component.component';
import { AirportCriteriaAddViewComponent } from './component/airport-criteria-add-view/airport-criteria-add-view.component';
import { SitPasswordValidationModule } from '@app/project/shared/module/sit-password-validation.module';
import { SitInputFileComponent } from '@app/project/shared/components/sit-input-file/sit-input-file.component';
import { SitInputFileModule } from '@app/project/shared/module/sit-input-file.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PosHideDirectiveDirective } from './directive/pos-hide-directive.directive';
import { EnterSearchDirective } from '@app/project/shared/directives/enterSearch.directive';
import {MatExpansionModule} from '@angular/material/expansion';

export function createTranslateLoader(http: HttpClient) {
  return new OwnTranslateLoader(http, [
    { prefix: 'assets/mockjson/example/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    TestComponentComponent,
    DemoPageInitAirportComponent,
    AirportTableComponent,
    AirportCriteriaComponent,
    DemoPageAddAirportComponent,
    DemoValidateComponent,
    DemoPageValidateComponent,
    ThemeDisableComponent,
    AirportCriteriaAddViewComponent,
    PosHideDirectiveDirective
  ],
  imports: [
    CommonModule,
    ExampleRoutingModule,
    HttpClientModule,
    //sit-component
    SitlabelModule,
    SitAutocompleteModule,
    DatePickerModule,
    Time24Module,
    // Paginator
    SitPaginatorModule,
    // TableSort
    SitTableSortModule,
    // validate
    SitValidateModule,
    // angular material
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    SitTitleModule,
    MatTabsModule,
    MatRadioModule,
    MatCheckboxModule,
    TextFieldModule,
    A11yModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    DragDropModule,
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
    SitButtonModule,
    MatSelectModule,
    NumberOnlyDirective,
    SitButtonIconModule,
    ActiveStatusPipe,
    LockStatusPipe,
    MatTooltipModule,
    MatSlideToggleModule,
    SitPasswordValidationModule,
    SitInputFileModule,
    EnterSearchDirective,
    MatExpansionModule
  ]
})
export class ExampleModule { }
