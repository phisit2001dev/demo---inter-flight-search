import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notOkToBoardStatusPipe',
  standalone: true,
})
export class NotOkToBoardStatusPipe implements PipeTransform {

  transform(value: string, style: string): string | null {
    // console.log(value);
    // console.log(style);
    let result = '';
    if ("icon" === style) {
      if("" !== value ){
        result = "list_alt";
      }
    }
    return result;
  }
}
