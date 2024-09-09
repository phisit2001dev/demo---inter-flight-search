import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lockStatusPipe',
  standalone: true,
})
export class LockStatusPipe implements PipeTransform {

  // transform(value: string, style: string): string | null {
  //   let result = '';
  //   if ("color" === style) {
  //     if ("Locked" === value) {
  //       result = "red";
  //     } else if ("Ready" === value) {
  //       result = "orange";
  //     }
  //   } else if ("icon" === style) {
  //     if ("Locked" === value) {
  //       result = "lock";
  //     } else if ("Ready" === value) {
  //       result = "lock_open";
  //     }
  //   }
  //   return result;
  // }
  transform(value: string, style?: string): string | null {
    if (value === 'Ready') {
      return 'status-highlight text-active'
    }else if(value === 'Locked') {
      return 'status-highlight text-Inactive'
    }
    return null;
  }

}
