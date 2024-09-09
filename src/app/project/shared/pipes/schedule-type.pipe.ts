import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scheduleTypePipe',
  standalone: true,
})
export class ScheduleTypePipe implements PipeTransform {

  transform(value: string, style: string ): string {
    switch (value){
      case 'Schedule':
        return style === 'icon' ? 'event_available':  'schedule-type-schedule';
      case 'Unschedule':
        return style === 'icon' ? 'event_busy':  'schedule-type-unschedule'; 
      default:
        ''
    }
  }
}
