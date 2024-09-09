import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {

    spinnerName : string = 'mainspinner';

    constructor(
        private ngxSpinner : NgxSpinnerService
    ){}

    // แสดง spinner
    show(name?: string): void{
        if(name){
            this.ngxSpinner.show(name);
        }else{
            this.ngxSpinner.show(this.spinnerName);
        }
    }

    // ซ่อน spinner
    hide(name?: string){
        if(name){
            this.ngxSpinner.hide(name);
        }else{
            this.ngxSpinner.hide(this.spinnerName);
        }
    }
}