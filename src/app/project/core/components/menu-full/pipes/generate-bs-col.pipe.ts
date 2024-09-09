import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'generateBsCol'
})
export class GenerateBsColPipe implements PipeTransform {

  transform(value: number, bp: string): unknown {
    return `col-${bp}-${!(12%value) ? 12/value : '3'}`;
  }
}
