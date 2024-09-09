import { Injectable, ChangeDetectorRef } from '@angular/core';
import { CommonResponse } from '@app/common/models/common-response';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class ManualDetectionService {

  constructor() {
    // console.log('Constructor Service');
  }
  private notifier$: Subject<boolean> = new Subject<boolean>();
  private manualDetect$: Subject<boolean> = new Subject<boolean>();
  private memoizedFunctions = [];

  // sitValidate
  private _validateTrigger$ = new Subject<any>();

  /**
   * ให้บริการสำหรับ sit-validate เพื่อ trigger event ไปยัง children
   */
  getmanualDetect$(){
    return this.manualDetect$.asObservable();
  }

  /**
   * ให้บริการสำหรับ parent component เพื่อ trigger event ไปยัง children
   */
  getNext(){
    this.manualDetect$.next(true);
    this.detectAngularValidate();
  }

  /**
   * ให้บริการสำหรับ children component เพื่อรอรับ event จาก parent
   */
  doMarkForCheck(cdf: ChangeDetectorRef){
    this.manualDetect$
    .pipe(takeUntil(this.notifier$))
    .subscribe(
      (val) => {
        cdf.markForCheck();
      },
      // (error) => console.log(error),
      // () => console.log('manualDetect complete')
    );
  }

  setMemoizedFunction(func: any) {
    this.memoizedFunctions.push(func);
  }

  destroy(){
    this.notifier$.next(true);
    this.notifier$.complete();
    this._validateTrigger$.next(true);
    this._validateTrigger$.complete();

    this.memoizedFunctions.forEach(f => {
      f.clear();
    });
  }


  // สำหรับการตรวจสอบ validate api-validate
  getValidateTrigger(){
    return this._validateTrigger$.asObservable();
  }

  // สำหรับการตรวจสอบ validate api-validate
  setValidateResp(commonResp: CommonResponse ,reset: boolean = false) {
    this._validateTrigger$.next({resp: {commonResp, reset}});
  }

  // สำหรับการตรวจสอบ validate ก่อนการ submit
  setValidateManual(element){
    this._validateTrigger$.next({manual: {element}});

  }

  // สำหรับการตรวจสอบ angular validate ของ formcontrol
  detectAngularValidate(){
    this._validateTrigger$.next({detect: {}});
  }

  clearValidate(){
    this._validateTrigger$.next({resp: {commonResp: null, reset: true}});
  };

  // เคสแยกการใช้ manual, resp,detect
}
