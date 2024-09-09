import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonResponse } from './../../../common/models/common-response';

interface setHttpValidate {
  commonResp: CommonResponse,
  reset: boolean
}

@Injectable({
  providedIn: 'root',
})
export class SitValidatorInputService {

  // _handelResponseTrigger = new Subject<{commonResp:CommonResponse,reset:boolean}>
  // private _handelResponseTrigger = new Subject<[]|setHttpValidate>

  constructor() {}

  // getTrigger(){
  //   return this._handelResponseTrigger.asObservable();
  // }

  // trigger(commonResp: CommonResponse,reset: boolean = false) {
  //   this._handelResponseTrigger.next({commonResp, reset});
  // }

  // setValidate(element){
  //   this._handelResponseTrigger.next(element);
  // }

  // complate() {
  //   if (this._handelResponseTrigger) {
  //     this._handelResponseTrigger.complete();
  //   }
  // }

}
