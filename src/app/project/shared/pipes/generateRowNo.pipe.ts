import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'generateRowNo'
})
export class GenerateRowNoPipe implements PipeTransform {
  transform(index: any, pageSize, pageIndex): any {
    return (pageIndex) * pageSize + (index + 1);
  }

}
