import { OnDestroy } from '@angular/core';
import { Directive, ElementRef, NgZone, OnInit } from '@angular/core';
import { Subject, debounceTime, fromEvent, takeUntil } from 'rxjs';

@Directive({
  selector: '[posHideDirective]'
})
export class PosHideDirectiveDirective implements OnInit, OnDestroy {

  cardH = 0;
  destroy$: Subject<any> = new Subject();
  constructor(private ele: ElementRef,private ngZone: NgZone){}

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.cardH = document.getElementById('ex-card-validate').offsetHeight;
    this.ngZone.runOutsideAngular(() => {

      const element = document.querySelector(".sit-container");
      fromEvent(element, 'scroll')
      .pipe(debounceTime(100),takeUntil(this.destroy$))
      .subscribe((_: MouseEvent) => {
        if (this.cardH !== this.updateoffsetHeight()) {
          this.cardH = this.updateoffsetHeight()
        }
        if (element.scrollTop > (this.cardH-35)) {
          document.getElementById('move-box').classList.add('move-box-hide');
        }else{
          document.getElementById('move-box').classList.remove('move-box-hide');
        }
      });
    });
  }

  updateoffsetHeight(){
    return document.getElementById('ex-card-validate').offsetHeight;
  }
}
