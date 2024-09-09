import { AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Optional, Output } from '@angular/core';
import { Subscription, debounceTime, filter, fromEvent } from 'rxjs';

@Directive({
  selector: '[enterSearch]',
  standalone: true
})
export class EnterSearchDirective implements AfterViewInit, OnDestroy {

  @Output('enterSearch') emitKey = new EventEmitter();

  private readonly config = {
    keyEvent: 'keydown',
    keyTarget: 'Enter',
    dueTime: 350
  };
  private readonly filterNodeName = ['MAT-SELECT','MAT-EXPANSION-PANEL-HEADER','TEXTAREA','BUTTON'];
  private readonly filterInputType = ['radio','checkbox'];
  destroy: Subscription;
  constructor(@Optional() private eleRef: ElementRef) { }

  ngAfterViewInit(): void {
    this.destroy = fromEvent(this.eleRef.nativeElement, this.config.keyEvent).pipe(
      debounceTime(this.config.dueTime),
      filter((e: KeyboardEvent) => e.key === this.config.keyTarget))
      .subscribe((e) => {
        let event = (e.target as HTMLElement);
        if (this.filterNodeName.indexOf(event.nodeName) !== -1) {
          // case condition
          switch (event.nodeName) {
            case this.filterNodeName[0]:
              // MAT-SELECT
              if (event.ariaExpanded === 'false') {
                event.blur();
                event.focus();
                this.emitKey.emit(e);
              }
              break;
            // case this.filterNodeName[3]:
            //   // BUTTON DATE
            //   if (event.parentNode.nodeName === 'MAT-DATEPICKER-TOGGLE') {
            //     event.blur();
            //     event.focus();
            //     this.emitKey.emit(e);
            //   }
            //   break;
            }
        }else if(this.filterInputType.indexOf(event['type']) === -1) {
          event.blur();
          event.focus();
          this.emitKey.emit(e);
        }
      })
  }
  ngOnDestroy(): void {
    this.destroy?.unsubscribe();
  }
}
