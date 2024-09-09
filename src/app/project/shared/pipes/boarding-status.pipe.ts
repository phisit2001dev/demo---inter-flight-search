import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boardingStatusPipe',
  standalone: true,
})
export class BoardingStatusPipe implements PipeTransform {


  transform(value: string, style: string ): string {
    // console.log(value);
    switch (value){
      case 'Expected':
        return style === 'icon' ? 'check_circle':  'boarding-status-expected';
      case 'Cancelled':
        return style === 'icon' ? 'pause_circle':  'boarding-status-cancelled'; 
      case 'Not OK to Board':
        return style === 'icon' ? 'dangerous':  'boarding-status-not-ok-to-board';
      default:
        ''

    }


    // if(value && value === 'Expected'){
    //   if( 'icon' === style){
    //     return 'check_circle'
    //   } else if ('color' === style){
    //     return 'boarding-status-expected'
    //   }

    // } else if(value && value === 'Cancelled'){
    //   if( 'icon' === style){
    //     return 'cancel'
    //   } else if ('color' === style){
    //     return 'boarding-status-cancelled'
    //   }
    // }

    // return '';
  }

}
