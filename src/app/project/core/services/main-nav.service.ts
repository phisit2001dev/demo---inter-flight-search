import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainNavService {
  private isOpened = false;
  private subject = new BehaviorSubject<boolean>(this.isOpened);
  private _collectionMenu: { [key: string]: MatMenuTrigger }[] = [];
  private documentClick = new Subject<any>();
  private _currentSys = new BehaviorSubject<string>('');
  private _currentProjectName = new BehaviorSubject<string>('');
  private _updateDate = '';
  private _unLockHiddenToken = '';
  private _operatorName = '';
  private _isLogout = false;
  constructor(private http: HttpClient) {}

  toggle() {
    this.subject.next(!this.isOpened);
    this.isOpened = !this.isOpened;
  }

  get isOpened$() {
    return this.subject.asObservable();
  }

  get _isOpened() {
    return this.isOpened;
  }

  close() {
    if (this.isOpened) {
      this.subject.next(false)
      this.isOpened = false;
    }
  }

  // tslint:disable-next-line: no-shadowed-variable
  register(label: string, trigger: MatMenuTrigger) {
    const obj = {};
    obj[label] = trigger;
    this._collectionMenu.push(obj);
  }

  closeOpened(label: string) {
    this._collectionMenu.forEach((value) => {
      Object.keys(value).forEach((key) => {
        // console.log(key, label);trigger
        if (key !== label && value[key].openMenu) {
          value[key].closeMenu();
        }
      });
    });
  }
  nextTagetClick(target: string) {
    this.documentClick.next(target);
  }

  get doucmentClicked$() {
    return this.documentClick.asObservable();
  }
  get currentSys$() {
    // this._currentSys.asObservable().subscribe((value) => console.log(value));
    return this._currentSys.asObservable();
  }
  set currentSys(e: string) {
    this._currentSys.next(e);
  }

  get currentProjectName$() {
    // this._currentSys.asObservable().subscribe((value) => console.log(value));
    return this._currentProjectName.asObservable();
  }
  set currentProjectName(e: string) {
    this._currentProjectName.next(e);
  }

  set updateDate(e) {
    this._updateDate = e;
  }
  get updateDate() {
    return this._updateDate;
  }
  set unLockHiddenToken(e) {
    this._unLockHiddenToken = e;
  }
  get unLockHiddenToken() {
    return this._unLockHiddenToken;
  }

  get operatorName() {
    return this._operatorName;
  }
  set operatorName(e) {
    this._operatorName = e;
  }

  set isLogout(e: boolean) {
    this._isLogout = e;
  }

  logoutProcess(): Observable<boolean> {
    if (this._isLogout) {
      this._isLogout = !this._isLogout;
    }
    return of(true);
  }
}
