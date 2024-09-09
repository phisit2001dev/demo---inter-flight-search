import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'overrideOrDirectiveStatusPipe',
  standalone: true,
})
export class OverrideOrDirectiveStatusPipe implements PipeTransform {

  transform(value: string): string | null {
    let result = '';
    if ("New" === value) {
      result = "status-highlight override-status-New";
    } else if ("Pending" === value) {
      result = "status-highlight override-status-Pending";
    } else if ("In progress" === value) {
      result = "status-highlight override-status-In_progress";
    } else if ("Can not override" == value) {
      result = "status-highlight override-status-Can_not_override";
    } else if ("Overridden" === value) {
      result = "status-highlight override-status-Overridden";
    } else if ("Declined" === value) {
      result = "status-highlight override-status-Declined";
    } else if ("Directived" === value) {
      result = "status-highlight override-status-Directived";
    } else if ("No action required" === value) {
      result = "status-highlight override-status-No_action_required";
    } else if("No additional directive" === value){
      result = "status-highlight override-status-No_additional_directive";
    }

    return result;
  }
}
