import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { environment } from '@evn/environment';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor(private datePipe: DatePipe) {}

  toDate(data: string) {
    if (!data || !data.trim()) {
      return null;
    }

    const [day, month, year] = data.split('/').map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
    }

    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  }

  toString(date: Date) {
    try {
      return this.datePipe.transform(date, environment.dateFormat);
    } catch (e) {
      return null;
    }
  }

  calDiffDate(datefrom: any, dateto: any) {
    const dFrom = new Date(datefrom);
    const dTo = new Date(dateto);

    if(dTo.valueOf() < dFrom.valueOf() || dFrom.valueOf() > dTo.valueOf()){
      return undefined;
    } else {
      const data = Math.abs(dTo.getTime() - dFrom.getTime());
      const diffDateTime = Math.floor(data / (1000 * 60 * 60 * 24));

      return diffDateTime;
    }
  }

  checkOverMaxDay(datefrom: any, dateto: any, maxDay: any){
    if(this.calDiffDate(datefrom , dateto) > maxDay){
      return true;
    } else {
      return false;
    }
  }
}
