import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'risktypeStatusPipe',
  standalone: true,
})
export class RiskTypeStatusPipe implements PipeTransform {

  transform(value: string): string | null {
    let result = '';
    if ("NL" === value) {
      result = "status-highlight risk-type-noentryexit";
    } else if ("BL" === value) {
      result = "status-highlight risk-type-blacklist";
    } else if ("WL" === value) {
      result = "status-highlight risk-type-watchlist";
    }
    return result;
  }
}
