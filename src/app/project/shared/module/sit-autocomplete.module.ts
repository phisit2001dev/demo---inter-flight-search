import { SitAutoPlaceholderPipe } from './../pipes/sit-auto-placeholder.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SitAutocompleteComponent } from './../components/sit-autocomplete/sit-autocomplete.component';
import { SitChipAutocompleteComponent } from './../components/sit-chip-autocomplete/sit-chip-autocomplete.component';
import { AutocompleteHighlightDirective } from './../directives/autocomplete-highlight.directive';
import { AutocompleteClearDirective } from './../directives/autocomplete.directive';
import { SugggestionDirective } from './../directives/sugggestion.directive';
import {MatRippleModule} from '@angular/material/core';

@NgModule({
  declarations: [
    SitAutocompleteComponent,
    AutocompleteClearDirective,
    SugggestionDirective,
    AutocompleteHighlightDirective,
    SitChipAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatChipsModule,
    MatRippleModule,
    SitAutoPlaceholderPipe
  ],
  exports: [SitAutocompleteComponent, SitChipAutocompleteComponent],
})

export class SitAutocompleteModule {}
