import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'styleMenu'
})
export class StyleMenuPipe implements PipeTransform {

  transform(path: string, treeLv: number): string {
    if (!path && treeLv > 1) {
      return 'head-tree-node subMenuHeader';
    }
    return 'head-tree-node menuHeader';
  }
}
