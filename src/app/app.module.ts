import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_PAGINATOR_DEFAULT_OPTIONS } from '@angular/material/paginator';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/slide-toggle';
import { MAT_SORT_DEFAULT_OPTIONS } from '@angular/material/sort';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppComponent } from './app.component';
import { CoreModule } from './project/core/core.module';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';
import { TimezoneService } from './project/core/services/timezone.service';


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    CommonModule,
    CoreModule,
    NgxSpinnerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
  },
  {
    provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
  },
  {
    provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
  },
  {
    provide: MAT_DIALOG_DEFAULT_OPTIONS,
    useValue: { disableClose: true, autoFocus: true, restoreFocus: false },
  },
  {
    provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
    useValue: { hidePageSize: true, showFirstLastButtons: true },
  },
  {
    provide: MAT_SORT_DEFAULT_OPTIONS,
    useValue: { disableClear: true },
  },
  {
    provide: MAT_TABS_CONFIG,
    useValue: { animationDuration: '400ms' },
  },
  {
    provide: APP_INITIALIZER,
    useFactory: (timeZone: TimezoneService) => () => timeZone.timeZoneEventInit(),
    deps: [TimezoneService],
    multi: true
  }

],
  bootstrap: [AppComponent]
})
export class AppModule { }
