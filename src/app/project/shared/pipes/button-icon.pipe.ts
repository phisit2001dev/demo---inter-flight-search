import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buttonIcon',
  standalone: true,
})
export class ButtonIconPipe implements PipeTransform {

  transform(
      type: 'VIEW' | 'EDIT' | 'CANCEL' | 'ACTIVE' | 'EXPORT'
    , action?: 'ICON' | 'STYLE'
  ) {
    switch (type) {
      case 'EDIT':
        return action === 'STYLE' ? '' : 'edit';
      case 'VIEW':
        return action === 'STYLE' ? '' : 'search';
      case 'CANCEL':
        return action === 'STYLE' ? '' : 'close';
      case 'EXPORT':
        return action === 'STYLE' ? '' : 'output';
      default:
        return '';
    }
  }
}
