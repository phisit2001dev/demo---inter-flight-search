import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Directive, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { AlertDialogComponent } from '@app/project/shared/components/alert-dialog/alert-dialog.component';
import { AlertDialogData } from '@app/project/shared/components/alert-dialog/models/alert-dialog-data';
import { ConfirmDialogComponent } from '@app/project/shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialog } from '@app/project/shared/components/confirm-dialog/models/confirm-dialog';
import { SitValidateInputDirective } from '@app/project/shared/directives/sit-validate-input.directive';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonResponse } from './../common/models/common-response';

@Directive()
export abstract class AbstractComponent {
  destroy$: Subject<any> = new Subject();
  translateSub: Subscription;
  _prevPayload = null;
  language$;

  @ViewChildren(SitValidateInputDirective)
  inputValidates = new QueryList<SitValidateInputDirective>();

  @ViewChildren(MatPaginator)
  matPaginator = new QueryList<MatPaginator>();
  // @ViewChild(MatSort) matSort: MatSort
  @ViewChildren(MatSortHeader) matSortHeader:QueryList<MatSortHeader>;

  constructor(
    protected snackbarService: SnackbarService,
    protected dialog: MatDialog,
    protected abstractSpinner: SpinnerService,
    // ------ sitValidator ------------------
    protected mds$?: ManualDetectionService,
    // ------ language ----------------------
    protected translate?: TranslateService,
    protected authQuery?: AuthQuery,
  ) {
    if (this.authQuery) {
      this.language$ = this.authQuery.select().pipe(
        map((map) => map.language)
      );
    }
  }

  onInitial() {
    this.translateSub = this.language$.subscribe((tranState) => {
      if (tranState) {
        this.translate.use(tranState.toLowerCase());
      }
    });

    if (this.mds$) {
      this.mds$.getValidateTrigger()
      .pipe(takeUntil(this.destroy$))
      .subscribe((trigger) =>{
        if (!trigger) {
          this.mds$.clearValidate();
          return;
        }
        if (trigger.detect) {
          this.setErrorMarkAsTouched();
        }else if(trigger.manual) {
          // setvalidate # case custom
          this.processSetValidate(trigger.manual.element);
        }else if (trigger.resp) {
          if (!trigger.resp.reset) {
            // setvalidate # case api
            this.processSetValidate(trigger.resp.commonResp?.invalid);
          }else {
            this.setErrorForm(null);
          }
        }
      })
    }
  }

  onDestroy() {
    if (this.translateSub) {
      this.translateSub.unsubscribe();
    }

    this.destroy$.next(null);
    this.destroy$.complete();
  }

  openConfirm(messageCode: string): MatDialogRef<ConfirmDialogComponent, any> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        description: this.translate.instant(messageCode),
      },
    });
    return dialogRef;
  }

  handleResponse(
    payload: CommonResponse,
    byPassSpinner?: boolean
  ): MatSnackBarRef<any> | MatDialogRef<any, any> {
    this.mds$?.clearValidate();
    const title = payload.messageDesc;
    let status = payload.error ? 'E' : payload.displayStatus;
    // add check if warning status set fromdisplayStatus
    if (payload.displayStatus !== 'E') {
      status = payload.displayStatus;
    }else {}

    // create prevPayload
    this._prevPayload = payload;

    if (this.mds$) {
      this.mds$.setValidateResp(this._prevPayload,false);
    }

    // Alert Dialog
    if (payload.componentType === 'A') {
      const data: AlertDialogData = {
        title,
        description: payload.messageDesc ? payload.messageDesc : '',
        closeLabel: 'Close',
        type: status,
      };

      return this.dialog.open<AlertDialogComponent, AlertDialogData, void>(
        AlertDialogComponent,
        {
          disableClose: false,
          data,
        }
      );

      // Confirm Dialog
    } else if (payload.componentType === 'C') {
      // console.log('type CCC');
      const data: ConfirmDialog = {
        // header: title,
        description: title,
        cancelText: 'No',
        confirmText: 'Yes',
      };

      return this.dialog.open<ConfirmDialogComponent, ConfirmDialog, boolean>(
        ConfirmDialogComponent,
        {
          disableClose: false,
          data,
        }
      );

      // SnackBar
    } else {
      if (payload.messageCode === 'X00000') {
        return;
      } else {
        return this.snackbarService.open(title, status, byPassSpinner);
      }
    }
  }

  /**
   * @param obj
   * @note obj รับ type เป็น [ ] หรือ boolean สำหรับการตรวจสอบและ setError และ clear error form
   *
   *
   **/
  setErrorForm(obj: {element: string, msg:string}[] | boolean, clearPreviousValidate: boolean = false){

    let validatorRef = [];
    if (typeof(obj) === 'boolean') {
      if (obj) {
        this.inputValidates.forEach(directive => {
          directive.helper?.setInitFormErrMsg();
          directive.helper?.update();
        })
      }else {
        this.inputValidates.forEach(directive => directive.setValidStyleCustom());
      }
      return;
    }
    if (Array.isArray(obj)) {
      let objmsg = obj
      objmsg.forEach(input => {
        let data = this.inputValidates.find((v) => v.input === input.element);
        if (data) {
          validatorRef.push({msg: input.msg, directive: data});
        }
      });
      if (validatorRef.length > 0) {
        if (clearPreviousValidate) {
          this.inputValidates.forEach(directive => directive.setValidStyleCustom());
        }
        validatorRef.forEach(ref => {
          ref.directive.setInvalidStyleCustom(ref.msg);
        })
      }
    }else {
      this.inputValidates.forEach(directive => directive.setValidStyleCustom());
    }

  }

  setErrorMarkAsTouched(){
    this.setErrorForm(true); //*
  }


  clearValidateInput() {
    if (this.mds$) {
      this.mds$.clearValidate();
    }
  }

  // สำหรับการ set validate ให้ element
  processSetValidate(listElement){
    if (listElement?.length > 0) {
      listElement.forEach(resp => {
        let ele = this.inputValidates.find(validate => validate.input === resp.element);
        if (ele) {
          if (resp.msg) {
            ele.setInvalidStyleCustom(resp.msg);
          }else if(resp.msg === null) {
            ele.setValidStyleCustom();
          }else{
            ele.setInvalidStyleCustom('');
          }
        }
      });
    }
  }

  /**
   *
   * @param pageIndex
   * @param linePerPage
   * @param dataLength
   * @returns false = ไม่ผ่าน
   */

  validatePaginator(pageIndex: number, linePerPage: any, dataLength: number){
    // always rounds up floating point number
    if (pageIndex > Math.ceil(dataLength / linePerPage)) {
      return false;
    }
    return true;
  }


  // /**
  //  *
  //  *
  //  * @param {*} [headerSort=[]]
  //  * @memberof AbstractComponent
  //  */

  // initialSortHeader(headerSort = []){
  //   // ตรวจสอบ sortHeader
  //   if (this.matSortHeader && headerSort) {
  //     this.matSortHeader.forEach((header,index) => {
  //       if (header.id === headerSort[index].columnName) {
  //         header.start = headerSort[index].order;
  //         header._updateArrowDirection();
  //       }
  //     })
  //     document.getElementById('sitTable').classList.add('init-sort-header');
  //   }
  // }
}
