import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'openSchedulePipe',
  standalone: true,
})
export class OpenSchedulePipe implements PipeTransform {

  transform(value: boolean, style: string): string | null {
    //  console.log(value);
    //  console.log(style);
    if (value === true) {
      return '#1E90FF'
    }else {
      return ''
    }
  }
}
