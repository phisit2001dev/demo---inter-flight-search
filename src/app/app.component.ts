import { MainNavService } from './project/core/services/main-nav.service';
import { Component, HostListener } from '@angular/core';
import { Overlay, CloseScrollStrategy } from '@angular/cdk/overlay';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { MAT_DATEPICKER_SCROLL_STRATEGY } from '@angular/material/datepicker';
import { MAT_MENU_SCROLL_STRATEGY } from '@angular/material/menu';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollOverlay, deps: [Overlay] },
    { provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY, useFactory: scrollOverlay, deps: [Overlay] },
    { provide: MAT_DATEPICKER_SCROLL_STRATEGY, useFactory: scrollOverlay, deps: [Overlay] },
    { provide: MAT_MENU_SCROLL_STRATEGY, useFactory: scrollOverlay, deps: [Overlay] }
  ]

})
export class AppComponent {
  title = 'e-border';

  constructor(private navService: MainNavService){

  }
  @HostListener('document:click', ['$event'])
  clickout(event) {
    this.navService.nextTagetClick(event.target);
  }
}
export function scrollOverlay(overlay: Overlay): () => CloseScrollStrategy {
  return () => overlay.scrollStrategies.close();
}

