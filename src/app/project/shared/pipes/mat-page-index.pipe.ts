import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pageIndex'
})
export class MatPageIndexPipe implements PipeTransform {
  transform(display: number, index: number): unknown {
    // console.log(display);
    // console.log(index);
    // display =  index+1;

    return null;
  }

}
