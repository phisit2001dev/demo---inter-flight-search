import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'traApValidated',
  standalone: true,
})
export class TraApValidatedPipe implements PipeTransform {

  transform(value: string): any {
    return value === 'I' ? 'invalid-status': '';
  }

}
