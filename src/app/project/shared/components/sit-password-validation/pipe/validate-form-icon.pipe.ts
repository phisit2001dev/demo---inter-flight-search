import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

@Pipe({
  name: 'validateFormIcon',
  standalone: true

})
export class ValidateFormIconPipe implements PipeTransform {
  transform(form: FormControl, tri, indexRow: number): any {
    let data = form.errors?.data?.find(d=> d.index === indexRow);
    if (!form.value || data?.invalid) {
      return 'cancel';
    }
    return 'check_circle';
  }
}
