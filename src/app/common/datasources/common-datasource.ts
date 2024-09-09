import { CommonResponse } from '@app/common/models/common-response';
import { DataSource } from '@angular/cdk/table';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractSearchComponent } from '@app/abstracts/abstract-search-component';
import { ConfirmDialogComponent } from '@app/project/shared/components/confirm-dialog/confirm-dialog.component';
import { BehaviorSubject, Observable } from 'rxjs';

interface Paginator {
  linePerPage: string,
  pageIndex: string
}


export class SitCommonDatasource implements DataSource<any> {


  private _dataSource$ = new BehaviorSubject<any[]>([]);
  private _sortHeader$ = new BehaviorSubject<any>('');
  private _paginator$ = new BehaviorSubject<Paginator>(undefined);

  // -------------------_dataSource
  load(resp: any) {
    this._dataSource$.next(resp);
  }

  connect(): Observable<any[]> {
    return this._dataSource$.asObservable();
  }

  disconnect(): void {
    // this.subject.complete();
  }

  // -------------------_paginator


  get paginator() {
    return this._paginator$.asObservable();
  }








  private subject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(undefined);
  _size = 0;
  loading$ = this.loadingSubject.asObservable();
  hidden = true;
  loading = false;
  // ใช้ตรวจสอบว่ามีข้อมูลหรือไม่
  isEmpty = false;
  constructor(
    private absComponent?: AbstractSearchComponent
  ) {}


  get size() {
    return this._size;
  }
  setSize(val) {
    val = this._size;
  }

  // set header(e) {
  //   this._header = e;
  // }
  get data() {
    return this.subject.value;
  }

  get length() {
    return this.subject.value.length;
  }

  // generateRowNumber(index: number): number {
  //   if (this.absComponent) {
  //     const pageSize = this.absComponent.paginator.pageSize;
  //     const pageIndex = this.absComponent.displayPageIndex;

  //     return pageIndex * pageSize + (index + 1);
  //   } else {
  //     return index + 1;
  //   }
  // }

}
