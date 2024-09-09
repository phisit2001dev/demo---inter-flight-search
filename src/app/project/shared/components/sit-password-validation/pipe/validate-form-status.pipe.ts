import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

@Pipe({
  name: 'validateFormStatus',
  standalone: true
})
export class ValidateFormStatusPipe implements PipeTransform {
  transform(form: FormControl, tri, indexRow: number): any {
    let data = form.errors?.data?.find(d=> d.index === indexRow);
    if (!form.value || data?.invalid) {
      return 'invalid-list';
    }
    return 'valid-list';
  }
}
