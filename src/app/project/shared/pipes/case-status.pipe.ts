import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'caseStatusPipe',
  standalone: true,
})
export class CaseStatusPipe implements PipeTransform {

  transform(value: string): string | null {
    let result = '';
    if ("New" === value) {
      result = "status-highlight case-status-new";
    } else if ("In progress" === value) {
      result = "status-highlight case-status-in-progress";
    } else if ("On hold" === value) {
      result = "status-highlight case-status-on-hold";
    } else if ("Close" == value) {
      result = "status-highlight case-status-close";
    }

    return result;
  }
}
