import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconMenu'
})
export class IconMenuPipe implements PipeTransform {

  transform(value: any): string {
    if (value.level === 1) {
      return 'chevron_right';
    }else if(value.level > 1 && !value.path){
      return 'keyboard_double_arrow_right';
    }
    return 'trip_origin';
  }
}
