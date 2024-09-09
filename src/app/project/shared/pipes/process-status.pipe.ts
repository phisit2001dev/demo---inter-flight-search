import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'processStatus',
  standalone: true,
})
export class ProcessStatusPipe implements PipeTransform {

  transform(value: string): any {
    if (value === 'Complete') {
      return 'status-highlight text-complete'
    } else if(value === 'Incomplete') {
      return 'status-highlight text-incomplete'
    } else if(value === 'Processing') {
      return 'status-highlight text-processing'
    }
  }

}
