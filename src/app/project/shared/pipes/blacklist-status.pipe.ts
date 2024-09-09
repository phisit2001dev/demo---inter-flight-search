import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'blacklistStatusPipe',
  standalone: true,
})
export class BlacklistStatusPipe implements PipeTransform {

  transform(value: string, style: string): string | null {
    // console.log(value);
    // console.log(style);
    let result = '';
    if ("icon" === style) {
      if("0" !== value ){
        result = "person";
      }
    }else if("color" === style){
      if("0" !== value ){
        result = "yellow";
      }
    }

    return result;
  }
}
