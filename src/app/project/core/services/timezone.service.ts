import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, distinctUntilChanged, filter, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService implements OnDestroy {

  timeZone$ = new BehaviorSubject<any>(null);
  observable: Subscription;
  constructor() {}

  ngOnDestroy(): void {
    this.observable?.unsubscribe();
    this.timeZone$.next(null);
    this.timeZone$.complete();
  }

  setTimeZone(tz){
    this.timeZone$.next(tz);
    localStorage.setItem('timeZone', tz);
  }

  getTimeZone(){
    return localStorage.getItem('timeZone');
  }

  timeZoneEventInit(){
    this.observable = fromEvent<StorageEvent>(window, "storage")
    .pipe(
      distinctUntilChanged(),
      filter(et => et.key === 'timeZone')
    ).subscribe(ev => {
      this.timeZone$.next(ev.newValue);
    });
  }

  change(): Observable<any> {
    return this.timeZone$.asObservable();
  }
}
