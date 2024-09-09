import { Directive, ElementRef, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil, Subject } from 'rxjs';
import { DateService } from '@app/project/core/services/date.service';

@Directive({
  selector: '[date-from-to-spinner]',
  standalone: true
})
export class DateFromToSpinnerDirective implements AfterViewInit, OnDestroy {

  @Input()
  dateFromControl: FormControl;

  @Input()
  dateToControl: FormControl;

  @Input()
  spinner: FormControl;

  @Input()
  setFromTo: boolean = false;

  @Input()
  setToFrom: boolean = false; // หมายเหตุ : ใช้ในกรณีเงื่อนไข To มีค่าแต่ From ไม่มีค่า จะให้ From มีค่าเท่ากับ To

  @Input()
  setFromToWithMaxDays: boolean = false;

  @Input()
  maxDays: number;

  private destroy$: Subject<any> = new Subject();

  constructor(
    private el: ElementRef,
    private dateService: DateService,
    ) {}

  ngAfterViewInit(): void {
    this.dateFromControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((dateFrom) => {
        if(dateFrom){
          // มี spinner หรือไม่
          if(this.spinner){
            if(this.spinner.valid){
              // มี setFromTo
              if(this.setFromTo){
                // dateTo ไม่มีข้อมูล หรือ spinner เป็น null
                if(!this.dateToControl.value && this.checkSpinnerValue()){
                  // มี setFromToWithMaxDays
                  if(this.setFromToWithMaxDays){
                    const newDate = new Date(dateFrom);
                      newDate.setDate(
                      newDate.getDate() + this.maxDays
                    );
                  this.dateToControl.setValue(newDate, { emitEvent: false });
                  } else {
                    this.dateToControl.setValue(dateFrom, { emitEvent: false });
                  }
                } else if(parseInt(this.spinner.value) >= 0){
                  this.dateToControl.setValue(this.newDateWithPlusDays(dateFrom, parseInt(this.spinner.value)), { emitEvent: false });
                  // if(this.dateService.checkOverMaxDay(dateFrom , this.dateToControl.value, this.maxDays)){
                  //   this.dateToControl.setValue(this.newDateWithPlusDays(dateFrom, this.maxDays), { emitEvent: false });
                  // }
                  // if(dateFrom < this.dateToControl.value){
                  //   this.dateToControl.setValue(this.newDateWithPlusDays(dateFrom, parseInt(this.spinner.value)), { emitEvent: false });
                  // }
                } else if(this.dateToControl.value){
                  if(this.dateService.checkOverMaxDay(dateFrom , this.dateToControl.value, this.maxDays)){
                    this.dateToControl.setValue(this.newDateWithPlusDays(dateFrom, this.maxDays), { emitEvent: false });
                  } else {

                    if(this.setFromToWithMaxDays){
                      const newDate = new Date(dateFrom);
                        newDate.setDate(
                        newDate.getDate() + this.maxDays
                      );
                      this.dateToControl.setValue(newDate, { emitEvent: false });
                    }
                  }
                }

              if(this.dateFromControl.value && this.dateToControl.value){
                this.calDiffDaySpinner(dateFrom, this.dateToControl.value);
              }
            }
           }
          } else {
            if(this.setFromTo){
              if (this.dateToControl.errors?.message !== 'Invalid format.') {
                if (!this.dateToControl.value) {
                  if(this.setFromToWithMaxDays){
                    const newDate = new Date(dateFrom);
                      newDate.setDate(
                      newDate.getDate() + this.maxDays
                  );
                    this.dateToControl.setValue(newDate, { emitEvent: false });
                    } else {
                      this.dateToControl.setValue(dateFrom, { emitEvent: true });
                    }
                } else if(dateFrom > this.dateToControl.value){
                  this.dateToControl.setValue(dateFrom, { emitEvent: true });
                }
              }
            } else if(this.dateToControl.value){
              if(dateFrom > this.dateToControl.value){
                this.dateToControl.setValue(dateFrom, { emitEvent: true });
              } else if(this.maxDays){
                if(this.dateService.checkOverMaxDay(dateFrom , this.dateToControl.value, this.maxDays)){
                  const newDate = new Date(dateFrom);
                  newDate.setDate(newDate.getDate() + this.maxDays);
                  this.dateToControl.setValue(newDate, { emitEvent: false });
                }
              }
            }
        }
      }
    });

    this.dateToControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((dateTo) => {
        if(dateTo){
          if(this.spinner){
            // มีการ setFromTo
            if(this.setFromTo){
              if (this.dateFromControl.value) {
                if(this.dateService.checkOverMaxDay(this.dateFromControl.value , dateTo, this.maxDays)){
                  const newDate = new Date(dateTo);
                  newDate.setDate(
                    newDate.getDate() - this.maxDays
                  );
                  this.dateFromControl.setValue(newDate, { emitEvent: false });
                } else if(dateTo < this.dateFromControl.value){
                  this.dateFromControl.setValue(dateTo, { emitEvent: false });
                }
              }
            }

            // else {
            //   if(this.dateService.checkOverMaxDay(this.dateFromControl.value , dateTo, this.maxDays)){
            //     const newDate = new Date(dateTo);
            //     newDate.setDate(
            //       newDate.getDate() - this.maxDays
            //     );
            //     this.dateFromControl.setValue(newDate, { emitEvent: false });
            //   }
            // }
            if(this.dateFromControl.value && this.dateToControl.value){
              this.calDiffDaySpinner(this.dateFromControl.value, dateTo);
            }
          }  else {
            if (this.setToFrom) {
              if (this.dateFromControl.errors?.message !== 'Invalid format.') {
                if (!this.dateFromControl.value) {
                  this.dateFromControl.setValue(dateTo, { emitEvent: true });
                } else if (dateTo < this.dateFromControl.value) {
                  this.dateFromControl.setValue(dateTo, { emitEvent: true });
                }
              }
            } else if (this.dateFromControl.value) {
              if (dateTo < this.dateFromControl.value) {
                this.dateFromControl.setValue(dateTo, { emitEvent: true });
              } else if (this.maxDays) {
                if(this.dateService.checkOverMaxDay(this.dateFromControl.value , dateTo, this.maxDays)){
                  const newDate = new Date(dateTo);
                  newDate.setDate(newDate.getDate() - this.maxDays);
                  this.dateFromControl.setValue(newDate, { emitEvent: false });
                }
              }
            }
          }
        }
      });

    if(this.spinner){
      this.spinner.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        //if(this.dateFromControl.value && this.dateToControl.value){
          if(value != null){
            //if(parseInt(value) > this.maxDays){
              //this.spinner.setValue(0, { emitEvent: false });

              //this.dateToControl.setValue(this.newDateWithPlusDays(this.dateFromControl.value, 0), { emitEvent: false });
            //  this.dateToControl.setValue(this.newDateWithPlusDays(this.dateFromControl.value, 0), { emitEvent: false });
            //} else {
              if((value >= 0 && value <= this.maxDays) && this.dateFromControl.value){

                // if(value > 0 && value !=  parseInt(value)){
                //   this.spinner.setValue(parseInt(value));
                // }

                const newDate = new Date(this.dateFromControl.value);
                newDate.setDate(newDate.getDate() + parseInt(value));
                this.dateToControl.setValue(newDate, { emitEvent: true });
              }
            //}
          }
        //}
      });
    }
  }

  private newDateWithPlusDays(dateToCreate, days){
    const newDate = new Date(dateToCreate);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  private calDiffDaySpinner(dateFrom, dateTo){
    this.spinner.setValue(
      this.dateService.calDiffDate(dateFrom, this.dateToControl.value),
      { emitEvent: false }
    );
    this.spinner.setErrors(null);
  }

  checkSpinnerValue(){
    return this.spinner.value == "" || this.spinner.value == null? true : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
