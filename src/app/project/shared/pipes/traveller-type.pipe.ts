import { switchMap } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'travellerTypePipe',
  standalone: true,
})
export class TravellerTypePipe implements PipeTransform {


  transform(value: string, style: string ): string {
    //  console.log("-------------------------------------------")
    //  console.log(value)
    //  let result = "";
    switch(value){
      case 'P':
        return style === 'icon' ? 'directions_walk':  'traveller-type-passenger-icon-color';
      case 'C':
        return style === 'icon' ? 'luggage':  'traveller-type-crew-icon-color';
      case 'X':
        return style === 'icon' ? 'luggage':  'traveller-type-crew-icon-color'
      default:
        return '';
    }

   }
}
