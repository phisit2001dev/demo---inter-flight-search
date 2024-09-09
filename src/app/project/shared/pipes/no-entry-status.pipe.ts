import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noEntryStatusPipe',
  standalone: true,
})
export class NoEntryStatusPipe implements PipeTransform {

  transform(value: string, style: string): string | null {
    // console.log(value);
    // console.log(style);
    let result = '';
    if ("icon" === style) {
      if("0" != value){
        result = "person";
      }
    }else if("color" === style){
      if("0" !== value  ){
        result = "red";
      }
    }

    return result;
  }
}
