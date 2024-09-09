import { R } from '@angular/cdk/keycodes';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initMatsort',
})
export class InitMatsortPipe implements PipeTransform {
  transform(value: string[], type: 'columnName' | 'order'): unknown {
    if (value?.length > 0) {
      if (type === 'columnName') {
        let number = value[0]['columnName'];
        if (!isNaN(number)) {
          number = (parseInt(number));
          return number;
        }
        return null;
      }else if(type === 'order') {
        let order: string = value[0]['order'];
        return order.toLocaleLowerCase();
      }
    }
    return null;
  }
}
