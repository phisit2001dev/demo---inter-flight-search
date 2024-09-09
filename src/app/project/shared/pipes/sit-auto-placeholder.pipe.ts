import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sitAutoPlaceholder',
  standalone: true
})
export class SitAutoPlaceholderPipe implements PipeTransform {

  transform(placeholder: string,readonly: boolean): unknown {
    return readonly ? '' : (placeholder ? placeholder : '');
  }

}
