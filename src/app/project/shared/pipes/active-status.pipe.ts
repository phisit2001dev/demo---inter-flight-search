import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeStatusPipe',
  standalone: true,
})
export class ActiveStatusPipe implements PipeTransform {

  transform(value: string, style?: string): string | null {
    // console.log(value);
    // console.log(style);

    // let result = '';
    // if ("color" === style) {
    //   if ("Active" === value) {
    //     // result = "#E6803C";
    //     result = "#169a70";
    //   } else if ("Inactive" === value) {
    //     // result = "#6D7C8B";
    //     result = "#bfbfbf";
    //   }
    // } else if ("icon" === style) {
    //   result = "emoji_objects";
    // }
    // return result;

    if (value === 'Active') {
      return 'status-highlight text-active'
    }else if(value === 'Inactive') {
      return 'status-highlight text-Inactive'
    }
    // if (status === 'Active') {
    //   return 'xxxxx text-active'
    // }else if(status === 'Inactive') {
    //   return 'xxxxx text-Inactive'
    // }

    return null;
  }
}
